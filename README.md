# Orvix

Dark-themed public proxy list scraper and exporter.

## Features
- Aggregates five public proxy-list sources
- Deduplicates and validates IPv4:port entries
- Live source status and scrape duration
- Client-side filtering
- Exports the current cleaned list as `scraped.txt`
- Next.js app suitable for Vercel

The visual direction uses the dark, animated-background approach of React Bits as inspiration; see https://reactbits.dev/ for the component library and background gallery.

## Run

```bash
npm install
npm run dev
```

This project only aggregates publicly published proxy lists. Use exported proxies responsibly and only where you have authorization.
