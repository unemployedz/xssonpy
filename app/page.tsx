"use client";

import { useMemo, useState } from "react";
import Particles from "../components/Particles";

type ProxyItem={value:string;protocol:string};
type Source={url:string;count:number;error?:string};
type Result={proxies:ProxyItem[];count:number;sources:Source[];durationMs:number};

const TYPES=["all","http","https","socks4","socks5"];

export default function Home(){
 const [result,setResult]=useState<Result|null>(null);const[loading,setLoading]=useState(false);const[error,setError]=useState("");const[query,setQuery]=useState("");const[type,setType]=useState("all");
 async function scrape(){setLoading(true);setError("");try{const r=await fetch("/api/scrape",{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.error||"Scrape failed");setResult(d)}catch(e){setError(e instanceof Error?e.message:"Scrape failed")}finally{setLoading(false)}}
 const filtered=useMemo(()=>{if(!result)return[];const q=query.trim().toLowerCase();return result.proxies.filter(p=>(type==="all"||p.protocol===type)&&(!q||p.value.toLowerCase().includes(q)))},[result,query,type]);
 function download(){if(!filtered.length)return;const text=filtered.map(p=>`${p.protocol}://${p.value}`).join("\n")+"\n";const blob=new Blob([text],{type:"text/plain"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download="scraped.txt";a.click();URL.revokeObjectURL(u)}
 return <><div className="stage"><Particles particleColors={["#ffffff"]} particleCount={180} particleSpread={18} speed={0.12} particleBaseSize={110} moveParticlesOnHover={true} alphaParticles={true} /></div><main className="shell">
  <header className="top"><div className="brand"><div className="mark"/><div><strong>Orvix</strong><span>proxy suite</span></div></div><div className="status">● LIVE SOURCES</div></header>
  <section className="hero"><div className="eyebrow">proxy scraper / verified pool</div><h1>Clean proxies.<br/><em>Nothing else.</em></h1><p>Pull verified public HTTP, HTTPS, SOCKS4 and SOCKS5 lists, normalize them, remove duplicates and export the current pool.</p></section>
  <section className="card toolbar"><input className="input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Filter IP or port…"/><select className="btn" value={type} onChange={e=>setType(e.target.value)}>{TYPES.map(t=><option key={t} value={t}>{t.toUpperCase()}</option>)}</select><button className="btn primary" onClick={scrape} disabled={loading}>{loading?"Scraping…":"Scrape verified lists"}</button><button className="btn" onClick={download} disabled={!filtered.length}>Export scraped.txt</button></section>
  {error&&<div className="card" style={{padding:14,marginTop:10,color:"#ff7185"}}>{error}</div>}
  <section className="stats"><div className="card stat"><small>verified pool</small><strong>{result?.count??"—"}</strong></div><div className="card stat"><small>visible</small><strong>{result?filtered.length:"—"}</strong></div><div className="card stat"><small>duration</small><strong>{result?`${result.durationMs}ms`:"—"}</strong></div></section>
  <section className="content"><div className="card panel"><h2>PROXY POOL</h2><div className="proxybox">{result?(filtered.length?filtered.map(p=>`${p.protocol.padEnd(7)} ${p.value}`).join("\n"):"No verified proxies match your filter."):"Run a scrape to populate the verified pool."}</div><div className="note">Export includes protocol + IP:PORT. Sources used below publish or re-check working public proxies. No credentials are sent through scraped proxies.</div></div>
  <aside className="card panel"><h2>VERIFIED SOURCES</h2>{result?.sources.map(s=><div className="source" key={s.url}><span>{new URL(s.url).hostname}</span><b className={s.error?"":"ok"}>{s.error?"failed":`${s.count}`}</b></div>)}{!result&&<div className="note">HTTP · HTTPS · SOCKS4 · SOCKS5<br/>Multiple independent public pools.</div>} {result&&<div className="note">Counts are the entries accepted from each source after IP:port validation and deduplication.</div>}</aside></section>
  <div className="footer">ORVIX · PUBLIC VERIFIED PROXY AGGREGATOR · AUTHORIZED / RESPONSIBLE USE</div>
 </main></>;
}
