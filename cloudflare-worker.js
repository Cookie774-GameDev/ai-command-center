// Optional live-news proxy for the iPad AI Command Center.
// Deploy as a Cloudflare Worker, then paste the worker URL into the app's Setup panel.
// It returns JSON and adds CORS headers so your iPad PWA can read RSS feeds.

const FEEDS = [
  'https://news.google.com/rss/search?q=(AI%20OR%20OpenAI%20OR%20Anthropic%20OR%20Claude%20OR%20Gemini%20OR%20Cursor%20OR%20Kiro%20OR%20Perplexity)%20when:1d&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=(AI%20promo%20OR%20free%20AI%20credits%20OR%20startup%20AI%20credits%20OR%20student%20AI%20subscription)%20when:7d&hl=en-US&gl=US&ceid=US:en'
];
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=900'
};
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const items = [];
    for (const feed of FEEDS) {
      try {
        const xml = await fetch(feed, { cf: { cacheTtl: 900, cacheEverything: true } }).then(r => r.text());
        const matches = [...xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<pubDate>([\s\S]*?)<\/pubDate>[\s\S]*?(?:<source[^>]*>([\s\S]*?)<\/source>)?[\s\S]*?<\/item>/g)];
        for (const m of matches) items.push({ title: decode(m[1]), url: decode(m[2]), publishedAt: new Date(m[3]).toISOString(), source: strip(decode(m[4] || 'Google News')), summary: '' });
      } catch (err) {
        items.push({ title: 'Feed error', summary: String(err.message || err), source: 'Worker', publishedAt: new Date().toISOString(), url: '' });
      }
    }
    const seen = new Set();
    const unique = items.filter(i => i.title && !seen.has(i.title) && seen.add(i.title)).sort((a,b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 40);
    return new Response(JSON.stringify({ checkedAt: new Date().toISOString(), items: unique }, null, 2), { headers: CORS });
  }
};
function decode(s='') { return strip(s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"')); }
function strip(s='') { return s.replace(/<[^>]*>/g,'').trim(); }
