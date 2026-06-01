import { GOOGLE_API_KEY } from '$env/static/private';
import { env } from '$env/dynamic/private';
import { markdownToSafeHtml } from '$lib/server/content';
import { generateGroundedContent, DEFAULT_GEMINI_MODEL } from '$lib/server/gemini';
import { buildDailyBriefingPrompt } from '$lib/server/prompt';
import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

export async function load({ url }: { url: URL }) {
	if (!dev) {
		throw error(404, 'Not found');
	}

	if (!GOOGLE_API_KEY) {
		throw error(500, 'Missing GOOGLE_API_KEY');
	}

	const prompt = url.searchParams.get('prompt')?.trim() || buildDailyBriefingPrompt();
	const modelId = env.GEMINI_MODEL_ID ?? DEFAULT_GEMINI_MODEL;

	let content = '';
	let sources: { title?: string; url: string }[] = [];

	try {
		const grounded = await generateGroundedContent(GOOGLE_API_KEY, prompt, modelId);
		content = markdownToSafeHtml(grounded.text);
		sources = grounded.sources;

		if (grounded.webSearchQueries.length > 0) {
			console.log('[preview] webSearchQueries:', grounded.webSearchQueries.join(', '));
		}
	} catch (err) {
		console.error('Preview generation failed', err);
		content =
			'Unable to generate preview content right now. Check the server logs and your Gemini configuration.';
		sources = [];
	}

	return {
		content,
		sources,
		updatedAt: new Date().toISOString(),
		prompt,
		model: modelId
	};
}
