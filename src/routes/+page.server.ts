import { kv } from '@vercel/kv';

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
	const dailyData = (await kv.get<DailyCachePayload>('daily_cache')) ?? null;

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

