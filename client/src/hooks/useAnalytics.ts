export function trackPageView(page: string) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'page_view', name: page }),
  }).catch(() => {});
}

export function trackFeature(feature: string, detail?: string) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'feature', name: feature, detail }),
  }).catch(() => {});
}
