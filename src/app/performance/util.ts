export function isElementsCross(first: Element, last: Element): boolean {
  const firstRect = first.getBoundingClientRect();
  const lastRect = last.getBoundingClientRect();
  let firstCenter;
  let lastCenter;
  firstCenter = {
    x: firstRect.left + firstRect.width / 2,
    y: firstRect.top + firstRect.height / 2,
  };
  lastCenter = {
    x: lastRect.left + lastRect.width / 2,
    y: lastRect.top + lastRect.height / 2,
  };
  return (
    Math.abs(firstCenter.x - lastCenter.x) <
      (firstRect.width + lastRect.width) / 2 &&
    Math.abs(firstCenter.y - lastCenter.y) <
      (firstRect.height + lastRect.height) / 2
  );
}
