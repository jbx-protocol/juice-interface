drop view if exists projects_aggregate;

create view projects_aggregate as
(
  -- One project per suckerGroupId + array of chainIds
  select distinct on (p.sucker_group_id)
    p.id,
    p.handle,
    p.project_id,
    p.pv,
    p.sucker_group_id,
    p.terminal,
    p.deployer,
    p.created_at,
    p.name,
    p.description,
    p.logo_uri,
    p.metadata_uri,
    p.tags,
    p.archived,
    p.owner,
    p.creator,
    p.created_within_trending_window,
    p.chain_id,
    sub.chain_ids,
    sub.contributors_count as contributors_count,
    sub.current_balance as current_balance,
    sub.payments_count as payments_count,
    sub.nfts_minted_count as nfts_minted_count,
    sub.redeem_count as redeem_count,
    sub.redeem_volume as redeem_volume,
    sub.redeem_volume_usd as redeem_volume_usd,
    sub.trending_payments_count as trending_payments_count,
    sub.trending_score as trending_score,
    sub.trending_volume as trending_volume,
    sub.volume as volume,
    sub.volume_usd as volume_usd
  from projects p
  join (
    select 
      sucker_group_id, 
      coalesce(array_agg(distinct chain_id) filter (where chain_id is not null), '{}') as chain_ids,
      coalesce(sum(contributors_count), 0) as contributors_count,
      lpad(coalesce(sum((current_balance)::numeric), 0)::text, 40, '0')::bpchar as current_balance,
      coalesce(sum(payments_count), 0) as payments_count,
      coalesce(sum(nfts_minted_count), 0) as nfts_minted_count,
      coalesce(sum(redeem_count), 0) as redeem_count,
      lpad(coalesce(sum(redeem_volume::numeric), 0)::text, 40, '0')::bpchar as redeem_volume,
      lpad(coalesce(sum(redeem_volume_usd::numeric), 0)::text, 40, '0')::bpchar as redeem_volume_usd,
      coalesce(sum(trending_payments_count), 0) as trending_payments_count,
      lpad(coalesce(sum(trending_score::numeric), 0)::text, 40, '0')::bpchar as trending_score,
      lpad(coalesce(sum(trending_volume::numeric), 0)::text, 40, '0')::bpchar as trending_volume,
      lpad(coalesce(sum(volume::numeric), 0)::text, 40, '0')::bpchar as volume,
      lpad(coalesce(sum(volume_usd::numeric), 0)::text, 40, '0')::bpchar as volume_usd
    from projects
    group by sucker_group_id
  ) sub
  on p.sucker_group_id = sub.sucker_group_id
  order by p.sucker_group_id, p.chain_id, p.id
)
union
(
  -- All other projects (not pv=4), no chainIds array
  select 
    id,
    handle,
    project_id,
    pv,
    sucker_group_id,
    terminal,
    deployer,
    created_at,
    name,
    description,
    logo_uri,
    metadata_uri,
    tags,
    archived,
    owner,
    creator,
    created_within_trending_window,
    chain_id,
    coalesce(array[chain_id], '{}')::int[] as chain_ids,
    contributors_count,
    current_balance,
    payments_count,
    nfts_minted_count,
    redeem_count,
    redeem_volume,
    redeem_volume_usd,
    trending_payments_count,
    trending_score,
    trending_volume,
    volume,
    volume_usd
  from projects
  where sucker_group_id is null
);