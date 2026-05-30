# Task 05 — RAG Ingestion Pipeline

## Goal
Build the retrieval-augmented generation (RAG) ingestion pipeline that receives business configuration documents, partitions text into chunks, generates vector representations using OpenAI, and stores vectors into pgvector via Supabase Client.

## Prerequisites
- Task 01 — Database Schema
- Task 03 — Business Onboarding and Settings

## Env vars needed
```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Acceptance criteria
1. A Supabase RPC database function `match_chunks` is successfully registered to enable Cosine distance comparisons against pgvector columns.
2. The `POST /api/rag/ingest` route handles requests with content bodies, clears previous knowledge records for the tenant, and streams back created statistics.
3. The custom character-based text chunker in `lib/rag.ts` properly segments information into blocks (~2000 characters, ~200 character overlap) split gracefully along newlines.
4. OpenAI client integration generates `text-embedding-3-small` vector dimensions (1536 elements) for each chunk.
5. Ingestion saves vector records directly to Supabase using a service role key to bypass row-level security (RLS) constraints.
6. A similarity lookup method `retrieveContext` fetches relevant chunks matching a text query from the DB using the custom Supabase RPC.

## Files to create or modify
- [NEW] [lib/openai.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/openai.ts) — OpenAI API client initialization and embedding generator helper.
- [NEW] [lib/supabase.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/supabase.ts) — Supabase Client initialization using service role keys for system writes.
- [NEW] [lib/rag.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/lib/rag.ts) — Chunker functions, context fetcher, and pgvector search queries.
- [NEW] [app/api/rag/ingest/route.ts](file:///Users/muhammadhaziq/Projects/misc/bookbot/app/api/rag/ingest/route.ts) — Protected ingestion route handler calling the processing pipeline.

## Implementation notes
- The RPC SQL to deploy in Supabase:
  ```sql
  create or replace function match_chunks(
    query_embedding vector(1536),
    p_business_id uuid,
    match_count int default 3
  )
  returns table(id uuid, content text, similarity float)
  language sql stable
  as $$
    select id, content, 1 - (embedding <=> query_embedding) as similarity
    from "KnowledgeChunk"
    where "businessId" = p_business_id
    order by embedding <=> query_embedding
    limit match_count;
  $$;
  ```
- Splitter Logic: Avoid third-party library dependencies. Implement character splitting: Split by double newline first, then accumulate characters. If length exceeds max target size, split with overlap index offset, maintaining text integrity where possible.
- Batching embeddings: Process arrays in batches (maximum of 20 embedding calls at once) to avoid API limit penalties. Include a small wait (`200ms`) between batches.

## Test steps
1. Run the `match_chunks` SQL definition on the Supabase SQL page.
2. Send a POST request to `/api/rag/ingest` containing a sample FAQ text document for an authenticated business. Verify response code is 200 and details the number of chunks stored.
3. Directly verify the database table `KnowledgeChunk` contains the new records, checking that the `embedding` fields contain numeric array listings.
4. Run a retrieval test via a CLI script calling `retrieveContext` with a sample query (e.g. "What is the pricing?") and verify it retrieves relevant FAQ text chunks.
