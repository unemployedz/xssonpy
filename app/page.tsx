"use client";

import { useMemo, useState } from "react";

type Source = { url: string; count: number; error?: string };
type Result = { proxies: string[]; count: number; sources: Source[]; durationMs: number };

const SOURCES = [
  "api.proxyscrape.com",
  "TheSpeedX / PROXY-List",
  "mmpx12 / proxy-list",
  "monosans / proxy-list",
  "clarketm / proxy-list",
];

export default function Home() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function scrape() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/scrape", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Scrape failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Scrape failed");
    } finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    if (!result) return [];
    const q = query.trim();
    return q ? result.proxies.filter((p) => p.includes(q)) : result.proxies;
  }, [result, query]);

  function download() {
    if (!result) return;
    const blob = new Blob([result.proxies.join("\n") + "\n"], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "scraped.txt"; a.click();
    URL.revokeObjectURL(url);
  }

  return <>
    <div className="bg"/><div className="noise"/>
    <main className="shell">
      <header className="top">
        <div className="brand"><div className="mark"/><div><strong>Orvix</strong><span>proxy suite</span></div></div>
        <div className="status">● PUBLIC SOURCES</div>
      </header>

      <section className="hero">
        <div className="eyebrow">proxy scraper / v1</div>
        <h1>Collect clean lists.<br/><em>Export instantly.</em></h1>
        <p>Aggregate public proxy lists, remove duplicates and invalid entries, then export the cleaned pool as <b>scraped.txt</b>.</p>
      </section>

      <section className="card toolbar">
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter proxies by IP or port…"/>
        <button className="btn primary" onClick={scrape} disabled={loading}>{loading ? "Scraping…" : "Scrape sources"}</button>
        <button className="btn" onClick={download} disabled={!result?.count}>Export scraped.txt</button>
      </section>

      {error && <div className="card" style={{padding:14,marginTop:12,color:"#ff8da0"}}>{error}</div>}

      <section className="stats">
        <div className="card stat"><small>unique proxies</small><strong>{result?.count ?? "—"}</strong></div>
        <div className="card stat"><small>visible</small><strong>{result ? filtered.length : "—"}</strong></div>
        <div className="card stat"><small>duration</small><strong>{result ? `${result.durationMs}ms` : "—"}</strong></div>
      </section>

      <section className="content">
        <div className="card panel">
          <h2>SCRAPED PROXIES</h2>
          <div className="proxybox">{result ? (filtered.length ? filtered.join("\n") : "No proxies match your filter.") : "Run a scrape to populate the list."}</div>
          <div className="note">Only public proxy-list sources are aggregated. The browser export contains one <code>IP:PORT</code> entry per line.</div>
        </div>
        <aside className="card panel">
          <h2>SOURCES</h2>
          {SOURCES.map((name) => <div className="source" key={name}><span>{name}</span><b className={result ? "ok" : ""}>{result ? "loaded" : "ready"}</b></div>)}
          {result && <div className="note">Duplicates are removed server-side and malformed IPv4/port entries are discarded.</div>}
        </aside>
      </section>

      <div className="footer">ORVIX · PUBLIC PROXY LIST AGGREGATOR · AUTHORIZED / RESPONSIBLE USE</div>
    </main>
  </>;
}
