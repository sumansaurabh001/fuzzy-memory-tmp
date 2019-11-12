
declare const hljs:any;

export function highlightCodeBlocks() {
  setTimeout(() => {
    document.querySelectorAll('pre').forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
}
