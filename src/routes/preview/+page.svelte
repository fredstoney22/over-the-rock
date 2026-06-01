<script lang="ts">
	import ArticleView from '$lib/ArticleView.svelte';

	const { data } = $props<{
		data: {
			content: string;
			sources: { title?: string; url: string }[];
			updatedAt: string;
			prompt: string;
		};
	}>();

	let prompt = $state(data.prompt ?? '');
</script>

<section class="preview-shell">
	<div class="preview-panel">
		<h1 class="preview-title">Prompt preview (dev only)</h1>
		<p class="preview-subtitle">
			Edit the prompt and run it to see exactly how the content would render on the main page.
		</p>

		<form method="GET" class="prompt-form">
			<label for="prompt" class="prompt-label">Prompt</label>
			<textarea
				id="prompt"
				name="prompt"
				class="prompt-input"
				rows="16"
				bind:value={prompt}
			></textarea>

			<button type="submit" class="prompt-button">Run preview</button>
		</form>
	</div>
</section>

{#if data.content}
	<ArticleView content={data.content} updatedAt={data.updatedAt} />
{/if}

<style>
	.preview-shell {
		max-width: 72rem;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 0;
	}

	.preview-panel {
		max-width: 48rem;
		margin: 0 auto 1.5rem;
		background: rgba(15, 23, 42, 0.03);
		border-radius: 1rem;
		padding: 1.25rem 1.5rem 1.5rem;
		border: 1px solid rgba(15, 23, 42, 0.06);
	}

	.preview-title {
		margin: 0 0 0.25rem;
		font-size: 1.15rem;
		font-weight: 600;
		color: #111827;
	}

	.preview-subtitle {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		color: #4b5563;
	}

	.prompt-form {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.prompt-label {
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.14em;
		color: #6b7280;
	}

	.prompt-input {
		width: 100%;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		font-size: 0.9rem;
		line-height: 1.5;
		padding: 0.6rem 0.7rem;
		border-radius: 0.5rem;
		border: 1px solid rgba(15, 23, 42, 0.18);
		background: #fdfdfc;
		resize: vertical;
	}

	.prompt-input:focus {
		outline: none;
		border-color: #2563eb;
		box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.4);
	}

	.prompt-button {
		align-self: flex-start;
		margin-top: 0.5rem;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		border: none;
		font-size: 0.9rem;
		font-weight: 500;
		background: #111827;
		color: #f9fafb;
		cursor: pointer;
		transition:
			background-color 140ms ease,
			transform 140ms ease,
			box-shadow 140ms ease;
	}

	.prompt-button:hover {
		background: #0f172a;
		transform: translateY(-1px);
		box-shadow:
			0 10px 20px rgba(15, 23, 42, 0.18),
			0 1px 2px rgba(15, 23, 42, 0.3);
	}

	.prompt-button:active {
		transform: translateY(0);
		box-shadow: none;
	}
</style>

