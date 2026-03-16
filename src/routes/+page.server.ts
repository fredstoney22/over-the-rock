import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';
import { redis } from '$lib/server/redis';

type DailyCachePayload = {
	content: string;
	sources?: { title?: string; url: string }[];
	metadata?: {
		generated_at: string;
		model?: string;
	};
	updated_at?: string;
};

export async function load() {
	const kvConfigured = Boolean(KV_REST_API_URL && KV_REST_API_TOKEN);

	if (!kvConfigured) {
		const now = new Date().toISOString();

		return {
			content:
				'KV is not configured yet. Add KV_REST_API_URL and KV_REST_API_TOKEN to your env vars to enable daily caching.',
			sources: [] as { title?: string; url: string }[],
			updatedAt: now
		};
	}

	const dailyData = (await redis.get<DailyCachePayload>('daily_cache')) ?? null;

	if (!dailyData) {
		const now = new Date().toISOString();

		return {
			content: "We're currently gathering today's insights. Check back in a few minutes.",
			sources: [] as { title?: string; url: string }[],
			updatedAt: now
		};
	}

	return {
		content: dailyData.content ?? '',
		sources: dailyData.sources ?? [],
		updatedAt: dailyData.updated_at ?? dailyData.metadata?.generated_at ?? new Date().toISOString()
	};
}

