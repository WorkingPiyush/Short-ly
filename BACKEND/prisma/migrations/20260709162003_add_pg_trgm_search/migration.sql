CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Url_originalUrl_trgm_idx"
ON "Url"
USING GIN ("originalUrl" gin_trgm_ops);

CREATE INDEX "Url_shortCode_trgm_idx"
ON "Url"
USING GIN ("shortCode" gin_trgm_ops);