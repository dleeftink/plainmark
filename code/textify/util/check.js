export function check(fragment) {
  return fragment instanceof DocumentFragment
    ? fragment
    : document.getSelection().rangeCount
      ? document.getSelection().getRangeAt(0).cloneContents()
      : document.createDocumentFragment();
}