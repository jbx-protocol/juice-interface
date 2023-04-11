# Supabase Databse

The Juicebox front-end uses a Postgres Database for its metadata.

## Projects

All projects are stored in the Supabase `public.projects` table. Each row contains all project data from the Subgraph, as well as the project's metadata. Project data is updated using a cron defined in /vercel.json, which calls the update routine endpoint defined at /api/projects/update

This pattern allows the UI to query projects by properties defined in metadata (these properties are unavailable to query via the Subgraph).

### Dev

During local dev without a cron, the update routine endpoint /api/projects/update must be called anytime a database is restarted, or when changes to projects need to be reflected in the database.