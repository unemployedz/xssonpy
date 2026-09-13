# XSSonPy

A Vercel-ready, non-destructive web security scanner for targets you own or are authorized to test.

## What it checks
- HTTPS and redirect behavior
- Security response headers (CSP, nosniff, Referrer-Policy, Permissions-Policy)
- Cookie security attributes
- Response content type
- Basic development/debug disclosure signals

The API deliberately avoids exploit payloads, destructive requests, authentication bypasses, brute force, and arbitrary internal-network access. It also blocks local/private/reserved hosts to reduce SSRF risk.

## Deploy
Import this repository into Vercel. The included Next.js app builds without additional services.

## Important
Only scan systems for which you have explicit authorization. Missing security headers are findings to investigate, not proof of an exploitable vulnerability.
