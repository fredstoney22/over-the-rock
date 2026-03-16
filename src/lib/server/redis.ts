import { Redis } from '@upstash/redis';
import { KV_REST_API_URL, KV_REST_API_TOKEN } from '$env/static/private';

if (!KV_REST_API_URL || !KV_REST_API_TOKEN) {
	throw new Error(
		'KV_REST_API_URL or KV_REST_API_TOKEN is missing. Define them in your env (locally in .env, and on Vercel).'
	);
}

export const redis = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

