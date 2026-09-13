import { NextResponse } from "next/server";

const SOURCES = [
  "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=elite",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/refs/heads/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/https.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt",
];

const PROXY_RE = /(?:\d{1,3}\.){3}\d{1,3}:\d{2,5}/g;

function validProxy(value: string) {
  const [host, portText] = value.split(":");
  const octets = host.split(".").map(Number);
  const port = Number(portText);
  return octets.length === 4 && octets.every((n) => Number.isInteger(n) && n >= 0 && n <= 255) && port > 0 && port < 65536;
}

export async function GET() {
  const started = Date.now();
  const headers = { "user-agent": "Orvix/1.0 public-proxy-list-aggregator" };
  const sourceResults: { url: string; count: number; error?: string }[] = [];
  const all = new Set<string>();

  await Promise.all(SOURCES.map(async (url) => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const response = await fetch(url, { headers, cache: "no-store", signal: controller.signal });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const found = new Set((text.match(PROXY_RE) || []).filter(validProxy));
      found.forEach((p) => all.add(p));
      sourceResults.push({ url, count: found.size });
    } catch (error) {
      sourceResults.push({ url, count: 0, error: error instanceof Error ? error.message : "request failed" });
    }
  }));

  const proxies = [...all].sort();
  return NextResponse.json({
    proxies,
    count: proxies.length,
    sources: sourceResults.sort((a, b) => a.url.localeCompare(b.url)),
    durationMs: Date.now() - started,
  }, { headers: { "cache-control": "no-store" } });
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
