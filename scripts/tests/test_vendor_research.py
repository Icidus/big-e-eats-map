import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('research', Path(__file__).parents[1] / 'vendor_research.py')
research = importlib.util.module_from_spec(spec)
spec.loader.exec_module(research)

class ResearchTests(unittest.TestCase):
    def setUp(self):
        self.items = [dict(id='a', vendor='Alpha', name='Fries'), dict(id='b', vendor='Beta', name='Pie'), dict(id='c', vendor='Beta', name='Cake')]

    def test_sync_preserves_reviews_and_updates_items(self):
        queue = research.sync_queue(self.items)
        queue['vendors'][0]['reviews'].append({'checkedAt':'2026-09-19', 'status':'reviewed'})
        updated = research.sync_queue(self.items + [dict(id='d',vendor='Alpha',name='Soda')], queue)
        self.assertEqual(updated['vendors'][0]['reviews'], queue['vendors'][0]['reviews'])
        self.assertEqual(len(updated['vendors'][0]['items']), 2)

    def test_batch_resumes_and_only_advances_after_all_reviews(self):
        queue = research.sync_queue(self.items)
        batch = research.start_batch(queue, 1)
        self.assertEqual(batch['vendorIds'], ['alpha'])
        self.assertEqual(research.start_batch(queue, 2)['id'], batch['id'])
        research.record_review(queue, dict(vendorId='alpha', status='no-account-found', checkedAt='2026-09-19', notes='Searched vendor + Big E.', accounts=[], findings=[], searches=['Alpha Big E Instagram']))
        self.assertEqual(research.start_batch(queue, 1)['vendorIds'], ['beta'])

    def test_invalid_confirmation_does_not_mutate_queue(self):
        queue = research.sync_queue(self.items)
        review = dict(vendorId='alpha', status='reviewed', checkedAt='2026-09-19', notes='Test', accounts=[], searches=['Alpha'], findings=[dict(detail='Fries', confidence='confirmed', url='https://example.com/menu', publishedOn='2026-09-18', event='New York State Fair', year=2026, sourceType='vendor')])
        with self.assertRaises(ValueError): research.record_review(queue, review)
        self.assertEqual(queue['vendors'][0]['reviews'], [])

    def test_recheck_retains_history_and_uses_cutoff(self):
        queue = research.sync_queue(self.items[:1])
        research.record_review(queue, dict(vendorId='alpha', status='reviewed', checkedAt='2026-09-18', notes='Read posts', accounts=[], findings=[], searches=['Alpha']))
        self.assertIsNone(research.start_batch(queue, 10))
        self.assertEqual(research.start_batch(queue, 10, '2026-09-19')['vendorIds'], ['alpha'])
        self.assertEqual(len(queue['vendors'][0]['reviews']), 1)

    def test_duplicate_review_cannot_complete_a_new_recheck_batch(self):
        queue = research.sync_queue(self.items[:1])
        review = dict(vendorId='alpha', status='reviewed', checkedAt='2026-09-18', notes='Read posts', accounts=[], findings=[], searches=['Alpha'])
        research.record_review(queue, review)
        batch = research.start_batch(queue, 10, '2026-09-19')
        research.record_review(queue, review)
        self.assertEqual(batch['completedIds'], [])

    def test_slug_collision_is_rejected(self):
        with self.assertRaises(ValueError):
            research.sync_queue([dict(id='a',vendor='A & B',name='Pie'),dict(id='b',vendor='A B',name='Fries')])

if __name__ == '__main__': unittest.main()
