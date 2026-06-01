import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function markdownToSafeHtml(markdown: string): string {
	if (!markdown) return '';

	const rawHtml = marked(markdown, { breaks: true });

	return sanitizeHtml(rawHtml, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat([
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6'
		]),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			a: ['href', 'name', 'target', 'rel']
		},
		allowedSchemes: ['http', 'https', 'mailto']
	});
}

