// marklet functionality

function processContent(fragment) {

  let domain = getDomain(window.location.origin)

  let stamp = `###### [\`+\`]` + "%09" + `${tid().replaceAll(/[\.\:]/g, "-")}`;
  let URL = `###### [\`+\`]` + "%09" + `[#${domain}](${window.location.href})`;
  return (
    plaindown(plainDOM(fragment).post)
      .map((row, i) =>
        row
          .map((d, j, f) =>
            i == 0 || j == 0 ? (d.exit.startsWith("####") ? `__\n\n${d.exit}${stamp}\n\n> [!cite] #tag` : d.exit.replace(/^\n/, "\n> ")) : d.exit,
          )
          .join(""),
      )
      .join("") + `\n\n${URL}`
  );
}

function sweep() {
  let serializer = new XMLSerializer();
  let prev = null;

  document.addEventListener(
    "selectionchange",
    debounce((e) => {
      const selection = document.getSelection();

      // Check if there's a new selection
      if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const inverse =
          (selection.baseNode.compareDocumentPosition(selection.focusNode) &
            Node.DOCUMENT_POSITION_PRECEDING) >
          0;

        // Compare with previous selection
        if (
          !prev ||
          selection.focusNode !== prev.focusNode ||
          selection.anchorNode !== prev.anchorNode
        ) {
          // Update range only if there's a real change
          const newRange = range.cloneRange();
          if (selection.anchorOffset !== 0 || selection.focusOffset !== 0) {
            if (inverse) {
              range.setEndAfter(selection.anchorNode);
              range.setStartBefore(selection.anchorNode);
              console.log(
                "inverted range now from",
                selection.anchorNode,
                selection.focusNode,
              );
            } else {
              range.setStartBefore(selection.anchorNode);
              range.setEndAfter(selection.focusNode);
              console.log(
                "regular range from",
                selection.anchorNode,
                selection.focusNode,
              );
            }

            let fragment = range.cloneContents();
            [
              ...fragment.querySelectorAll(
                ":not(:is(div,span,a,p,code,pre,i,b,sup,sub,section,article,h1,h2,h3,h4,h5,h6))",
              ),
            ].forEach((n) => n.remove);
            //console.log(fragment.textContent);

            let processed = processContent(fragment);

            console.log(processed);

            let item = [
              new ClipboardItem({
                "text/plain": new Blob([processed], { type: "text/plain" }),
                //"text/html": new Blob([template], { type: "text/html" }),
              }),
            ];

            navigator.clipboard.write(item);
          }
          // Store the current selection state
          prev = {
            focusNode: selection.focusNode,
            anchorNode: selection.anchorNode,
          };
        }
      } else {
        // Reset previous selection if there's no selection
        console.log("deselected");
        prev = null;
      }
    }, 1000),
  )

}