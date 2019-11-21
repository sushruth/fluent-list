export function getNearestScrollableParent(
	node: Element | null,
): Element | Window {
	if (node === null) return window;

	const hasOverflow = !!window
		.getComputedStyle(node)
		.getPropertyValue('overflow')
		.match('scroll');
	const hasScrollabelContent = node.clientHeight < node.scrollHeight;
	if (hasOverflow && hasScrollabelContent) {
		return node;
	} else {
		return getNearestScrollableParent(node.parentElement);
	}
}
