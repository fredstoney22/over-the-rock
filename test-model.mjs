import { GoogleGenAI } from '@google/genai';

const MODEL_ID = process.env.GEMINI_MODEL_ID || 'gemini-3.0-flash-preview';
const apiKey = process.env.GOOGLE_API_KEY;

async function main() {
	if (!apiKey) {
		console.error('Missing GOOGLE_API_KEY in environment.');
		process.exit(1);
	}

	const genAI = new GoogleGenAI({ apiKey });

	console.log(`Testing model: ${MODEL_ID}`);

	try {
		const result = await genAI.models.generateContent({
			model: MODEL_ID,
			contents: [
				{
					role: 'user',
					parts: [{ text: 'Say "ok" if this model is available.' }]
				}
			]
		});

		console.log('Model call succeeded.');

		if (result?.response && typeof result.response.text === 'function') {
			console.log('Response text:');
			console.log(result.response.text());
		} else {
			console.log('Full raw result (no .response.text() available):');
			console.dir(result, { depth: null });
		}
	} catch (err) {
		console.error('Model test failed:');
		console.error(err);
		process.exit(1);
	}
}

main();

