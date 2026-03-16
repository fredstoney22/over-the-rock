<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';

	let { children } = $props();

	if (!dev) {
		inject();
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
