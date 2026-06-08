export function sanitizeHtmlLinks(html: string): string {
  if (!html) return html;
  return html.replace(/href=(["'])(.*?)\1/gi, 'href="javascript:void(0)"');
}
