import { redis } from '$lib/server/redis';
import {
	GOOGLE_API_KEY,
	CRON_SECRET,
	KV_REST_API_URL,
	KV_REST_API_TOKEN
} from '$env/static/private';
import { env } from '$env/dynamic/private';
import { generateGroundedContent, DEFAULT_GEMINI_MODEL } from '$lib/server/gemini';
import { buildDailyBriefingPrompt } from '$lib/server/prompt';

export async function GET({ request }: { request: Request }) {
	const authHeader = request.headers.get('authorization');

	if (authHeader !== `Bearer ${CRON_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	if (!GOOGLE_API_KEY) {
		return new Response('Missing GOOGLE_API_KEY', { status: 500 });
	}

	if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
		return new Response('KV is not configured (missing KV_REST_API_URL or KV_REST_API_TOKEN)', {
			status: 500
		});
	}

	const modelId = env.GEMINI_MODEL_ID ?? DEFAULT_GEMINI_MODEL;

	try {
		const grounded = await generateGroundedContent(
			GOOGLE_API_KEY,
			buildDailyBriefingPrompt(),
			modelId
		);
		const now = new Date().toISOString();

		const payload = {
			content: grounded.text,
			sources: grounded.sources,
			metadata: {
				generated_at: now,
				model: grounded.model,
				web_search_queries: grounded.webSearchQueries
			},
			updated_at: now
		};

		await redis.set('daily_cache', payload);

		return new Response('Daily update complete.', { status: 200 });
	} catch (err) {
		console.error('Cron update failed', err);
		return new Response('Failed to generate daily content', { status: 500 });
	}
}
