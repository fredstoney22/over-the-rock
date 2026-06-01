<script lang="ts">
	let { content, updatedAt } = $props<{
		content: string;
		updatedAt: string;
	}>();
</script>

<main class="page">
	<header class="masthead">
		<div class="masthead-top-bar"></div>
		<div class="masthead-inner">
			<div class="masthead-title-block">
				<h1 class="site-title">Over the Rock</h1>
				<p class="site-tagline">Daily AI‑curated briefing over the noise.</p>
			</div>
			<p class="masthead-date">
				Daily briefing for
				<span class="date-pill">
					{new Date(updatedAt).toLocaleDateString('en-US', {
						weekday: 'long',
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</span>
			</p>
		</div>
	</header>

	<section class="article-shell">
		<article class="article-body">
			{@html content}
		</article>
	</section>

	<footer class="page-footer">
		<span class="footer-brand">Over the Rock</span>
		<span aria-hidden="true">·</span>
		<span>AI‑generated daily brief</span>
	</footer>
</main>

<style>
	:global(body) {
		margin: 0;
		min-height: 100vh;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #f5f3f0;
		color: #191719;
	}

	.page {
		max-width: 72rem;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 3.5rem;
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.masthead {
		border-bottom: 1px solid rgba(15, 23, 42, 0.08);
		padding-bottom: 1.75rem;
	}

	.masthead-top-bar {
		height: 3px;
		width: 84px;
		background: linear-gradient(90deg, #1f2937, #4b5563, #0f766e);
		border-radius: 999px;
		margin-bottom: 1.25rem;
	}

	.masthead-inner {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.masthead-title-block {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.site-title {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: clamp(2.2rem, 3vw, 2.6rem);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0;
	}

	.site-tagline {
		margin: 0;
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 0.16em;
		color: #6b7280;
	}

	.masthead-date {
		margin: 0;
		font-size: 0.9rem;
		color: #4b5563;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
	}

	.date-pill {
		padding: 0.2rem 0.7rem;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.04);
		border: 1px solid rgba(15, 23, 42, 0.06);
		font-weight: 500;
	}

	.article-shell {
		max-width: 48rem;
		margin: 0 auto;
		background: #fdfcfb;
		border-radius: 1.25rem;
		padding: 1.75rem 1.75rem 2.25rem;
		box-shadow:
			0 18px 40px rgba(15, 23, 42, 0.06),
			0 1px 2px rgba(15, 23, 42, 0.05);
		border: 1px solid rgba(15, 23, 42, 0.06);
	}

	.article-body {
		font-family: 'Georgia', 'Times New Roman', serif;
		font-size: 1.02rem;
		line-height: 1.7;
		color: #1f2933;
	}

	.article-body h1,
	.article-body h2,
	.article-body h3,
	.article-body h4 {
		font-family: 'Georgia', 'Times New Roman', serif;
		color: #111827;
		margin-top: 2.1rem;
		margin-bottom: 0.6rem;
		line-height: 1.3;
	}

	.article-body h1 {
		font-size: 1.7rem;
	}

	.article-body h2 {
		font-size: 1.4rem;
	}

	.article-body h3 {
		font-size: 1.2rem;
		text-transform: none;
		letter-spacing: 0.04em;
		color: #374151;
	}

	.article-body p {
		margin: 0 0 1.1rem;
	}

	.article-body ul,
	.article-body ol {
		margin: 0 0 1.1rem 1.2rem;
		padding-left: 0.8rem;
	}

	.article-body li + li {
		margin-top: 0.25rem;
	}

	.article-body strong {
		font-weight: 700;
	}

	.article-body em {
		font-style: italic;
	}

	.article-body a {
		color: #1d4ed8;
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 0.16em;
		transition: color 140ms ease, text-decoration-thickness 140ms ease;
	}

	.article-body a:hover {
		color: #1e40af;
		text-decoration-thickness: 2px;
	}

	.page-footer {
		margin-top: 0.5rem;
		text-align: center;
		font-size: 0.75rem;
		color: #9ca3af;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.4rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(15, 23, 42, 0.06);
	}

	.footer-brand {
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	@media (min-width: 768px) {
		.page {
			padding: 3.25rem 2.5rem 4rem;
		}

		.masthead-inner {
			flex-direction: row;
			justify-content: space-between;
			align-items: flex-end;
		}
	}
</style>

