import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Uses DOMPurify to strip dangerous tags/attributes while preserving safe formatting.
 *
 * @param dirty - Raw HTML string that may contain unsafe content
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['strong', 'em', 'b', 'i', 'u', 'br', 'span', 'p', 'ul', 'ol', 'li', 'sub', 'sup'],
    ALLOWED_ATTR: ['class', 'style'],
  });
}

/**
 * Apply markdown-style bold/italic formatting and then sanitize.
 * Converts **text** to <strong>text</strong> and *text* to <em>text</em>.
 *
 * @param text - Raw text with markdown-style formatting
 * @returns Sanitized HTML string
 */
export function formatAndSanitize(text: string): string {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  return sanitizeHtml(html);
}
