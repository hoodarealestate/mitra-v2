# 🪷 Mitra 2.0 — Deploy Guide

## Step 1 — Run Database
Go to: https://supabase.com/dashboard/project/zjdsgenntcbajqkctpkx/sql/new
Copy lib/schema.sql → paste → click Run ✅

## Step 2 — Vercel Environment Variables
When deploying on Vercel, add these 4 variables
(values are in your .env.local file — DO NOT commit that file):

- GROQ_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY

## Step 3 — GoDaddy DNS
Add CNAME record:
- Name: mitra
- Value: cname.vercel-dns.com
