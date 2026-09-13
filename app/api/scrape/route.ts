import { NextResponse } from "next/server";

type Source = { url:string; protocol:string };
const SOURCES: Source[] = [
  {url:"https://raw.githubusercontent.com/proxio-io/proxy-list/main/http.txt",protocol:"http"},
  {url:"https://raw.githubusercontent.com/proxio-io/proxy-list/main/https.txt",protocol:"https"},
  {url:"https://raw.githubusercontent.com/proxio-io/proxy-list/main/socks4.txt",protocol:"socks4"},
  {url:"https://raw.githubusercontent.com/proxio-io/proxy-list/main/socks5.txt",protocol:"socks5"},
  {url:"https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/http/data.txt",protocol:"http"},
  {url:"https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.txt",protocol:"https"},
  {url:"https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/socks4/data.txt",protocol:"socks4"},
  {url:"https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/socks5/data.txt",protocol:"socks5"},
  {url:"https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/http.txt",protocol:"http"},
  {url:"https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/https.txt",protocol:"https"},
  {url:"https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/socks4.txt",protocol:"socks4"},
  {url:"https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/socks5.txt",protocol:"socks5"},
  {url:"https://raw.githubusercontent.com/iplocate/free-proxy-list/main/protocols/http.txt",protocol:"http"},
  {url:"https://raw.githubusercontent.com/iplocate/free-proxy-list/main/protocols/socks4.txt",protocol:"socks4"},
  {url:"https://raw.githubusercontent.com/iplocate/free-proxy-list/main/protocols/socks5.txt",protocol:"socks5"},
  {url:"https://raw.githubusercontent.com/stormsia/proxy-list/main/http.txt",protocol:"http"},
  {url:"https://raw.githubusercontent.com/stormsia/proxy-list/main/socks4.txt",protocol:"socks4"},
  {url:"https://raw.githubusercontent.com/stormsia/proxy-list/main/socks5.txt",protocol:"socks5"},
  {url:"https://raw.githubusercontent.com/gproxynet/free-proxy-list/main/http.txt",protocol:"http"},
  {url:"https://raw.githubusercontent.com/gproxynet/free-proxy-list/main/socks4.txt",protocol:"socks4"},
  {url:"https://raw.githubusercontent.com/gproxynet/free-proxy-list/main/socks5.txt",protocol:"socks5"},
];

const PROXY_RE=/(?:\d{1,3}\.){3}\d{1,3}:\d{1,5}/g;
function validProxy(value:string){const [host,portText]=value.split(":");const octets=host.split(".").map(Number);const port=Number(portText);return octets.length===4&&octets.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&port>0&&port<65536;}

export async function GET(){
 const started=Date.now();const headers={"user-agent":"Orvix/1.1 verified-public-proxy-aggregator"};const sourceResults:{url:string;count:number;protocol:string;error?:string}[]=[];const all=new Map<string,{value:string;protocol:string}>();
 await Promise.all(SOURCES.map(async source=>{try{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);const r=await fetch(source.url,{headers,cache:"no-store",signal:controller.signal});clearTimeout(timer);if(!r.ok)throw new Error(`HTTP ${r.status}`);const text=await r.text();const found=new Set<string>();for(const raw of text.match(PROXY_RE)||[]){if(validProxy(raw))found.add(raw)}for(const p of found)all.set(`${source.protocol}://${p}`,{value:p,protocol:source.protocol});sourceResults.push({url:source.url,count:found.size,protocol:source.protocol});}catch(error){sourceResults.push({url:source.url,count:0,protocol:source.protocol,error:error instanceof Error?error.message:"request failed"});}}));
 const proxies=[...all.values()].sort((a,b)=>a.protocol.localeCompare(b.protocol)||a.value.localeCompare(b.value));
 return NextResponse.json({proxies,count:proxies.length,sources:sourceResults,durationMs:Date.now()-started},{headers:{"cache-control":"no-store"}});
}
export const runtime="nodejs";export const dynamic="force-dynamic";
