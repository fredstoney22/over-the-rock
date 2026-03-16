import { GoogleGenAI } from '@google/genai';
import { redis } from '$lib/server/redis';
import { GOOGLE_API_KEY, CRON_SECRET, KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

const DAILY_PROMPT =
	'Summarize the most important AI and tech news from the last 24 hours in a concise briefing. Use clear headings and short sections suitable for a single-page daily update.';

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

	const genAI = new GoogleGenAI({
		apiKey: GOOGLE_API_KEY
	});

	try {
		const result = await genAI.models.generateContent({
			model: 'gemini-2.0-flash-001',
			contents: [
				{
					role: 'user',
					parts: [{ text: DAILY_PROMPT }]
				}
			]
		});

		const text = result.response.text();

		// Try to pull structured source information if available
		const grounding =
			// @ts-expect-error groundingMetadata may not be typed in the SDK yet
			result.response.groundingMetadata ??
			// @ts-expect-error searchEntryPoint may exist depending on SDK version
			result.response.candidates?.[0]?.groundingMetadata;

		const rawSources =
			grounding?.groundingChunks ??
			grounding?.searchEntryPoint?.renderedContent ??
			grounding?.sources ??
			[];

		const sources =
			Array.isArray(rawSources) && rawSources.length > 0
				? rawSources
						.map((s: any) => ({
							title: s.title ?? s.description ?? undefined,
							url: s.uri ?? s.url ?? ''
						}))
						.filter((s: { url: string }) => s.url)
				: [];

		const now = new Date().toISOString();

		const payload = {
			content: text,
			sources,
			metadata: {
				generated_at: now,
				model: 'gemini-2.0-flash-001'
			},
			updated_at: now
		};

		await redis.set('daily_cache', payload);

		return new Response('Daily update complete.', { status: 200 });
	} catch (error) {
		console.error('Cron update failed', error);
		return new Response('Failed to generate daily content', { status: 500 });
	}
}

