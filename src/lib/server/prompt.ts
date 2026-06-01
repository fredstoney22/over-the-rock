const RECENCY_HOURS = 72;

/** e.g. "Sunday, May 31, 2026" */
export function formatBriefingDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/** e.g. "May 31, 2026" — used in headlines and recency windows */
export function formatHeadlineDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function getRecencyWindow(now = new Date()) {
	const windowEnd = new Date(now);
	const windowStart = new Date(now);
	windowStart.setHours(windowStart.getHours() - RECENCY_HOURS);

	return {
		today: formatBriefingDate(now),
		windowStart: formatHeadlineDate(windowStart),
		windowEnd: formatHeadlineDate(windowEnd),
		headlineDateExample: formatHeadlineDate(now)
	};
}

/** Daily briefing prompt with today's date and 72-hour window injected. */
export function buildDailyBriefingPrompt(now = new Date()): string {
	const { today, windowStart, windowEnd, headlineDateExample } = getRecencyWindow(now);

	return `Today is ${today}.

Use today's actual calendar date for all searches and dates in your answer (not dates from memory). The recency window is ${windowStart} through ${windowEnd} (last ${RECENCY_HOURS} hours).

Search first, then write a briefing for someone with NO background — like you're catching a friend up over coffee.

Only include stories from the last ${RECENCY_HOURS} hours (${windowStart} – ${windowEnd}). If you can't verify a publication date within that window, skip the story.

Include every story that feels important or interesting in that window — no fixed limit. Don't pad with weak items; don't cut good ones for an arbitrary cap.

Cover two sections:

## Global news
## Internet culture

For EACH story, use exactly this markdown format:

### Friend-like headline — ${headlineDateExample}
One or two casual sentences. Gist only — how you'd explain it in passing. No jargon; if you use a name or meme, explain it in plain words inside those sentences.

**Source:** [Short readable source name](URL from your search results)

Rules:
- Put the date on the headline line after an em dash (use the story's publication or event date within the recency window)
- Sound like conversation, not a news article
- Keep each item to 1–2 sentences max
- Links must use markdown only — never show raw URLs; link text should be a short name
- Every item MUST include a clickable Source link from search
- No stories older than ${RECENCY_HOURS} hours
- No separate sources list at the end — links only inline per item`;
}
