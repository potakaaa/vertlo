# Product

<!-- impeccable:product-schema 1 -->

> Source note: written from the project brief and the copy in `src/content/landing.ts`, without an interview round. Lines marked (brief) come from the brief, (repo) from the existing content. Nothing here was confirmed in conversation.

## Platform

web

## Users

Owners and operators of high-risk ecommerce brands (supplements, subscriptions, digital goods) who take card payments across several merchant accounts (MIDs). They arrive worried about one thing: a processor closing an account and checkout going dark. (brief, repo)

The industry list is a working assumption and should be confirmed with Vertlo before launch. (repo)

## Product Purpose

Vertlo is a payment CRM and processor for high-risk ecommerce. It runs all of a merchant's payment providers and merchant accounts in one place and routes orders around the account that gets paused, so one closed account does not stop checkout. (brief)

Success for the landing page: a merchant books a call. "Book a call" is the one CTA. (repo)

## Positioning

Routing around a failure. When one account pauses, traffic moves to the other live accounts in seconds. Vertlo also underwrites in-house and can issue new accounts. (brief, repo)

## Operating Context

Merchants work in the Vertlo portal (Overview: volume, approval rate, routing split, payment health, settlement, attention items). The page shows it as a product shot with illustrative data for the merchant "Nordvia Group LLC". (repo)

## Capabilities and Constraints

- Routing across accounts by rules the merchant sets; failover when a MID pauses; early dispute alerts; every store in one CRM; in-house underwriting. (repo)
- No published prices: a setup fee plus a percentage per transaction, quoted per merchant on a call. (repo)
- All numbers, orders, accounts and events on the page are illustrative and must stay labelled. (brief, repo)
- Merchant quotes and logos are placeholders until real, approved ones exist. Never ship invented ones. (repo)

## Brand Commitments

- Misty green brand: `#eef1ee` ground, forest `#1f3b2b`, bright green `#16c45a`. (brief)
- The client asked for something unusual that still feels trustworthy, and "stealthy": quiet, minimal, understated. Restraint, not a dark theme. (brief)
- The client said an earlier version "feels too AI generated… too familiar with other AI generated websites." (brief)
- Copy stays short: a headline and one line per section.

## Evidence on Hand

- Copy and illustrative data: `src/content/landing.ts`.
- Portal product shot: `src/components/landing/portal/`.
- No real testimonials, customer logos, benchmarks or prices exist yet.

## Product Principles

1. Show the failover happening; do not explain it.
2. Trust comes from precision: real-looking IDs, times and statuses, always labelled illustrative.
3. One action: book a call.
4. Say less. Whitespace over decoration.
