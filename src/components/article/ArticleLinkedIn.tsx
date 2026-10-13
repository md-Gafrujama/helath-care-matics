const SHOWCASE_URL =
  "https://www.linkedin.com/showcase/healthmatics-healthcare-intelligence/posts/";

function LinkedInMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.5 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.55-2.3 3.1V21H9z" />
    </svg>
  );
}

export default function ArticleLinkedIn({ url }: { url: string }) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="li-actions">
      <a
        className="li-btn"
        href={shareUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInMark />
        Share on LinkedIn
      </a>
      <a
        className="li-btn"
        href={SHOWCASE_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInMark />
        HealthMatics on LinkedIn
      </a>
    </div>
  );
}
