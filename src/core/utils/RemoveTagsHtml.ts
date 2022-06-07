export function removeTags(html: string): { length: number; text: string } {
  const data = new DOMParser().parseFromString(html, 'text/html');

  const formated = data.body.textContent
    ? data.body.textContent.replace(/\n/g, '')
    : '';

  return {
    length: formated.length,
    text: formated,
  };
}
