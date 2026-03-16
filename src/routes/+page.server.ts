import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { redis } from '$lib/server/redis';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

type DailyCachePayload = {
	content: string;
	sources?: { title?: string; url: string }[];
	metadata?: {
		generated_at: string;
		model?: string;
	};
	updated_at?: string;
};

function markdownToSafeHtml(markdown: string): string {
	if (!markdown) return '';

	// Render markdown (handles headings, bold, lists, etc.)
	const rawHtml = marked(markdown, { breaks: true });

	// Sanitize to prevent XSS while allowing common formatting
	return sanitizeHtml(rawHtml, {
		allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
		allowedAttributes: {
			...sanitizeHtml.defaults.allowedAttributes,
			a: ['href', 'name', 'target', 'rel']
		},
		allowedSchemes: ['http', 'https', 'mailto']
	});
}

export async function load() {
	const kvConfigured = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);

	if (!kvConfigured) {
		const now = new Date().toISOString();

		return {
			content: markdownToSafeHtml(
				'KV is not configured yet. Add `KV_REST_API_URL` and `KV_REST_API_TOKEN` to your env vars to enable daily caching.'
			),
			sources: [] as { title?: string; url: string }[],
			updatedAt: now
		};
	}

	const dailyData = (await redis.get<DailyCachePayload>('daily_cache')) ?? null;

	if (!dailyData) {
		const now = new Date().toISOString();

		return {
			content: markdownToSafeHtml(
				"We're currently gathering today's insights. Check back in a few minutes."
			),
			sources: [] as { title?: string; url: string }[],
			updatedAt: now
		};
	}

	const renderedContent = markdownToSafeHtml(dailyData.content ?? '');

	return {
		content: renderedContent,
		sources: dailyData.sources ?? [],
		updatedAt: dailyData.updated_at ?? dailyData.metadata?.generated_at ?? new Date().toISOString()
	};
}

