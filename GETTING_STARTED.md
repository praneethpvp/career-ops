# Career-Ops — Praneeth's Getting Started Guide

## Quick Setup (5 minutes)

Open your terminal and run:

```bash
cd ~/Personal\ Assistant/career-ops
bash setup.sh
```

This will clone the career-ops repo, merge your personalized files, install dependencies, and run a health check.

## What's Already Configured For You

I've set up 4 personalized files based on your resume and preferences:

### config/profile.yml
Your contact info, target roles (6 archetypes from Data Analyst to AI Product Analyst), compensation target ($220K+), narrative, superpowers, and proof points from Google/Amazon/Microsoft/Intuit.

### cv.md
Your full resume in markdown — this is the source of truth for all evaluations and PDF generation.

### portals.yml
60+ companies to scan across 4 categories:
- Big Tech: Google, Meta, Apple, Amazon, Microsoft, Netflix, Uber, Airbnb, Stripe, Databricks, Snowflake, Salesforce, LinkedIn, Intuit
- AI Labs: Anthropic, OpenAI, Mistral, Cohere, ElevenLabs, Perplexity, Scale AI, Hugging Face, Weights & Biases, Langchain, Pinecone
- Startups: Retool, Vercel, Supabase, Notion, Figma, Rippling, Ramp, dbt Labs, Hex, n8n, Zapier, Fivetran
- Fintech/Fraud: Block, PayPal, Affirm, Chime, Marqeta, SoFi, Robinhood, Coinbase

### _profile.md
Your career context, scoring adjustments, and what makes you unique. This teaches the AI how to evaluate opportunities specifically for you (e.g., Fraud/Risk roles get a +0.5 bonus).

## How to Use Career-Ops

After setup, open Claude Code in the career-ops directory:

```bash
cd ~/Personal\ Assistant/career-ops
claude
```

Then use these commands:

### Evaluate a single job offer
Just paste a job URL or description. Career-ops auto-detects it and runs the full pipeline: evaluation, PDF generation, and tracker entry.

### Scan for new jobs
```
/career-ops scan
```
Scans all 60+ companies in your portals.yml for matching roles.

### Generate a tailored PDF resume
```
/career-ops pdf
```
Creates an ATS-optimized PDF customized to a specific job description. You can also run `npm run pdf` to convert the most recent HTML resume to PDF, or `npm run pdf -- filename.html` for a specific file.

### Batch evaluate multiple offers
```
/career-ops batch
```
Evaluate 10+ offers in parallel using sub-agents.

### Check your pipeline
```
/career-ops tracker
```
View all tracked applications, their status, and scores.

### Deep company research
```
/career-ops deep
```
Deep-dive research on a specific company before applying.

### Interview prep
```
/career-ops interview-prep
```
Generate STAR+R stories tailored to a specific role.

### LinkedIn outreach
```
/career-ops contacto
```
Generate personalized LinkedIn messages for recruiters/hiring managers.

## Tips for Best Results

1. **Feed it context.** The more you tell it about your preferences, the better it gets. Update _profile.md with new learnings.

2. **Don't spray and pray.** Career-ops recommends against applying to anything below 4.0/5. Trust the filter.

3. **Review before submitting.** The system never auto-submits. You always have the final call.

4. **Keep cv.md updated.** This is the source of truth. If you add a new project or skill, update it here.

5. **Add proof points.** Create an article-digest.md with links to your portfolio projects, blog posts, or case studies for even better personalization.

## Your Role Archetypes

Career-ops uses archetypes to classify and score job fit. Yours are:

| Archetype | Level | Fit | What It Covers |
|-----------|-------|-----|----------------|
| Data/Product Analyst | Senior/Staff | Primary | Dashboards, KPIs, A/B testing, product decisions |
| Analytics Engineer | Senior | Primary | ETL, data models, dbt, Snowflake/BigQuery |
| BI Engineer | Senior/Staff | Primary | Reporting systems, dashboarding, data quality |
| AI/ML Data Analyst | Mid-Senior | Secondary | Analytics + ML, fraud detection, pattern recognition |
| Data Scientist | Senior | Secondary | Experimentation, statistical analysis, modeling |
| AI Product Analyst | Senior | Adjacent | AI product strategy + analytics (stretch role) |
