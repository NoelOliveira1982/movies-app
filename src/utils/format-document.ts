export function applyFormatToDocument(document: string, format: string): string {
  const cleanedDocument = document.replace(/\D/g, '');

  const formattedDocument = format.split('').map((char, index) => {
    return char === 'X' && cleanedDocument[index] ? cleanedDocument[index] : char;
  }).join('');

  return formattedDocument;
}
