import express from 'express';
import NewsAPI from "newsapi";
import fetch from "node-fetch";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Keys
const NEWSAPI_KEY = "5f4ae048e65940f7b3aa862dff863c9a";
const newsapi = new NewsAPI(NEWSAPI_KEY);
const CG_KEY = "CG-GMyD44iKgt3YL1ChBCrFaWvo";
const CG_HEADERS = { "x-cg-demo-api-key": CG_KEY };

//Helpers
async function getArticles(q = "crypto") {
    const { articles } = await newsapi.v2.everything({
        q,
        language: "en",
        sortBy: "publishedAt",
        pageSize: 12,
    });
    return articles || [];
}

async function cgJson(url) {
    const r = await fetch(url, { headers: CG_HEADERS });
    return r.json();
}

function fmtUSD(n) {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
    return `$${Number(n || 0).toLocaleString()}`;
}

function pct(n) {
    return (Number.isFinite(n) ? `${n.toFixed(2)}%` : "—");
}

async function resolveCoinId(input) {
    const q = input.toLowerCase().trim();

    const test = await cgJson(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(q)}&vs_currencies=usd`);
    if (test[q]) return q;

    const s = await cgJson(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`);
    const ids = (s.coins || []).map(c => c.id);
    if (ids.includes(q)) return q;
    if (ids.length) return ids[0];
    return "bitcoin";
}

//Routes

//news
app.get("/news", async (req, res) => {
    const q = (req.query.q || "crypto").trim() || "crypto";
    const articles = await getArticles(q);
    res.render("news.ejs", { q, articles });
});

app.post("/news", (req, res) => {
    const q = (req.body.q || "").trim();
    res.redirect(`/news?q=${encodeURIComponent(q || "crypto")}`);
});

//research
app.get("/research", async (req, res) => {
    const input = (req.query.coin || "bitcoin");
    const id = await resolveCoinId(input);

    const price = await cgJson(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`
    );

    const chart = await cgJson(
        `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}/market_chart?vs_currency=usd&days=7`
    );

    const labels = (chart.prices || []).map(p => new Date(p[0]).toLocaleString());
    const prices = (chart.prices || []).map(p => p[1]);
    const usd = price[id]?.usd ?? null;

    res.render("research.ejs", { query: input, id, usd, labels, prices });
});

//Home - Charts

app.get("/", async (req, res) => {
    // Top 20 by 24h volume
    const byVolume = await cgJson(
        "https://api.coingecko.com/api/v3/coins/markets" +
        "?vs_currency=usd&order=volume_desc&per_page=20&page=1&price_change_percentage=24h"
    );

    const volRows = (byVolume || []).map(c => ({
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        price: fmtUSD(c.current_price),
        volume: fmtUSD(c.total_volume),
        change: pct(c.price_change_percentage_24h)
    }));

    // Pool then top 20 gainers by 24h %
    const pool = await cgJson(
        "https://api.coingecko.com/api/v3/coins/markets" +
        "?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&price_change_percentage=24h"
    );

    const gainers = (pool || [])
        .filter(c => Number.isFinite(c.price_change_percentage_24h) && c.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 20);

    const gainRows = gainers.map(c => ({
        name: c.name,
        symbol: c.symbol?.toUpperCase(),
        price: fmtUSD(c.current_price),
        volume: fmtUSD(c.total_volume),
        change: pct(c.price_change_percentage_24h)
    }));

    res.render("home.ejs", { volRows, gainRows });
});

//Localhost
app.listen(3000, () => {
    console.log('server started');
});