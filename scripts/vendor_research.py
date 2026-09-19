"""Resumable, human-reviewed vendor research. No scraping or catalog writes."""
import argparse
import copy
import json
import re
import unicodedata
from datetime import date
from pathlib import Path
from urllib.parse import urlencode, urlparse

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / 'research/vendors-2026.json'
STATUSES = {'reviewed', 'inaccessible', 'no-account-found'}


def vendor_id(name):
    plain = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', plain).strip('-')


def sync_queue(items, previous=None):
    queue = copy.deepcopy(previous or {'version': 1, 'year': 2026, 'vendors': [], 'batches': []})
    known = {v['id']: v for v in queue['vendors']}
    for vendor in known.values():
        vendor['items'] = []
    for item in items:
        key = vendor_id(item['vendor'])
        if key in known and known[key]['name'] != item['vendor']:
            raise ValueError(f'Vendor ID collision: {key}')
        vendor = known.setdefault(key, dict(id=key, name=item['vendor'], items=[], reviews=[]))
        vendor['items'].append({'id': item['id'], 'name': item['name']})
    queue['vendors'] = sorted(known.values(), key=lambda v: (len(v['items']), v['name'].casefold()))
    return queue


def start_batch(queue, size=10, recheck_before=None):
    if not 1 <= size <= 50:
        raise ValueError('Batch size must be between 1 and 50.')
    if recheck_before:
        date.fromisoformat(recheck_before)
    for batch in queue['batches']:
        if set(batch['vendorIds']) - set(batch['completedIds']):
            return batch
    eligible = [v for v in queue['vendors'] if v['items'] and (not v['reviews'] or
                (recheck_before and v['reviews'][-1]['checkedAt'] < recheck_before))]
    if not eligible:
        return None
    batch = dict(id=f"batch-{len(queue['batches']) + 1:03d}", createdOn=date.today().isoformat(),
                 vendorIds=[v['id'] for v in eligible[:size]], completedIds=[])
    queue['batches'].append(batch)
    return batch


def valid_url(url):
    parsed = urlparse(url)
    if parsed.scheme != 'https' or not parsed.netloc:
        raise ValueError('Evidence requires an absolute HTTPS URL.')


def record_review(queue, review):
    vendor = next((v for v in queue['vendors'] if v['id'] == review.get('vendorId')), None)
    if not vendor:
        raise ValueError('Unknown vendorId.')
    if review.get('status') not in STATUSES:
        raise ValueError('Unsupported review status.')
    checked = date.fromisoformat(review['checkedAt'])
    if checked > date.today():
        raise ValueError('checkedAt cannot be in the future.')
    if vendor['reviews'] and review['checkedAt'] < vendor['reviews'][-1]['checkedAt']:
        raise ValueError('Review date precedes the last check.')
    if not review.get('notes') or not review.get('searches'):
        raise ValueError('Record review scope and searches, including unsuccessful searches.')
    for account in review['accounts']:
        valid_url(account['url'])
        if account.get('verified'):
            valid_url(account['evidenceUrl'])
            if not account.get('evidence'):
                raise ValueError('Verified accounts need identity evidence.')
    for finding in review['findings']:
        valid_url(finding['url'])
        if not finding.get('detail') or finding.get('confidence') not in {'confirmed', 'lead'}:
            raise ValueError('Findings require detail and confirmed/lead confidence.')
        if finding.get('publishedOn'):
            if date.fromisoformat(finding['publishedOn']) > checked:
                raise ValueError('Post date is after the review.')
        if finding['confidence'] == 'confirmed':
            if finding.get('event') != 'The Big E' or finding.get('year') != queue['year'] or finding.get('sourceType') not in {'vendor', 'fair'} or not finding.get('publishedOn'):
                raise ValueError('Confirmation requires dated vendor/fair evidence for this year’s Big E.')
        if finding.get('kind') not in {'confirmation', 'new-item', 'detail', 'location', None}:
            raise ValueError('Unsupported finding kind.')
    if review in vendor['reviews']:
        return
    vendor['reviews'].append(copy.deepcopy(review))
    for batch in queue['batches']:
        if vendor['id'] in batch['vendorIds'] and vendor['id'] not in batch['completedIds']:
            batch['completedIds'].append(vendor['id'])


def batch_packet(queue, batch):
    if not batch:
        return {'message': 'No eligible vendors. Use --recheck-before for another pass.'}
    vendors = {v['id']: v for v in queue['vendors']}
    entries = []
    for key in batch['vendorIds']:
        if key in batch['completedIds']:
            continue
        vendor = vendors[key]
        queries = [f'"{vendor["name"]}" "Big E" 2026', f'"{vendor["name"]}" Instagram Facebook official']
        entries.append(dict(vendorId=key, name=vendor['name'], catalogItems=vendor['items'],
                            lastReview=vendor['reviews'][-1] if vendor['reviews'] else None,
                            searches=[dict(query=q, url='https://www.google.com/search?' + urlencode({'q': q})) for q in queries],
                            reviewTemplate=dict(vendorId=key, checkedAt=date.today().isoformat(), status='reviewed', searches=queries, notes='', accounts=[], findings=[])))
    return dict(batchId=batch['id'], vendors=entries)


def report(queue):
    reviewed = [v for v in queue['vendors'] if v['reviews']]
    lines = ['# Vendor research progress', '', f"{len(reviewed)} of {len(queue['vendors'])} vendor records checked. Catalog promotions are tracked in `promoted-items-*.json`.", '',
             'Checks cover the recorded scope only; inaccessible accounts and unsuccessful discovery are not exhaustive reviews.', '']
    for vendor in reviewed:
        latest = vendor['reviews'][-1]
        lines.extend([f"## {vendor['name']}", '', f"{latest['status']} · {latest['checkedAt']} · {len(vendor['items'])} catalog items", '', latest['notes'], ''])
        for account in latest['accounts']:
            lines.append(f"- Account: {account['url']} ({'verified' if account.get('verified') else 'candidate'})")
        for review in vendor['reviews']:
            for finding in review['findings']:
                lines.append(f"- **{finding['confidence']} / {finding.get('kind', 'detail')}**: {finding['detail']} [Source]({finding['url']}) (checked {review['checkedAt']})")
        lines.append('')
    return '\n'.join(lines)


def save(queue):
    QUEUE.parent.mkdir(parents=True, exist_ok=True)
    temporary = QUEUE.with_suffix('.tmp')
    temporary.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(QUEUE)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('sync')
    batch = sub.add_parser('batch')
    batch.add_argument('--size', type=int, default=10)
    batch.add_argument('--recheck-before')
    record = sub.add_parser('record')
    record.add_argument('file', type=Path)
    sub.add_parser('report')
    args = parser.parse_args()
    queue = json.loads(QUEUE.read_text()) if QUEUE.exists() else None
    if args.command == 'sync':
        queue = sync_queue(json.loads((ROOT / 'src/data/2026/catalog.json').read_text()), queue)
        save(queue)
        print(f"Synced {len(queue['vendors'])} vendors; review history preserved.")
    elif queue is None:
        parser.error('Run sync first.')
    elif args.command == 'batch':
        selected = start_batch(queue, args.size, args.recheck_before)
        save(queue)
        print(json.dumps(batch_packet(queue, selected), ensure_ascii=False, indent=2))
    elif args.command == 'record':
        payload = json.loads(args.file.read_text())
        reviews = payload if isinstance(payload, list) else [payload]
        for review in reviews:
            record_review(queue, review)
        save(queue)
        print(f'Recorded {len(reviews)} reviews.')
    else:
        print(report(queue))


if __name__ == '__main__':
    main()
