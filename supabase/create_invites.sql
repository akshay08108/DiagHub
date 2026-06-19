-- Generates ten single-use friend codes.
-- Copy the final query results immediately; only hashes remain in the database.

create temporary table generated_diaghub_invites (
  code text primary key
) on commit drop;

insert into generated_diaghub_invites (code)
select 'DH-' || upper(encode(extensions.gen_random_bytes(6), 'hex'))
from generate_series(1, 10);

insert into public.invite_codes (code_hash, max_uses, uses, active)
select encode(extensions.digest(code, 'sha256'), 'hex'), 1, 0, true
from generated_diaghub_invites
on conflict (code_hash) do nothing;

select code as private_friend_code
from generated_diaghub_invites
order by code;
