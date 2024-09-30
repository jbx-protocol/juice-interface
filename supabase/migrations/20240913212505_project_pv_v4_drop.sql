DO $
$
BEGIN
  IF NOT EXISTS (
        SELECT 1
  FROM pg_catalog.pg_attribute
  WHERE attrelid = 'public.projects'::regclass
        AND attname = 'chain_id'
        AND NOT attisdropped
    ) THEN
  ALTER TABLE public.projects ADD COLUMN "chain_id" int;
END
IF;
END $$;
