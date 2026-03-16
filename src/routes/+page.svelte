<script lang="ts">
	let { data } = $props();
</script>

<main class="max-w-3xl mx-auto px-6 py-12">
	<header class="mb-10 border-b border-gray-200 pb-6">
		<h1 class="text-4xl font-bold text-gray-900 mb-2">Over the Rock</h1>
		<p class="text-sm text-gray-500 uppercase tracking-widest font-semibold">
			Daily briefing for {new Date(data.updatedAt).toLocaleDateString('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</p>
	</header>

	<article class="prose prose-lg max-w-none text-gray-800 leading-relaxed">
		{@html data.content}
	</article>

	{#if data.sources.length > 0}
		<section class="mt-16 pt-8 border-t border-gray-100">
			<h2 class="text-lg font-bold text-gray-900 mb-4">Verified Sources</h2>
			<ul class="space-y-3">
				{#each data.sources as source}
					<li>
						<a
							href={source.url}
							target="_blank"
							rel="noopener noreferrer"
							class="text-blue-600 hover:underline flex items-center gap-2"
						>
							<span class="text-sm">↗</span>
							{source.title || source.url}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<footer class="mt-20 text-center text-xs text-gray-400">
		Over the Rock • Generated via Gemini 3 Flash • Powered by Vercel KV
	</footer>
</main>

