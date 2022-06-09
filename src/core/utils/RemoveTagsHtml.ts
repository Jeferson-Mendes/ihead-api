export function removeTags(html: string): { length: number; text: string } {
  const data = html;

  const formated = data.replace(/\n/g, '');

  return {
    length: formated.length,
    text: formated,
  };
}
