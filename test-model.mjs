import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
const apiKey = process.env.GOOGLE_API_KEY;

function extractSources(grounding) {
	if (!grounding?.groundingChunks) return [];
	const seen = new Set();
	const out = [];
	for (const chunk of grounding.groundingChunks) {
		const url = chunk?.web?.uri ?? chunk?.uri ?? chunk?.url ?? '';
		if (!url || seen.has(url)) continue;
		seen.add(url);
		out.push({ title: chunk?.web?.title ?? chunk?.title, url });
	}
	return out;
}

async function main() {
	if (!apiKey) {
		console.error('Missing GOOGLE_API_KEY in environment.');
		process.exit(1);
	}

	const genAI = new GoogleGenAI({ apiKey });

	console.log(`Testing model: ${MODEL_ID} with googleSearch grounding`);

	try {
		const result = await genAI.models.generateContent({
			model: MODEL_ID,
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: 'You are a news researcher. What is one major tech headline from today? Use search and be brief.'
						}
					]
				}
			],
			config: {
				tools: [{ googleSearch: {} }]
			}
		});

		const candidate = result?.candidates?.[0] ?? result?.response?.candidates?.[0];
		const text =
			candidate?.content?.parts?.find((p) => typeof p.text === 'string')?.text ?? '(no text)';

		console.log('Model call succeeded.');
		console.log('Response text:', text.slice(0, 500) + (text.length > 500 ? '...' : ''));

		const grounding = candidate?.groundingMetadata;
		if (grounding?.webSearchQueries?.length) {
			console.log('webSearchQueries:', grounding.webSearchQueries);
		}
		const sources = extractSources(grounding);
		console.log(`Sources (${sources.length}):`, sources.slice(0, 5));
	} catch (err) {
		console.error('Model test failed:');
		console.error(err);
		process.exit(1);
	}
}

main();
