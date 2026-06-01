import { GoogleGenAI } from '@google/genai';

/** Default: stable + search grounding. Override via GEMINI_MODEL_ID (e.g. gemini-3.5-flash). */
export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION =
	'You write a casual daily briefing grounded in Google Search. Follow the user prompt exactly: conversational tone, inline markdown source links per story, no footer source list, and strict recency rules.';

export type GroundedSource = { title?: string; url: string };

export type GroundedResult = {
	text: string;
	sources: GroundedSource[];
	webSearchQueries: string[];
	model: string;
};

function getFirstCandidate(result: unknown): Record<string, unknown> | null {
	const r = result as {
		response?: { candidates?: Record<string, unknown>[] };
		candidates?: Record<string, unknown>[];
	};
	return r.response?.candidates?.[0] ?? r.candidates?.[0] ?? null;
}

function extractText(candidate: Record<string, unknown> | null): string | null {
	const parts = (candidate?.content as { parts?: { text?: string }[] } | undefined)?.parts;
	if (!Array.isArray(parts)) return null;
	const part = parts.find((p) => typeof p.text === 'string');
	return part?.text ?? null;
}

/** Parse groundingMetadata.groundingChunks (current API uses chunk.web.uri). */
export function extractSourcesFromGrounding(grounding: unknown): GroundedSource[] {
	if (!grounding || typeof grounding !== 'object') return [];

	const chunks = (grounding as { groundingChunks?: unknown[] }).groundingChunks;
	if (!Array.isArray(chunks)) return [];

	const sources: GroundedSource[] = [];
	const seen = new Set<string>();

	for (const chunk of chunks) {
		if (!chunk || typeof chunk !== 'object') continue;
		const c = chunk as {
			web?: { uri?: string; title?: string };
			uri?: string;
			url?: string;
			title?: string;
			description?: string;
		};
		const url = c.web?.uri ?? c.uri ?? c.url ?? '';
		if (!url || seen.has(url)) continue;
		seen.add(url);
		sources.push({
			title: c.web?.title ?? c.title ?? c.description,
			url
		});
	}

	return sources;
}

export async function generateGroundedContent(
	apiKey: string,
	userPrompt: string,
	modelId: string = DEFAULT_GEMINI_MODEL
): Promise<GroundedResult> {
	const genAI = new GoogleGenAI({ apiKey });

	const result = await genAI.models.generateContent({
		model: modelId,
		contents: [
			{
				role: 'user',
				parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${userPrompt}` }]
			}
		],
		config: {
			tools: [{ googleSearch: {} }]
		}
	});

	const candidate = getFirstCandidate(result);
	const text = extractText(candidate);

	if (!text) {
		throw new Error('Gemini response did not contain text');
	}

	const grounding =
		(candidate?.groundingMetadata as unknown) ??
		(candidate?.grounding_attribution as unknown) ??
		null;

	const webSearchQueries = Array.isArray(
		(grounding as { webSearchQueries?: unknown })?.webSearchQueries
	)
		? ((grounding as { webSearchQueries: string[] }).webSearchQueries ?? [])
		: [];

	return {
		text,
		sources: extractSourcesFromGrounding(grounding),
		webSearchQueries,
		model: modelId
	};
}
