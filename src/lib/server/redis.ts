import { Redis } from '@upstash/redis';

const { KV_REST_API_URL = '', KV_REST_API_TOKEN = '' } = process.env;

export const redis = new Redis({
	url: KV_REST_API_URL,
	token: KV_REST_API_TOKEN
});

