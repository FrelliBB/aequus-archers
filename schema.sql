-- Contact form submissions log.
-- Apply with:
--   npx wrangler d1 execute aequus-contact --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL
);
