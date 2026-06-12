export function css<T extends HTMLElement>(
  el: T,
  styles: Partial<CSSStyleDeclaration>,
): T {
  return (Object.assign(el.style, styles), el);
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> = {},
): HTMLElementTagNameMap[K] {
  return Object.assign(document.createElement(tag), props);
}

export function div(styles: Partial<CSSStyleDeclaration> = {}): HTMLDivElement {
  return css(document.createElement("div"), styles);
}

export function span(
  text: string,
  styles: Partial<CSSStyleDeclaration> = {},
): HTMLSpanElement {
  return css(el("span", { textContent: text }), styles);
}
