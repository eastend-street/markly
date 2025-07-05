export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

export function createHighlightedText(text: string, searchTerm: string) {
  const highlightedText = highlightSearchTerm(text, searchTerm);
  return { __html: highlightedText };
}