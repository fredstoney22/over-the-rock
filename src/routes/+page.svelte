<script lang="ts">
	import ArticleView from '$lib/ArticleView.svelte';
	let { data } = $props();
</script>

<ArticleView content={data.content} updatedAt={data.updatedAt} />
