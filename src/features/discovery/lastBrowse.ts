const STORAGE_KEY = "big-e:last-browse-search";

/** Remember the browse page's current query string so the Browse nav tab can return to it. */
export function rememberBrowseSearch(search: string): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, search);
  } catch {
    // Storage can be unavailable (private mode, quota); the tab simply falls back to a fresh browse.
  }
}

/** The last remembered browse query string ("?..." or ""), or "" when nothing is stored or storage fails. */
export function readBrowseSearch(): string {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}
