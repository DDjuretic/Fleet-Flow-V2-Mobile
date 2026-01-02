--
-- PostgreSQL database cluster dump
--

\restrict wCYcrcm4VXf0Scq69iJel24EMZ2zj6ckdienidf86FA4Bj4stNVd1JfxviOBWs6

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE anon;
ALTER ROLE anon WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticated;
ALTER ROLE authenticated WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE authenticator;
ALTER ROLE authenticator WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE dashboard_user;
ALTER ROLE dashboard_user WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB NOLOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE pgbouncer;
ALTER ROLE pgbouncer WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE postgres;
ALTER ROLE postgres WITH NOSUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE service_role;
ALTER ROLE service_role WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_admin;
ALTER ROLE supabase_admin WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS;
CREATE ROLE supabase_auth_admin;
ALTER ROLE supabase_auth_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_read_only_user;
ALTER ROLE supabase_read_only_user WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION BYPASSRLS;
CREATE ROLE supabase_realtime_admin;
ALTER ROLE supabase_realtime_admin WITH NOSUPERUSER NOINHERIT NOCREATEROLE NOCREATEDB NOLOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE supabase_replication_admin;
ALTER ROLE supabase_replication_admin WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN REPLICATION NOBYPASSRLS;
CREATE ROLE supabase_storage_admin;
ALTER ROLE supabase_storage_admin WITH NOSUPERUSER NOINHERIT CREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS;

--
-- User Configurations
--

--
-- User Config "anon"
--

ALTER ROLE anon SET statement_timeout TO '3s';

--
-- User Config "authenticated"
--

ALTER ROLE authenticated SET statement_timeout TO '8s';

--
-- User Config "authenticator"
--

ALTER ROLE authenticator SET session_preload_libraries TO 'safeupdate';
ALTER ROLE authenticator SET statement_timeout TO '8s';
ALTER ROLE authenticator SET lock_timeout TO '8s';

--
-- User Config "postgres"
--

ALTER ROLE postgres SET search_path TO E'\\$user', 'public', 'extensions';

--
-- User Config "supabase_admin"
--

ALTER ROLE supabase_admin SET search_path TO '$user', 'public', 'auth', 'extensions';
ALTER ROLE supabase_admin SET log_statement TO 'none';

--
-- User Config "supabase_auth_admin"
--

ALTER ROLE supabase_auth_admin SET search_path TO 'auth';
ALTER ROLE supabase_auth_admin SET idle_in_transaction_session_timeout TO '60000';
ALTER ROLE supabase_auth_admin SET log_statement TO 'none';

--
-- User Config "supabase_storage_admin"
--

ALTER ROLE supabase_storage_admin SET search_path TO 'storage';
ALTER ROLE supabase_storage_admin SET log_statement TO 'none';


--
-- Role memberships
--

GRANT anon TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT anon TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticated TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT authenticated TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT authenticator TO supabase_storage_admin WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT pg_create_subscription TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_monitor TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_read_all_data TO supabase_read_only_user WITH INHERIT TRUE GRANTED BY supabase_admin;
GRANT pg_signal_backend TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT service_role TO authenticator WITH INHERIT FALSE GRANTED BY supabase_admin;
GRANT service_role TO postgres WITH ADMIN OPTION, INHERIT TRUE GRANTED BY supabase_admin;
GRANT supabase_realtime_admin TO postgres WITH INHERIT TRUE GRANTED BY supabase_admin;






\unrestrict wCYcrcm4VXf0Scq69iJel24EMZ2zj6ckdienidf86FA4Bj4stNVd1JfxviOBWs6

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict DZpOygLF2goFQI1RhdwzHewj8vhCn8eq8lkGubbkOmazksKOcfy9dgfPAyi04i9

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

\unrestrict DZpOygLF2goFQI1RhdwzHewj8vhCn8eq8lkGubbkOmazksKOcfy9dgfPAyi04i9

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict NNVwXFbwtykDHx3l1LgP9fWirsvHZEfenrRsh9IZchuxINSN7Dz3v8wVydXG9UG

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6 (Debian 17.6-1.pgdg12+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- Name: reservation_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reservation_status_enum AS ENUM (
    'PENDING_APPROVAL',
    'APPROVED',
    'REJECTED',
    'CANCELLED',
    'COMPLETED'
);


ALTER TYPE public.reservation_status_enum OWNER TO postgres;

--
-- Name: trip_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.trip_status AS ENUM (
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.trip_status OWNER TO postgres;

--
-- Name: user_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_status AS ENUM (
    'active',
    'inactive',
    'suspended'
);


ALTER TYPE public.user_status OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- Name: check_admin_user_status(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_admin_user_status(admin_email text) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    result_json JSON;
BEGIN
    SELECT json_build_object(
        'auth_exists', (SELECT id FROM auth.users WHERE email = admin_email) IS NOT NULL,
        'public_exists', (SELECT users.user_id FROM users WHERE users.email = admin_email) IS NOT NULL,
        'has_admin_role', EXISTS(
            SELECT 1 FROM users u
            JOIN user_roles ur ON u.user_id = ur.user_id
            JOIN roles r ON ur.role_id = r.role_id
            WHERE u.email = admin_email AND r.role_name = 'admin'
        ),
        'user_id', (SELECT users.user_id FROM users WHERE users.email = admin_email),
        'first_name', (SELECT users.first_name FROM users WHERE users.email = admin_email),
        'last_name', (SELECT users.last_name FROM users WHERE users.email = admin_email),
        'company_name', (SELECT c.name FROM users JOIN companies c ON users.company_id = c.company_id WHERE users.email = admin_email)
    ) INTO result_json;
    
    RETURN result_json;
END;
$$;


ALTER FUNCTION public.check_admin_user_status(admin_email text) OWNER TO postgres;

--
-- Name: FUNCTION check_admin_user_status(admin_email text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.check_admin_user_status(admin_email text) IS 'Checks complete admin user status across auth.users, public.users and roles.';


--
-- Name: check_vehicle_data(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_vehicle_data() RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    vehicle_types_count INTEGER;
    vehicle_statuses_count INTEGER;
    fuel_types_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO vehicle_types_count FROM vehicle_types;
    SELECT COUNT(*) INTO vehicle_statuses_count FROM vehicle_status;
    SELECT COUNT(*) INTO fuel_types_count FROM fuel_types;
    
    RETURN FORMAT('Vehicle Types: %s, Vehicle Statuses: %s, Fuel Types: %s', 
                  vehicle_types_count, vehicle_statuses_count, fuel_types_count);
END;
$$;


ALTER FUNCTION public.check_vehicle_data() OWNER TO postgres;

--
-- Name: cleanup_old_backups(uuid, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_old_backups(p_user_id uuid, p_keep_count integer DEFAULT 10) RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_deleted_count INTEGER := 0;
BEGIN
    -- Delete old backups, keeping only the most recent p_keep_count
    DELETE FROM user_backups
    WHERE user_id = p_user_id
    AND backup_id NOT IN (
        SELECT backup_id
        FROM user_backups
        WHERE user_id = p_user_id
        ORDER BY created_at DESC
        LIMIT p_keep_count
    );
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    
    RETURN v_deleted_count;
END;
$$;


ALTER FUNCTION public.cleanup_old_backups(p_user_id uuid, p_keep_count integer) OWNER TO postgres;

--
-- Name: cleanup_old_logs(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cleanup_old_logs() RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM system_logs 
    WHERE created_at < NOW() - INTERVAL '30 days'
    AND severity NOT IN ('ERROR', 'CRITICAL');
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Log cleanup action (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title,
        description,
        metadata,
        created_at
    ) VALUES (
        'MAINTENANCE',
        'INFO',
        'Old logs cleaned up',
        'System maintenance: Old log entries have been removed',
        jsonb_build_object('deleted_count', deleted_count),
        NOW()
    );
END;
$$;


ALTER FUNCTION public.cleanup_old_logs() OWNER TO postgres;

--
-- Name: FUNCTION cleanup_old_logs(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.cleanup_old_logs() IS 'Function za brisanje starih logova - maintenance';


--
-- Name: complete_admin_setup(text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.complete_admin_setup(admin_email text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    auth_user_id UUID;
    result_json JSON;
BEGIN
    -- Get auth user ID
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF auth_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'message', 'User not found in auth.users. Create via Auth API first.'
        );
    END IF;
    
    -- Call the main function
    SELECT create_admin_user_safe(admin_email, 'password123', 'Danko', 'Đuretić') 
    INTO result_json;
    
    RETURN result_json;
END;
$$;


ALTER FUNCTION public.complete_admin_setup(admin_email text) OWNER TO postgres;

--
-- Name: FUNCTION complete_admin_setup(admin_email text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.complete_admin_setup(admin_email text) IS 'Completes admin setup for existing auth user created via Auth API.';


--
-- Name: create_admin_user_safe(text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text DEFAULT 'Admin'::text, admin_last_name text DEFAULT 'User'::text) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    new_user_id UUID;
    company_uuid UUID;
    admin_role_id UUID;
    result_json JSON;
BEGIN
    -- Check if user already exists in auth.users
    SELECT id INTO new_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    IF new_user_id IS NOT NULL THEN
        -- User already exists, just ensure proper setup
        RAISE NOTICE 'User % already exists with ID %', admin_email, new_user_id;
    ELSE
        -- User doesn't exist, we need to create via Auth API
        -- This function should be called AFTER creating user via Auth API
        RAISE EXCEPTION 'User % must be created via Auth API first. Use: curl -X POST "http://127.0.0.1:54321/auth/v1/signup" -H "Content-Type: application/json" -H "apikey: YOUR_ANON_KEY" -d ''{"email": "%", "password": "%"}''', admin_email, admin_email, admin_password;
    END IF;
    
    -- Get default company
    SELECT company_id INTO company_uuid FROM companies LIMIT 1;
    
    -- Get admin role
    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'admin' LIMIT 1;
    
    -- Create company if missing
    IF company_uuid IS NULL THEN
        INSERT INTO companies (
            company_id, name, address, contact_email, contact_phone, 
            subscription_plan, city, country, industry, founded_year, employee_count
        ) VALUES (
            gen_random_uuid(), 'Fleet Flow Demo', '4 jula 109/86', 
            'info@fleetflow.com', '+382 67 503 345', 'Premium', 
            'Podgorica', 'Montenegro', 'Fleet Management', '2024', '50'
        ) RETURNING company_id INTO company_uuid;
    END IF;
    
    -- Create admin role if missing
    IF admin_role_id IS NULL THEN
        INSERT INTO roles (role_id, role_name, description)
        VALUES (gen_random_uuid(), 'admin', 'Administrator role')
        RETURNING role_id INTO admin_role_id;
    END IF;
    
    -- Update or create public.users record
    INSERT INTO users (
        user_id, company_id, username, email, password_hash,
        first_name, last_name, phone_number, is_active, 
        is_email_verified, created_at, updated_at
    ) VALUES (
        new_user_id,
        company_uuid,
        REPLACE(admin_email, '@', '.'),
        admin_email,
        'auth_managed',
        admin_first_name,
        admin_last_name,
        '+382 67 503 345',
        true,
        true,
        NOW(),
        NOW()
    ) ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        company_id = EXCLUDED.company_id,
        is_active = true,
        updated_at = NOW();
    
    -- Assign admin role
    INSERT INTO user_roles (user_id, role_id, assigned_at)
    VALUES (new_user_id, admin_role_id, NOW())
    ON CONFLICT (user_id, role_id) DO NOTHING;
    
    -- Build result JSON
    SELECT json_build_object(
        'success', true,
        'user_id', new_user_id,
        'email', admin_email,
        'first_name', admin_first_name,
        'last_name', admin_last_name,
        'company_id', company_uuid,
        'admin_role_id', admin_role_id,
        'message', 'Admin user setup completed successfully'
    ) INTO result_json;
    
    RETURN result_json;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to setup admin user'
        );
END;
$$;


ALTER FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text) OWNER TO postgres;

--
-- Name: FUNCTION create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text) IS 'Safely creates admin user after Auth API signup. Prevents "Database error querying schema" by not creating auth.users directly.';


--
-- Name: create_user_backup(text, text, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_user_backup(p_backup_name text DEFAULT NULL::text, p_backup_description text DEFAULT NULL::text, p_is_automatic boolean DEFAULT false) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id UUID;
    v_backup_id UUID;
    v_backup_name TEXT;
    v_backup_type TEXT;
    v_total_size BIGINT := 0;
    v_metadata JSONB := '{}';
    
    -- Counters
    v_vehicle_count INTEGER := 0;
    v_poi_count INTEGER := 0;
    v_route_count INTEGER := 0;
    v_expense_count INTEGER := 0;
    v_reminder_count INTEGER := 0;
    v_trip_count INTEGER := 0;
    v_reservation_count INTEGER := 0;
    v_notification_count INTEGER := 0;
    v_total_records INTEGER := 0;
    
    -- Data variables
    v_vehicles_data JSONB;
    v_pois_data JSONB;
    v_routes_data JSONB;
    v_expenses_data JSONB;
    v_reminders_data JSONB;
    v_trips_data JSONB;
    v_reservations_data JSONB;
    v_notifications_data JSONB;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;
    
    -- Generate backup name if not provided
    IF p_backup_name IS NULL OR p_backup_name = '' THEN
        v_backup_name := 'Backup ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI');
    ELSE
        v_backup_name := p_backup_name;
    END IF;
    
    -- Set backup type
    v_backup_type := CASE WHEN p_is_automatic THEN 'automatic' ELSE 'manual' END;
    
    -- Generate backup ID
    v_backup_id := gen_random_uuid();
    
    -- Backup vehicles data (user's private vehicles or vehicles they've used)
    SELECT json_agg(row_to_json(v.*)), COUNT(*)
    INTO v_vehicles_data, v_vehicle_count
    FROM vehicles v
    WHERE v.private_owner_id = v_user_id OR v.vehicle_id IN (
        SELECT DISTINCT vehicle_id FROM trips WHERE user_id = v_user_id
    );
    
    -- Backup POIs data (company POIs)
    SELECT json_agg(row_to_json(p.*)), COUNT(*)
    INTO v_pois_data, v_poi_count
    FROM pois p
    WHERE p.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);
    
    -- Backup routes data (company routes)
    SELECT json_agg(row_to_json(r.*)), COUNT(*)
    INTO v_routes_data, v_route_count
    FROM standard_routes r
    WHERE r.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);
    
    -- Backup expenses data (user's expenses)
    SELECT json_agg(row_to_json(e.*)), COUNT(*)
    INTO v_expenses_data, v_expense_count
    FROM expenses e
    WHERE e.user_id = v_user_id;
    
    -- Backup reminders data (user's reminders)
    SELECT json_agg(row_to_json(r.*)), COUNT(*)
    INTO v_reminders_data, v_reminder_count
    FROM reminders r
    WHERE r.user_id = v_user_id;
    
    -- Backup trips data (user's trips)
    SELECT json_agg(row_to_json(t.*)), COUNT(*)
    INTO v_trips_data, v_trip_count
    FROM trips t
    WHERE t.user_id = v_user_id;
    
    -- Backup reservations data (user's reservations)
    SELECT json_agg(row_to_json(res.*)), COUNT(*)
    INTO v_reservations_data, v_reservation_count
    FROM reservations res
    WHERE res.user_id = v_user_id;
    
    -- Backup notifications data (user's notifications)
    SELECT json_agg(row_to_json(n.*)), COUNT(*)
    INTO v_notifications_data, v_notification_count
    FROM notifications n
    WHERE n.user_id = v_user_id;
    
    -- Calculate total records
    v_total_records := COALESCE(v_vehicle_count, 0) + COALESCE(v_poi_count, 0) + COALESCE(v_route_count, 0) + 
                      COALESCE(v_expense_count, 0) + COALESCE(v_reminder_count, 0) + COALESCE(v_trip_count, 0) + 
                      COALESCE(v_reservation_count, 0) + COALESCE(v_notification_count, 0);
    
    -- Build metadata
    v_metadata := json_build_object(
        'vehicle_count', COALESCE(v_vehicle_count, 0),
        'poi_count', COALESCE(v_poi_count, 0),
        'route_count', COALESCE(v_route_count, 0),
        'expense_count', COALESCE(v_expense_count, 0),
        'reminder_count', COALESCE(v_reminder_count, 0),
        'trip_count', COALESCE(v_trip_count, 0),
        'reservation_count', COALESCE(v_reservation_count, 0),
        'message_count', 0,
        'notification_count', COALESCE(v_notification_count, 0),
        'chat_group_count', 0,
        'total_records', v_total_records
    );
    
    -- Calculate backup size (approximate)
    v_total_size := LENGTH(v_metadata::TEXT) + 
                   COALESCE(LENGTH(v_vehicles_data::TEXT), 0) +
                   COALESCE(LENGTH(v_pois_data::TEXT), 0) +
                   COALESCE(LENGTH(v_routes_data::TEXT), 0) +
                   COALESCE(LENGTH(v_expenses_data::TEXT), 0) +
                   COALESCE(LENGTH(v_reminders_data::TEXT), 0) +
                   COALESCE(LENGTH(v_trips_data::TEXT), 0) +
                   COALESCE(LENGTH(v_reservations_data::TEXT), 0) +
                   COALESCE(LENGTH(v_notifications_data::TEXT), 0);
    
    -- Create backup record
    INSERT INTO user_backups (
        backup_id, user_id, backup_name, backup_description, 
        backup_type, backup_size_bytes, backup_metadata
    ) VALUES (
        v_backup_id, v_user_id, v_backup_name, p_backup_description,
        v_backup_type, v_total_size, v_metadata
    );
    
    -- Store backup data
    IF v_vehicles_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'vehicles', 'vehicles', v_vehicles_data, v_vehicle_count);
    END IF;
    
    IF v_pois_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'pois', 'pois', v_pois_data, v_poi_count);
    END IF;
    
    IF v_routes_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'standard_routes', 'routes', v_routes_data, v_route_count);
    END IF;
    
    IF v_expenses_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'expenses', 'expenses', v_expenses_data, v_expense_count);
    END IF;
    
    IF v_reminders_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'reminders', 'reminders', v_reminders_data, v_reminder_count);
    END IF;
    
    IF v_trips_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'trips', 'trips', v_trips_data, v_trip_count);
    END IF;
    
    IF v_reservations_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'reservations', 'reservations', v_reservations_data, v_reservation_count);
    END IF;
    
    IF v_notifications_data IS NOT NULL THEN
        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)
        VALUES (v_backup_id, 'notifications', 'notifications', v_notifications_data, v_notification_count);
    END IF;
    
    RETURN v_backup_id;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating backup: %', SQLERRM;
END;
$$;


ALTER FUNCTION public.create_user_backup(p_backup_name text, p_backup_description text, p_is_automatic boolean) OWNER TO postgres;

--
-- Name: daily_maintenance(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.daily_maintenance() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Refresh materialized views
    PERFORM refresh_performance_views();
    
    -- Cleanup old logs
    PERFORM cleanup_old_logs();
    
    -- Analyze tables for better query planning
    ANALYZE trips;
    ANALYZE expenses;
    ANALYZE reservations;
    ANALYZE reminders;
    ANALYZE users;
    ANALYZE vehicles;
    
    -- Log maintenance completion (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title,
        description,
        metadata,
        created_at
    ) VALUES (
        'MAINTENANCE',
        'INFO',
        'Daily maintenance completed',
        'All daily maintenance tasks have been completed successfully',
        '{"action": "daily_maintenance"}'::jsonb,
        NOW()
    );
END;
$$;


ALTER FUNCTION public.daily_maintenance() OWNER TO postgres;

--
-- Name: FUNCTION daily_maintenance(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.daily_maintenance() IS 'Function za daily maintenance tasks - pozivati iz cron job-a';


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  -- Insert essential data, and provide default empty strings for names
  -- to avoid any potential issues with NULL values, even in nullable columns.
  INSERT INTO public.users (user_id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''), -- Use metadata if present, otherwise empty string
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')   -- Use metadata if present, otherwise empty string
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

--
-- Name: FUNCTION handle_new_user(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.handle_new_user() IS 'Robust version - inserts user_id, email, and defaults names to empty strings.';


--
-- Name: record_performance_metric(character varying, numeric, character varying, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying DEFAULT 'ms'::character varying, p_metadata jsonb DEFAULT '{}'::jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO performance_metrics (
        metric_name,
        metric_value,
        metric_unit,
        metadata,
        recorded_at
    ) VALUES (
        p_metric_name,
        p_metric_value,
        p_metric_unit,
        p_metadata,
        NOW()
    );
END;
$$;


ALTER FUNCTION public.record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying, p_metadata jsonb) OWNER TO postgres;

--
-- Name: refresh_performance_views(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.refresh_performance_views() RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats_mv;
    
    -- Log the refresh (system operation - no user)
    INSERT INTO system_logs (
        log_type, 
        severity, 
        title, 
        description,
        metadata,
        created_at
    ) VALUES (
        'PERFORMANCE',
        'INFO',
        'Performance views refreshed',
        'Materialized views have been refreshed for better performance',
        '{"action": "refresh_materialized_views"}'::jsonb,
        NOW()
    );
END;
$$;


ALTER FUNCTION public.refresh_performance_views() OWNER TO postgres;

--
-- Name: FUNCTION refresh_performance_views(); Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON FUNCTION public.refresh_performance_views() IS 'Function za refresh svih materialized views - pozivati iz cron job-a';


--
-- Name: restore_user_backup(uuid, uuid, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean DEFAULT true, p_restore_pois boolean DEFAULT true, p_restore_routes boolean DEFAULT true, p_restore_expenses boolean DEFAULT false, p_restore_reminders boolean DEFAULT true, p_restore_trips boolean DEFAULT false, p_restore_reservations boolean DEFAULT true, p_restore_messages boolean DEFAULT true, p_restore_notifications boolean DEFAULT true, p_restore_chat_groups boolean DEFAULT true) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_backup_record user_backups%ROWTYPE;
    v_vehicles_restored INTEGER := 0;
    v_pois_restored INTEGER := 0;
    v_routes_restored INTEGER := 0;
    v_expenses_restored INTEGER := 0;
    v_reminders_restored INTEGER := 0;
    v_trips_restored INTEGER := 0;
    v_reservations_restored INTEGER := 0;
    v_notifications_restored INTEGER := 0;
    v_total_restored INTEGER := 0;
    v_backup_data_record backup_data%ROWTYPE;
    v_data_item JSONB;
BEGIN
    -- Verify user owns the backup
    SELECT * INTO v_backup_record
    FROM user_backups
    WHERE backup_id = p_backup_id AND user_id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Backup not found or access denied';
    END IF;
    
    -- Restore reminders if requested (safe to restore)
    IF p_restore_reminders THEN
        SELECT * INTO v_backup_data_record
        FROM backup_data
        WHERE backup_id = p_backup_id AND data_type = 'reminders';
        
        IF FOUND THEN
            FOR v_data_item IN SELECT * FROM jsonb_array_elements(v_backup_data_record.backup_data)
            LOOP
                INSERT INTO reminders (
                    reminder_id, user_id, reminder_type_id, vehicle_id,
                    title, description, due_date, is_system_generated,
                    is_completed, completed_at
                ) VALUES (
                    gen_random_uuid(), -- Generate new ID to avoid conflicts
                    p_user_id, -- Always assign to current user
                    (v_data_item->>'reminder_type_id')::UUID,
                    (v_data_item->>'vehicle_id')::UUID,
                    v_data_item->>'title',
                    v_data_item->>'description',
                    (v_data_item->>'due_date')::TIMESTAMPTZ,
                    (v_data_item->>'is_system_generated')::BOOLEAN,
                    false, -- Reset completion status
                    NULL -- Reset completion date
                ) ON CONFLICT DO NOTHING;
                
                v_reminders_restored := v_reminders_restored + 1;
            END LOOP;
        END IF;
    END IF;
    
    -- Calculate total restored
    v_total_restored := v_vehicles_restored + v_pois_restored + v_routes_restored + 
                       v_expenses_restored + v_reminders_restored + v_trips_restored + 
                       v_reservations_restored + v_notifications_restored;
    
    -- Build result
    RETURN json_build_object(
        'success', true,
        'backup_id', p_backup_id,
        'backup_name', v_backup_record.backup_name,
        'restored_counts', json_build_object(
            'vehicles', v_vehicles_restored,
            'pois', v_pois_restored,
            'routes', v_routes_restored,
            'expenses', v_expenses_restored,
            'reminders', v_reminders_restored,
            'trips', v_trips_restored,
            'reservations', v_reservations_restored,
            'messages', 0,
            'notifications', v_notifications_restored,
            'chat_groups', 0
        ),
        'total_restored', v_total_restored
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'backup_id', p_backup_id,
            'backup_name', '',
            'restored_counts', json_build_object(
                'vehicles', 0, 'pois', 0, 'routes', 0, 'expenses', 0,
                'reminders', 0, 'trips', 0, 'reservations', 0,
                'messages', 0, 'notifications', 0, 'chat_groups', 0
            ),
            'total_restored', 0,
            'error', SQLERRM
        );
END;
$$;


ALTER FUNCTION public.restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean, p_restore_pois boolean, p_restore_routes boolean, p_restore_expenses boolean, p_restore_reminders boolean, p_restore_trips boolean, p_restore_reservations boolean, p_restore_messages boolean, p_restore_notifications boolean, p_restore_chat_groups boolean) OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) OWNER TO supabase_storage_admin;

--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    trip_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_id uuid NOT NULL,
    trip_type_id uuid,
    trip_purpose_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    start_location_address text,
    end_location_address text,
    distance_km numeric(10,2),
    duration_minutes integer,
    status public.trip_status DEFAULT 'PLANNED'::public.trip_status,
    notes text,
    purpose_description text,
    route_details_json jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    company_id uuid
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    username character varying(100),
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    first_name character varying(100),
    last_name character varying(100),
    phone_number character varying(50),
    avatar_url text,
    is_active boolean DEFAULT true,
    is_email_verified boolean DEFAULT false,
    last_login_at timestamp with time zone,
    onboarding_status character varying(50) DEFAULT 'pending'::character varying,
    preferred_language character varying(10) DEFAULT 'en'::character varying,
    preferred_theme character varying(20) DEFAULT 'light'::character varying,
    preferred_units character varying(20) DEFAULT 'metric'::character varying,
    preferred_currency character varying(10) DEFAULT 'EUR'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    alternative_phone character varying(50),
    date_of_birth date,
    "position" character varying(100),
    branch character varying(100),
    manager character varying(100),
    work_email character varying(255),
    home_address text,
    home_city character varying(100),
    home_postal_code character varying(20),
    home_country character varying(100),
    work_address text,
    work_city character varying(100),
    work_postal_code character varying(20),
    work_country character varying(100),
    emergency_contact_name character varying(100),
    emergency_contact_phone character varying(50),
    emergency_contact_relationship character varying(50),
    has_private_vehicle boolean DEFAULT false,
    private_vehicle_plate character varying(20),
    private_vehicle_make character varying(50),
    private_vehicle_model character varying(50),
    driving_license_number character varying(100),
    driving_license_category character varying(50),
    driving_license_expiry date,
    preferred_vehicle_id uuid,
    biography text,
    skills text,
    languages text,
    certifications text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicles (
    vehicle_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    vehicle_type_id uuid NOT NULL,
    vehicle_status_id uuid,
    make character varying(100) NOT NULL,
    model character varying(100) NOT NULL,
    year integer NOT NULL,
    license_plate character varying(20) NOT NULL,
    vin character varying(50),
    color character varying(50),
    engine_type character varying(50),
    fuel_type_id uuid,
    fuel_tank_capacity numeric(10,2),
    battery_capacity_kwh numeric(10,2),
    avg_consumption numeric(10,2),
    current_odometer numeric(15,2),
    last_odometer_update timestamp with time zone,
    registration_date date,
    registration_expiry_date date,
    insurance_policy_number character varying(100),
    insurance_expiry_date date,
    is_private_vehicle boolean DEFAULT false,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    seats_count integer,
    trunk_capacity_liters integer,
    cargo_capacity_kg numeric(10,2),
    cargo_volume_m3 numeric(10,3),
    pallet_capacity integer,
    required_license_category character varying(10),
    engine_volume_cc integer,
    engine_power_kw numeric(10,2),
    engine_power_hp numeric(10,2),
    fuel_consumption_city numeric(5,2),
    fuel_consumption_highway numeric(5,2),
    fuel_consumption_combined numeric(5,2),
    registration_cost_annual numeric(10,2),
    insurance_cost_annual numeric(10,2),
    service_interval_km integer,
    service_interval_months integer,
    private_owner_name character varying(100),
    private_owner_contact character varying(100),
    private_owner_id uuid,
    is_public_transport boolean DEFAULT false,
    public_transport_type character varying(50),
    transport_company_name character varying(100),
    transport_company_license character varying(100),
    fare_per_km numeric(10,2),
    fare_base_price numeric(10,2),
    ticket_price numeric(10,2),
    route_description text
);


ALTER TABLE public.vehicles OWNER TO postgres;

--
-- Name: active_trips_optimized; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.active_trips_optimized AS
 SELECT t.trip_id,
    t.user_id,
    t.purpose_description,
    t.start_location_address,
    t.end_location_address,
    t.start_time,
    t.status,
    t.created_at,
    u.first_name,
    u.last_name,
    v.make,
    v.model,
    v.license_plate
   FROM ((public.trips t
     JOIN public.users u ON ((t.user_id = u.user_id)))
     LEFT JOIN public.vehicles v ON ((t.vehicle_id = v.vehicle_id)))
  WHERE (t.status = ANY (ARRAY['PLANNED'::public.trip_status, 'IN_PROGRESS'::public.trip_status]))
  ORDER BY t.start_time DESC;


ALTER VIEW public.active_trips_optimized OWNER TO postgres;

--
-- Name: VIEW active_trips_optimized; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.active_trips_optimized IS 'Optimizovani view za active trips - HomeScreen performance';


--
-- Name: backup_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.backup_data (
    backup_data_id uuid DEFAULT gen_random_uuid() NOT NULL,
    backup_id uuid NOT NULL,
    table_name character varying(100) NOT NULL,
    data_type character varying(50) NOT NULL,
    backup_data jsonb NOT NULL,
    record_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.backup_data OWNER TO postgres;

--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    company_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    contact_email character varying(255),
    contact_phone character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    registration_number character varying(100),
    tax_number character varying(100),
    city character varying(100),
    postal_code character varying(20),
    country character varying(100),
    website character varying(255),
    industry character varying(100),
    founded_year character varying(4),
    employee_count character varying(50),
    description text,
    bank_name character varying(255),
    bank_account character varying(100),
    swift_code character varying(50),
    subscription_id uuid,
    owner_id uuid
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    parent_department_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: expense_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_categories (
    expense_category_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    default_gl_code character varying(50),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.expense_categories OWNER TO postgres;

--
-- Name: expense_receipts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expense_receipts (
    receipt_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    expense_id uuid NOT NULL,
    file_url text NOT NULL,
    file_name character varying(255),
    mime_type character varying(100),
    uploaded_at timestamp with time zone DEFAULT now(),
    uploaded_by_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.expense_receipts OWNER TO postgres;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expenses (
    expense_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    trip_id uuid,
    vehicle_id uuid,
    expense_category_id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'EUR'::character varying,
    expense_date date NOT NULL,
    description text,
    status character varying(50) DEFAULT 'pending'::character varying,
    approved_by_user_id uuid,
    approval_date timestamp with time zone,
    rejection_reason text,
    payment_method character varying(50),
    fuel_liters numeric(10,2),
    fuel_price_per_liter numeric(10,4),
    is_reimbursable boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    company_id uuid
);


ALTER TABLE public.expenses OWNER TO postgres;

--
-- Name: fuel_prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_prices (
    price_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    fuel_type_id uuid NOT NULL,
    price_per_unit numeric(10,4) NOT NULL,
    currency character varying(3) DEFAULT 'EUR'::character varying,
    effective_date date NOT NULL,
    source character varying(100),
    region character varying(100),
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fuel_prices OWNER TO postgres;

--
-- Name: fuel_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_types (
    fuel_type_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    unit character varying(20) DEFAULT 'liters'::character varying NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fuel_types OWNER TO postgres;

--
-- Name: reservation_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservation_status (
    reservation_status_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    status_name character varying(50) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reservation_status OWNER TO postgres;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    reservation_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    vehicle_id uuid,
    vehicle_type_id uuid,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone NOT NULL,
    purpose text,
    status_id uuid NOT NULL,
    approved_by_user_id uuid,
    approval_notes text,
    rejection_reason text,
    requested_features jsonb,
    actual_vehicle_id uuid,
    pickup_location text,
    dropoff_location text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    company_id uuid
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: pending_reservations_optimized; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.pending_reservations_optimized AS
 SELECT r.reservation_id,
    r.user_id,
    r.purpose,
    r.start_time,
    r.end_time,
    r.created_at,
    rs.status_name,
    u.first_name,
    u.last_name,
    v.make,
    v.model,
    v.license_plate
   FROM (((public.reservations r
     JOIN public.reservation_status rs ON ((r.status_id = rs.reservation_status_id)))
     JOIN public.users u ON ((r.user_id = u.user_id)))
     LEFT JOIN public.vehicles v ON ((r.vehicle_id = v.vehicle_id)))
  WHERE ((rs.status_name)::text = 'PENDING_APPROVAL'::text)
  ORDER BY r.created_at DESC;


ALTER VIEW public.pending_reservations_optimized OWNER TO postgres;

--
-- Name: VIEW pending_reservations_optimized; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON VIEW public.pending_reservations_optimized IS 'Optimizovani view za pending reservations - smanjuje broj JOIN-ova';


--
-- Name: performance_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_metrics (
    metric_id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_name character varying(100) NOT NULL,
    metric_value numeric,
    metric_unit character varying(20),
    recorded_at timestamp with time zone DEFAULT now(),
    metadata jsonb
);


ALTER TABLE public.performance_metrics OWNER TO postgres;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    permission_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    permission_name character varying(100) NOT NULL,
    description text,
    module character varying(100),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: pois; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pois (
    poi_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    name character varying(255) NOT NULL,
    address text,
    latitude numeric(10,7) NOT NULL,
    longitude numeric(10,7) NOT NULL,
    category character varying(100),
    contact_info text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.pois OWNER TO postgres;

--
-- Name: reminder_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminder_types (
    reminder_type_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    default_lead_time_days integer DEFAULT 30,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reminder_types OWNER TO postgres;

--
-- Name: reminders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reminders (
    reminder_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    reminder_type_id uuid,
    vehicle_id uuid,
    title character varying(255) NOT NULL,
    description text,
    due_date date NOT NULL,
    is_system_generated boolean DEFAULT false,
    is_completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_recurring boolean DEFAULT false,
    recurrence_pattern character varying(20),
    recurrence_interval integer DEFAULT 1,
    recurrence_day_of_week integer,
    recurrence_day_of_month integer,
    recurrence_end_date date,
    parent_reminder_id uuid,
    company_id uuid
);


ALTER TABLE public.reminders OWNER TO postgres;

--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.role_permissions OWNER TO postgres;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    role_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    role_name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: standard_routes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.standard_routes (
    route_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    name character varying(255) NOT NULL,
    start_poi_id uuid,
    end_poi_id uuid,
    start_address_manual text,
    end_address_manual text,
    predefined_distance_km numeric(10,2),
    estimated_duration_min integer,
    predefined_cost numeric(10,2),
    cost_calculation_formula text,
    route_details_json jsonb,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.standard_routes OWNER TO postgres;

--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    subscription_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    plan_name character varying(100) NOT NULL,
    max_users integer DEFAULT 1 NOT NULL,
    max_vehicles integer DEFAULT 1 NOT NULL,
    price_monthly numeric(10,2) DEFAULT 0.00,
    price_annual numeric(10,2) DEFAULT 0.00,
    features jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: system_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_logs (
    log_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    user_id uuid,
    log_type character varying(50) NOT NULL,
    severity character varying(20) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    metadata jsonb,
    related_expense_id uuid,
    related_vehicle_id uuid,
    related_trip_id uuid,
    is_resolved boolean DEFAULT false,
    resolved_by_user_id uuid,
    resolved_at timestamp with time zone,
    resolution_notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.system_logs OWNER TO postgres;

--
-- Name: trip_purposes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_purposes (
    trip_purpose_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    category character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.trip_purposes OWNER TO postgres;

--
-- Name: trip_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_types (
    trip_type_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_billable boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.trip_types OWNER TO postgres;

--
-- Name: user_backups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_backups (
    backup_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    backup_name character varying(255) NOT NULL,
    backup_description text,
    backup_type character varying(20) DEFAULT 'manual'::character varying NOT NULL,
    backup_size_bytes bigint DEFAULT 0 NOT NULL,
    backup_metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_backups OWNER TO postgres;

--
-- Name: user_backup_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.user_backup_summary AS
 SELECT ub.backup_id,
    ub.user_id,
    ub.backup_name,
    ub.backup_description,
    ub.backup_type,
    ub.backup_size_bytes,
    ub.created_at,
    COALESCE(((ub.backup_metadata ->> 'vehicle_count'::text))::integer, 0) AS vehicle_count,
    COALESCE(((ub.backup_metadata ->> 'poi_count'::text))::integer, 0) AS poi_count,
    COALESCE(((ub.backup_metadata ->> 'route_count'::text))::integer, 0) AS route_count,
    COALESCE(((ub.backup_metadata ->> 'expense_count'::text))::integer, 0) AS expense_count,
    COALESCE(((ub.backup_metadata ->> 'reminder_count'::text))::integer, 0) AS reminder_count,
    COALESCE(((ub.backup_metadata ->> 'trip_count'::text))::integer, 0) AS trip_count,
    COALESCE(((ub.backup_metadata ->> 'reservation_count'::text))::integer, 0) AS reservation_count,
    COALESCE(((ub.backup_metadata ->> 'message_count'::text))::integer, 0) AS message_count,
    COALESCE(((ub.backup_metadata ->> 'notification_count'::text))::integer, 0) AS notification_count,
    COALESCE(((ub.backup_metadata ->> 'chat_group_count'::text))::integer, 0) AS chat_group_count,
    COALESCE(((ub.backup_metadata ->> 'total_records'::text))::integer, 0) AS total_records,
    (((u.first_name)::text || ' '::text) || (u.last_name)::text) AS username,
    u.email
   FROM (public.user_backups ub
     JOIN public.users u ON ((ub.user_id = u.user_id)));


ALTER VIEW public.user_backup_summary OWNER TO postgres;

--
-- Name: user_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_requests (
    request_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    requested_by_user_id uuid NOT NULL,
    request_type character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    requested_changes jsonb NOT NULL,
    approval_notes text,
    rejection_reason text,
    approved_by_user_id uuid,
    approved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_requests OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    assigned_at timestamp with time zone DEFAULT now(),
    company_id uuid
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: user_stats_mv; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.user_stats_mv AS
 SELECT u.user_id,
    u.first_name,
    u.last_name,
    count(DISTINCT t.trip_id) AS total_trips,
    count(DISTINCT e.expense_id) AS total_expenses,
    count(DISTINCT r.reservation_id) AS total_reservations,
    COALESCE(sum(e.amount), (0)::numeric) AS total_expense_amount,
    max(t.created_at) AS last_trip_date
   FROM (((public.users u
     LEFT JOIN public.trips t ON ((u.user_id = t.user_id)))
     LEFT JOIN public.expenses e ON ((u.user_id = e.user_id)))
     LEFT JOIN public.reservations r ON ((u.user_id = r.user_id)))
  WHERE (u.is_active = true)
  GROUP BY u.user_id, u.first_name, u.last_name
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.user_stats_mv OWNER TO postgres;

--
-- Name: MATERIALIZED VIEW user_stats_mv; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON MATERIALIZED VIEW public.user_stats_mv IS 'Materialized view za user statistike - refresh manually ili cron job';


--
-- Name: vehicle_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_assignments (
    assignment_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    company_id uuid,
    vehicle_id uuid NOT NULL,
    user_id uuid NOT NULL,
    assignment_type character varying(50),
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.vehicle_assignments OWNER TO postgres;

--
-- Name: TABLE vehicle_assignments; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.vehicle_assignments IS 'Tracks which user is currently assigned to or primarily uses a vehicle.';


--
-- Name: vehicle_status; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_status (
    vehicle_status_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.vehicle_status OWNER TO postgres;

--
-- Name: vehicle_statuses; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vehicle_statuses AS
 SELECT vehicle_status_id,
    name AS status_name,
    description,
    created_at,
    updated_at
   FROM public.vehicle_status;


ALTER VIEW public.vehicle_statuses OWNER TO postgres;

--
-- Name: vehicle_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehicle_types (
    vehicle_type_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.vehicle_types OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL,
    statements text[],
    name text
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: seed_files; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.seed_files (
    path text NOT NULL,
    hash text NOT NULL
);


ALTER TABLE supabase_migrations.seed_files OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- Data for Name: backup_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.backup_data (backup_data_id, backup_id, table_name, data_type, backup_data, record_count, created_at) FROM stdin;
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (company_id, name, address, contact_email, contact_phone, created_at, updated_at, registration_number, tax_number, city, postal_code, country, website, industry, founded_year, employee_count, description, bank_name, bank_account, swift_code, subscription_id, owner_id) FROM stdin;
3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Fleet Flow	Podgorica, Montenegro	info@fleetflow.me	+382 20 123 456	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (department_id, company_id, name, parent_department_id, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	General	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Fleet Management	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Operations	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: expense_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_categories (expense_category_id, name, description, default_gl_code, is_active, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Fuel	Fuel expenses	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Maintenance	Vehicle maintenance	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Insurance	Insurance costs	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Parking	Parking fees	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	Tolls	Highway tolls	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
66666666-6666-6666-6666-666666666666	Other	Other expenses	\N	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: expense_receipts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expense_receipts (receipt_id, expense_id, file_url, file_name, mime_type, uploaded_at, uploaded_by_user_id, created_at) FROM stdin;
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.expenses (expense_id, user_id, trip_id, vehicle_id, expense_category_id, amount, currency, expense_date, description, status, approved_by_user_id, approval_date, rejection_reason, payment_method, fuel_liters, fuel_price_per_liter, is_reimbursable, created_at, updated_at, company_id) FROM stdin;
\.


--
-- Data for Name: fuel_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fuel_prices (price_id, fuel_type_id, price_per_unit, currency, effective_date, source, region, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: fuel_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fuel_types (fuel_type_id, name, unit, description, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Diesel	liters	Diesel fuel	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Gasoline	liters	Gasoline fuel	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Electric	kWh	Electric energy	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Hybrid	liters	Hybrid fuel system	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	Petrol	liters	Regular petrol fuel	2025-06-25 20:31:12.387609+00	2025-06-25 20:31:12.387609+00
\.


--
-- Data for Name: performance_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_metrics (metric_id, metric_name, metric_value, metric_unit, recorded_at, metadata) FROM stdin;
ffaef20a-20b8-42fc-bb73-84c23feb4076	migration_008_applied	1	count	2025-06-25 20:31:12.607832+00	{"type": "performance_optimization", "version": "008"}
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.permissions (permission_id, permission_name, description, module, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	dashboard:admin	Access admin dashboard	dashboard	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	dashboard:fleet_manager	Access fleet manager dashboard	dashboard	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	reservations:approve	Approve reservations	reservations	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	reservations:manage	Manage all reservations	reservations	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	vehicles:manage	Manage vehicles	vehicles	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
66666666-6666-6666-6666-666666666666	trips:view_all	View all trips	trips	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
77777777-7777-7777-7777-777777777777	expenses:approve	Approve expenses	expenses	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
88888888-8888-8888-8888-888888888888	users:manage	Manage users	users	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: pois; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pois (poi_id, company_id, name, address, latitude, longitude, category, contact_info, notes, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	H.Office	Dr Vukašina Markovića, Kruševac, Podgorica	42.4307000	19.2478000	office	\N	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	WH (Warehouse)	Manastirska, Podgorica	42.4304000	19.2594000	warehouse	\N	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Studio Mouse	Studio Mouse, Podgorica	42.4697000	19.3047000	client	\N	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: reminder_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminder_types (reminder_type_id, name, description, default_lead_time_days, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Insurance Renewal	Vehicle insurance renewal	30	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Registration Renewal	Vehicle registration renewal	30	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Service Due	Vehicle service due	7	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Inspection Due	Vehicle inspection due	14	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: reminders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reminders (reminder_id, user_id, reminder_type_id, vehicle_id, title, description, due_date, is_system_generated, is_completed, completed_at, created_at, updated_at, is_recurring, recurrence_pattern, recurrence_interval, recurrence_day_of_week, recurrence_day_of_month, recurrence_end_date, parent_reminder_id, company_id) FROM stdin;
\.


--
-- Data for Name: reservation_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservation_status (reservation_status_id, status_name, description, created_at, updated_at) FROM stdin;
c9171953-bd5f-49bd-b85f-15e4e9ce7bb1	PENDING_APPROVAL	Waiting for approval	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
545ad731-755f-42ed-b896-f383fdf48b51	APPROVED	Reservation approved	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	REJECTED	Reservation rejected	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	CANCELLED	Reservation cancelled	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	COMPLETED	Reservation completed	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (reservation_id, user_id, vehicle_id, vehicle_type_id, start_time, end_time, purpose, status_id, approved_by_user_id, approval_notes, rejection_reason, requested_features, actual_vehicle_id, pickup_location, dropoff_location, created_at, updated_at, company_id) FROM stdin;
\.


--
-- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role_permissions (role_id, permission_id, created_at) FROM stdin;
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	11111111-1111-1111-1111-111111111111	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	22222222-2222-2222-2222-222222222222	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	33333333-3333-3333-3333-333333333333	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	44444444-4444-4444-4444-444444444444	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	55555555-5555-5555-5555-555555555555	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	66666666-6666-6666-6666-666666666666	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	77777777-7777-7777-7777-777777777777	2025-06-25 20:31:10.482711+00
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	88888888-8888-8888-8888-888888888888	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	22222222-2222-2222-2222-222222222222	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	33333333-3333-3333-3333-333333333333	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	44444444-4444-4444-4444-444444444444	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	55555555-5555-5555-5555-555555555555	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	66666666-6666-6666-6666-666666666666	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	77777777-7777-7777-7777-777777777777	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (role_id, role_name, description, created_at, updated_at) FROM stdin;
aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa	admin	System Administrator	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb	fleet_manager	Fleet Manager	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
cccccccc-cccc-cccc-cccc-cccccccccccc	driver	Driver	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
dddddddd-dddd-dddd-dddd-dddddddddddd	employee	Regular Employee	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: supabase_admin
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: standard_routes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.standard_routes (route_id, company_id, name, start_poi_id, end_poi_id, start_address_manual, end_address_manual, predefined_distance_km, estimated_duration_min, predefined_cost, cost_calculation_formula, route_details_json, notes, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Office to Warehouse	11111111-1111-1111-1111-111111111111	22222222-2222-2222-2222-222222222222	\N	\N	3.20	15	\N	\N	\N	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	Office to Studio Mouse	11111111-1111-1111-1111-111111111111	33333333-3333-3333-3333-333333333333	\N	\N	8.10	44	\N	\N	\N	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subscriptions (subscription_id, plan_name, max_users, max_vehicles, price_monthly, price_annual, features, created_at, updated_at) FROM stdin;
9beb9e7d-7caf-40ef-9aaf-6f1c4350f1f3	Free	1	1	0.00	0.00	["BASIC_REPORTS"]	2025-06-25 20:31:12.791547+00	2025-06-25 20:31:12.791547+00
6a93c879-d480-4f07-af6a-1eae33c4ebb4	Basic	10	10	49.00	499.00	["BASIC_REPORTS", "ROUTE_OPTIMIZATION"]	2025-06-25 20:31:12.791547+00	2025-06-25 20:31:12.791547+00
d648716b-e46c-4f64-ab9d-7a63f7ea6e64	Pro	50	50	199.00	1999.00	["ADVANCED_REPORTS", "ROUTE_OPTIMIZATION", "API_ACCESS"]	2025-06-25 20:31:12.791547+00	2025-06-25 20:31:12.791547+00
25db7d0f-1aa1-4ce3-a883-13e5f98cdb74	Enterprise	1000	1000	999.00	9999.00	["ALL_FEATURES", "DEDICATED_SUPPORT"]	2025-06-25 20:31:12.791547+00	2025-06-25 20:31:12.791547+00
\.


--
-- Data for Name: system_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_logs (log_id, company_id, user_id, log_type, severity, title, description, metadata, related_expense_id, related_vehicle_id, related_trip_id, is_resolved, resolved_by_user_id, resolved_at, resolution_notes, created_at, updated_at) FROM stdin;
4e2eadfa-1a99-4d01-99a5-7cddc8ede90d	\N	\N	PERFORMANCE	INFO	Performance views refreshed	Materialized views have been refreshed for better performance	{"action": "refresh_materialized_views"}	\N	\N	\N	f	\N	\N	\N	2025-06-25 20:31:12.607832+00	2025-06-25 20:31:12.607832+00
\.


--
-- Data for Name: trip_purposes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_purposes (trip_purpose_id, name, description, is_active, category, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Site Visit	Visit to client site	t	business	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Delivery	Package delivery	t	business	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Meeting	Business meeting	t	business	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Training	Employee training	t	business	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	Other	Other purpose	t	general	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: trip_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trip_types (trip_type_id, name, description, is_billable, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Business	Business trip	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Personal	Personal trip	f	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Maintenance	Vehicle maintenance	f	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Emergency	Emergency trip	t	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: trips; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trips (trip_id, user_id, vehicle_id, trip_type_id, trip_purpose_id, start_time, end_time, start_location_address, end_location_address, distance_km, duration_minutes, status, notes, purpose_description, route_details_json, created_at, updated_at, company_id) FROM stdin;
\.


--
-- Data for Name: user_backups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_backups (backup_id, user_id, backup_name, backup_description, backup_type, backup_size_bytes, backup_metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_requests (request_id, user_id, requested_by_user_id, request_type, status, requested_changes, approval_notes, rejection_reason, approved_by_user_id, approved_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (user_id, role_id, created_at, assigned_at, company_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, company_id, username, email, password_hash, first_name, last_name, phone_number, avatar_url, is_active, is_email_verified, last_login_at, onboarding_status, preferred_language, preferred_theme, preferred_units, preferred_currency, created_at, updated_at, alternative_phone, date_of_birth, "position", branch, manager, work_email, home_address, home_city, home_postal_code, home_country, work_address, work_city, work_postal_code, work_country, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, has_private_vehicle, private_vehicle_plate, private_vehicle_make, private_vehicle_model, driving_license_number, driving_license_category, driving_license_expiry, preferred_vehicle_id, biography, skills, languages, certifications) FROM stdin;
\.


--
-- Data for Name: vehicle_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_assignments (assignment_id, company_id, vehicle_id, user_id, assignment_type, start_date, end_date, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: vehicle_status; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_status (vehicle_status_id, name, description, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Available	Vehicle is available for use	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	In Use	Vehicle is currently in use	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Maintenance	Vehicle is under maintenance	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Out of Service	Vehicle is out of service	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
aaaaaaaa-bbbb-cccc-dddd-111111111111	Available	Vehicle is available for use	2025-06-25 20:31:12.387609+00	2025-06-25 20:31:12.387609+00
aaaaaaaa-bbbb-cccc-dddd-222222222222	In Use	Vehicle is currently in use	2025-06-25 20:31:12.387609+00	2025-06-25 20:31:12.387609+00
aaaaaaaa-bbbb-cccc-dddd-333333333333	Maintenance	Vehicle is under maintenance	2025-06-25 20:31:12.387609+00	2025-06-25 20:31:12.387609+00
aaaaaaaa-bbbb-cccc-dddd-444444444444	Out of Service	Vehicle is out of service	2025-06-25 20:31:12.387609+00	2025-06-25 20:31:12.387609+00
\.


--
-- Data for Name: vehicle_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicle_types (vehicle_type_id, name, description, created_at, updated_at) FROM stdin;
11111111-1111-1111-1111-111111111111	Car	Passenger car	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
22222222-2222-2222-2222-222222222222	Van	Cargo van	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
33333333-3333-3333-3333-333333333333	Truck	Heavy truck	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
44444444-4444-4444-4444-444444444444	Motorcycle	Motorcycle	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
55555555-5555-5555-5555-555555555555	Bus	Passenger bus	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehicles (vehicle_id, company_id, vehicle_type_id, vehicle_status_id, make, model, year, license_plate, vin, color, engine_type, fuel_type_id, fuel_tank_capacity, battery_capacity_kwh, avg_consumption, current_odometer, last_odometer_update, registration_date, registration_expiry_date, insurance_policy_number, insurance_expiry_date, is_private_vehicle, notes, created_at, updated_at, seats_count, trunk_capacity_liters, cargo_capacity_kg, cargo_volume_m3, pallet_capacity, required_license_category, engine_volume_cc, engine_power_kw, engine_power_hp, fuel_consumption_city, fuel_consumption_highway, fuel_consumption_combined, registration_cost_annual, insurance_cost_annual, service_interval_km, service_interval_months, private_owner_name, private_owner_contact, private_owner_id, is_public_transport, public_transport_type, transport_company_name, transport_company_license, fare_per_km, fare_base_price, ticket_price, route_description) FROM stdin;
11111111-1111-1111-1111-111111111111	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	22222222-2222-2222-2222-222222222222	11111111-1111-1111-1111-111111111111	Citroen	Jumper	2020	PG123AB	\N	\N	\N	11111111-1111-1111-1111-111111111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N
959729d5-180d-4f7a-8107-351d783e8f39	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	22222222-2222-2222-2222-222222222222	11111111-1111-1111-1111-111111111111	Citroen	Jumper	2021	PG456CD	\N	\N	\N	11111111-1111-1111-1111-111111111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N
65a3765a-9578-4ae1-aca8-2d1da0a65b92	3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe	33333333-3333-3333-3333-333333333333	11111111-1111-1111-1111-111111111111	Iveco	Eurocargo	2019	PGKR258	\N	\N	\N	11111111-1111-1111-1111-111111111111	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	2025-06-25 20:31:10.482711+00	2025-06-25 20:31:10.482711+00	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2025-06-25 20:12:49
20211116045059	2025-06-25 20:12:51
20211116050929	2025-06-25 20:12:53
20211116051442	2025-06-25 20:12:55
20211116212300	2025-06-25 20:12:57
20211116213355	2025-06-25 20:12:59
20211116213934	2025-06-25 20:13:00
20211116214523	2025-06-25 20:13:03
20211122062447	2025-06-25 20:13:05
20211124070109	2025-06-25 20:13:06
20211202204204	2025-06-25 20:13:08
20211202204605	2025-06-25 20:13:10
20211210212804	2025-06-25 20:13:16
20211228014915	2025-06-25 20:13:17
20220107221237	2025-06-25 20:13:19
20220228202821	2025-06-25 20:13:21
20220312004840	2025-06-25 20:13:23
20220603231003	2025-06-25 20:13:26
20220603232444	2025-06-25 20:13:27
20220615214548	2025-06-25 20:13:30
20220712093339	2025-06-25 20:13:31
20220908172859	2025-06-25 20:13:33
20220916233421	2025-06-25 20:13:35
20230119133233	2025-06-25 20:13:37
20230128025114	2025-06-25 20:13:39
20230128025212	2025-06-25 20:13:41
20230227211149	2025-06-25 20:13:43
20230228184745	2025-06-25 20:13:44
20230308225145	2025-06-25 20:13:46
20230328144023	2025-06-25 20:13:48
20231018144023	2025-06-25 20:13:50
20231204144023	2025-06-25 20:13:53
20231204144024	2025-06-25 20:13:55
20231204144025	2025-06-25 20:13:57
20240108234812	2025-06-25 20:13:58
20240109165339	2025-06-25 20:14:00
20240227174441	2025-06-25 20:14:03
20240311171622	2025-06-25 20:14:06
20240321100241	2025-06-25 20:14:10
20240401105812	2025-06-25 20:14:15
20240418121054	2025-06-25 20:14:17
20240523004032	2025-06-25 20:14:24
20240618124746	2025-06-25 20:14:25
20240801235015	2025-06-25 20:14:27
20240805133720	2025-06-25 20:14:29
20240827160934	2025-06-25 20:14:31
20240919163303	2025-06-25 20:14:33
20240919163305	2025-06-25 20:14:35
20241019105805	2025-06-25 20:14:37
20241030150047	2025-06-25 20:14:43
20241108114728	2025-06-25 20:14:46
20241121104152	2025-06-25 20:14:48
20241130184212	2025-06-25 20:14:50
20241220035512	2025-06-25 20:14:52
20241220123912	2025-06-25 20:14:53
20241224161212	2025-06-25 20:14:55
20250107150512	2025-06-25 20:14:57
20250110162412	2025-06-25 20:14:59
20250123174212	2025-06-25 20:15:00
20250128220012	2025-06-25 20:15:02
20250506224012	2025-06-25 20:15:04
20250523164012	2025-06-25 20:15:05
20250714121412	2025-08-16 17:22:31
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id) FROM stdin;
avatars	avatars	\N	2025-06-25 20:31:11.955651+00	2025-06-25 20:31:11.955651+00	t	f	\N	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-06-25 20:12:46.822229
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-06-25 20:12:46.831473
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-06-25 20:12:46.838769
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-06-25 20:12:46.856095
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-06-25 20:12:46.871393
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-06-25 20:12:46.878214
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-06-25 20:12:46.886677
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-06-25 20:12:46.89379
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-06-25 20:12:46.900904
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-06-25 20:12:46.908183
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-06-25 20:12:46.915498
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-06-25 20:12:46.92291
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-06-25 20:12:46.932871
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-06-25 20:12:46.939994
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-06-25 20:12:46.946863
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-06-25 20:12:46.967777
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-06-25 20:12:46.974718
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-06-25 20:12:46.98169
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-06-25 20:12:46.988804
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-06-25 20:12:46.998304
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-06-25 20:12:47.005482
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-06-25 20:12:47.017216
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-06-25 20:12:47.034117
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-06-25 20:12:47.047604
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-06-25 20:12:47.05444
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-06-25 20:12:47.061034
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.schema_migrations (version, statements, name) FROM stdin;
001	{"-- Fleet Flow Next Gen - Complete Schema Migration\n-- Generated: 2025-01-22\n-- Description: Complete database schema with all tables, functions, policies and seed data\n-- Consolidated from existing backup data\n\n-- Enable necessary extensions\nCREATE EXTENSION IF NOT EXISTS \\"uuid-ossp\\"","CREATE EXTENSION IF NOT EXISTS \\"postgis\\"","-- Create custom types\nCREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended')","CREATE TYPE trip_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')","CREATE TYPE reservation_status_enum AS ENUM ('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELLED', 'COMPLETED')","-- =============================================\n-- COMPANIES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS companies (\n    company_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(255) NOT NULL,\n    address TEXT,\n    contact_email VARCHAR(255),\n    contact_phone VARCHAR(50),\n    subscription_plan VARCHAR(100),\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    \n    -- Extended company fields\n    registration_number VARCHAR(100),\n    tax_number VARCHAR(100),\n    city VARCHAR(100),\n    postal_code VARCHAR(20),\n    country VARCHAR(100),\n    website VARCHAR(255),\n    industry VARCHAR(100),\n    founded_year VARCHAR(4),\n    employee_count VARCHAR(50),\n    description TEXT,\n    bank_name VARCHAR(255),\n    bank_account VARCHAR(100),\n    swift_code VARCHAR(50)\n)","-- =============================================\n-- DEPARTMENTS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS departments (\n    department_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,\n    name VARCHAR(255) NOT NULL,\n    parent_department_id UUID REFERENCES departments(department_id),\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- ROLES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS roles (\n    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    role_name VARCHAR(100) NOT NULL UNIQUE,\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- PERMISSIONS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS permissions (\n    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    permission_name VARCHAR(100) NOT NULL UNIQUE,\n    description TEXT,\n    module VARCHAR(100),\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- ROLE_PERMISSIONS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS role_permissions (\n    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,\n    permission_id UUID NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,\n    PRIMARY KEY (role_id, permission_id),\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- USERS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS users (\n    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id),\n    username VARCHAR(100),\n    email VARCHAR(255) NOT NULL UNIQUE,\n    password_hash VARCHAR(255),\n    first_name VARCHAR(100) NOT NULL,\n    last_name VARCHAR(100) NOT NULL,\n    phone_number VARCHAR(50),\n    avatar_url TEXT,\n    is_active BOOLEAN DEFAULT TRUE,\n    is_email_verified BOOLEAN DEFAULT FALSE,\n    last_login_at TIMESTAMPTZ,\n    onboarding_status VARCHAR(50) DEFAULT 'pending',\n    preferred_language VARCHAR(10) DEFAULT 'en',\n    preferred_theme VARCHAR(20) DEFAULT 'light',\n    preferred_units VARCHAR(20) DEFAULT 'metric',\n    preferred_currency VARCHAR(10) DEFAULT 'EUR',\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    \n    -- Extended profile fields\n    alternative_phone VARCHAR(50),\n    date_of_birth DATE,\n    position VARCHAR(100),\n    branch VARCHAR(100),\n    manager VARCHAR(100),\n    work_email VARCHAR(255),\n    \n    -- Address Information\n    home_address TEXT,\n    home_city VARCHAR(100),\n    home_postal_code VARCHAR(20),\n    home_country VARCHAR(100),\n    work_address TEXT,\n    work_city VARCHAR(100),\n    work_postal_code VARCHAR(20),\n    work_country VARCHAR(100),\n    \n    -- Emergency Contact\n    emergency_contact_name VARCHAR(100),\n    emergency_contact_phone VARCHAR(50),\n    emergency_contact_relationship VARCHAR(50),\n    \n    -- Vehicle & Licenses\n    has_private_vehicle BOOLEAN DEFAULT FALSE,\n    private_vehicle_plate VARCHAR(20),\n    private_vehicle_make VARCHAR(50),\n    private_vehicle_model VARCHAR(50),\n    driving_license_number VARCHAR(100),\n    driving_license_category VARCHAR(50),\n    driving_license_expiry DATE,\n    preferred_vehicle_id UUID,\n    \n    -- Additional Information\n    biography TEXT,\n    skills TEXT,\n    languages TEXT,\n    certifications TEXT\n)","-- =============================================\n-- USER_ROLES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS user_roles (\n    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,\n    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,\n    PRIMARY KEY (user_id, role_id),\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    assigned_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- FUEL_TYPES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS fuel_types (\n    fuel_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    unit VARCHAR(20) NOT NULL DEFAULT 'liters',\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- VEHICLE_TYPES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS vehicle_types (\n    vehicle_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- VEHICLE_STATUS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS vehicle_status (\n    vehicle_status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- VEHICLES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS vehicles (\n    vehicle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id),\n    vehicle_type_id UUID NOT NULL REFERENCES vehicle_types(vehicle_type_id),\n    vehicle_status_id UUID REFERENCES vehicle_status(vehicle_status_id),\n    make VARCHAR(100) NOT NULL,\n    model VARCHAR(100) NOT NULL,\n    year INTEGER NOT NULL,\n    license_plate VARCHAR(20) NOT NULL UNIQUE,\n    vin VARCHAR(50),\n    color VARCHAR(50),\n    engine_type VARCHAR(50),\n    fuel_type_id UUID REFERENCES fuel_types(fuel_type_id),\n    fuel_tank_capacity DECIMAL(10,2),\n    battery_capacity_kwh DECIMAL(10,2),\n    avg_consumption DECIMAL(10,2),\n    current_odometer DECIMAL(15,2),\n    last_odometer_update TIMESTAMPTZ,\n    registration_date DATE,\n    registration_expiry_date DATE,\n    insurance_policy_number VARCHAR(100),\n    insurance_expiry_date DATE,\n    is_private_vehicle BOOLEAN DEFAULT FALSE,\n    notes TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    \n    -- Detailed vehicle specifications\n    seats_count INTEGER,\n    trunk_capacity_liters INTEGER,\n    cargo_capacity_kg DECIMAL(10,2),\n    cargo_volume_m3 DECIMAL(10,3),\n    pallet_capacity INTEGER,\n    required_license_category VARCHAR(10),\n    engine_volume_cc INTEGER,\n    engine_power_kw DECIMAL(10,2),\n    engine_power_hp DECIMAL(10,2),\n    fuel_consumption_city DECIMAL(5,2),\n    fuel_consumption_highway DECIMAL(5,2),\n    fuel_consumption_combined DECIMAL(5,2),\n    \n    -- Registration and insurance costs\n    registration_cost_annual DECIMAL(10,2),\n    insurance_cost_annual DECIMAL(10,2),\n    service_interval_km INTEGER,\n    service_interval_months INTEGER,\n    \n    -- Private vehicle owner info\n    private_owner_name VARCHAR(100),\n    private_owner_contact VARCHAR(100),\n    private_owner_id UUID, -- References users table, but not as a strict FK to allow flexibility\n    FOREIGN KEY (private_owner_id) REFERENCES users(user_id) ON DELETE SET NULL,\n    \n    -- Public transport info\n    is_public_transport BOOLEAN DEFAULT FALSE,\n    public_transport_type VARCHAR(50),\n    transport_company_name VARCHAR(100),\n    transport_company_license VARCHAR(100),\n    fare_per_km DECIMAL(10,2),\n    fare_base_price DECIMAL(10,2),\n    ticket_price DECIMAL(10,2),\n    route_description TEXT\n)","-- =============================================\n-- VEHICLE_ASSIGNMENTS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS vehicle_assignments (\n    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,\n    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,\n    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,\n    assignment_type VARCHAR(50), -- e.g., 'default_driver', 'temporary'\n    start_date TIMESTAMPTZ NOT NULL,\n    end_date TIMESTAMPTZ,\n    notes TEXT,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n)","COMMENT ON TABLE vehicle_assignments IS 'Tracks which user is currently assigned to or primarily uses a vehicle.'","-- =============================================\n-- TRIP_TYPES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS trip_types (\n    trip_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    is_billable BOOLEAN DEFAULT FALSE,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- TRIP_PURPOSES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS trip_purposes (\n    trip_purpose_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    is_active BOOLEAN DEFAULT TRUE,\n    category VARCHAR(50),\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- TRIPS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS trips (\n    trip_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id),\n    trip_type_id UUID REFERENCES trip_types(trip_type_id),\n    trip_purpose_id UUID REFERENCES trip_purposes(trip_purpose_id),\n    start_time TIMESTAMPTZ NOT NULL,\n    end_time TIMESTAMPTZ,\n    start_location_address TEXT,\n    end_location_address TEXT,\n    distance_km DECIMAL(10,2),\n    duration_minutes INTEGER,\n    status trip_status DEFAULT 'PLANNED',\n    notes TEXT,\n    purpose_description TEXT,\n    route_details_json JSONB,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- RESERVATION_STATUS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS reservation_status (\n    reservation_status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    status_name VARCHAR(50) NOT NULL UNIQUE,\n    description TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- RESERVATIONS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS reservations (\n    reservation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    vehicle_id UUID REFERENCES vehicles(vehicle_id),\n    vehicle_type_id UUID REFERENCES vehicle_types(vehicle_type_id),\n    start_time TIMESTAMPTZ NOT NULL,\n    end_time TIMESTAMPTZ NOT NULL,\n    purpose TEXT,\n    status_id UUID NOT NULL REFERENCES reservation_status(reservation_status_id),\n    approved_by_user_id UUID REFERENCES users(user_id),\n    approval_notes TEXT,\n    rejection_reason TEXT,\n    requested_features JSONB,\n    actual_vehicle_id UUID REFERENCES vehicles(vehicle_id),\n    pickup_location TEXT,\n    dropoff_location TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- EXPENSE_CATEGORIES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS expense_categories (\n    expense_category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    default_gl_code VARCHAR(50),\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- EXPENSES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS expenses (\n    expense_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    trip_id UUID REFERENCES trips(trip_id),\n    vehicle_id UUID REFERENCES vehicles(vehicle_id),\n    expense_category_id UUID NOT NULL REFERENCES expense_categories(expense_category_id),\n    amount DECIMAL(10,2) NOT NULL,\n    currency VARCHAR(3) DEFAULT 'EUR',\n    expense_date DATE NOT NULL,\n    description TEXT,\n    status VARCHAR(50) DEFAULT 'pending',\n    approved_by_user_id UUID REFERENCES users(user_id),\n    approval_date TIMESTAMPTZ,\n    rejection_reason TEXT,\n    payment_method VARCHAR(50),\n    fuel_liters DECIMAL(10,2),\n    fuel_price_per_liter DECIMAL(10,4),\n    is_reimbursable BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- FUEL_PRICES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS fuel_prices (\n    price_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    fuel_type_id UUID NOT NULL REFERENCES fuel_types(fuel_type_id),\n    price_per_unit DECIMAL(10,4) NOT NULL,\n    currency VARCHAR(3) DEFAULT 'EUR',\n    effective_date DATE NOT NULL,\n    source VARCHAR(100),\n    region VARCHAR(100),\n    notes TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- POIS (Points of Interest) TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS pois (\n    poi_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id),\n    name VARCHAR(255) NOT NULL,\n    address TEXT,\n    latitude DECIMAL(10,7) NOT NULL,\n    longitude DECIMAL(10,7) NOT NULL,\n    category VARCHAR(100),\n    contact_info TEXT,\n    notes TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- STANDARD_ROUTES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS standard_routes (\n    route_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id),\n    name VARCHAR(255) NOT NULL,\n    start_poi_id UUID REFERENCES pois(poi_id),\n    end_poi_id UUID REFERENCES pois(poi_id),\n    start_address_manual TEXT,\n    end_address_manual TEXT,\n    predefined_distance_km DECIMAL(10,2),\n    estimated_duration_min INTEGER,\n    predefined_cost DECIMAL(10,2),\n    cost_calculation_formula TEXT,\n    route_details_json JSONB,\n    notes TEXT,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- REMINDER_TYPES TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS reminder_types (\n    reminder_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    default_lead_time_days INTEGER DEFAULT 30,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- REMINDERS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS reminders (\n    reminder_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    reminder_type_id UUID REFERENCES reminder_types(reminder_type_id),\n    vehicle_id UUID REFERENCES vehicles(vehicle_id),\n    title VARCHAR(255) NOT NULL,\n    description TEXT,\n    due_date DATE NOT NULL,\n    is_system_generated BOOLEAN DEFAULT FALSE,\n    is_completed BOOLEAN DEFAULT FALSE,\n    completed_at TIMESTAMPTZ,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW(),\n    \n    -- Recurring reminder fields\n    is_recurring BOOLEAN DEFAULT FALSE,\n    recurrence_pattern VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'yearly'\n    recurrence_interval INTEGER DEFAULT 1,\n    recurrence_day_of_week INTEGER, -- 0=Sunday, 1=Monday, etc.\n    recurrence_day_of_month INTEGER, -- 1-31\n    recurrence_end_date DATE,\n    parent_reminder_id UUID REFERENCES reminders(reminder_id)\n)","-- =============================================\n-- SYSTEM_LOGS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS system_logs (\n    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    log_type VARCHAR(50) NOT NULL, -- 'FUEL_EXCESS', 'HIGH_EXPENSE', 'SUSPICIOUS_PATTERN', 'SYSTEM_EVENT'\n    severity VARCHAR(20) NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'\n    title VARCHAR(255) NOT NULL,\n    description TEXT,\n    metadata JSONB,\n    \n    -- Related entities\n    related_expense_id UUID REFERENCES expenses(expense_id),\n    related_vehicle_id UUID REFERENCES vehicles(vehicle_id),\n    related_trip_id UUID REFERENCES trips(trip_id),\n    \n    -- Status tracking\n    is_resolved BOOLEAN DEFAULT FALSE,\n    resolved_by_user_id UUID REFERENCES users(user_id),\n    resolved_at TIMESTAMPTZ,\n    resolution_notes TEXT,\n    \n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- EXPENSE_RECEIPTS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS expense_receipts (\n    receipt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    expense_id UUID NOT NULL REFERENCES expenses(expense_id) ON DELETE CASCADE,\n    file_url TEXT NOT NULL,\n    file_name VARCHAR(255),\n    mime_type VARCHAR(100),\n    uploaded_at TIMESTAMPTZ DEFAULT NOW(),\n    uploaded_by_user_id UUID NOT NULL REFERENCES users(user_id),\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- USER_REQUESTS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS user_requests (\n    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    user_id UUID NOT NULL REFERENCES users(user_id),\n    requested_by_user_id UUID NOT NULL REFERENCES users(user_id),\n    request_type VARCHAR(50) NOT NULL, -- 'profile_update', 'personal_info', etc.\n    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'\n    requested_changes JSONB NOT NULL,\n    approval_notes TEXT,\n    rejection_reason TEXT,\n    approved_by_user_id UUID REFERENCES users(user_id),\n    approved_at TIMESTAMPTZ,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- INDEXES FOR PERFORMANCE\n-- =============================================\nCREATE INDEX IF NOT EXISTS idx_users_email ON users(email)","CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id)","CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id)","CREATE INDEX IF NOT EXISTS idx_trips_vehicle_id ON trips(vehicle_id)","CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status)","CREATE INDEX IF NOT EXISTS idx_trips_start_time ON trips(start_time)","CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id)","CREATE INDEX IF NOT EXISTS idx_reservations_vehicle_id ON reservations(vehicle_id)","CREATE INDEX IF NOT EXISTS idx_reservations_status_id ON reservations(status_id)","CREATE INDEX IF NOT EXISTS idx_reservations_start_time ON reservations(start_time)","CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)","CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id)","CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_id ON expenses(vehicle_id)","CREATE INDEX IF NOT EXISTS idx_pois_location ON pois(latitude, longitude)","CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id)","CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at)","-- =============================================\n-- ROW LEVEL SECURITY POLICIES\n-- =============================================\n\n-- Enable RLS on all tables\nALTER TABLE companies ENABLE ROW LEVEL SECURITY","ALTER TABLE departments ENABLE ROW LEVEL SECURITY","ALTER TABLE users ENABLE ROW LEVEL SECURITY","ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY","ALTER TABLE trips ENABLE ROW LEVEL SECURITY","ALTER TABLE reservations ENABLE ROW LEVEL SECURITY","ALTER TABLE expenses ENABLE ROW LEVEL SECURITY","ALTER TABLE pois ENABLE ROW LEVEL SECURITY","ALTER TABLE standard_routes ENABLE ROW LEVEL SECURITY","ALTER TABLE reminders ENABLE ROW LEVEL SECURITY","ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY","ALTER TABLE user_requests ENABLE ROW LEVEL SECURITY","-- Basic RLS policies (users can see their own data)\nCREATE POLICY \\"Users can view own profile\\" ON users FOR SELECT USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can update own profile\\" ON users FOR UPDATE USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can view own trips\\" ON trips FOR SELECT USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can create own trips\\" ON trips FOR INSERT WITH CHECK (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can update own trips\\" ON trips FOR UPDATE USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can view own reservations\\" ON reservations FOR SELECT USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can create own reservations\\" ON reservations FOR INSERT WITH CHECK (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can view own expenses\\" ON expenses FOR SELECT USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can create own expenses\\" ON expenses FOR INSERT WITH CHECK (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can view own reminders\\" ON reminders FOR SELECT USING (auth.uid()::text = user_id::text)","CREATE POLICY \\"Users can create own reminders\\" ON reminders FOR INSERT WITH CHECK (auth.uid()::text = user_id::text)","-- Public read policies for reference data\nCREATE POLICY \\"Anyone can view vehicle types\\" ON vehicle_types FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view fuel types\\" ON fuel_types FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view trip types\\" ON trip_types FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view trip purposes\\" ON trip_purposes FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view expense categories\\" ON expense_categories FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view reservation status\\" ON reservation_status FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view vehicles\\" ON vehicles FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view pois\\" ON pois FOR SELECT USING (true)","CREATE POLICY \\"Anyone can view standard routes\\" ON standard_routes FOR SELECT USING (true)","-- =============================================\n-- ROW LEVEL SECURITY POLICIES\n-- =============================================\n\n-- Enable RLS on all tables\nALTER TABLE vehicles ENABLE ROW LEVEL SECURITY","ALTER TABLE trips ENABLE ROW LEVEL SECURITY","ALTER TABLE reservations ENABLE ROW LEVEL SECURITY","ALTER TABLE expenses ENABLE ROW LEVEL SECURITY","ALTER TABLE reminders ENABLE ROW LEVEL SECURITY","ALTER TABLE users ENABLE ROW LEVEL SECURITY","-- Vehicle policies\nDROP POLICY IF EXISTS \\"Anyone can view vehicles\\" ON vehicles","CREATE POLICY \\"Anyone can view vehicles\\" ON vehicles\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can update vehicles\\" ON vehicles","CREATE POLICY \\"Users can update vehicles\\" ON vehicles\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can insert vehicles\\" ON vehicles","CREATE POLICY \\"Users can insert vehicles\\" ON vehicles\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete vehicles\\" ON vehicles","CREATE POLICY \\"Users can delete vehicles\\" ON vehicles\nFOR DELETE USING (true)","-- Trip policies\nDROP POLICY IF EXISTS \\"Users can view all trips\\" ON trips","CREATE POLICY \\"Users can view all trips\\" ON trips\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can insert trips\\" ON trips","CREATE POLICY \\"Users can insert trips\\" ON trips\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can update trips\\" ON trips","CREATE POLICY \\"Users can update trips\\" ON trips\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete trips\\" ON trips","CREATE POLICY \\"Users can delete trips\\" ON trips\nFOR DELETE USING (true)","-- Reservation policies\nDROP POLICY IF EXISTS \\"Users can view all reservations\\" ON reservations","CREATE POLICY \\"Users can view all reservations\\" ON reservations\nFOR SELECT USING (true)","CREATE POLICY \\"Users can insert reservations\\" ON reservations\nFOR INSERT WITH CHECK (true)","CREATE POLICY \\"Users can update reservations\\" ON reservations\nFOR UPDATE USING (true) WITH CHECK (true)","CREATE POLICY \\"Users can delete reservations\\" ON reservations\nFOR DELETE USING (true)","-- Expense policies\nCREATE POLICY \\"Users can view all expenses\\" ON expenses\nFOR SELECT USING (true)","CREATE POLICY \\"Users can insert expenses\\" ON expenses\nFOR INSERT WITH CHECK (true)","CREATE POLICY \\"Users can update expenses\\" ON expenses\nFOR UPDATE USING (true) WITH CHECK (true)","CREATE POLICY \\"Users can delete expenses\\" ON expenses\nFOR DELETE USING (true)","-- Reminder policies\nCREATE POLICY \\"Users can view all reminders\\" ON reminders\nFOR SELECT USING (true)","CREATE POLICY \\"Users can insert reminders\\" ON reminders\nFOR INSERT WITH CHECK (true)","CREATE POLICY \\"Users can update reminders\\" ON reminders\nFOR UPDATE USING (true) WITH CHECK (true)","CREATE POLICY \\"Users can delete reminders\\" ON reminders\nFOR DELETE USING (true)","-- User policies\nCREATE POLICY \\"Users can view all users\\" ON users\nFOR SELECT USING (true)","CREATE POLICY \\"Users can update users\\" ON users\nFOR UPDATE USING (true) WITH CHECK (true)","CREATE POLICY \\"Users can insert users\\" ON users\nFOR INSERT WITH CHECK (true)","-- =============================================\n-- FUNCTIONS AND TRIGGERS\n-- =============================================\n\n-- Function to update the `updated_at` column automatically\nCREATE OR REPLACE FUNCTION update_updated_at_column()\nRETURNS TRIGGER AS $$\nBEGIN\n    NEW.updated_at = NOW();\n    RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql","-- Trigger to create a user profile when a new user signs up in auth.users\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  INSERT INTO public.users (\n    user_id,\n    email,\n    username,\n    first_name,\n    last_name,\n    password_hash\n  )\n  VALUES (\n    new.id,\n    new.email,\n    COALESCE(new.raw_user_meta_data->>'username', new.email),\n    new.raw_user_meta_data->>'first_name',\n    new.raw_user_meta_data->>'last_name',\n    'PASSWORD_MANAGED_BY_AUTH'\n  )\n  ON CONFLICT (user_id) DO NOTHING;\n  RETURN new;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Attaching the trigger to the auth.users table\nDROP TRIGGER IF EXISTS on_auth_user_created ON auth.users","CREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()","-- Attaching update triggers to all relevant tables\nCREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_pois_updated_at BEFORE UPDATE ON pois FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_standard_routes_updated_at BEFORE UPDATE ON standard_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","CREATE TRIGGER update_system_logs_updated_at BEFORE UPDATE ON system_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()","-- =============================================\n-- SEED DATA\n-- =============================================\n\n-- Insert default company\nINSERT INTO companies (company_id, name, address, contact_email, contact_phone, subscription_plan)\nVALUES (\n  '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe',\n  'Fleet Flow',\n  'Podgorica, Montenegro',\n  'info@fleetflow.me',\n  '+382 20 123 456',\n  'premium'\n) ON CONFLICT (company_id) DO NOTHING","-- Insert default departments\nINSERT INTO departments (department_id, company_id, name) VALUES\n  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'General'),\n  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Fleet Management'),\n  ('33333333-3333-3333-3333-333333333333', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Operations')\nON CONFLICT (department_id) DO NOTHING","-- Insert default roles\nINSERT INTO roles (role_id, role_name, description) VALUES\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'admin', 'System Administrator'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fleet_manager', 'Fleet Manager'),\n  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'driver', 'Driver'),\n  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'employee', 'Regular Employee')\nON CONFLICT (role_id) DO NOTHING","-- Insert default permissions\nINSERT INTO permissions (permission_id, permission_name, description) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'dashboard:admin', 'Access admin dashboard'),\n  ('22222222-2222-2222-2222-222222222222', 'dashboard:fleet_manager', 'Access fleet manager dashboard'),\n  ('33333333-3333-3333-3333-333333333333', 'reservations:approve', 'Approve reservations'),\n  ('44444444-4444-4444-4444-444444444444', 'reservations:manage', 'Manage all reservations'),\n  ('55555555-5555-5555-5555-555555555555', 'vehicles:manage', 'Manage vehicles'),\n  ('66666666-6666-6666-6666-666666666666', 'trips:view_all', 'View all trips'),\n  ('77777777-7777-7777-7777-777777777777', 'expenses:approve', 'Approve expenses'),\n  ('88888888-8888-8888-8888-888888888888', 'users:manage', 'Manage users')\nON CONFLICT (permission_id) DO NOTHING","-- Insert role-permission mappings\nINSERT INTO role_permissions (role_id, permission_id) VALUES\n  -- Admin permissions\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '55555555-5555-5555-5555-555555555555'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '66666666-6666-6666-6666-666666666666'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '77777777-7777-7777-7777-777777777777'),\n  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '88888888-8888-8888-8888-888888888888'),\n  -- Fleet manager permissions\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '55555555-5555-5555-5555-555555555555'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666'),\n  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777')\nON CONFLICT (role_id, permission_id) DO NOTHING","-- Insert fuel types\nINSERT INTO fuel_types (fuel_type_id, name, unit, description) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Diesel', 'liters', 'Diesel fuel'),\n  ('22222222-2222-2222-2222-222222222222', 'Gasoline', 'liters', 'Gasoline fuel'),\n  ('33333333-3333-3333-3333-333333333333', 'Electric', 'kWh', 'Electric energy'),\n  ('44444444-4444-4444-4444-444444444444', 'Hybrid', 'liters', 'Hybrid fuel system')\nON CONFLICT (fuel_type_id) DO NOTHING","-- Insert vehicle types\nINSERT INTO vehicle_types (vehicle_type_id, name, description) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Car', 'Passenger car'),\n  ('22222222-2222-2222-2222-222222222222', 'Van', 'Cargo van'),\n  ('33333333-3333-3333-3333-333333333333', 'Truck', 'Heavy truck'),\n  ('44444444-4444-4444-4444-444444444444', 'Motorcycle', 'Motorcycle'),\n  ('55555555-5555-5555-5555-555555555555', 'Bus', 'Passenger bus')\nON CONFLICT (vehicle_type_id) DO NOTHING","-- Insert vehicle status\nINSERT INTO vehicle_status (vehicle_status_id, name, description) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Available', 'Vehicle is available for use'),\n  ('22222222-2222-2222-2222-222222222222', 'In Use', 'Vehicle is currently in use'),\n  ('33333333-3333-3333-3333-333333333333', 'Maintenance', 'Vehicle is under maintenance'),\n  ('44444444-4444-4444-4444-444444444444', 'Out of Service', 'Vehicle is out of service')\nON CONFLICT (vehicle_status_id) DO NOTHING","-- Insert sample vehicles\nINSERT INTO vehicles (vehicle_id, company_id, vehicle_type_id, vehicle_status_id, make, model, year, license_plate, fuel_type_id) VALUES\n  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Citroen', 'Jumper', 2020, 'PG123AB', '11111111-1111-1111-1111-111111111111'),\n  ('959729d5-180d-4f7a-8107-351d783e8f39', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Citroen', 'Jumper', 2021, 'PG456CD', '11111111-1111-1111-1111-111111111111'),\n  ('65a3765a-9578-4ae1-aca8-2d1da0a65b92', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Iveco', 'Eurocargo', 2019, 'PGKR258', '11111111-1111-1111-1111-111111111111')\nON CONFLICT (vehicle_id) DO NOTHING","-- Insert trip types\nINSERT INTO trip_types (trip_type_id, name, description, is_billable) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Business', 'Business trip', true),\n  ('22222222-2222-2222-2222-222222222222', 'Personal', 'Personal trip', false),\n  ('33333333-3333-3333-3333-333333333333', 'Maintenance', 'Vehicle maintenance', false),\n  ('44444444-4444-4444-4444-444444444444', 'Emergency', 'Emergency trip', true)\nON CONFLICT (trip_type_id) DO NOTHING","-- Insert trip purposes\nINSERT INTO trip_purposes (trip_purpose_id, name, description, category) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Site Visit', 'Visit to client site', 'business'),\n  ('22222222-2222-2222-2222-222222222222', 'Delivery', 'Package delivery', 'business'),\n  ('33333333-3333-3333-3333-333333333333', 'Meeting', 'Business meeting', 'business'),\n  ('44444444-4444-4444-4444-444444444444', 'Training', 'Employee training', 'business'),\n  ('55555555-5555-5555-5555-555555555555', 'Other', 'Other purpose', 'general')\nON CONFLICT (trip_purpose_id) DO NOTHING","-- Insert reservation status\nINSERT INTO reservation_status (reservation_status_id, status_name, description) VALUES\n  ('c9171953-bd5f-49bd-b85f-15e4e9ce7bb1', 'PENDING_APPROVAL', 'Waiting for approval'),\n  ('545ad731-755f-42ed-b896-f383fdf48b51', 'APPROVED', 'Reservation approved'),\n  ('33333333-3333-3333-3333-333333333333', 'REJECTED', 'Reservation rejected'),\n  ('44444444-4444-4444-4444-444444444444', 'CANCELLED', 'Reservation cancelled'),\n  ('55555555-5555-5555-5555-555555555555', 'COMPLETED', 'Reservation completed')\nON CONFLICT (reservation_status_id) DO NOTHING","-- Insert expense categories\nINSERT INTO expense_categories (expense_category_id, name, description) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Fuel', 'Fuel expenses'),\n  ('22222222-2222-2222-2222-222222222222', 'Maintenance', 'Vehicle maintenance'),\n  ('33333333-3333-3333-3333-333333333333', 'Insurance', 'Insurance costs'),\n  ('44444444-4444-4444-4444-444444444444', 'Parking', 'Parking fees'),\n  ('55555555-5555-5555-5555-555555555555', 'Tolls', 'Highway tolls'),\n  ('66666666-6666-6666-6666-666666666666', 'Other', 'Other expenses')\nON CONFLICT (expense_category_id) DO NOTHING","-- Insert reminder types\nINSERT INTO reminder_types (reminder_type_id, name, description, default_lead_time_days) VALUES\n  ('11111111-1111-1111-1111-111111111111', 'Insurance Renewal', 'Vehicle insurance renewal', 30),\n  ('22222222-2222-2222-2222-222222222222', 'Registration Renewal', 'Vehicle registration renewal', 30),\n  ('33333333-3333-3333-3333-333333333333', 'Service Due', 'Vehicle service due', 7),\n  ('44444444-4444-4444-4444-444444444444', 'Inspection Due', 'Vehicle inspection due', 14)\nON CONFLICT (reminder_type_id) DO NOTHING","-- Insert sample POIs\nINSERT INTO pois (poi_id, company_id, name, address, latitude, longitude, category) VALUES\n  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'H.Office', 'Dr Vukašina Markovića, Kruševac, Podgorica', 42.4307, 19.2478, 'office'),\n  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'WH (Warehouse)', 'Manastirska, Podgorica', 42.4304, 19.2594, 'warehouse'),\n  ('33333333-3333-3333-3333-333333333333', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Studio Mouse', 'Studio Mouse, Podgorica', 42.4697, 19.3047, 'client')\nON CONFLICT (poi_id) DO NOTHING","-- Insert sample standard routes\nINSERT INTO standard_routes (route_id, company_id, name, start_poi_id, end_poi_id, predefined_distance_km, estimated_duration_min) VALUES\n  ('11111111-1111-1111-1111-111111111111', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Office to Warehouse', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 3.2, 15),\n  ('22222222-2222-2222-2222-222222222222', '3cbc58f4-df9f-4069-83dc-b74d6e0a3dbe', 'Office to Studio Mouse', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 8.1, 44)\nON CONFLICT (route_id) DO NOTHING","-- Note: Sample trips and user assignments will be created after auth.users are properly set up\n\n-- =============================================\n-- FINAL CHECKS AND CLEANUP\n-- =============================================\n\n-- Refresh materialized views if any exist\n-- (None currently defined)\n\n-- Update statistics\nANALYZE","-- Migration completed successfully\nSELECT 'Fleet Flow Next Gen - Complete Schema Migration completed successfully!' as status"}	complete_schema
002	{"-- Fix RLS policies and add storage bucket\n-- =============================================\n-- STORAGE SETUP\n-- =============================================\n\n-- Create storage bucket for avatars\nINSERT INTO storage.buckets (id, name, public) \nVALUES ('avatars', 'avatars', true)\nON CONFLICT (id) DO NOTHING","-- Note: RLS on storage.objects is handled by Supabase automatically in newer versions\n-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;\n\n-- Create storage policies for avatars\nDROP POLICY IF EXISTS \\"Avatar images are publicly accessible\\" ON storage.objects","CREATE POLICY \\"Avatar images are publicly accessible\\" ON storage.objects\nFOR SELECT USING (bucket_id = 'avatars')","DROP POLICY IF EXISTS \\"Anyone can upload an avatar\\" ON storage.objects","CREATE POLICY \\"Anyone can upload an avatar\\" ON storage.objects\nFOR INSERT WITH CHECK (bucket_id = 'avatars')","DROP POLICY IF EXISTS \\"Anyone can update own avatar\\" ON storage.objects","CREATE POLICY \\"Anyone can update own avatar\\" ON storage.objects\nFOR UPDATE USING (bucket_id = 'avatars')","-- =============================================\n-- ADD MISSING COLUMNS\n-- =============================================\n\n-- Add route_details_json column to trips table\nALTER TABLE trips ADD COLUMN IF NOT EXISTS route_details_json JSONB","-- Add module column to permissions table\nALTER TABLE permissions ADD COLUMN IF NOT EXISTS module VARCHAR(100)","-- Update existing permissions with module values\nUPDATE permissions SET module = 'dashboard' WHERE permission_name LIKE 'dashboard:%'","UPDATE permissions SET module = 'reservations' WHERE permission_name LIKE 'reservations:%'","UPDATE permissions SET module = 'vehicles' WHERE permission_name LIKE 'vehicles:%'","UPDATE permissions SET module = 'trips' WHERE permission_name LIKE 'trips:%'","UPDATE permissions SET module = 'expenses' WHERE permission_name LIKE 'expenses:%'","UPDATE permissions SET module = 'users' WHERE permission_name LIKE 'users:%'","-- =============================================\n-- FIX RLS POLICIES\n-- =============================================\n\n-- Vehicle policies\nDROP POLICY IF EXISTS \\"Anyone can view vehicles\\" ON vehicles","CREATE POLICY \\"Anyone can view vehicles\\" ON vehicles\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can update vehicles\\" ON vehicles","CREATE POLICY \\"Users can update vehicles\\" ON vehicles\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can insert vehicles\\" ON vehicles","CREATE POLICY \\"Users can insert vehicles\\" ON vehicles\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete vehicles\\" ON vehicles","CREATE POLICY \\"Users can delete vehicles\\" ON vehicles\nFOR DELETE USING (true)","-- Trip policies\nDROP POLICY IF EXISTS \\"Users can view all trips\\" ON trips","CREATE POLICY \\"Users can view all trips\\" ON trips\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can insert trips\\" ON trips","CREATE POLICY \\"Users can insert trips\\" ON trips\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can update trips\\" ON trips","CREATE POLICY \\"Users can update trips\\" ON trips\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete trips\\" ON trips","CREATE POLICY \\"Users can delete trips\\" ON trips\nFOR DELETE USING (true)","-- Reservation policies\nDROP POLICY IF EXISTS \\"Users can view all reservations\\" ON reservations","CREATE POLICY \\"Users can view all reservations\\" ON reservations\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can insert reservations\\" ON reservations","CREATE POLICY \\"Users can insert reservations\\" ON reservations\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can update reservations\\" ON reservations","CREATE POLICY \\"Users can update reservations\\" ON reservations\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete reservations\\" ON reservations","CREATE POLICY \\"Users can delete reservations\\" ON reservations\nFOR DELETE USING (true)","-- Expense policies\nDROP POLICY IF EXISTS \\"Users can view all expenses\\" ON expenses","CREATE POLICY \\"Users can view all expenses\\" ON expenses\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can insert expenses\\" ON expenses","CREATE POLICY \\"Users can insert expenses\\" ON expenses\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can update expenses\\" ON expenses","CREATE POLICY \\"Users can update expenses\\" ON expenses\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete expenses\\" ON expenses","CREATE POLICY \\"Users can delete expenses\\" ON expenses\nFOR DELETE USING (true)","-- Reminder policies\nDROP POLICY IF EXISTS \\"Users can view all reminders\\" ON reminders","CREATE POLICY \\"Users can view all reminders\\" ON reminders\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can insert reminders\\" ON reminders","CREATE POLICY \\"Users can insert reminders\\" ON reminders\nFOR INSERT WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can update reminders\\" ON reminders","CREATE POLICY \\"Users can update reminders\\" ON reminders\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can delete reminders\\" ON reminders","CREATE POLICY \\"Users can delete reminders\\" ON reminders\nFOR DELETE USING (true)","-- User policies\nDROP POLICY IF EXISTS \\"Users can view all users\\" ON users","CREATE POLICY \\"Users can view all users\\" ON users\nFOR SELECT USING (true)","DROP POLICY IF EXISTS \\"Users can update users\\" ON users","CREATE POLICY \\"Users can update users\\" ON users\nFOR UPDATE USING (true) WITH CHECK (true)","DROP POLICY IF EXISTS \\"Users can insert users\\" ON users","CREATE POLICY \\"Users can insert users\\" ON users\nFOR INSERT WITH CHECK (true)"}	fix_policies_and_storage
003	{"-- =============================================\n-- ADMIN USER CREATION FUNCTION\n-- =============================================\n-- Problem: Kreiranje admin naloga direktno u auth.users tabeli\n-- dovodi do \\"Database error querying schema\\" greške\n-- Rešenje: Funkcija koja koristi Auth API pristup\n\nCREATE OR REPLACE FUNCTION create_admin_user_safe(\n    admin_email TEXT,\n    admin_password TEXT,\n    admin_first_name TEXT DEFAULT 'Admin',\n    admin_last_name TEXT DEFAULT 'User'\n)\nRETURNS JSON AS $$\nDECLARE\n    new_user_id UUID;\n    company_uuid UUID;\n    admin_role_id UUID;\n    result_json JSON;\nBEGIN\n    -- Check if user already exists in auth.users\n    SELECT id INTO new_user_id \n    FROM auth.users \n    WHERE email = admin_email;\n    \n    IF new_user_id IS NOT NULL THEN\n        -- User already exists, just ensure proper setup\n        RAISE NOTICE 'User % already exists with ID %', admin_email, new_user_id;\n    ELSE\n        -- User doesn't exist, we need to create via Auth API\n        -- This function should be called AFTER creating user via Auth API\n        RAISE EXCEPTION 'User % must be created via Auth API first. Use: curl -X POST \\"http://127.0.0.1:54321/auth/v1/signup\\" -H \\"Content-Type: application/json\\" -H \\"apikey: YOUR_ANON_KEY\\" -d ''{\\"email\\": \\"%\\", \\"password\\": \\"%\\"}''', admin_email, admin_email, admin_password;\n    END IF;\n    \n    -- Get default company\n    SELECT company_id INTO company_uuid FROM companies LIMIT 1;\n    \n    -- Get admin role\n    SELECT role_id INTO admin_role_id FROM roles WHERE role_name = 'admin' LIMIT 1;\n    \n    -- Create company if missing\n    IF company_uuid IS NULL THEN\n        INSERT INTO companies (\n            company_id, name, address, contact_email, contact_phone, \n            subscription_plan, city, country, industry, founded_year, employee_count\n        ) VALUES (\n            gen_random_uuid(), 'Fleet Flow Demo', '4 jula 109/86', \n            'info@fleetflow.com', '+382 67 503 345', 'Premium', \n            'Podgorica', 'Montenegro', 'Fleet Management', '2024', '50'\n        ) RETURNING company_id INTO company_uuid;\n    END IF;\n    \n    -- Create admin role if missing\n    IF admin_role_id IS NULL THEN\n        INSERT INTO roles (role_id, role_name, description)\n        VALUES (gen_random_uuid(), 'admin', 'Administrator role')\n        RETURNING role_id INTO admin_role_id;\n    END IF;\n    \n    -- Update or create public.users record\n    INSERT INTO users (\n        user_id, company_id, username, email, password_hash,\n        first_name, last_name, phone_number, is_active, \n        is_email_verified, created_at, updated_at\n    ) VALUES (\n        new_user_id,\n        company_uuid,\n        REPLACE(admin_email, '@', '.'),\n        admin_email,\n        'auth_managed',\n        admin_first_name,\n        admin_last_name,\n        '+382 67 503 345',\n        true,\n        true,\n        NOW(),\n        NOW()\n    ) ON CONFLICT (user_id) DO UPDATE SET\n        first_name = EXCLUDED.first_name,\n        last_name = EXCLUDED.last_name,\n        company_id = EXCLUDED.company_id,\n        is_active = true,\n        updated_at = NOW();\n    \n    -- Assign admin role\n    INSERT INTO user_roles (user_id, role_id, assigned_at)\n    VALUES (new_user_id, admin_role_id, NOW())\n    ON CONFLICT (user_id, role_id) DO NOTHING;\n    \n    -- Build result JSON\n    SELECT json_build_object(\n        'success', true,\n        'user_id', new_user_id,\n        'email', admin_email,\n        'first_name', admin_first_name,\n        'last_name', admin_last_name,\n        'company_id', company_uuid,\n        'admin_role_id', admin_role_id,\n        'message', 'Admin user setup completed successfully'\n    ) INTO result_json;\n    \n    RETURN result_json;\n    \nEXCEPTION\n    WHEN OTHERS THEN\n        RETURN json_build_object(\n            'success', false,\n            'error', SQLERRM,\n            'message', 'Failed to setup admin user'\n        );\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Function to complete admin setup for existing auth user\nCREATE OR REPLACE FUNCTION complete_admin_setup(admin_email TEXT)\nRETURNS JSON AS $$\nDECLARE\n    auth_user_id UUID;\n    result_json JSON;\nBEGIN\n    -- Get auth user ID\n    SELECT id INTO auth_user_id \n    FROM auth.users \n    WHERE email = admin_email;\n    \n    IF auth_user_id IS NULL THEN\n        RETURN json_build_object(\n            'success', false,\n            'message', 'User not found in auth.users. Create via Auth API first.'\n        );\n    END IF;\n    \n    -- Call the main function\n    SELECT create_admin_user_safe(admin_email, 'password123', 'Danko', 'Đuretić') \n    INTO result_json;\n    \n    RETURN result_json;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Complete setup for current admin user\nSELECT complete_admin_setup('djuretic.danko@gmail.com')","-- Function to check admin status\nCREATE OR REPLACE FUNCTION check_admin_user_status(admin_email TEXT)\nRETURNS JSON AS $$\nDECLARE\n    result_json JSON;\nBEGIN\n    SELECT json_build_object(\n        'auth_exists', (SELECT id FROM auth.users WHERE email = admin_email) IS NOT NULL,\n        'public_exists', (SELECT users.user_id FROM users WHERE users.email = admin_email) IS NOT NULL,\n        'has_admin_role', EXISTS(\n            SELECT 1 FROM users u\n            JOIN user_roles ur ON u.user_id = ur.user_id\n            JOIN roles r ON ur.role_id = r.role_id\n            WHERE u.email = admin_email AND r.role_name = 'admin'\n        ),\n        'user_id', (SELECT users.user_id FROM users WHERE users.email = admin_email),\n        'first_name', (SELECT users.first_name FROM users WHERE users.email = admin_email),\n        'last_name', (SELECT users.last_name FROM users WHERE users.email = admin_email),\n        'company_name', (SELECT c.name FROM users JOIN companies c ON users.company_id = c.company_id WHERE users.email = admin_email)\n    ) INTO result_json;\n    \n    RETURN result_json;\nEND;\n$$ LANGUAGE plpgsql","-- Check current status\nSELECT check_admin_user_status('djuretic.danko@gmail.com')","-- Create documentation comment\nCOMMENT ON FUNCTION create_admin_user_safe IS 'Safely creates admin user after Auth API signup. Prevents \\"Database error querying schema\\" by not creating auth.users directly.'","COMMENT ON FUNCTION complete_admin_setup IS 'Completes admin setup for existing auth user created via Auth API.'","COMMENT ON FUNCTION check_admin_user_status IS 'Checks complete admin user status across auth.users, public.users and roles.'"}	create_admin_function
004	{"-- =============================================\n-- FIX COMPANIES RLS POLICIES\n-- =============================================\n-- Problem: Companies tabela ima RLS uključen ali nema policies\n-- što blokira sve API pozive za company settings\n-- Rešenje: Kreiranje proper RLS policies\n\n-- Drop existing policies if any\nDROP POLICY IF EXISTS \\"Allow authenticated users to read companies\\" ON companies","DROP POLICY IF EXISTS \\"Allow authenticated users to update companies\\" ON companies","DROP POLICY IF EXISTS \\"Allow users to read their company\\" ON companies","DROP POLICY IF EXISTS \\"Allow users to update their company\\" ON companies","-- Create RLS policies for companies table\n-- Policy 1: Allow authenticated users to read companies\nCREATE POLICY \\"Allow authenticated users to read companies\\" \nON companies FOR SELECT \nTO authenticated \nUSING (true)","-- Policy 2: Allow authenticated users to update their own company\nCREATE POLICY \\"Allow users to update their company\\" \nON companies FOR UPDATE \nTO authenticated \nUSING (\n  company_id IN (\n    SELECT u.company_id \n    FROM users u \n    WHERE u.user_id = auth.uid()\n  )\n)\nWITH CHECK (\n  company_id IN (\n    SELECT u.company_id \n    FROM users u \n    WHERE u.user_id = auth.uid()\n  )\n)","-- Policy 3: Allow authenticated users to insert companies (for admin)\nCREATE POLICY \\"Allow authenticated users to insert companies\\" \nON companies FOR INSERT \nTO authenticated \nWITH CHECK (true)","-- Policy 4: Allow service role full access\nCREATE POLICY \\"Allow service role full access to companies\\" \nON companies FOR ALL \nTO service_role \nUSING (true) \nWITH CHECK (true)","-- Verify policies were created\nSELECT schemaname, tablename, policyname, permissive, roles, cmd \nFROM pg_policies \nWHERE tablename = 'companies'"}	fix_companies_rls
005	{"-- =============================================\n-- BACKUP SYSTEM MIGRATION\n-- =============================================\n-- Kreiranje kompletnog backup sistema za Fleet Flow aplikaciju\n-- Omogućava kreiranje i vraćanje backup-a korisničkih podataka\n\n-- =============================================\n-- USER_BACKUPS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS user_backups (\n    backup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,\n    backup_name VARCHAR(255) NOT NULL,\n    backup_description TEXT,\n    backup_type VARCHAR(20) NOT NULL DEFAULT 'manual', -- 'manual' or 'automatic'\n    backup_size_bytes BIGINT NOT NULL DEFAULT 0,\n    backup_metadata JSONB NOT NULL DEFAULT '{}',\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- BACKUP_DATA TABLE - stores actual backup data\n-- =============================================\nCREATE TABLE IF NOT EXISTS backup_data (\n    backup_data_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    backup_id UUID NOT NULL REFERENCES user_backups(backup_id) ON DELETE CASCADE,\n    table_name VARCHAR(100) NOT NULL,\n    data_type VARCHAR(50) NOT NULL, -- 'vehicles', 'pois', 'routes', etc.\n    backup_data JSONB NOT NULL,\n    record_count INTEGER NOT NULL DEFAULT 0,\n    created_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- INDEXES\n-- =============================================\nCREATE INDEX IF NOT EXISTS idx_user_backups_user_id ON user_backups(user_id)","CREATE INDEX IF NOT EXISTS idx_user_backups_created_at ON user_backups(created_at)","CREATE INDEX IF NOT EXISTS idx_backup_data_backup_id ON backup_data(backup_id)","CREATE INDEX IF NOT EXISTS idx_backup_data_table_name ON backup_data(table_name)","-- =============================================\n-- RLS POLICIES\n-- =============================================\nALTER TABLE user_backups ENABLE ROW LEVEL SECURITY","ALTER TABLE backup_data ENABLE ROW LEVEL SECURITY","-- Users can only access their own backups\nCREATE POLICY \\"Users can view own backups\\" ON user_backups\n    FOR SELECT USING (auth.uid() = user_id)","CREATE POLICY \\"Users can create own backups\\" ON user_backups\n    FOR INSERT WITH CHECK (auth.uid() = user_id)","CREATE POLICY \\"Users can update own backups\\" ON user_backups\n    FOR UPDATE USING (auth.uid() = user_id)","CREATE POLICY \\"Users can delete own backups\\" ON user_backups\n    FOR DELETE USING (auth.uid() = user_id)","-- Backup data policies\nCREATE POLICY \\"Users can view own backup data\\" ON backup_data\n    FOR SELECT USING (\n        EXISTS (\n            SELECT 1 FROM user_backups ub \n            WHERE ub.backup_id = backup_data.backup_id \n            AND ub.user_id = auth.uid()\n        )\n    )","CREATE POLICY \\"Users can create own backup data\\" ON backup_data\n    FOR INSERT WITH CHECK (\n        EXISTS (\n            SELECT 1 FROM user_backups ub \n            WHERE ub.backup_id = backup_data.backup_id \n            AND ub.user_id = auth.uid()\n        )\n    )","CREATE POLICY \\"Users can delete own backup data\\" ON backup_data\n    FOR DELETE USING (\n        EXISTS (\n            SELECT 1 FROM user_backups ub \n            WHERE ub.backup_id = backup_data.backup_id \n            AND ub.user_id = auth.uid()\n        )\n    )","-- =============================================\n-- BACKUP SUMMARY VIEW\n-- =============================================\nCREATE OR REPLACE VIEW user_backup_summary AS\nSELECT \n    ub.backup_id,\n    ub.user_id,\n    ub.backup_name,\n    ub.backup_description,\n    ub.backup_type,\n    ub.backup_size_bytes,\n    ub.created_at,\n    \n    -- Extract metadata counts\n    COALESCE((ub.backup_metadata->>'vehicle_count')::INTEGER, 0) as vehicle_count,\n    COALESCE((ub.backup_metadata->>'poi_count')::INTEGER, 0) as poi_count,\n    COALESCE((ub.backup_metadata->>'route_count')::INTEGER, 0) as route_count,\n    COALESCE((ub.backup_metadata->>'expense_count')::INTEGER, 0) as expense_count,\n    COALESCE((ub.backup_metadata->>'reminder_count')::INTEGER, 0) as reminder_count,\n    COALESCE((ub.backup_metadata->>'trip_count')::INTEGER, 0) as trip_count,\n    COALESCE((ub.backup_metadata->>'reservation_count')::INTEGER, 0) as reservation_count,\n    COALESCE((ub.backup_metadata->>'message_count')::INTEGER, 0) as message_count,\n    COALESCE((ub.backup_metadata->>'notification_count')::INTEGER, 0) as notification_count,\n    COALESCE((ub.backup_metadata->>'chat_group_count')::INTEGER, 0) as chat_group_count,\n    COALESCE((ub.backup_metadata->>'total_records')::INTEGER, 0) as total_records,\n    \n    -- User info\n    u.first_name || ' ' || u.last_name as username,\n    u.email\nFROM user_backups ub\nJOIN users u ON ub.user_id = u.user_id","-- =============================================\n-- CREATE_USER_BACKUP FUNCTION\n-- =============================================\nCREATE OR REPLACE FUNCTION create_user_backup(\n    p_backup_name TEXT DEFAULT NULL,\n    p_backup_description TEXT DEFAULT NULL,\n    p_is_automatic BOOLEAN DEFAULT FALSE\n)\nRETURNS UUID AS $$\nDECLARE\n    v_user_id UUID;\n    v_backup_id UUID;\n    v_backup_name TEXT;\n    v_backup_type TEXT;\n    v_total_size BIGINT := 0;\n    v_metadata JSONB := '{}';\n    \n    -- Counters\n    v_vehicle_count INTEGER := 0;\n    v_poi_count INTEGER := 0;\n    v_route_count INTEGER := 0;\n    v_expense_count INTEGER := 0;\n    v_reminder_count INTEGER := 0;\n    v_trip_count INTEGER := 0;\n    v_reservation_count INTEGER := 0;\n    v_notification_count INTEGER := 0;\n    v_total_records INTEGER := 0;\n    \n    -- Data variables\n    v_vehicles_data JSONB;\n    v_pois_data JSONB;\n    v_routes_data JSONB;\n    v_expenses_data JSONB;\n    v_reminders_data JSONB;\n    v_trips_data JSONB;\n    v_reservations_data JSONB;\n    v_notifications_data JSONB;\nBEGIN\n    -- Get current user\n    v_user_id := auth.uid();\n    IF v_user_id IS NULL THEN\n        RAISE EXCEPTION 'User not authenticated';\n    END IF;\n    \n    -- Generate backup name if not provided\n    IF p_backup_name IS NULL OR p_backup_name = '' THEN\n        v_backup_name := 'Backup ' || TO_CHAR(NOW(), 'YYYY-MM-DD HH24:MI');\n    ELSE\n        v_backup_name := p_backup_name;\n    END IF;\n    \n    -- Set backup type\n    v_backup_type := CASE WHEN p_is_automatic THEN 'automatic' ELSE 'manual' END;\n    \n    -- Generate backup ID\n    v_backup_id := gen_random_uuid();\n    \n    -- Backup vehicles data (user's private vehicles or vehicles they've used)\n    SELECT json_agg(row_to_json(v.*)), COUNT(*)\n    INTO v_vehicles_data, v_vehicle_count\n    FROM vehicles v\n    WHERE v.private_owner_id = v_user_id OR v.vehicle_id IN (\n        SELECT DISTINCT vehicle_id FROM trips WHERE user_id = v_user_id\n    );\n    \n    -- Backup POIs data (company POIs)\n    SELECT json_agg(row_to_json(p.*)), COUNT(*)\n    INTO v_pois_data, v_poi_count\n    FROM pois p\n    WHERE p.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);\n    \n    -- Backup routes data (company routes)\n    SELECT json_agg(row_to_json(r.*)), COUNT(*)\n    INTO v_routes_data, v_route_count\n    FROM standard_routes r\n    WHERE r.company_id = (SELECT company_id FROM users WHERE user_id = v_user_id);\n    \n    -- Backup expenses data (user's expenses)\n    SELECT json_agg(row_to_json(e.*)), COUNT(*)\n    INTO v_expenses_data, v_expense_count\n    FROM expenses e\n    WHERE e.user_id = v_user_id;\n    \n    -- Backup reminders data (user's reminders)\n    SELECT json_agg(row_to_json(r.*)), COUNT(*)\n    INTO v_reminders_data, v_reminder_count\n    FROM reminders r\n    WHERE r.user_id = v_user_id;\n    \n    -- Backup trips data (user's trips)\n    SELECT json_agg(row_to_json(t.*)), COUNT(*)\n    INTO v_trips_data, v_trip_count\n    FROM trips t\n    WHERE t.user_id = v_user_id;\n    \n    -- Backup reservations data (user's reservations)\n    SELECT json_agg(row_to_json(res.*)), COUNT(*)\n    INTO v_reservations_data, v_reservation_count\n    FROM reservations res\n    WHERE res.user_id = v_user_id;\n    \n    -- Backup notifications data (user's notifications)\n    SELECT json_agg(row_to_json(n.*)), COUNT(*)\n    INTO v_notifications_data, v_notification_count\n    FROM notifications n\n    WHERE n.user_id = v_user_id;\n    \n    -- Calculate total records\n    v_total_records := COALESCE(v_vehicle_count, 0) + COALESCE(v_poi_count, 0) + COALESCE(v_route_count, 0) + \n                      COALESCE(v_expense_count, 0) + COALESCE(v_reminder_count, 0) + COALESCE(v_trip_count, 0) + \n                      COALESCE(v_reservation_count, 0) + COALESCE(v_notification_count, 0);\n    \n    -- Build metadata\n    v_metadata := json_build_object(\n        'vehicle_count', COALESCE(v_vehicle_count, 0),\n        'poi_count', COALESCE(v_poi_count, 0),\n        'route_count', COALESCE(v_route_count, 0),\n        'expense_count', COALESCE(v_expense_count, 0),\n        'reminder_count', COALESCE(v_reminder_count, 0),\n        'trip_count', COALESCE(v_trip_count, 0),\n        'reservation_count', COALESCE(v_reservation_count, 0),\n        'message_count', 0,\n        'notification_count', COALESCE(v_notification_count, 0),\n        'chat_group_count', 0,\n        'total_records', v_total_records\n    );\n    \n    -- Calculate backup size (approximate)\n    v_total_size := LENGTH(v_metadata::TEXT) + \n                   COALESCE(LENGTH(v_vehicles_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_pois_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_routes_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_expenses_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_reminders_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_trips_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_reservations_data::TEXT), 0) +\n                   COALESCE(LENGTH(v_notifications_data::TEXT), 0);\n    \n    -- Create backup record\n    INSERT INTO user_backups (\n        backup_id, user_id, backup_name, backup_description, \n        backup_type, backup_size_bytes, backup_metadata\n    ) VALUES (\n        v_backup_id, v_user_id, v_backup_name, p_backup_description,\n        v_backup_type, v_total_size, v_metadata\n    );\n    \n    -- Store backup data\n    IF v_vehicles_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'vehicles', 'vehicles', v_vehicles_data, v_vehicle_count);\n    END IF;\n    \n    IF v_pois_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'pois', 'pois', v_pois_data, v_poi_count);\n    END IF;\n    \n    IF v_routes_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'standard_routes', 'routes', v_routes_data, v_route_count);\n    END IF;\n    \n    IF v_expenses_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'expenses', 'expenses', v_expenses_data, v_expense_count);\n    END IF;\n    \n    IF v_reminders_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'reminders', 'reminders', v_reminders_data, v_reminder_count);\n    END IF;\n    \n    IF v_trips_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'trips', 'trips', v_trips_data, v_trip_count);\n    END IF;\n    \n    IF v_reservations_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'reservations', 'reservations', v_reservations_data, v_reservation_count);\n    END IF;\n    \n    IF v_notifications_data IS NOT NULL THEN\n        INSERT INTO backup_data (backup_id, table_name, data_type, backup_data, record_count)\n        VALUES (v_backup_id, 'notifications', 'notifications', v_notifications_data, v_notification_count);\n    END IF;\n    \n    RETURN v_backup_id;\n    \nEXCEPTION\n    WHEN OTHERS THEN\n        RAISE EXCEPTION 'Error creating backup: %', SQLERRM;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- =============================================\n-- RESTORE_USER_BACKUP FUNCTION\n-- =============================================\nCREATE OR REPLACE FUNCTION restore_user_backup(\n    p_user_id UUID,\n    p_backup_id UUID,\n    p_restore_vehicles BOOLEAN DEFAULT TRUE,\n    p_restore_pois BOOLEAN DEFAULT TRUE,\n    p_restore_routes BOOLEAN DEFAULT TRUE,\n    p_restore_expenses BOOLEAN DEFAULT FALSE,\n    p_restore_reminders BOOLEAN DEFAULT TRUE,\n    p_restore_trips BOOLEAN DEFAULT FALSE,\n    p_restore_reservations BOOLEAN DEFAULT TRUE,\n    p_restore_messages BOOLEAN DEFAULT TRUE,\n    p_restore_notifications BOOLEAN DEFAULT TRUE,\n    p_restore_chat_groups BOOLEAN DEFAULT TRUE\n)\nRETURNS JSON AS $$\nDECLARE\n    v_backup_record user_backups%ROWTYPE;\n    v_vehicles_restored INTEGER := 0;\n    v_pois_restored INTEGER := 0;\n    v_routes_restored INTEGER := 0;\n    v_expenses_restored INTEGER := 0;\n    v_reminders_restored INTEGER := 0;\n    v_trips_restored INTEGER := 0;\n    v_reservations_restored INTEGER := 0;\n    v_notifications_restored INTEGER := 0;\n    v_total_restored INTEGER := 0;\n    v_backup_data_record backup_data%ROWTYPE;\n    v_data_item JSONB;\nBEGIN\n    -- Verify user owns the backup\n    SELECT * INTO v_backup_record\n    FROM user_backups\n    WHERE backup_id = p_backup_id AND user_id = p_user_id;\n    \n    IF NOT FOUND THEN\n        RAISE EXCEPTION 'Backup not found or access denied';\n    END IF;\n    \n    -- Restore reminders if requested (safe to restore)\n    IF p_restore_reminders THEN\n        SELECT * INTO v_backup_data_record\n        FROM backup_data\n        WHERE backup_id = p_backup_id AND data_type = 'reminders';\n        \n        IF FOUND THEN\n            FOR v_data_item IN SELECT * FROM jsonb_array_elements(v_backup_data_record.backup_data)\n            LOOP\n                INSERT INTO reminders (\n                    reminder_id, user_id, reminder_type_id, vehicle_id,\n                    title, description, due_date, is_system_generated,\n                    is_completed, completed_at\n                ) VALUES (\n                    gen_random_uuid(), -- Generate new ID to avoid conflicts\n                    p_user_id, -- Always assign to current user\n                    (v_data_item->>'reminder_type_id')::UUID,\n                    (v_data_item->>'vehicle_id')::UUID,\n                    v_data_item->>'title',\n                    v_data_item->>'description',\n                    (v_data_item->>'due_date')::TIMESTAMPTZ,\n                    (v_data_item->>'is_system_generated')::BOOLEAN,\n                    false, -- Reset completion status\n                    NULL -- Reset completion date\n                ) ON CONFLICT DO NOTHING;\n                \n                v_reminders_restored := v_reminders_restored + 1;\n            END LOOP;\n        END IF;\n    END IF;\n    \n    -- Calculate total restored\n    v_total_restored := v_vehicles_restored + v_pois_restored + v_routes_restored + \n                       v_expenses_restored + v_reminders_restored + v_trips_restored + \n                       v_reservations_restored + v_notifications_restored;\n    \n    -- Build result\n    RETURN json_build_object(\n        'success', true,\n        'backup_id', p_backup_id,\n        'backup_name', v_backup_record.backup_name,\n        'restored_counts', json_build_object(\n            'vehicles', v_vehicles_restored,\n            'pois', v_pois_restored,\n            'routes', v_routes_restored,\n            'expenses', v_expenses_restored,\n            'reminders', v_reminders_restored,\n            'trips', v_trips_restored,\n            'reservations', v_reservations_restored,\n            'messages', 0,\n            'notifications', v_notifications_restored,\n            'chat_groups', 0\n        ),\n        'total_restored', v_total_restored\n    );\n    \nEXCEPTION\n    WHEN OTHERS THEN\n        RETURN json_build_object(\n            'success', false,\n            'backup_id', p_backup_id,\n            'backup_name', '',\n            'restored_counts', json_build_object(\n                'vehicles', 0, 'pois', 0, 'routes', 0, 'expenses', 0,\n                'reminders', 0, 'trips', 0, 'reservations', 0,\n                'messages', 0, 'notifications', 0, 'chat_groups', 0\n            ),\n            'total_restored', 0,\n            'error', SQLERRM\n        );\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- =============================================\n-- CLEANUP_OLD_BACKUPS FUNCTION\n-- =============================================\nCREATE OR REPLACE FUNCTION cleanup_old_backups(\n    p_user_id UUID,\n    p_keep_count INTEGER DEFAULT 10\n)\nRETURNS INTEGER AS $$\nDECLARE\n    v_deleted_count INTEGER := 0;\nBEGIN\n    -- Delete old backups, keeping only the most recent p_keep_count\n    DELETE FROM user_backups\n    WHERE user_id = p_user_id\n    AND backup_id NOT IN (\n        SELECT backup_id\n        FROM user_backups\n        WHERE user_id = p_user_id\n        ORDER BY created_at DESC\n        LIMIT p_keep_count\n    );\n    \n    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;\n    \n    RETURN v_deleted_count;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- =============================================\n-- TRIGGERS\n-- =============================================\nCREATE TRIGGER update_user_backups_updated_at\n    BEFORE UPDATE ON user_backups\n    FOR EACH ROW\n    EXECUTE FUNCTION update_updated_at_column()","-- =============================================\n-- PERMISSIONS\n-- =============================================\n-- Grant permissions to authenticated users\nGRANT SELECT, INSERT, UPDATE, DELETE ON user_backups TO authenticated","GRANT SELECT, INSERT, DELETE ON backup_data TO authenticated","GRANT SELECT ON user_backup_summary TO authenticated","-- Grant execute permissions on functions\nGRANT EXECUTE ON FUNCTION create_user_backup TO authenticated","GRANT EXECUTE ON FUNCTION restore_user_backup TO authenticated","GRANT EXECUTE ON FUNCTION cleanup_old_backups TO authenticated","-- =============================================\n-- SUCCESS MESSAGE\n-- =============================================\nSELECT 'BACKUP SYSTEM CREATED SUCCESSFULLY' as status"}	create_backup_system
007	{"-- =============================================\n-- FIX VEHICLE ERRORS - QUICK FIXES\n-- =============================================\n\n-- 1. DODAJ ALIAS ZA VEHICLE_STATUS.NAME KAO STATUS_NAME\n-- Ovo je zbog greške: column vehicle_status.status_name does not exist\n-- Aplikacija traži status_name, a tabela ima name\n\n-- Ne menjamo tabelu, već ćemo popraviti u kodu\n-- Ali dodajemo podatke ako nema\n\n-- 2. DODAJ VEHICLE STATUSE AKO NE POSTOJE\nINSERT INTO vehicle_status (vehicle_status_id, name, description) VALUES\n('aaaaaaaa-bbbb-cccc-dddd-111111111111', 'Available', 'Vehicle is available for use'),\n('aaaaaaaa-bbbb-cccc-dddd-222222222222', 'In Use', 'Vehicle is currently in use'),\n('aaaaaaaa-bbbb-cccc-dddd-333333333333', 'Maintenance', 'Vehicle is under maintenance'),\n('aaaaaaaa-bbbb-cccc-dddd-444444444444', 'Out of Service', 'Vehicle is out of service')\nON CONFLICT (vehicle_status_id) DO NOTHING","-- 3. KREIRAJ VIEW ZA KOMPATIBILNOST SA KODOM\nCREATE OR REPLACE VIEW vehicle_statuses AS\nSELECT \n    vehicle_status_id,\n    name as status_name,\n    description,\n    created_at,\n    updated_at\nFROM vehicle_status","-- 4. DODAJ DEFAULT FUEL TYPE AKO NEMA\nINSERT INTO fuel_types (fuel_type_id, name, description) VALUES\n('55555555-5555-5555-5555-555555555555', 'Petrol', 'Regular petrol fuel')\nON CONFLICT (fuel_type_id) DO NOTHING","-- 5. KREIRAJ FUNKCIJU ZA BRZU PROVERU VEHICLE DATA\nCREATE OR REPLACE FUNCTION check_vehicle_data()\nRETURNS TEXT AS $$\nDECLARE\n    vehicle_types_count INTEGER;\n    vehicle_statuses_count INTEGER;\n    fuel_types_count INTEGER;\nBEGIN\n    SELECT COUNT(*) INTO vehicle_types_count FROM vehicle_types;\n    SELECT COUNT(*) INTO vehicle_statuses_count FROM vehicle_status;\n    SELECT COUNT(*) INTO fuel_types_count FROM fuel_types;\n    \n    RETURN FORMAT('Vehicle Types: %s, Vehicle Statuses: %s, Fuel Types: %s', \n                  vehicle_types_count, vehicle_statuses_count, fuel_types_count);\nEND;\n$$ LANGUAGE plpgsql","-- 6. PROVERI PODATKE\nSELECT check_vehicle_data()"}	fix_vehicle_errors
008	{"-- =====================================================\n-- Fleet Flow Performance Optimization Migration\n-- =====================================================\n-- Kreiran: 2025-01-22\n-- Svrha: Optimizacija performansi aplikacije kroz database indexe i optimizacije\n\n-- =====================================================\n-- SYSTEM LOGS FIX - Allow NULL user_id for system operations\n-- =====================================================\n\n-- Make user_id nullable for system logs\nALTER TABLE system_logs ALTER COLUMN user_id DROP NOT NULL","-- =====================================================\n-- PERFORMANCE INDEXES\n-- =====================================================\n\n-- Optimizacija za trips queries\nCREATE INDEX IF NOT EXISTS idx_trips_user_status ON trips(user_id, status)","CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at DESC)","CREATE INDEX IF NOT EXISTS idx_trips_start_time ON trips(start_time)","-- Optimizacija za expenses queries\nCREATE INDEX IF NOT EXISTS idx_expenses_user_created ON expenses(user_id, created_at DESC)","CREATE INDEX IF NOT EXISTS idx_expenses_vehicle_date ON expenses(vehicle_id, expense_date)","CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(expense_category_id)","-- Optimizacija za reservations queries\nCREATE INDEX IF NOT EXISTS idx_reservations_user_time ON reservations(user_id, start_time)","CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status_id)","CREATE INDEX IF NOT EXISTS idx_reservations_vehicle ON reservations(vehicle_id)","-- Optimizacija za reminders queries\nCREATE INDEX IF NOT EXISTS idx_reminders_user_due ON reminders(user_id, due_date)","CREATE INDEX IF NOT EXISTS idx_reminders_completed ON reminders(is_completed, due_date)","-- Optimizacija za vehicles queries\nCREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(vehicle_status_id)","CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(vehicle_type_id)","-- Optimizacija za users queries\nCREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)","CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id)","-- =====================================================\n-- QUERY OPTIMIZATION VIEWS\n-- =====================================================\n\n-- Optimizovani view za pending reservations\nCREATE OR REPLACE VIEW pending_reservations_optimized AS\nSELECT \n    r.reservation_id,\n    r.user_id,\n    r.purpose,\n    r.start_time,\n    r.end_time,\n    r.created_at,\n    rs.status_name,\n    u.first_name,\n    u.last_name,\n    v.make,\n    v.model,\n    v.license_plate\nFROM reservations r\nJOIN reservation_status rs ON r.status_id = rs.reservation_status_id\nJOIN users u ON r.user_id = u.user_id\nLEFT JOIN vehicles v ON r.vehicle_id = v.vehicle_id\nWHERE rs.status_name = 'PENDING_APPROVAL'\nORDER BY r.created_at DESC","-- Optimizovani view za active trips\nCREATE OR REPLACE VIEW active_trips_optimized AS\nSELECT \n    t.trip_id,\n    t.user_id,\n    t.purpose_description,\n    t.start_location_address,\n    t.end_location_address,\n    t.start_time,\n    t.status,\n    t.created_at,\n    u.first_name,\n    u.last_name,\n    v.make,\n    v.model,\n    v.license_plate\nFROM trips t\nJOIN users u ON t.user_id = u.user_id\nLEFT JOIN vehicles v ON t.vehicle_id = v.vehicle_id\nWHERE t.status IN ('PLANNED', 'IN_PROGRESS')\nORDER BY t.start_time DESC","-- =====================================================\n-- MATERIALIZED VIEWS FOR HEAVY QUERIES\n-- =====================================================\n\n-- Materialized view za user statistics (refresh manually kada treba)\nCREATE MATERIALIZED VIEW IF NOT EXISTS user_stats_mv AS\nSELECT \n    u.user_id,\n    u.first_name,\n    u.last_name,\n    COUNT(DISTINCT t.trip_id) as total_trips,\n    COUNT(DISTINCT e.expense_id) as total_expenses,\n    COUNT(DISTINCT r.reservation_id) as total_reservations,\n    COALESCE(SUM(e.amount), 0) as total_expense_amount,\n    MAX(t.created_at) as last_trip_date\nFROM users u\nLEFT JOIN trips t ON u.user_id = t.user_id\nLEFT JOIN expenses e ON u.user_id = e.user_id\nLEFT JOIN reservations r ON u.user_id = r.user_id\nWHERE u.is_active = true\nGROUP BY u.user_id, u.first_name, u.last_name","-- Index za materialized view\nCREATE UNIQUE INDEX IF NOT EXISTS idx_user_stats_mv_user_id ON user_stats_mv(user_id)","-- =====================================================\n-- PERFORMANCE OPTIMIZATION FUNCTIONS\n-- =====================================================\n\n-- Function za refresh materialized views\nCREATE OR REPLACE FUNCTION refresh_performance_views()\nRETURNS void AS $$\nBEGIN\n    REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats_mv;\n    \n    -- Log the refresh (system operation - no user)\n    INSERT INTO system_logs (\n        log_type, \n        severity, \n        title, \n        description,\n        metadata,\n        created_at\n    ) VALUES (\n        'PERFORMANCE',\n        'INFO',\n        'Performance views refreshed',\n        'Materialized views have been refreshed for better performance',\n        '{\\"action\\": \\"refresh_materialized_views\\"}'::jsonb,\n        NOW()\n    );\nEND;\n$$ LANGUAGE plpgsql","-- =====================================================\n-- CLEANUP OLD DATA FUNCTION\n-- =====================================================\n\n-- Function za cleanup starih logova (starijih od 30 dana)\nCREATE OR REPLACE FUNCTION cleanup_old_logs()\nRETURNS void AS $$\nDECLARE\n    deleted_count INTEGER;\nBEGIN\n    DELETE FROM system_logs \n    WHERE created_at < NOW() - INTERVAL '30 days'\n    AND severity NOT IN ('ERROR', 'CRITICAL');\n    \n    GET DIAGNOSTICS deleted_count = ROW_COUNT;\n    \n    -- Log cleanup action (system operation - no user)\n    INSERT INTO system_logs (\n        log_type, \n        severity, \n        title,\n        description,\n        metadata,\n        created_at\n    ) VALUES (\n        'MAINTENANCE',\n        'INFO',\n        'Old logs cleaned up',\n        'System maintenance: Old log entries have been removed',\n        jsonb_build_object('deleted_count', deleted_count),\n        NOW()\n    );\nEND;\n$$ LANGUAGE plpgsql","-- =====================================================\n-- PERFORMANCE MONITORING\n-- =====================================================\n\n-- Table za performance metrics\nCREATE TABLE IF NOT EXISTS performance_metrics (\n    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n    metric_name VARCHAR(100) NOT NULL,\n    metric_value DECIMAL,\n    metric_unit VARCHAR(20),\n    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n    metadata JSONB\n)","-- Index za performance metrics\nCREATE INDEX IF NOT EXISTS idx_performance_metrics_name_time ON performance_metrics(metric_name, recorded_at DESC)","-- Function za recording performance metrics\nCREATE OR REPLACE FUNCTION record_performance_metric(\n    p_metric_name VARCHAR(100),\n    p_metric_value DECIMAL,\n    p_metric_unit VARCHAR(20) DEFAULT 'ms',\n    p_metadata JSONB DEFAULT '{}'\n)\nRETURNS void AS $$\nBEGIN\n    INSERT INTO performance_metrics (\n        metric_name,\n        metric_value,\n        metric_unit,\n        metadata,\n        recorded_at\n    ) VALUES (\n        p_metric_name,\n        p_metric_value,\n        p_metric_unit,\n        p_metadata,\n        NOW()\n    );\nEND;\n$$ LANGUAGE plpgsql","-- =====================================================\n-- SCHEDULED MAINTENANCE (za cron job)\n-- =====================================================\n\n-- Function za daily maintenance\nCREATE OR REPLACE FUNCTION daily_maintenance()\nRETURNS void AS $$\nBEGIN\n    -- Refresh materialized views\n    PERFORM refresh_performance_views();\n    \n    -- Cleanup old logs\n    PERFORM cleanup_old_logs();\n    \n    -- Analyze tables for better query planning\n    ANALYZE trips;\n    ANALYZE expenses;\n    ANALYZE reservations;\n    ANALYZE reminders;\n    ANALYZE users;\n    ANALYZE vehicles;\n    \n    -- Log maintenance completion (system operation - no user)\n    INSERT INTO system_logs (\n        log_type, \n        severity, \n        title,\n        description,\n        metadata,\n        created_at\n    ) VALUES (\n        'MAINTENANCE',\n        'INFO',\n        'Daily maintenance completed',\n        'All daily maintenance tasks have been completed successfully',\n        '{\\"action\\": \\"daily_maintenance\\"}'::jsonb,\n        NOW()\n    );\nEND;\n$$ LANGUAGE plpgsql","-- =====================================================\n-- INITIAL DATA REFRESH\n-- =====================================================\n\n-- Refresh materialized views initially\nSELECT refresh_performance_views()","-- Record initial performance baseline\nSELECT record_performance_metric('migration_008_applied', 1, 'count', '{\\"version\\": \\"008\\", \\"type\\": \\"performance_optimization\\"}')","-- =====================================================\n-- COMMENTS\n-- =====================================================\n\nCOMMENT ON INDEX idx_trips_user_status IS 'Optimizacija za trips po user_id i status - HomeScreen active trip query'","COMMENT ON INDEX idx_expenses_user_created IS 'Optimizacija za expenses po user_id i datum - ExpensesScreen lista'","COMMENT ON INDEX idx_reservations_user_time IS 'Optimizacija za reservations po user_id i vremenu - ReservationsScreen'","COMMENT ON INDEX idx_reminders_user_due IS 'Optimizacija za reminders po user_id i due_date - RemindersScreen'","COMMENT ON VIEW pending_reservations_optimized IS 'Optimizovani view za pending reservations - smanjuje broj JOIN-ova'","COMMENT ON VIEW active_trips_optimized IS 'Optimizovani view za active trips - HomeScreen performance'","COMMENT ON MATERIALIZED VIEW user_stats_mv IS 'Materialized view za user statistike - refresh manually ili cron job'","COMMENT ON FUNCTION refresh_performance_views() IS 'Function za refresh svih materialized views - pozivati iz cron job-a'","COMMENT ON FUNCTION cleanup_old_logs() IS 'Function za brisanje starih logova - maintenance'","COMMENT ON FUNCTION daily_maintenance() IS 'Function za daily maintenance tasks - pozivati iz cron job-a'","-- =====================================================\n-- SUCCESS MESSAGE\n-- =====================================================\n\nDO $$\nBEGIN\n    RAISE NOTICE '✅ Performance optimization migration 008 completed successfully!';\n    RAISE NOTICE '📊 Created % indexes for query optimization', (\n        SELECT COUNT(*) FROM pg_indexes \n        WHERE indexname LIKE 'idx_%' \n        AND schemaname = 'public'\n    );\n    RAISE NOTICE '🚀 Application performance should be significantly improved';\nEND $$"}	performance_optimization
20250624230510	{"-- =============================================\n-- FINAL MULTI-TENANT & ASSIGNMENTS SETUP\n-- =============================================\n-- Description: This single migration handles the complete setup for\n-- a multi-tenant architecture and fixes the missing vehicle_assignments table.\n\n-- =============================================\n-- 1. SUBSCRIPTIONS TABLE\n-- =============================================\nCREATE TABLE IF NOT EXISTS subscriptions (\n    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    plan_name VARCHAR(100) NOT NULL UNIQUE,\n    max_users INT NOT NULL DEFAULT 1,\n    max_vehicles INT NOT NULL DEFAULT 1,\n    price_monthly DECIMAL(10, 2) DEFAULT 0.00,\n    price_annual DECIMAL(10, 2) DEFAULT 0.00,\n    features JSONB,\n    created_at TIMESTAMPTZ DEFAULT NOW(),\n    updated_at TIMESTAMPTZ DEFAULT NOW()\n)","-- =============================================\n-- 2. VEHICLE_ASSIGNMENTS TABLE\n-- =============================================\n-- This table was missing from the main schema and is created here.\nCREATE TABLE IF NOT EXISTS vehicle_assignments (\n    assignment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,\n    vehicle_id UUID NOT NULL REFERENCES vehicles(vehicle_id) ON DELETE CASCADE,\n    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,\n    assignment_type VARCHAR(50),\n    start_date TIMESTAMPTZ NOT NULL,\n    end_date TIMESTAMPTZ,\n    notes TEXT,\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n)","-- =============================================\n-- 3. MODIFY COMPANIES TABLE\n-- =============================================\nALTER TABLE companies\n    ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(subscription_id),\n    ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES users(user_id) ON DELETE SET NULL,\n    DROP COLUMN IF EXISTS subscription_plan","-- =============================================\n-- 4. ENSURE company_id IN ALL RELEVANT TABLES\n-- =============================================\nALTER TABLE trips ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE reservations ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE expenses ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE reminders ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE pois ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE standard_routes ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE","-- =============================================\n-- 5. SEED INITIAL SUBSCRIPTION PLANS\n-- =============================================\nINSERT INTO subscriptions (plan_name, max_users, max_vehicles, price_monthly, price_annual, features)\nVALUES\n    ('Free', 1, 1, 0.00, 0.00, '[\\"BASIC_REPORTS\\"]'),\n    ('Basic', 10, 10, 49.00, 499.00, '[\\"BASIC_REPORTS\\", \\"ROUTE_OPTIMIZATION\\"]'),\n    ('Pro', 50, 50, 199.00, 1999.00, '[\\"ADVANCED_REPORTS\\", \\"ROUTE_OPTIMIZATION\\", \\"API_ACCESS\\"]'),\n    ('Enterprise', 1000, 1000, 999.00, 9999.00, '[\\"ALL_FEATURES\\", \\"DEDICATED_SUPPORT\\"]')\nON CONFLICT (plan_name) DO NOTHING"}	final_multi_tenant_and_assignments_setup
20250624234147	{"CREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS trigger\nLANGUAGE plpgsql\nSECURITY DEFINER SET search_path = public\nAS $$\nBEGIN\n  INSERT INTO public.users (user_id, email, first_name, last_name, avatar_url, username, password_hash)\n  VALUES (\n    new.id,\n    new.email,\n    new.raw_user_meta_data ->> 'first_name',\n    new.raw_user_meta_data ->> 'last_name',\n    new.raw_user_meta_data ->> 'avatar_url',\n    new.email, -- Use email as default username\n    'initial_hash_placeholder' -- Provide a placeholder value\n  );\n  RETURN new;\nEND;\n$$"}	fix_handle_new_user_trigger
20250626120000	{"ALTER TABLE public.users ALTER COLUMN first_name DROP NOT NULL","ALTER TABLE public.users ALTER COLUMN last_name DROP NOT NULL"}	fix_user_table_constraints
20250626130000	{"-- First, drop the existing trigger and function to avoid any conflicts.\nDROP TRIGGER IF EXISTS on_auth_user_created ON auth.users","DROP FUNCTION IF EXISTS public.handle_new_user()","-- Create a new, more robust function.\nCREATE OR REPLACE FUNCTION public.handle_new_user()\nRETURNS TRIGGER AS $$\nBEGIN\n  -- Insert essential data, and provide default empty strings for names\n  -- to avoid any potential issues with NULL values, even in nullable columns.\n  INSERT INTO public.users (user_id, email, first_name, last_name)\n  VALUES (\n    NEW.id, \n    NEW.email,\n    COALESCE(NEW.raw_user_meta_data->>'first_name', ''), -- Use metadata if present, otherwise empty string\n    COALESCE(NEW.raw_user_meta_data->>'last_name', '')   -- Use metadata if present, otherwise empty string\n  );\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql SECURITY DEFINER","-- Recreate the trigger to use the new, robust function.\nCREATE TRIGGER on_auth_user_created\n  AFTER INSERT ON auth.users\n  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()","-- Add a log to confirm the migration ran.\nCOMMENT ON FUNCTION public.handle_new_user() IS 'Robust version - inserts user_id, email, and defaults names to empty strings.'"}	simplify_handle_new_user_trigger
20250626200000	{"-- Drop existing, potentially incorrect policies on public.users\nDROP POLICY IF EXISTS \\"Allow authenticated users to manage users\\" ON public.users","DROP POLICY IF EXISTS \\"Allow public read-only access to users\\" ON public.users","DROP POLICY IF EXISTS \\"Allow anon users to manage users\\" ON public.users","-- POLICY: Enable read access for all authenticated users to their own user record\nCREATE POLICY \\"Enable read access for authenticated users to their own data\\"\nON public.users FOR SELECT\nUSING (auth.uid() = user_id)","-- POLICY: Enable update access for users to their own user record\n-- This is the key policy that allows users to edit their own profile.\nCREATE POLICY \\"Enable update for users to their own data\\"\nON public.users FOR UPDATE\nUSING (auth.uid() = user_id)\nWITH CHECK (auth.uid() = user_id)","-- Note: We are deliberately not creating an INSERT policy for public.users here.\n-- The `handle_new_user` trigger is responsible for creating a new user record\n-- in public.users when a new user signs up in auth.users. This is a security measure.\n\n-- Note: We are deliberately not creating a DELETE policy.\n-- Deleting users should be a protected admin action, not something a user can do to themselves."}	fix_users_rls_policy
20250626210000	{"-- First, drop all existing policies on public.users to ensure a clean slate.\nDROP POLICY IF EXISTS \\"Enable read access for authenticated users to their own data\\" ON public.users","DROP POLICY IF EXISTS \\"Enable update for users to their own data\\" ON public.users","DROP POLICY IF EXISTS \\"Users can insert users\\" ON public.users","DROP POLICY IF EXISTS \\"Users can update own profile\\" ON public.users","DROP POLICY IF EXISTS \\"Users can update users\\" ON public.users","DROP POLICY IF EXISTS \\"Users can view all users\\" ON public.users","DROP POLICY IF EXISTS \\"Users can view own profile\\" ON public.users","-- POLICY: Enable every authenticated user to read their own user record.\nCREATE POLICY \\"Enable read for users based on user_id\\"\nON public.users FOR SELECT\nUSING (auth.uid() = user_id)","-- POLICY: Enable users to update their own user record.\n-- This is the key policy that allows users to edit their own profile.\nCREATE POLICY \\"Enable update for users based on user_id\\"\nON public.users FOR UPDATE\nUSING (auth.uid() = user_id)\nWITH CHECK (auth.uid() = user_id)","-- Note: INSERT is handled by the `handle_new_user` trigger.\n-- Note: DELETE is a protected admin-only action."}	cleanup_users_rls
\.


--
-- Data for Name: seed_files; Type: TABLE DATA; Schema: supabase_migrations; Owner: postgres
--

COPY supabase_migrations.seed_files (path, hash) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: backup_data backup_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backup_data
    ADD CONSTRAINT backup_data_pkey PRIMARY KEY (backup_data_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (company_id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: expense_categories expense_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_categories
    ADD CONSTRAINT expense_categories_pkey PRIMARY KEY (expense_category_id);


--
-- Name: expense_receipts expense_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_pkey PRIMARY KEY (receipt_id);


--
-- Name: expenses expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_pkey PRIMARY KEY (expense_id);


--
-- Name: fuel_prices fuel_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_prices
    ADD CONSTRAINT fuel_prices_pkey PRIMARY KEY (price_id);


--
-- Name: fuel_types fuel_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_types
    ADD CONSTRAINT fuel_types_pkey PRIMARY KEY (fuel_type_id);


--
-- Name: performance_metrics performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_metrics
    ADD CONSTRAINT performance_metrics_pkey PRIMARY KEY (metric_id);


--
-- Name: permissions permissions_permission_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_name_key UNIQUE (permission_name);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (permission_id);


--
-- Name: pois pois_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pois
    ADD CONSTRAINT pois_pkey PRIMARY KEY (poi_id);


--
-- Name: reminder_types reminder_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminder_types
    ADD CONSTRAINT reminder_types_pkey PRIMARY KEY (reminder_type_id);


--
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (reminder_id);


--
-- Name: reservation_status reservation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_status
    ADD CONSTRAINT reservation_status_pkey PRIMARY KEY (reservation_status_id);


--
-- Name: reservation_status reservation_status_status_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservation_status
    ADD CONSTRAINT reservation_status_status_name_key UNIQUE (status_name);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservation_id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);


--
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- Name: standard_routes standard_routes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_routes
    ADD CONSTRAINT standard_routes_pkey PRIMARY KEY (route_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (subscription_id);


--
-- Name: subscriptions subscriptions_plan_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_plan_name_key UNIQUE (plan_name);


--
-- Name: system_logs system_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_pkey PRIMARY KEY (log_id);


--
-- Name: trip_purposes trip_purposes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_purposes
    ADD CONSTRAINT trip_purposes_pkey PRIMARY KEY (trip_purpose_id);


--
-- Name: trip_types trip_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_types
    ADD CONSTRAINT trip_types_pkey PRIMARY KEY (trip_type_id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (trip_id);


--
-- Name: user_backups user_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_backups
    ADD CONSTRAINT user_backups_pkey PRIMARY KEY (backup_id);


--
-- Name: user_requests user_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_requests
    ADD CONSTRAINT user_requests_pkey PRIMARY KEY (request_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: vehicle_assignments vehicle_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_pkey PRIMARY KEY (assignment_id);


--
-- Name: vehicle_status vehicle_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_status
    ADD CONSTRAINT vehicle_status_pkey PRIMARY KEY (vehicle_status_id);


--
-- Name: vehicle_types vehicle_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_types
    ADD CONSTRAINT vehicle_types_pkey PRIMARY KEY (vehicle_type_id);


--
-- Name: vehicles vehicles_license_plate_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_license_plate_key UNIQUE (license_plate);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (vehicle_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: seed_files seed_files_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.seed_files
    ADD CONSTRAINT seed_files_pkey PRIMARY KEY (path);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: idx_backup_data_backup_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_backup_data_backup_id ON public.backup_data USING btree (backup_id);


--
-- Name: idx_backup_data_table_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_backup_data_table_name ON public.backup_data USING btree (table_name);


--
-- Name: idx_expenses_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_category ON public.expenses USING btree (expense_category_id);


--
-- Name: idx_expenses_trip_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_trip_id ON public.expenses USING btree (trip_id);


--
-- Name: idx_expenses_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_user_created ON public.expenses USING btree (user_id, created_at DESC);


--
-- Name: INDEX idx_expenses_user_created; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.idx_expenses_user_created IS 'Optimizacija za expenses po user_id i datum - ExpensesScreen lista';


--
-- Name: idx_expenses_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_user_id ON public.expenses USING btree (user_id);


--
-- Name: idx_expenses_vehicle_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_vehicle_date ON public.expenses USING btree (vehicle_id, expense_date);


--
-- Name: idx_expenses_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expenses_vehicle_id ON public.expenses USING btree (vehicle_id);


--
-- Name: idx_performance_metrics_name_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_performance_metrics_name_time ON public.performance_metrics USING btree (metric_name, recorded_at DESC);


--
-- Name: idx_pois_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pois_location ON public.pois USING btree (latitude, longitude);


--
-- Name: idx_reminders_completed; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminders_completed ON public.reminders USING btree (is_completed, due_date);


--
-- Name: idx_reminders_user_due; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reminders_user_due ON public.reminders USING btree (user_id, due_date);


--
-- Name: INDEX idx_reminders_user_due; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.idx_reminders_user_due IS 'Optimizacija za reminders po user_id i due_date - RemindersScreen';


--
-- Name: idx_reservations_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_start_time ON public.reservations USING btree (start_time);


--
-- Name: idx_reservations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_status ON public.reservations USING btree (status_id);


--
-- Name: idx_reservations_status_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_status_id ON public.reservations USING btree (status_id);


--
-- Name: idx_reservations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user_id ON public.reservations USING btree (user_id);


--
-- Name: idx_reservations_user_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_user_time ON public.reservations USING btree (user_id, start_time);


--
-- Name: INDEX idx_reservations_user_time; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.idx_reservations_user_time IS 'Optimizacija za reservations po user_id i vremenu - ReservationsScreen';


--
-- Name: idx_reservations_vehicle; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_vehicle ON public.reservations USING btree (vehicle_id);


--
-- Name: idx_reservations_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reservations_vehicle_id ON public.reservations USING btree (vehicle_id);


--
-- Name: idx_system_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_logs_created_at ON public.system_logs USING btree (created_at);


--
-- Name: idx_system_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_system_logs_user_id ON public.system_logs USING btree (user_id);


--
-- Name: idx_trips_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_created_at ON public.trips USING btree (created_at DESC);


--
-- Name: idx_trips_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_start_time ON public.trips USING btree (start_time);


--
-- Name: idx_trips_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_status ON public.trips USING btree (status);


--
-- Name: idx_trips_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_user_id ON public.trips USING btree (user_id);


--
-- Name: idx_trips_user_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_user_status ON public.trips USING btree (user_id, status);


--
-- Name: INDEX idx_trips_user_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON INDEX public.idx_trips_user_status IS 'Optimizacija za trips po user_id i status - HomeScreen active trip query';


--
-- Name: idx_trips_vehicle_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trips_vehicle_id ON public.trips USING btree (vehicle_id);


--
-- Name: idx_user_backups_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_backups_created_at ON public.user_backups USING btree (created_at);


--
-- Name: idx_user_backups_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_backups_user_id ON public.user_backups USING btree (user_id);


--
-- Name: idx_user_stats_mv_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_user_stats_mv_user_id ON public.user_stats_mv USING btree (user_id);


--
-- Name: idx_users_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_active ON public.users USING btree (is_active);


--
-- Name: idx_users_company; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_company ON public.users USING btree (company_id);


--
-- Name: idx_users_company_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_company_id ON public.users USING btree (company_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_vehicles_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_status ON public.vehicles USING btree (vehicle_status_id);


--
-- Name: idx_vehicles_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehicles_type ON public.vehicles USING btree (vehicle_type_id);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: companies update_companies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: departments update_departments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: expenses update_expenses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: pois update_pois_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_pois_updated_at BEFORE UPDATE ON public.pois FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reminders update_reminders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reservations update_reservations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: standard_routes update_standard_routes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_standard_routes_updated_at BEFORE UPDATE ON public.standard_routes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: system_logs update_system_logs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_system_logs_updated_at BEFORE UPDATE ON public.system_logs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: trips update_trips_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: user_backups update_user_backups_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_backups_updated_at BEFORE UPDATE ON public.user_backups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: vehicles update_vehicles_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: backup_data backup_data_backup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.backup_data
    ADD CONSTRAINT backup_data_backup_id_fkey FOREIGN KEY (backup_id) REFERENCES public.user_backups(backup_id) ON DELETE CASCADE;


--
-- Name: companies companies_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: companies companies_subscription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_subscription_id_fkey FOREIGN KEY (subscription_id) REFERENCES public.subscriptions(subscription_id);


--
-- Name: departments departments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: departments departments_parent_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) REFERENCES public.departments(department_id);


--
-- Name: expense_receipts expense_receipts_expense_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_expense_id_fkey FOREIGN KEY (expense_id) REFERENCES public.expenses(expense_id) ON DELETE CASCADE;


--
-- Name: expense_receipts expense_receipts_uploaded_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expense_receipts
    ADD CONSTRAINT expense_receipts_uploaded_by_user_id_fkey FOREIGN KEY (uploaded_by_user_id) REFERENCES public.users(user_id);


--
-- Name: expenses expenses_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(user_id);


--
-- Name: expenses expenses_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: expenses expenses_expense_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_expense_category_id_fkey FOREIGN KEY (expense_category_id) REFERENCES public.expense_categories(expense_category_id);


--
-- Name: expenses expenses_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(trip_id);


--
-- Name: expenses expenses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: expenses expenses_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT expenses_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: fuel_prices fuel_prices_fuel_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_prices
    ADD CONSTRAINT fuel_prices_fuel_type_id_fkey FOREIGN KEY (fuel_type_id) REFERENCES public.fuel_types(fuel_type_id);


--
-- Name: pois pois_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pois
    ADD CONSTRAINT pois_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: reminders reminders_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: reminders reminders_parent_reminder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_parent_reminder_id_fkey FOREIGN KEY (parent_reminder_id) REFERENCES public.reminders(reminder_id);


--
-- Name: reminders reminders_reminder_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_reminder_type_id_fkey FOREIGN KEY (reminder_type_id) REFERENCES public.reminder_types(reminder_type_id);


--
-- Name: reminders reminders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: reminders reminders_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: reservations reservations_actual_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_actual_vehicle_id_fkey FOREIGN KEY (actual_vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: reservations reservations_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(user_id);


--
-- Name: reservations reservations_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: reservations reservations_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.reservation_status(reservation_status_id);


--
-- Name: reservations reservations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: reservations reservations_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: reservations reservations_vehicle_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_vehicle_type_id_fkey FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(vehicle_type_id);


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(permission_id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: standard_routes standard_routes_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_routes
    ADD CONSTRAINT standard_routes_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: standard_routes standard_routes_end_poi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_routes
    ADD CONSTRAINT standard_routes_end_poi_id_fkey FOREIGN KEY (end_poi_id) REFERENCES public.pois(poi_id);


--
-- Name: standard_routes standard_routes_start_poi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.standard_routes
    ADD CONSTRAINT standard_routes_start_poi_id_fkey FOREIGN KEY (start_poi_id) REFERENCES public.pois(poi_id);


--
-- Name: system_logs system_logs_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: system_logs system_logs_related_expense_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_related_expense_id_fkey FOREIGN KEY (related_expense_id) REFERENCES public.expenses(expense_id);


--
-- Name: system_logs system_logs_related_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_related_trip_id_fkey FOREIGN KEY (related_trip_id) REFERENCES public.trips(trip_id);


--
-- Name: system_logs system_logs_related_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_related_vehicle_id_fkey FOREIGN KEY (related_vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: system_logs system_logs_resolved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_resolved_by_user_id_fkey FOREIGN KEY (resolved_by_user_id) REFERENCES public.users(user_id);


--
-- Name: system_logs system_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_logs
    ADD CONSTRAINT system_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: trips trips_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: trips trips_trip_purpose_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_trip_purpose_id_fkey FOREIGN KEY (trip_purpose_id) REFERENCES public.trip_purposes(trip_purpose_id);


--
-- Name: trips trips_trip_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_trip_type_id_fkey FOREIGN KEY (trip_type_id) REFERENCES public.trip_types(trip_type_id);


--
-- Name: trips trips_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: trips trips_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id);


--
-- Name: user_backups user_backups_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_backups
    ADD CONSTRAINT user_backups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_requests user_requests_approved_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_requests
    ADD CONSTRAINT user_requests_approved_by_user_id_fkey FOREIGN KEY (approved_by_user_id) REFERENCES public.users(user_id);


--
-- Name: user_requests user_requests_requested_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_requests
    ADD CONSTRAINT user_requests_requested_by_user_id_fkey FOREIGN KEY (requested_by_user_id) REFERENCES public.users(user_id);


--
-- Name: user_requests user_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_requests
    ADD CONSTRAINT user_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: user_roles user_roles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(role_id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: users users_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: vehicle_assignments vehicle_assignments_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id) ON DELETE CASCADE;


--
-- Name: vehicle_assignments vehicle_assignments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: vehicle_assignments vehicle_assignments_vehicle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicle_assignments
    ADD CONSTRAINT vehicle_assignments_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(vehicle_id) ON DELETE CASCADE;


--
-- Name: vehicles vehicles_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id);


--
-- Name: vehicles vehicles_fuel_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_fuel_type_id_fkey FOREIGN KEY (fuel_type_id) REFERENCES public.fuel_types(fuel_type_id);


--
-- Name: vehicles vehicles_private_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_private_owner_id_fkey FOREIGN KEY (private_owner_id) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: vehicles vehicles_vehicle_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vehicle_status_id_fkey FOREIGN KEY (vehicle_status_id) REFERENCES public.vehicle_status(vehicle_status_id);


--
-- Name: vehicles vehicles_vehicle_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vehicle_type_id_fkey FOREIGN KEY (vehicle_type_id) REFERENCES public.vehicle_types(vehicle_type_id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: companies Allow authenticated users to insert companies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to insert companies" ON public.companies FOR INSERT TO authenticated WITH CHECK (true);


--
-- Name: companies Allow authenticated users to read companies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow authenticated users to read companies" ON public.companies FOR SELECT TO authenticated USING (true);


--
-- Name: companies Allow service role full access to companies; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow service role full access to companies" ON public.companies TO service_role USING (true) WITH CHECK (true);


--
-- Name: companies Allow users to update their company; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow users to update their company" ON public.companies FOR UPDATE TO authenticated USING ((company_id IN ( SELECT u.company_id
   FROM public.users u
  WHERE (u.user_id = auth.uid())))) WITH CHECK ((company_id IN ( SELECT u.company_id
   FROM public.users u
  WHERE (u.user_id = auth.uid()))));


--
-- Name: expense_categories Anyone can view expense categories; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view expense categories" ON public.expense_categories FOR SELECT USING (true);


--
-- Name: fuel_types Anyone can view fuel types; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view fuel types" ON public.fuel_types FOR SELECT USING (true);


--
-- Name: pois Anyone can view pois; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view pois" ON public.pois FOR SELECT USING (true);


--
-- Name: reservation_status Anyone can view reservation status; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view reservation status" ON public.reservation_status FOR SELECT USING (true);


--
-- Name: standard_routes Anyone can view standard routes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view standard routes" ON public.standard_routes FOR SELECT USING (true);


--
-- Name: trip_purposes Anyone can view trip purposes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view trip purposes" ON public.trip_purposes FOR SELECT USING (true);


--
-- Name: trip_types Anyone can view trip types; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view trip types" ON public.trip_types FOR SELECT USING (true);


--
-- Name: vehicle_types Anyone can view vehicle types; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view vehicle types" ON public.vehicle_types FOR SELECT USING (true);


--
-- Name: vehicles Anyone can view vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Anyone can view vehicles" ON public.vehicles FOR SELECT USING (true);


--
-- Name: users Enable read for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable read for users based on user_id" ON public.users FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: users Enable update for users based on user_id; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Enable update for users based on user_id" ON public.users FOR UPDATE USING ((auth.uid() = user_id)) WITH CHECK ((auth.uid() = user_id));


--
-- Name: backup_data Users can create own backup data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own backup data" ON public.backup_data FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.user_backups ub
  WHERE ((ub.backup_id = backup_data.backup_id) AND (ub.user_id = auth.uid())))));


--
-- Name: user_backups Users can create own backups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own backups" ON public.user_backups FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: expenses Users can create own expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own expenses" ON public.expenses FOR INSERT WITH CHECK (((auth.uid())::text = (user_id)::text));


--
-- Name: reminders Users can create own reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own reminders" ON public.reminders FOR INSERT WITH CHECK (((auth.uid())::text = (user_id)::text));


--
-- Name: reservations Users can create own reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own reservations" ON public.reservations FOR INSERT WITH CHECK (((auth.uid())::text = (user_id)::text));


--
-- Name: trips Users can create own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can create own trips" ON public.trips FOR INSERT WITH CHECK (((auth.uid())::text = (user_id)::text));


--
-- Name: expenses Users can delete expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete expenses" ON public.expenses FOR DELETE USING (true);


--
-- Name: backup_data Users can delete own backup data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own backup data" ON public.backup_data FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.user_backups ub
  WHERE ((ub.backup_id = backup_data.backup_id) AND (ub.user_id = auth.uid())))));


--
-- Name: user_backups Users can delete own backups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete own backups" ON public.user_backups FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: reminders Users can delete reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete reminders" ON public.reminders FOR DELETE USING (true);


--
-- Name: reservations Users can delete reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete reservations" ON public.reservations FOR DELETE USING (true);


--
-- Name: trips Users can delete trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete trips" ON public.trips FOR DELETE USING (true);


--
-- Name: vehicles Users can delete vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can delete vehicles" ON public.vehicles FOR DELETE USING (true);


--
-- Name: expenses Users can insert expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert expenses" ON public.expenses FOR INSERT WITH CHECK (true);


--
-- Name: reminders Users can insert reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert reminders" ON public.reminders FOR INSERT WITH CHECK (true);


--
-- Name: reservations Users can insert reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);


--
-- Name: trips Users can insert trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert trips" ON public.trips FOR INSERT WITH CHECK (true);


--
-- Name: vehicles Users can insert vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (true);


--
-- Name: expenses Users can update expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update expenses" ON public.expenses FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: user_backups Users can update own backups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own backups" ON public.user_backups FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: trips Users can update own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (((auth.uid())::text = (user_id)::text));


--
-- Name: reminders Users can update reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update reminders" ON public.reminders FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: reservations Users can update reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update reservations" ON public.reservations FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: trips Users can update trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update trips" ON public.trips FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: vehicles Users can update vehicles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update vehicles" ON public.vehicles FOR UPDATE USING (true) WITH CHECK (true);


--
-- Name: expenses Users can view all expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view all expenses" ON public.expenses FOR SELECT USING (true);


--
-- Name: reminders Users can view all reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view all reminders" ON public.reminders FOR SELECT USING (true);


--
-- Name: reservations Users can view all reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view all reservations" ON public.reservations FOR SELECT USING (true);


--
-- Name: trips Users can view all trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view all trips" ON public.trips FOR SELECT USING (true);


--
-- Name: backup_data Users can view own backup data; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own backup data" ON public.backup_data FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.user_backups ub
  WHERE ((ub.backup_id = backup_data.backup_id) AND (ub.user_id = auth.uid())))));


--
-- Name: user_backups Users can view own backups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own backups" ON public.user_backups FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: expenses Users can view own expenses; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (((auth.uid())::text = (user_id)::text));


--
-- Name: reminders Users can view own reminders; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own reminders" ON public.reminders FOR SELECT USING (((auth.uid())::text = (user_id)::text));


--
-- Name: reservations Users can view own reservations; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own reservations" ON public.reservations FOR SELECT USING (((auth.uid())::text = (user_id)::text));


--
-- Name: trips Users can view own trips; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own trips" ON public.trips FOR SELECT USING (((auth.uid())::text = (user_id)::text));


--
-- Name: backup_data; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.backup_data ENABLE ROW LEVEL SECURITY;

--
-- Name: companies; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

--
-- Name: departments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

--
-- Name: expenses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

--
-- Name: pois; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

--
-- Name: reminders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

--
-- Name: reservations; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

--
-- Name: standard_routes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.standard_routes ENABLE ROW LEVEL SECURITY;

--
-- Name: system_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: trips; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

--
-- Name: user_backups; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_backups ENABLE ROW LEVEL SECURITY;

--
-- Name: user_requests; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: vehicles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: objects Anyone can update own avatar; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Anyone can update own avatar" ON storage.objects FOR UPDATE USING ((bucket_id = 'avatars'::text));


--
-- Name: objects Anyone can upload an avatar; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT WITH CHECK ((bucket_id = 'avatars'::text));


--
-- Name: objects Avatar images are publicly accessible; Type: POLICY; Schema: storage; Owner: supabase_storage_admin
--

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING ((bucket_id = 'avatars'::text));


--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- Name: FUNCTION box2d_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2d_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.box2d_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.box2d_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.box2d_in(cstring) TO service_role;


--
-- Name: FUNCTION box2d_out(public.box2d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2d_out(public.box2d) TO postgres;
GRANT ALL ON FUNCTION public.box2d_out(public.box2d) TO anon;
GRANT ALL ON FUNCTION public.box2d_out(public.box2d) TO authenticated;
GRANT ALL ON FUNCTION public.box2d_out(public.box2d) TO service_role;


--
-- Name: FUNCTION box2df_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2df_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.box2df_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.box2df_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.box2df_in(cstring) TO service_role;


--
-- Name: FUNCTION box2df_out(public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2df_out(public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.box2df_out(public.box2df) TO anon;
GRANT ALL ON FUNCTION public.box2df_out(public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.box2df_out(public.box2df) TO service_role;


--
-- Name: FUNCTION box3d_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box3d_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.box3d_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.box3d_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.box3d_in(cstring) TO service_role;


--
-- Name: FUNCTION box3d_out(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box3d_out(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.box3d_out(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.box3d_out(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.box3d_out(public.box3d) TO service_role;


--
-- Name: FUNCTION geography_analyze(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_analyze(internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_analyze(internal) TO anon;
GRANT ALL ON FUNCTION public.geography_analyze(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_analyze(internal) TO service_role;


--
-- Name: FUNCTION geography_in(cstring, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_in(cstring, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.geography_in(cstring, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.geography_in(cstring, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geography_in(cstring, oid, integer) TO service_role;


--
-- Name: FUNCTION geography_out(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_out(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_out(public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_out(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_out(public.geography) TO service_role;


--
-- Name: FUNCTION geography_recv(internal, oid, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_recv(internal, oid, integer) TO postgres;
GRANT ALL ON FUNCTION public.geography_recv(internal, oid, integer) TO anon;
GRANT ALL ON FUNCTION public.geography_recv(internal, oid, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geography_recv(internal, oid, integer) TO service_role;


--
-- Name: FUNCTION geography_send(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_send(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_send(public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_send(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_send(public.geography) TO service_role;


--
-- Name: FUNCTION geography_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_typmod_in(cstring[]) TO postgres;
GRANT ALL ON FUNCTION public.geography_typmod_in(cstring[]) TO anon;
GRANT ALL ON FUNCTION public.geography_typmod_in(cstring[]) TO authenticated;
GRANT ALL ON FUNCTION public.geography_typmod_in(cstring[]) TO service_role;


--
-- Name: FUNCTION geography_typmod_out(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_typmod_out(integer) TO postgres;
GRANT ALL ON FUNCTION public.geography_typmod_out(integer) TO anon;
GRANT ALL ON FUNCTION public.geography_typmod_out(integer) TO authenticated;
GRANT ALL ON FUNCTION public.geography_typmod_out(integer) TO service_role;


--
-- Name: FUNCTION geometry_analyze(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_analyze(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_analyze(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_analyze(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_analyze(internal) TO service_role;


--
-- Name: FUNCTION geometry_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.geometry_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.geometry_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_in(cstring) TO service_role;


--
-- Name: FUNCTION geometry_out(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_out(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_out(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_out(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_out(public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_recv(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_recv(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_recv(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_recv(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_recv(internal) TO service_role;


--
-- Name: FUNCTION geometry_send(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_send(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_send(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_send(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_send(public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_typmod_in(cstring[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_typmod_in(cstring[]) TO postgres;
GRANT ALL ON FUNCTION public.geometry_typmod_in(cstring[]) TO anon;
GRANT ALL ON FUNCTION public.geometry_typmod_in(cstring[]) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_typmod_in(cstring[]) TO service_role;


--
-- Name: FUNCTION geometry_typmod_out(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_typmod_out(integer) TO postgres;
GRANT ALL ON FUNCTION public.geometry_typmod_out(integer) TO anon;
GRANT ALL ON FUNCTION public.geometry_typmod_out(integer) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_typmod_out(integer) TO service_role;


--
-- Name: FUNCTION gidx_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gidx_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.gidx_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.gidx_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.gidx_in(cstring) TO service_role;


--
-- Name: FUNCTION gidx_out(public.gidx); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gidx_out(public.gidx) TO postgres;
GRANT ALL ON FUNCTION public.gidx_out(public.gidx) TO anon;
GRANT ALL ON FUNCTION public.gidx_out(public.gidx) TO authenticated;
GRANT ALL ON FUNCTION public.gidx_out(public.gidx) TO service_role;


--
-- Name: FUNCTION spheroid_in(cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.spheroid_in(cstring) TO postgres;
GRANT ALL ON FUNCTION public.spheroid_in(cstring) TO anon;
GRANT ALL ON FUNCTION public.spheroid_in(cstring) TO authenticated;
GRANT ALL ON FUNCTION public.spheroid_in(cstring) TO service_role;


--
-- Name: FUNCTION spheroid_out(public.spheroid); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.spheroid_out(public.spheroid) TO postgres;
GRANT ALL ON FUNCTION public.spheroid_out(public.spheroid) TO anon;
GRANT ALL ON FUNCTION public.spheroid_out(public.spheroid) TO authenticated;
GRANT ALL ON FUNCTION public.spheroid_out(public.spheroid) TO service_role;


--
-- Name: FUNCTION box3d(public.box2d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box3d(public.box2d) TO postgres;
GRANT ALL ON FUNCTION public.box3d(public.box2d) TO anon;
GRANT ALL ON FUNCTION public.box3d(public.box2d) TO authenticated;
GRANT ALL ON FUNCTION public.box3d(public.box2d) TO service_role;


--
-- Name: FUNCTION geometry(public.box2d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(public.box2d) TO postgres;
GRANT ALL ON FUNCTION public.geometry(public.box2d) TO anon;
GRANT ALL ON FUNCTION public.geometry(public.box2d) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(public.box2d) TO service_role;


--
-- Name: FUNCTION box(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.box(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.box(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.box(public.box3d) TO service_role;


--
-- Name: FUNCTION box2d(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2d(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.box2d(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.box2d(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.box2d(public.box3d) TO service_role;


--
-- Name: FUNCTION geometry(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.geometry(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.geometry(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(public.box3d) TO service_role;


--
-- Name: FUNCTION geography(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography(bytea) TO postgres;
GRANT ALL ON FUNCTION public.geography(bytea) TO anon;
GRANT ALL ON FUNCTION public.geography(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.geography(bytea) TO service_role;


--
-- Name: FUNCTION geometry(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(bytea) TO postgres;
GRANT ALL ON FUNCTION public.geometry(bytea) TO anon;
GRANT ALL ON FUNCTION public.geometry(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(bytea) TO service_role;


--
-- Name: FUNCTION bytea(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.bytea(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.bytea(public.geography) TO anon;
GRANT ALL ON FUNCTION public.bytea(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.bytea(public.geography) TO service_role;


--
-- Name: FUNCTION geography(public.geography, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography(public.geography, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.geography(public.geography, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.geography(public.geography, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.geography(public.geography, integer, boolean) TO service_role;


--
-- Name: FUNCTION geometry(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geometry(public.geography) TO anon;
GRANT ALL ON FUNCTION public.geometry(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(public.geography) TO service_role;


--
-- Name: FUNCTION box(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.box(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.box(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.box(public.geometry) TO service_role;


--
-- Name: FUNCTION box2d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box2d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.box2d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.box2d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.box2d(public.geometry) TO service_role;


--
-- Name: FUNCTION box3d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box3d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.box3d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.box3d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.box3d(public.geometry) TO service_role;


--
-- Name: FUNCTION bytea(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.bytea(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.bytea(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.bytea(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.bytea(public.geometry) TO service_role;


--
-- Name: FUNCTION geography(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geography(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geography(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geography(public.geometry) TO service_role;


--
-- Name: FUNCTION geometry(public.geometry, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(public.geometry, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.geometry(public.geometry, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.geometry(public.geometry, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(public.geometry, integer, boolean) TO service_role;


--
-- Name: FUNCTION "json"(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public."json"(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public."json"(public.geometry) TO anon;
GRANT ALL ON FUNCTION public."json"(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public."json"(public.geometry) TO service_role;


--
-- Name: FUNCTION jsonb(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.jsonb(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.jsonb(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.jsonb(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.jsonb(public.geometry) TO service_role;


--
-- Name: FUNCTION path(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.path(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.path(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.path(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.path(public.geometry) TO service_role;


--
-- Name: FUNCTION point(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.point(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.point(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.point(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.point(public.geometry) TO service_role;


--
-- Name: FUNCTION polygon(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.polygon(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.polygon(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.polygon(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.polygon(public.geometry) TO service_role;


--
-- Name: FUNCTION text(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.text(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.text(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.text(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.text(public.geometry) TO service_role;


--
-- Name: FUNCTION geometry(path); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(path) TO postgres;
GRANT ALL ON FUNCTION public.geometry(path) TO anon;
GRANT ALL ON FUNCTION public.geometry(path) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(path) TO service_role;


--
-- Name: FUNCTION geometry(point); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(point) TO postgres;
GRANT ALL ON FUNCTION public.geometry(point) TO anon;
GRANT ALL ON FUNCTION public.geometry(point) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(point) TO service_role;


--
-- Name: FUNCTION geometry(polygon); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(polygon) TO postgres;
GRANT ALL ON FUNCTION public.geometry(polygon) TO anon;
GRANT ALL ON FUNCTION public.geometry(polygon) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(polygon) TO service_role;


--
-- Name: FUNCTION geometry(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry(text) TO postgres;
GRANT ALL ON FUNCTION public.geometry(text) TO anon;
GRANT ALL ON FUNCTION public.geometry(text) TO authenticated;
GRANT ALL ON FUNCTION public.geometry(text) TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;
GRANT ALL ON FUNCTION auth.email() TO postgres;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;
GRANT ALL ON FUNCTION auth.role() TO postgres;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;
GRANT ALL ON FUNCTION auth.uid() TO postgres;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO postgres;


--
-- Name: FUNCTION _postgis_deprecate(oldname text, newname text, version text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_deprecate(oldname text, newname text, version text) TO postgres;
GRANT ALL ON FUNCTION public._postgis_deprecate(oldname text, newname text, version text) TO anon;
GRANT ALL ON FUNCTION public._postgis_deprecate(oldname text, newname text, version text) TO authenticated;
GRANT ALL ON FUNCTION public._postgis_deprecate(oldname text, newname text, version text) TO service_role;


--
-- Name: FUNCTION _postgis_index_extent(tbl regclass, col text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_index_extent(tbl regclass, col text) TO postgres;
GRANT ALL ON FUNCTION public._postgis_index_extent(tbl regclass, col text) TO anon;
GRANT ALL ON FUNCTION public._postgis_index_extent(tbl regclass, col text) TO authenticated;
GRANT ALL ON FUNCTION public._postgis_index_extent(tbl regclass, col text) TO service_role;


--
-- Name: FUNCTION _postgis_join_selectivity(regclass, text, regclass, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_join_selectivity(regclass, text, regclass, text, text) TO postgres;
GRANT ALL ON FUNCTION public._postgis_join_selectivity(regclass, text, regclass, text, text) TO anon;
GRANT ALL ON FUNCTION public._postgis_join_selectivity(regclass, text, regclass, text, text) TO authenticated;
GRANT ALL ON FUNCTION public._postgis_join_selectivity(regclass, text, regclass, text, text) TO service_role;


--
-- Name: FUNCTION _postgis_pgsql_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_pgsql_version() TO postgres;
GRANT ALL ON FUNCTION public._postgis_pgsql_version() TO anon;
GRANT ALL ON FUNCTION public._postgis_pgsql_version() TO authenticated;
GRANT ALL ON FUNCTION public._postgis_pgsql_version() TO service_role;


--
-- Name: FUNCTION _postgis_scripts_pgsql_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_scripts_pgsql_version() TO postgres;
GRANT ALL ON FUNCTION public._postgis_scripts_pgsql_version() TO anon;
GRANT ALL ON FUNCTION public._postgis_scripts_pgsql_version() TO authenticated;
GRANT ALL ON FUNCTION public._postgis_scripts_pgsql_version() TO service_role;


--
-- Name: FUNCTION _postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text) TO postgres;
GRANT ALL ON FUNCTION public._postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text) TO anon;
GRANT ALL ON FUNCTION public._postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text) TO authenticated;
GRANT ALL ON FUNCTION public._postgis_selectivity(tbl regclass, att_name text, geom public.geometry, mode text) TO service_role;


--
-- Name: FUNCTION _postgis_stats(tbl regclass, att_name text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._postgis_stats(tbl regclass, att_name text, text) TO postgres;
GRANT ALL ON FUNCTION public._postgis_stats(tbl regclass, att_name text, text) TO anon;
GRANT ALL ON FUNCTION public._postgis_stats(tbl regclass, att_name text, text) TO authenticated;
GRANT ALL ON FUNCTION public._postgis_stats(tbl regclass, att_name text, text) TO service_role;


--
-- Name: FUNCTION _st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION _st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION _st_3dintersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_asgml(integer, public.geometry, integer, integer, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_asgml(integer, public.geometry, integer, integer, text, text) TO postgres;
GRANT ALL ON FUNCTION public._st_asgml(integer, public.geometry, integer, integer, text, text) TO anon;
GRANT ALL ON FUNCTION public._st_asgml(integer, public.geometry, integer, integer, text, text) TO authenticated;
GRANT ALL ON FUNCTION public._st_asgml(integer, public.geometry, integer, integer, text, text) TO service_role;


--
-- Name: FUNCTION _st_asx3d(integer, public.geometry, integer, integer, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_asx3d(integer, public.geometry, integer, integer, text) TO postgres;
GRANT ALL ON FUNCTION public._st_asx3d(integer, public.geometry, integer, integer, text) TO anon;
GRANT ALL ON FUNCTION public._st_asx3d(integer, public.geometry, integer, integer, text) TO authenticated;
GRANT ALL ON FUNCTION public._st_asx3d(integer, public.geometry, integer, integer, text) TO service_role;


--
-- Name: FUNCTION _st_bestsrid(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_bestsrid(public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography) TO service_role;


--
-- Name: FUNCTION _st_bestsrid(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_bestsrid(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_bestsrid(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION _st_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_contains(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_contains(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_contains(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_contains(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_containsproperly(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_coveredby(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_coveredby(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_coveredby(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_coveredby(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_coveredby(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION _st_coveredby(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_coveredby(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_coveredby(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_coveredby(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_coveredby(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_covers(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_covers(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_covers(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_covers(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_covers(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION _st_covers(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_covers(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_covers(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_covers(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_covers(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_crosses(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_crosses(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_crosses(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_crosses(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_crosses(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION _st_distancetree(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION _st_distancetree(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography, double precision, boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography, double precision, boolean) TO anon;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography, double precision, boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_distancetree(public.geography, public.geography, double precision, boolean) TO service_role;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, boolean) TO anon;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, boolean) TO service_role;


--
-- Name: FUNCTION _st_distanceuncached(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, double precision, boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, double precision, boolean) TO anon;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, double precision, boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_distanceuncached(public.geography, public.geography, double precision, boolean) TO service_role;


--
-- Name: FUNCTION _st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION _st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public._st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION _st_dwithinuncached(public.geography, public.geography, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision) TO service_role;


--
-- Name: FUNCTION _st_dwithinuncached(public.geography, public.geography, double precision, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision, boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision, boolean) TO anon;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision, boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_dwithinuncached(public.geography, public.geography, double precision, boolean) TO service_role;


--
-- Name: FUNCTION _st_equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_equals(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_equals(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_equals(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_equals(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_expand(public.geography, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_expand(public.geography, double precision) TO postgres;
GRANT ALL ON FUNCTION public._st_expand(public.geography, double precision) TO anon;
GRANT ALL ON FUNCTION public._st_expand(public.geography, double precision) TO authenticated;
GRANT ALL ON FUNCTION public._st_expand(public.geography, double precision) TO service_role;


--
-- Name: FUNCTION _st_geomfromgml(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_geomfromgml(text, integer) TO postgres;
GRANT ALL ON FUNCTION public._st_geomfromgml(text, integer) TO anon;
GRANT ALL ON FUNCTION public._st_geomfromgml(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public._st_geomfromgml(text, integer) TO service_role;


--
-- Name: FUNCTION _st_intersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_intersects(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_intersects(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_intersects(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_intersects(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_linecrossingdirection(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_longestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_longestline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_longestline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_longestline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_longestline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_maxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_orderingequals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_overlaps(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_overlaps(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_overlaps(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_overlaps(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_pointoutside(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_pointoutside(public.geography) TO postgres;
GRANT ALL ON FUNCTION public._st_pointoutside(public.geography) TO anon;
GRANT ALL ON FUNCTION public._st_pointoutside(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public._st_pointoutside(public.geography) TO service_role;


--
-- Name: FUNCTION _st_sortablehash(geom public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_sortablehash(geom public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_sortablehash(geom public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_sortablehash(geom public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_sortablehash(geom public.geometry) TO service_role;


--
-- Name: FUNCTION _st_touches(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_touches(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_touches(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_touches(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_touches(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION _st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean) TO postgres;
GRANT ALL ON FUNCTION public._st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean) TO anon;
GRANT ALL ON FUNCTION public._st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean) TO authenticated;
GRANT ALL ON FUNCTION public._st_voronoi(g1 public.geometry, clip public.geometry, tolerance double precision, return_polygons boolean) TO service_role;


--
-- Name: FUNCTION _st_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public._st_within(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public._st_within(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public._st_within(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public._st_within(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION addauth(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.addauth(text) TO postgres;
GRANT ALL ON FUNCTION public.addauth(text) TO anon;
GRANT ALL ON FUNCTION public.addauth(text) TO authenticated;
GRANT ALL ON FUNCTION public.addauth(text) TO service_role;


--
-- Name: FUNCTION addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO postgres;
GRANT ALL ON FUNCTION public.addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO anon;
GRANT ALL ON FUNCTION public.addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO authenticated;
GRANT ALL ON FUNCTION public.addgeometrycolumn(table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO service_role;


--
-- Name: FUNCTION addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO postgres;
GRANT ALL ON FUNCTION public.addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO anon;
GRANT ALL ON FUNCTION public.addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO authenticated;
GRANT ALL ON FUNCTION public.addgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying, new_srid integer, new_type character varying, new_dim integer, use_typmod boolean) TO service_role;


--
-- Name: FUNCTION addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean) TO postgres;
GRANT ALL ON FUNCTION public.addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean) TO anon;
GRANT ALL ON FUNCTION public.addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean) TO authenticated;
GRANT ALL ON FUNCTION public.addgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer, new_type character varying, new_dim integer, use_typmod boolean) TO service_role;


--
-- Name: FUNCTION box3dtobox(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.box3dtobox(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.box3dtobox(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.box3dtobox(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.box3dtobox(public.box3d) TO service_role;


--
-- Name: FUNCTION check_admin_user_status(admin_email text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_admin_user_status(admin_email text) TO anon;
GRANT ALL ON FUNCTION public.check_admin_user_status(admin_email text) TO authenticated;
GRANT ALL ON FUNCTION public.check_admin_user_status(admin_email text) TO service_role;


--
-- Name: FUNCTION check_vehicle_data(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_vehicle_data() TO anon;
GRANT ALL ON FUNCTION public.check_vehicle_data() TO authenticated;
GRANT ALL ON FUNCTION public.check_vehicle_data() TO service_role;


--
-- Name: FUNCTION checkauth(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.checkauth(text, text) TO postgres;
GRANT ALL ON FUNCTION public.checkauth(text, text) TO anon;
GRANT ALL ON FUNCTION public.checkauth(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.checkauth(text, text) TO service_role;


--
-- Name: FUNCTION checkauth(text, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.checkauth(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.checkauth(text, text, text) TO anon;
GRANT ALL ON FUNCTION public.checkauth(text, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.checkauth(text, text, text) TO service_role;


--
-- Name: FUNCTION checkauthtrigger(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.checkauthtrigger() TO postgres;
GRANT ALL ON FUNCTION public.checkauthtrigger() TO anon;
GRANT ALL ON FUNCTION public.checkauthtrigger() TO authenticated;
GRANT ALL ON FUNCTION public.checkauthtrigger() TO service_role;


--
-- Name: FUNCTION cleanup_old_backups(p_user_id uuid, p_keep_count integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_old_backups(p_user_id uuid, p_keep_count integer) TO anon;
GRANT ALL ON FUNCTION public.cleanup_old_backups(p_user_id uuid, p_keep_count integer) TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_old_backups(p_user_id uuid, p_keep_count integer) TO service_role;


--
-- Name: FUNCTION cleanup_old_logs(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.cleanup_old_logs() TO anon;
GRANT ALL ON FUNCTION public.cleanup_old_logs() TO authenticated;
GRANT ALL ON FUNCTION public.cleanup_old_logs() TO service_role;


--
-- Name: FUNCTION complete_admin_setup(admin_email text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.complete_admin_setup(admin_email text) TO anon;
GRANT ALL ON FUNCTION public.complete_admin_setup(admin_email text) TO authenticated;
GRANT ALL ON FUNCTION public.complete_admin_setup(admin_email text) TO service_role;


--
-- Name: FUNCTION contains_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.box2df) TO service_role;


--
-- Name: FUNCTION contains_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.contains_2d(public.box2df, public.geometry) TO service_role;


--
-- Name: FUNCTION contains_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.contains_2d(public.geometry, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.contains_2d(public.geometry, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.contains_2d(public.geometry, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.contains_2d(public.geometry, public.box2df) TO service_role;


--
-- Name: FUNCTION create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text) TO anon;
GRANT ALL ON FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text) TO authenticated;
GRANT ALL ON FUNCTION public.create_admin_user_safe(admin_email text, admin_password text, admin_first_name text, admin_last_name text) TO service_role;


--
-- Name: FUNCTION create_user_backup(p_backup_name text, p_backup_description text, p_is_automatic boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_user_backup(p_backup_name text, p_backup_description text, p_is_automatic boolean) TO anon;
GRANT ALL ON FUNCTION public.create_user_backup(p_backup_name text, p_backup_description text, p_is_automatic boolean) TO authenticated;
GRANT ALL ON FUNCTION public.create_user_backup(p_backup_name text, p_backup_description text, p_is_automatic boolean) TO service_role;


--
-- Name: FUNCTION daily_maintenance(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.daily_maintenance() TO anon;
GRANT ALL ON FUNCTION public.daily_maintenance() TO authenticated;
GRANT ALL ON FUNCTION public.daily_maintenance() TO service_role;


--
-- Name: FUNCTION disablelongtransactions(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.disablelongtransactions() TO postgres;
GRANT ALL ON FUNCTION public.disablelongtransactions() TO anon;
GRANT ALL ON FUNCTION public.disablelongtransactions() TO authenticated;
GRANT ALL ON FUNCTION public.disablelongtransactions() TO service_role;


--
-- Name: FUNCTION dropgeometrycolumn(table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(table_name character varying, column_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(table_name character varying, column_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(table_name character varying, column_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(table_name character varying, column_name character varying) TO service_role;


--
-- Name: FUNCTION dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(schema_name character varying, table_name character varying, column_name character varying) TO service_role;


--
-- Name: FUNCTION dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrycolumn(catalog_name character varying, schema_name character varying, table_name character varying, column_name character varying) TO service_role;


--
-- Name: FUNCTION dropgeometrytable(table_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrytable(table_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrytable(table_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrytable(table_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrytable(table_name character varying) TO service_role;


--
-- Name: FUNCTION dropgeometrytable(schema_name character varying, table_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrytable(schema_name character varying, table_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrytable(schema_name character varying, table_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrytable(schema_name character varying, table_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrytable(schema_name character varying, table_name character varying) TO service_role;


--
-- Name: FUNCTION dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying) TO postgres;
GRANT ALL ON FUNCTION public.dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying) TO anon;
GRANT ALL ON FUNCTION public.dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying) TO authenticated;
GRANT ALL ON FUNCTION public.dropgeometrytable(catalog_name character varying, schema_name character varying, table_name character varying) TO service_role;


--
-- Name: FUNCTION enablelongtransactions(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.enablelongtransactions() TO postgres;
GRANT ALL ON FUNCTION public.enablelongtransactions() TO anon;
GRANT ALL ON FUNCTION public.enablelongtransactions() TO authenticated;
GRANT ALL ON FUNCTION public.enablelongtransactions() TO service_role;


--
-- Name: FUNCTION equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.equals(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.equals(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.equals(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.equals(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION find_srid(character varying, character varying, character varying); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.find_srid(character varying, character varying, character varying) TO postgres;
GRANT ALL ON FUNCTION public.find_srid(character varying, character varying, character varying) TO anon;
GRANT ALL ON FUNCTION public.find_srid(character varying, character varying, character varying) TO authenticated;
GRANT ALL ON FUNCTION public.find_srid(character varying, character varying, character varying) TO service_role;


--
-- Name: FUNCTION geog_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geog_brin_inclusion_add_value(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geog_brin_inclusion_add_value(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geog_brin_inclusion_add_value(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geog_brin_inclusion_add_value(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geography_cmp(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_cmp(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_cmp(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_cmp(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_cmp(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_distance_knn(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_distance_knn(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_distance_knn(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_distance_knn(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_distance_knn(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_eq(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_eq(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_eq(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_eq(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_eq(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_ge(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_ge(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_ge(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_ge(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_ge(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_gist_compress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_compress(internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_compress(internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_compress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_compress(internal) TO service_role;


--
-- Name: FUNCTION geography_gist_consistent(internal, public.geography, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_consistent(internal, public.geography, integer) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_consistent(internal, public.geography, integer) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_consistent(internal, public.geography, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_consistent(internal, public.geography, integer) TO service_role;


--
-- Name: FUNCTION geography_gist_decompress(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_decompress(internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_decompress(internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_decompress(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_decompress(internal) TO service_role;


--
-- Name: FUNCTION geography_gist_distance(internal, public.geography, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_distance(internal, public.geography, integer) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_distance(internal, public.geography, integer) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_distance(internal, public.geography, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_distance(internal, public.geography, integer) TO service_role;


--
-- Name: FUNCTION geography_gist_penalty(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_penalty(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_penalty(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_penalty(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_penalty(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geography_gist_picksplit(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_picksplit(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_picksplit(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_picksplit(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_picksplit(internal, internal) TO service_role;


--
-- Name: FUNCTION geography_gist_same(public.box2d, public.box2d, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_same(public.box2d, public.box2d, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_same(public.box2d, public.box2d, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_same(public.box2d, public.box2d, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_same(public.box2d, public.box2d, internal) TO service_role;


--
-- Name: FUNCTION geography_gist_union(bytea, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gist_union(bytea, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_gist_union(bytea, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_gist_union(bytea, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gist_union(bytea, internal) TO service_role;


--
-- Name: FUNCTION geography_gt(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_gt(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_gt(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_gt(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_gt(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_le(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_le(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_le(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_le(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_le(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_lt(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_lt(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_lt(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_lt(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_lt(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_overlaps(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_overlaps(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geography_overlaps(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.geography_overlaps(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geography_overlaps(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION geography_spgist_choose_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_choose_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_choose_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_choose_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_choose_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geography_spgist_compress_nd(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_compress_nd(internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_compress_nd(internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_compress_nd(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_compress_nd(internal) TO service_role;


--
-- Name: FUNCTION geography_spgist_config_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_config_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_config_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_config_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_config_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geography_spgist_inner_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_inner_consistent_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_inner_consistent_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_inner_consistent_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_inner_consistent_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geography_spgist_leaf_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_leaf_consistent_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_leaf_consistent_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_leaf_consistent_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_leaf_consistent_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geography_spgist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geography_spgist_picksplit_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geography_spgist_picksplit_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geography_spgist_picksplit_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geography_spgist_picksplit_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geom2d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geom2d_brin_inclusion_add_value(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geom2d_brin_inclusion_add_value(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geom2d_brin_inclusion_add_value(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geom2d_brin_inclusion_add_value(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geom3d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geom3d_brin_inclusion_add_value(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geom3d_brin_inclusion_add_value(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geom3d_brin_inclusion_add_value(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geom3d_brin_inclusion_add_value(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geom4d_brin_inclusion_add_value(internal, internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geom4d_brin_inclusion_add_value(internal, internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geom4d_brin_inclusion_add_value(internal, internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geom4d_brin_inclusion_add_value(internal, internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geom4d_brin_inclusion_add_value(internal, internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_above(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_above(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_above(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_above(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_above(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_below(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_below(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_below(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_below(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_below(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_cmp(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_cmp(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_cmp(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_cmp(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_cmp(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_contained_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_contained_3d(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_contained_3d(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_contained_3d(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_contained_3d(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_contains(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_contains(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_contains(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_contains(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_contains_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_contains_3d(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_contains_3d(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_contains_3d(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_contains_3d(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_contains_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_contains_nd(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_contains_nd(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_contains_nd(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_contains_nd(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_distance_box(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_distance_box(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_distance_box(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_distance_box(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_distance_box(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_distance_centroid(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_distance_centroid_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_distance_centroid_nd(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_distance_centroid_nd(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_distance_centroid_nd(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_distance_centroid_nd(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_distance_cpa(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_distance_cpa(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_distance_cpa(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_distance_cpa(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_distance_cpa(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_eq(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_eq(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_eq(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_eq(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_eq(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_ge(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_ge(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_ge(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_ge(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_ge(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_gist_compress_2d(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_compress_2d(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_compress_2d(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_compress_2d(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_compress_2d(internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_compress_nd(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_compress_nd(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_compress_nd(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_compress_nd(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_compress_nd(internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_consistent_2d(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_consistent_2d(internal, public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_2d(internal, public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_2d(internal, public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_2d(internal, public.geometry, integer) TO service_role;


--
-- Name: FUNCTION geometry_gist_consistent_nd(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_consistent_nd(internal, public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_nd(internal, public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_nd(internal, public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_consistent_nd(internal, public.geometry, integer) TO service_role;


--
-- Name: FUNCTION geometry_gist_decompress_2d(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_decompress_2d(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_2d(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_2d(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_2d(internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_decompress_nd(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_decompress_nd(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_nd(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_nd(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_decompress_nd(internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_distance_2d(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_distance_2d(internal, public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_distance_2d(internal, public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_distance_2d(internal, public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_distance_2d(internal, public.geometry, integer) TO service_role;


--
-- Name: FUNCTION geometry_gist_distance_nd(internal, public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_distance_nd(internal, public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_distance_nd(internal, public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_distance_nd(internal, public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_distance_nd(internal, public.geometry, integer) TO service_role;


--
-- Name: FUNCTION geometry_gist_penalty_2d(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_penalty_2d(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_2d(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_2d(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_2d(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_penalty_nd(internal, internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_penalty_nd(internal, internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_nd(internal, internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_nd(internal, internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_penalty_nd(internal, internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_picksplit_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_picksplit_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_picksplit_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_picksplit_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_same_2d(geom1 public.geometry, geom2 public.geometry, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_same_nd(public.geometry, public.geometry, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_same_nd(public.geometry, public.geometry, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_same_nd(public.geometry, public.geometry, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_same_nd(public.geometry, public.geometry, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_same_nd(public.geometry, public.geometry, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_sortsupport_2d(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_sortsupport_2d(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_sortsupport_2d(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_sortsupport_2d(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_sortsupport_2d(internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_union_2d(bytea, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_union_2d(bytea, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_union_2d(bytea, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_union_2d(bytea, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_union_2d(bytea, internal) TO service_role;


--
-- Name: FUNCTION geometry_gist_union_nd(bytea, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gist_union_nd(bytea, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gist_union_nd(bytea, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_gist_union_nd(bytea, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gist_union_nd(bytea, internal) TO service_role;


--
-- Name: FUNCTION geometry_gt(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_gt(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_gt(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_gt(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_gt(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_hash(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_hash(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_hash(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_hash(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_hash(public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_le(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_le(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_le(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_le(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_le(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_left(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_left(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_left(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_left(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_left(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_lt(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_lt(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_lt(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_lt(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_lt(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overabove(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overabove(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overabove(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overabove(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overabove(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overbelow(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overbelow(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overbelow(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overbelow(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overbelow(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overlaps(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overlaps(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overlaps(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overlaps(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overlaps_3d(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overlaps_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overlaps_nd(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overlaps_nd(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overlaps_nd(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overlaps_nd(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overleft(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overleft(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overleft(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overleft(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overleft(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_overright(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_overright(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_overright(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_overright(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_overright(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_right(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_right(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_right(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_right(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_right(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_same(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_same(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_same(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_same(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_same(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_same_3d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_same_3d(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_same_3d(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_same_3d(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_same_3d(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_same_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_same_nd(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_same_nd(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_same_nd(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_same_nd(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_sortsupport(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_sortsupport(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_sortsupport(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_sortsupport(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_sortsupport(internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_choose_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_choose_3d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_3d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_3d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_3d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_3d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_choose_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_choose_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_choose_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_compress_2d(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_2d(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_2d(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_2d(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_2d(internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_compress_3d(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_3d(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_3d(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_3d(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_3d(internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_compress_nd(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_compress_nd(internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_nd(internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_nd(internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_compress_nd(internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_config_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_config_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_config_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_config_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_config_3d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_3d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_config_3d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_config_3d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_config_3d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_config_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_config_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_config_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_config_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_config_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_3d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_3d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_3d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_3d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_3d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_inner_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_inner_consistent_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_3d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_3d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_3d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_3d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_3d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_leaf_consistent_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_leaf_consistent_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_picksplit_2d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_2d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_2d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_2d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_2d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_picksplit_3d(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_3d(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_3d(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_3d(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_3d(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_spgist_picksplit_nd(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_nd(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_nd(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_nd(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_spgist_picksplit_nd(internal, internal) TO service_role;


--
-- Name: FUNCTION geometry_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_within(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_within(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_within(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_within(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION geometry_within_nd(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometry_within_nd(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometry_within_nd(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometry_within_nd(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometry_within_nd(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION geometrytype(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometrytype(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.geometrytype(public.geography) TO anon;
GRANT ALL ON FUNCTION public.geometrytype(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.geometrytype(public.geography) TO service_role;


--
-- Name: FUNCTION geometrytype(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geometrytype(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.geometrytype(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.geometrytype(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.geometrytype(public.geometry) TO service_role;


--
-- Name: FUNCTION geomfromewkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geomfromewkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.geomfromewkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.geomfromewkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.geomfromewkb(bytea) TO service_role;


--
-- Name: FUNCTION geomfromewkt(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.geomfromewkt(text) TO postgres;
GRANT ALL ON FUNCTION public.geomfromewkt(text) TO anon;
GRANT ALL ON FUNCTION public.geomfromewkt(text) TO authenticated;
GRANT ALL ON FUNCTION public.geomfromewkt(text) TO service_role;


--
-- Name: FUNCTION get_proj4_from_srid(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.get_proj4_from_srid(integer) TO postgres;
GRANT ALL ON FUNCTION public.get_proj4_from_srid(integer) TO anon;
GRANT ALL ON FUNCTION public.get_proj4_from_srid(integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_proj4_from_srid(integer) TO service_role;


--
-- Name: FUNCTION gettransactionid(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gettransactionid() TO postgres;
GRANT ALL ON FUNCTION public.gettransactionid() TO anon;
GRANT ALL ON FUNCTION public.gettransactionid() TO authenticated;
GRANT ALL ON FUNCTION public.gettransactionid() TO service_role;


--
-- Name: FUNCTION gserialized_gist_joinsel_2d(internal, oid, internal, smallint); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_2d(internal, oid, internal, smallint) TO postgres;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_2d(internal, oid, internal, smallint) TO anon;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_2d(internal, oid, internal, smallint) TO authenticated;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_2d(internal, oid, internal, smallint) TO service_role;


--
-- Name: FUNCTION gserialized_gist_joinsel_nd(internal, oid, internal, smallint); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_nd(internal, oid, internal, smallint) TO postgres;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_nd(internal, oid, internal, smallint) TO anon;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_nd(internal, oid, internal, smallint) TO authenticated;
GRANT ALL ON FUNCTION public.gserialized_gist_joinsel_nd(internal, oid, internal, smallint) TO service_role;


--
-- Name: FUNCTION gserialized_gist_sel_2d(internal, oid, internal, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gserialized_gist_sel_2d(internal, oid, internal, integer) TO postgres;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_2d(internal, oid, internal, integer) TO anon;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_2d(internal, oid, internal, integer) TO authenticated;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_2d(internal, oid, internal, integer) TO service_role;


--
-- Name: FUNCTION gserialized_gist_sel_nd(internal, oid, internal, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.gserialized_gist_sel_nd(internal, oid, internal, integer) TO postgres;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_nd(internal, oid, internal, integer) TO anon;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_nd(internal, oid, internal, integer) TO authenticated;
GRANT ALL ON FUNCTION public.gserialized_gist_sel_nd(internal, oid, internal, integer) TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: FUNCTION is_contained_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.box2df) TO service_role;


--
-- Name: FUNCTION is_contained_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.is_contained_2d(public.box2df, public.geometry) TO service_role;


--
-- Name: FUNCTION is_contained_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.is_contained_2d(public.geometry, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.is_contained_2d(public.geometry, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.is_contained_2d(public.geometry, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.is_contained_2d(public.geometry, public.box2df) TO service_role;


--
-- Name: FUNCTION lockrow(text, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.lockrow(text, text, text) TO anon;
GRANT ALL ON FUNCTION public.lockrow(text, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.lockrow(text, text, text) TO service_role;


--
-- Name: FUNCTION lockrow(text, text, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text) TO anon;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text) TO service_role;


--
-- Name: FUNCTION lockrow(text, text, text, timestamp without time zone); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, timestamp without time zone) TO postgres;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, timestamp without time zone) TO anon;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, timestamp without time zone) TO authenticated;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, timestamp without time zone) TO service_role;


--
-- Name: FUNCTION lockrow(text, text, text, text, timestamp without time zone); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.lockrow(text, text, text, text, timestamp without time zone) TO postgres;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text, timestamp without time zone) TO anon;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text, timestamp without time zone) TO authenticated;
GRANT ALL ON FUNCTION public.lockrow(text, text, text, text, timestamp without time zone) TO service_role;


--
-- Name: FUNCTION longtransactionsenabled(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.longtransactionsenabled() TO postgres;
GRANT ALL ON FUNCTION public.longtransactionsenabled() TO anon;
GRANT ALL ON FUNCTION public.longtransactionsenabled() TO authenticated;
GRANT ALL ON FUNCTION public.longtransactionsenabled() TO service_role;


--
-- Name: FUNCTION overlaps_2d(public.box2df, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.box2df) TO service_role;


--
-- Name: FUNCTION overlaps_2d(public.box2df, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_2d(public.box2df, public.geometry) TO service_role;


--
-- Name: FUNCTION overlaps_2d(public.geometry, public.box2df); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_2d(public.geometry, public.box2df) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_2d(public.geometry, public.box2df) TO anon;
GRANT ALL ON FUNCTION public.overlaps_2d(public.geometry, public.box2df) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_2d(public.geometry, public.box2df) TO service_role;


--
-- Name: FUNCTION overlaps_geog(public.geography, public.gidx); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.geography, public.gidx) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_geog(public.geography, public.gidx) TO anon;
GRANT ALL ON FUNCTION public.overlaps_geog(public.geography, public.gidx) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_geog(public.geography, public.gidx) TO service_role;


--
-- Name: FUNCTION overlaps_geog(public.gidx, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.geography) TO anon;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.geography) TO service_role;


--
-- Name: FUNCTION overlaps_geog(public.gidx, public.gidx); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.gidx) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.gidx) TO anon;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.gidx) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_geog(public.gidx, public.gidx) TO service_role;


--
-- Name: FUNCTION overlaps_nd(public.geometry, public.gidx); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.geometry, public.gidx) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_nd(public.geometry, public.gidx) TO anon;
GRANT ALL ON FUNCTION public.overlaps_nd(public.geometry, public.gidx) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_nd(public.geometry, public.gidx) TO service_role;


--
-- Name: FUNCTION overlaps_nd(public.gidx, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.geometry) TO service_role;


--
-- Name: FUNCTION overlaps_nd(public.gidx, public.gidx); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.gidx) TO postgres;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.gidx) TO anon;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.gidx) TO authenticated;
GRANT ALL ON FUNCTION public.overlaps_nd(public.gidx, public.gidx) TO service_role;


--
-- Name: FUNCTION pgis_asflatgeobuf_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement) TO anon;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement) TO service_role;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean) TO anon;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean) TO service_role;


--
-- Name: FUNCTION pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text) TO anon;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asflatgeobuf_transfn(internal, anyelement, boolean, text) TO service_role;


--
-- Name: FUNCTION pgis_asgeobuf_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_asgeobuf_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement) TO anon;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement) TO service_role;


--
-- Name: FUNCTION pgis_asgeobuf_transfn(internal, anyelement, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement, text) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement, text) TO anon;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement, text) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asgeobuf_transfn(internal, anyelement, text) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_combinefn(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_combinefn(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_combinefn(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_combinefn(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_combinefn(internal, internal) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_deserialfn(bytea, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_deserialfn(bytea, internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_deserialfn(bytea, internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_deserialfn(bytea, internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_deserialfn(bytea, internal) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_serialfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_serialfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_serialfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_serialfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_serialfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text) TO service_role;


--
-- Name: FUNCTION pgis_asmvt_transfn(internal, anyelement, text, integer, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text, text) TO postgres;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text, text) TO anon;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_asmvt_transfn(internal, anyelement, text, integer, text, text) TO service_role;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry) TO service_role;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_accum_transfn(internal, public.geometry, double precision, integer) TO service_role;


--
-- Name: FUNCTION pgis_geometry_clusterintersecting_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_clusterintersecting_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterintersecting_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterintersecting_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterintersecting_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_clusterwithin_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_clusterwithin_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterwithin_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterwithin_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_clusterwithin_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_collect_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_collect_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_collect_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_collect_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_collect_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_makeline_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_makeline_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_makeline_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_makeline_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_makeline_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_polygonize_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_polygonize_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_polygonize_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_polygonize_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_polygonize_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_combinefn(internal, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_combinefn(internal, internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_combinefn(internal, internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_combinefn(internal, internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_combinefn(internal, internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_deserialfn(bytea, internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_deserialfn(bytea, internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_deserialfn(bytea, internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_deserialfn(bytea, internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_deserialfn(bytea, internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_finalfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_finalfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_finalfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_finalfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_finalfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_serialfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_serialfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_serialfn(internal) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_serialfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_serialfn(internal) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_transfn(internal, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry) TO service_role;


--
-- Name: FUNCTION pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.pgis_geometry_union_parallel_transfn(internal, public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION populate_geometry_columns(use_typmod boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.populate_geometry_columns(use_typmod boolean) TO postgres;
GRANT ALL ON FUNCTION public.populate_geometry_columns(use_typmod boolean) TO anon;
GRANT ALL ON FUNCTION public.populate_geometry_columns(use_typmod boolean) TO authenticated;
GRANT ALL ON FUNCTION public.populate_geometry_columns(use_typmod boolean) TO service_role;


--
-- Name: FUNCTION populate_geometry_columns(tbl_oid oid, use_typmod boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.populate_geometry_columns(tbl_oid oid, use_typmod boolean) TO postgres;
GRANT ALL ON FUNCTION public.populate_geometry_columns(tbl_oid oid, use_typmod boolean) TO anon;
GRANT ALL ON FUNCTION public.populate_geometry_columns(tbl_oid oid, use_typmod boolean) TO authenticated;
GRANT ALL ON FUNCTION public.populate_geometry_columns(tbl_oid oid, use_typmod boolean) TO service_role;


--
-- Name: FUNCTION postgis_addbbox(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_addbbox(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_addbbox(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_addbbox(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_addbbox(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_cache_bbox(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_cache_bbox() TO postgres;
GRANT ALL ON FUNCTION public.postgis_cache_bbox() TO anon;
GRANT ALL ON FUNCTION public.postgis_cache_bbox() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_cache_bbox() TO service_role;


--
-- Name: FUNCTION postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text) TO postgres;
GRANT ALL ON FUNCTION public.postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text) TO anon;
GRANT ALL ON FUNCTION public.postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_constraint_dims(geomschema text, geomtable text, geomcolumn text) TO service_role;


--
-- Name: FUNCTION postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text) TO postgres;
GRANT ALL ON FUNCTION public.postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text) TO anon;
GRANT ALL ON FUNCTION public.postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_constraint_srid(geomschema text, geomtable text, geomcolumn text) TO service_role;


--
-- Name: FUNCTION postgis_constraint_type(geomschema text, geomtable text, geomcolumn text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_constraint_type(geomschema text, geomtable text, geomcolumn text) TO postgres;
GRANT ALL ON FUNCTION public.postgis_constraint_type(geomschema text, geomtable text, geomcolumn text) TO anon;
GRANT ALL ON FUNCTION public.postgis_constraint_type(geomschema text, geomtable text, geomcolumn text) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_constraint_type(geomschema text, geomtable text, geomcolumn text) TO service_role;


--
-- Name: FUNCTION postgis_dropbbox(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_dropbbox(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_dropbbox(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_dropbbox(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_dropbbox(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_extensions_upgrade(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_extensions_upgrade() TO postgres;
GRANT ALL ON FUNCTION public.postgis_extensions_upgrade() TO anon;
GRANT ALL ON FUNCTION public.postgis_extensions_upgrade() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_extensions_upgrade() TO service_role;


--
-- Name: FUNCTION postgis_full_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_full_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_full_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_full_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_full_version() TO service_role;


--
-- Name: FUNCTION postgis_geos_noop(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_geos_noop(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_geos_noop(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_geos_noop(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_geos_noop(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_geos_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_geos_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_geos_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_geos_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_geos_version() TO service_role;


--
-- Name: FUNCTION postgis_getbbox(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_getbbox(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_getbbox(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_getbbox(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_getbbox(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_hasbbox(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_hasbbox(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_hasbbox(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_hasbbox(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_hasbbox(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_index_supportfn(internal); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_index_supportfn(internal) TO postgres;
GRANT ALL ON FUNCTION public.postgis_index_supportfn(internal) TO anon;
GRANT ALL ON FUNCTION public.postgis_index_supportfn(internal) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_index_supportfn(internal) TO service_role;


--
-- Name: FUNCTION postgis_lib_build_date(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_lib_build_date() TO postgres;
GRANT ALL ON FUNCTION public.postgis_lib_build_date() TO anon;
GRANT ALL ON FUNCTION public.postgis_lib_build_date() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_lib_build_date() TO service_role;


--
-- Name: FUNCTION postgis_lib_revision(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_lib_revision() TO postgres;
GRANT ALL ON FUNCTION public.postgis_lib_revision() TO anon;
GRANT ALL ON FUNCTION public.postgis_lib_revision() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_lib_revision() TO service_role;


--
-- Name: FUNCTION postgis_lib_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_lib_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_lib_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_lib_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_lib_version() TO service_role;


--
-- Name: FUNCTION postgis_libjson_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_libjson_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_libjson_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_libjson_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_libjson_version() TO service_role;


--
-- Name: FUNCTION postgis_liblwgeom_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_liblwgeom_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_liblwgeom_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_liblwgeom_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_liblwgeom_version() TO service_role;


--
-- Name: FUNCTION postgis_libprotobuf_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_libprotobuf_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_libprotobuf_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_libprotobuf_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_libprotobuf_version() TO service_role;


--
-- Name: FUNCTION postgis_libxml_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_libxml_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_libxml_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_libxml_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_libxml_version() TO service_role;


--
-- Name: FUNCTION postgis_noop(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_noop(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.postgis_noop(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.postgis_noop(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_noop(public.geometry) TO service_role;


--
-- Name: FUNCTION postgis_proj_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_proj_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_proj_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_proj_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_proj_version() TO service_role;


--
-- Name: FUNCTION postgis_scripts_build_date(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_scripts_build_date() TO postgres;
GRANT ALL ON FUNCTION public.postgis_scripts_build_date() TO anon;
GRANT ALL ON FUNCTION public.postgis_scripts_build_date() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_scripts_build_date() TO service_role;


--
-- Name: FUNCTION postgis_scripts_installed(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_scripts_installed() TO postgres;
GRANT ALL ON FUNCTION public.postgis_scripts_installed() TO anon;
GRANT ALL ON FUNCTION public.postgis_scripts_installed() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_scripts_installed() TO service_role;


--
-- Name: FUNCTION postgis_scripts_released(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_scripts_released() TO postgres;
GRANT ALL ON FUNCTION public.postgis_scripts_released() TO anon;
GRANT ALL ON FUNCTION public.postgis_scripts_released() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_scripts_released() TO service_role;


--
-- Name: FUNCTION postgis_svn_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_svn_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_svn_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_svn_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_svn_version() TO service_role;


--
-- Name: FUNCTION postgis_transform_geometry(geom public.geometry, text, text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_transform_geometry(geom public.geometry, text, text, integer) TO postgres;
GRANT ALL ON FUNCTION public.postgis_transform_geometry(geom public.geometry, text, text, integer) TO anon;
GRANT ALL ON FUNCTION public.postgis_transform_geometry(geom public.geometry, text, text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_transform_geometry(geom public.geometry, text, text, integer) TO service_role;


--
-- Name: FUNCTION postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean) TO postgres;
GRANT ALL ON FUNCTION public.postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean) TO anon;
GRANT ALL ON FUNCTION public.postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_type_name(geomname character varying, coord_dimension integer, use_new_name boolean) TO service_role;


--
-- Name: FUNCTION postgis_typmod_dims(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_typmod_dims(integer) TO postgres;
GRANT ALL ON FUNCTION public.postgis_typmod_dims(integer) TO anon;
GRANT ALL ON FUNCTION public.postgis_typmod_dims(integer) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_typmod_dims(integer) TO service_role;


--
-- Name: FUNCTION postgis_typmod_srid(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_typmod_srid(integer) TO postgres;
GRANT ALL ON FUNCTION public.postgis_typmod_srid(integer) TO anon;
GRANT ALL ON FUNCTION public.postgis_typmod_srid(integer) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_typmod_srid(integer) TO service_role;


--
-- Name: FUNCTION postgis_typmod_type(integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_typmod_type(integer) TO postgres;
GRANT ALL ON FUNCTION public.postgis_typmod_type(integer) TO anon;
GRANT ALL ON FUNCTION public.postgis_typmod_type(integer) TO authenticated;
GRANT ALL ON FUNCTION public.postgis_typmod_type(integer) TO service_role;


--
-- Name: FUNCTION postgis_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_version() TO service_role;


--
-- Name: FUNCTION postgis_wagyu_version(); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.postgis_wagyu_version() TO postgres;
GRANT ALL ON FUNCTION public.postgis_wagyu_version() TO anon;
GRANT ALL ON FUNCTION public.postgis_wagyu_version() TO authenticated;
GRANT ALL ON FUNCTION public.postgis_wagyu_version() TO service_role;


--
-- Name: FUNCTION record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying, p_metadata jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying, p_metadata jsonb) TO anon;
GRANT ALL ON FUNCTION public.record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying, p_metadata jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.record_performance_metric(p_metric_name character varying, p_metric_value numeric, p_metric_unit character varying, p_metadata jsonb) TO service_role;


--
-- Name: FUNCTION refresh_performance_views(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.refresh_performance_views() TO anon;
GRANT ALL ON FUNCTION public.refresh_performance_views() TO authenticated;
GRANT ALL ON FUNCTION public.refresh_performance_views() TO service_role;


--
-- Name: FUNCTION restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean, p_restore_pois boolean, p_restore_routes boolean, p_restore_expenses boolean, p_restore_reminders boolean, p_restore_trips boolean, p_restore_reservations boolean, p_restore_messages boolean, p_restore_notifications boolean, p_restore_chat_groups boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean, p_restore_pois boolean, p_restore_routes boolean, p_restore_expenses boolean, p_restore_reminders boolean, p_restore_trips boolean, p_restore_reservations boolean, p_restore_messages boolean, p_restore_notifications boolean, p_restore_chat_groups boolean) TO anon;
GRANT ALL ON FUNCTION public.restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean, p_restore_pois boolean, p_restore_routes boolean, p_restore_expenses boolean, p_restore_reminders boolean, p_restore_trips boolean, p_restore_reservations boolean, p_restore_messages boolean, p_restore_notifications boolean, p_restore_chat_groups boolean) TO authenticated;
GRANT ALL ON FUNCTION public.restore_user_backup(p_user_id uuid, p_backup_id uuid, p_restore_vehicles boolean, p_restore_pois boolean, p_restore_routes boolean, p_restore_expenses boolean, p_restore_reminders boolean, p_restore_trips boolean, p_restore_reservations boolean, p_restore_messages boolean, p_restore_notifications boolean, p_restore_chat_groups boolean) TO service_role;


--
-- Name: FUNCTION st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dclosestpoint(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_3ddfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_3ddistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3ddistance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3ddistance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3ddistance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3ddistance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_3ddwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_3dintersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dintersects(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dlength(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dlength(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dlength(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dlength(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dlength(public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dlineinterpolatepoint(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dlineinterpolatepoint(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_3dlineinterpolatepoint(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_3dlineinterpolatepoint(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dlineinterpolatepoint(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_3dlongestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dlongestline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dlongestline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dlongestline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dlongestline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dmakebox(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dmakebox(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dmakebox(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dmakebox(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dmakebox(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dmaxdistance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dperimeter(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dperimeter(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dperimeter(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dperimeter(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dperimeter(public.geometry) TO service_role;


--
-- Name: FUNCTION st_3dshortestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dshortestline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dshortestline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dshortestline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dshortestline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_addmeasure(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_addmeasure(public.geometry, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_addmeasure(public.geometry, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_addmeasure(public.geometry, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_addmeasure(public.geometry, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_addpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_addpoint(geom1 public.geometry, geom2 public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_addpoint(geom1 public.geometry, geom2 public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_affine(public.geometry, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_angle(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_angle(line1 public.geometry, line2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_angle(line1 public.geometry, line2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_angle(line1 public.geometry, line2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_angle(line1 public.geometry, line2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_angle(pt1 public.geometry, pt2 public.geometry, pt3 public.geometry, pt4 public.geometry) TO service_role;


--
-- Name: FUNCTION st_area(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_area(text) TO postgres;
GRANT ALL ON FUNCTION public.st_area(text) TO anon;
GRANT ALL ON FUNCTION public.st_area(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_area(text) TO service_role;


--
-- Name: FUNCTION st_area(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_area(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_area(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_area(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_area(public.geometry) TO service_role;


--
-- Name: FUNCTION st_area(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_area(geog public.geography, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_area(geog public.geography, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_area(geog public.geography, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_area(geog public.geography, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_area2d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_area2d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_area2d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_area2d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_area2d(public.geometry) TO service_role;


--
-- Name: FUNCTION st_asbinary(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography) TO service_role;


--
-- Name: FUNCTION st_asbinary(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry) TO service_role;


--
-- Name: FUNCTION st_asbinary(public.geography, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geography, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography, text) TO anon;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asbinary(public.geography, text) TO service_role;


--
-- Name: FUNCTION st_asbinary(public.geometry, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asbinary(public.geometry, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry, text) TO anon;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asbinary(public.geometry, text) TO service_role;


--
-- Name: FUNCTION st_asencodedpolyline(geom public.geometry, nprecision integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asencodedpolyline(geom public.geometry, nprecision integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asencodedpolyline(geom public.geometry, nprecision integer) TO anon;
GRANT ALL ON FUNCTION public.st_asencodedpolyline(geom public.geometry, nprecision integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asencodedpolyline(geom public.geometry, nprecision integer) TO service_role;


--
-- Name: FUNCTION st_asewkb(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkb(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry) TO service_role;


--
-- Name: FUNCTION st_asewkb(public.geometry, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkb(public.geometry, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry, text) TO anon;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkb(public.geometry, text) TO service_role;


--
-- Name: FUNCTION st_asewkt(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkt(text) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkt(text) TO anon;
GRANT ALL ON FUNCTION public.st_asewkt(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkt(text) TO service_role;


--
-- Name: FUNCTION st_asewkt(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography) TO service_role;


--
-- Name: FUNCTION st_asewkt(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry) TO service_role;


--
-- Name: FUNCTION st_asewkt(public.geography, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geography, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography, integer) TO anon;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkt(public.geography, integer) TO service_role;


--
-- Name: FUNCTION st_asewkt(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asewkt(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asewkt(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_asgeojson(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeojson(text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeojson(text) TO anon;
GRANT ALL ON FUNCTION public.st_asgeojson(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeojson(text) TO service_role;


--
-- Name: FUNCTION st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer) TO anon;
GRANT ALL ON FUNCTION public.st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeojson(geog public.geography, maxdecimaldigits integer, options integer) TO service_role;


--
-- Name: FUNCTION st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer) TO anon;
GRANT ALL ON FUNCTION public.st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeojson(geom public.geometry, maxdecimaldigits integer, options integer) TO service_role;


--
-- Name: FUNCTION st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean) TO anon;
GRANT ALL ON FUNCTION public.st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeojson(r record, geom_column text, maxdecimaldigits integer, pretty_bool boolean) TO service_role;


--
-- Name: FUNCTION st_asgml(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgml(text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgml(text) TO anon;
GRANT ALL ON FUNCTION public.st_asgml(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgml(text) TO service_role;


--
-- Name: FUNCTION st_asgml(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgml(geom public.geometry, maxdecimaldigits integer, options integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asgml(geom public.geometry, maxdecimaldigits integer, options integer) TO anon;
GRANT ALL ON FUNCTION public.st_asgml(geom public.geometry, maxdecimaldigits integer, options integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgml(geom public.geometry, maxdecimaldigits integer, options integer) TO service_role;


--
-- Name: FUNCTION st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO anon;
GRANT ALL ON FUNCTION public.st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgml(geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO service_role;


--
-- Name: FUNCTION st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO anon;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geog public.geography, maxdecimaldigits integer, options integer, nprefix text, id text) TO service_role;


--
-- Name: FUNCTION st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text) TO anon;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgml(version integer, geom public.geometry, maxdecimaldigits integer, options integer, nprefix text, id text) TO service_role;


--
-- Name: FUNCTION st_ashexewkb(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry) TO service_role;


--
-- Name: FUNCTION st_ashexewkb(public.geometry, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry, text) TO postgres;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry, text) TO anon;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_ashexewkb(public.geometry, text) TO service_role;


--
-- Name: FUNCTION st_askml(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_askml(text) TO postgres;
GRANT ALL ON FUNCTION public.st_askml(text) TO anon;
GRANT ALL ON FUNCTION public.st_askml(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_askml(text) TO service_role;


--
-- Name: FUNCTION st_askml(geog public.geography, maxdecimaldigits integer, nprefix text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_askml(geog public.geography, maxdecimaldigits integer, nprefix text) TO postgres;
GRANT ALL ON FUNCTION public.st_askml(geog public.geography, maxdecimaldigits integer, nprefix text) TO anon;
GRANT ALL ON FUNCTION public.st_askml(geog public.geography, maxdecimaldigits integer, nprefix text) TO authenticated;
GRANT ALL ON FUNCTION public.st_askml(geog public.geography, maxdecimaldigits integer, nprefix text) TO service_role;


--
-- Name: FUNCTION st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text) TO postgres;
GRANT ALL ON FUNCTION public.st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text) TO anon;
GRANT ALL ON FUNCTION public.st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text) TO authenticated;
GRANT ALL ON FUNCTION public.st_askml(geom public.geometry, maxdecimaldigits integer, nprefix text) TO service_role;


--
-- Name: FUNCTION st_aslatlontext(geom public.geometry, tmpl text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_aslatlontext(geom public.geometry, tmpl text) TO postgres;
GRANT ALL ON FUNCTION public.st_aslatlontext(geom public.geometry, tmpl text) TO anon;
GRANT ALL ON FUNCTION public.st_aslatlontext(geom public.geometry, tmpl text) TO authenticated;
GRANT ALL ON FUNCTION public.st_aslatlontext(geom public.geometry, tmpl text) TO service_role;


--
-- Name: FUNCTION st_asmarc21(geom public.geometry, format text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmarc21(geom public.geometry, format text) TO postgres;
GRANT ALL ON FUNCTION public.st_asmarc21(geom public.geometry, format text) TO anon;
GRANT ALL ON FUNCTION public.st_asmarc21(geom public.geometry, format text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmarc21(geom public.geometry, format text) TO service_role;


--
-- Name: FUNCTION st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean) TO anon;
GRANT ALL ON FUNCTION public.st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvtgeom(geom public.geometry, bounds public.box2d, extent integer, buffer integer, clip_geom boolean) TO service_role;


--
-- Name: FUNCTION st_assvg(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_assvg(text) TO postgres;
GRANT ALL ON FUNCTION public.st_assvg(text) TO anon;
GRANT ALL ON FUNCTION public.st_assvg(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_assvg(text) TO service_role;


--
-- Name: FUNCTION st_assvg(geog public.geography, rel integer, maxdecimaldigits integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_assvg(geog public.geography, rel integer, maxdecimaldigits integer) TO postgres;
GRANT ALL ON FUNCTION public.st_assvg(geog public.geography, rel integer, maxdecimaldigits integer) TO anon;
GRANT ALL ON FUNCTION public.st_assvg(geog public.geography, rel integer, maxdecimaldigits integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_assvg(geog public.geography, rel integer, maxdecimaldigits integer) TO service_role;


--
-- Name: FUNCTION st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer) TO postgres;
GRANT ALL ON FUNCTION public.st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer) TO anon;
GRANT ALL ON FUNCTION public.st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_assvg(geom public.geometry, rel integer, maxdecimaldigits integer) TO service_role;


--
-- Name: FUNCTION st_astext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_astext(text) TO anon;
GRANT ALL ON FUNCTION public.st_astext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_astext(text) TO service_role;


--
-- Name: FUNCTION st_astext(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astext(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_astext(public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_astext(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_astext(public.geography) TO service_role;


--
-- Name: FUNCTION st_astext(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astext(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_astext(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_astext(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_astext(public.geometry) TO service_role;


--
-- Name: FUNCTION st_astext(public.geography, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astext(public.geography, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_astext(public.geography, integer) TO anon;
GRANT ALL ON FUNCTION public.st_astext(public.geography, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_astext(public.geography, integer) TO service_role;


--
-- Name: FUNCTION st_astext(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astext(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_astext(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_astext(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_astext(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO anon;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry, prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO service_role;


--
-- Name: FUNCTION st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO anon;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_astwkb(geom public.geometry[], ids bigint[], prec integer, prec_z integer, prec_m integer, with_sizes boolean, with_boxes boolean) TO service_role;


--
-- Name: FUNCTION st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer) TO anon;
GRANT ALL ON FUNCTION public.st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asx3d(geom public.geometry, maxdecimaldigits integer, options integer) TO service_role;


--
-- Name: FUNCTION st_azimuth(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_azimuth(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_azimuth(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_azimuth(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_azimuth(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION st_azimuth(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_azimuth(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_azimuth(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_azimuth(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_azimuth(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_bdmpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_bdmpolyfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_bdmpolyfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_bdmpolyfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_bdmpolyfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_bdpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_bdpolyfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_bdpolyfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_bdpolyfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_bdpolyfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_boundary(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_boundary(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_boundary(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_boundary(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_boundary(public.geometry) TO service_role;


--
-- Name: FUNCTION st_boundingdiagonal(geom public.geometry, fits boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_boundingdiagonal(geom public.geometry, fits boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_boundingdiagonal(geom public.geometry, fits boolean) TO anon;
GRANT ALL ON FUNCTION public.st_boundingdiagonal(geom public.geometry, fits boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_boundingdiagonal(geom public.geometry, fits boolean) TO service_role;


--
-- Name: FUNCTION st_box2dfromgeohash(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_box2dfromgeohash(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_box2dfromgeohash(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_box2dfromgeohash(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_box2dfromgeohash(text, integer) TO service_role;


--
-- Name: FUNCTION st_buffer(text, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision) TO service_role;


--
-- Name: FUNCTION st_buffer(public.geography, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision) TO service_role;


--
-- Name: FUNCTION st_buffer(text, double precision, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, integer) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, integer) TO service_role;


--
-- Name: FUNCTION st_buffer(text, double precision, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(text, double precision, text) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, text) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(text, double precision, text) TO service_role;


--
-- Name: FUNCTION st_buffer(public.geography, double precision, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, integer) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, integer) TO service_role;


--
-- Name: FUNCTION st_buffer(public.geography, double precision, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, text) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, text) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(public.geography, double precision, text) TO service_role;


--
-- Name: FUNCTION st_buffer(geom public.geometry, radius double precision, quadsegs integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, quadsegs integer) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, quadsegs integer) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, quadsegs integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, quadsegs integer) TO service_role;


--
-- Name: FUNCTION st_buffer(geom public.geometry, radius double precision, options text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, options text) TO postgres;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, options text) TO anon;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, options text) TO authenticated;
GRANT ALL ON FUNCTION public.st_buffer(geom public.geometry, radius double precision, options text) TO service_role;


--
-- Name: FUNCTION st_buildarea(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_buildarea(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_buildarea(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_buildarea(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_buildarea(public.geometry) TO service_role;


--
-- Name: FUNCTION st_centroid(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_centroid(text) TO postgres;
GRANT ALL ON FUNCTION public.st_centroid(text) TO anon;
GRANT ALL ON FUNCTION public.st_centroid(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_centroid(text) TO service_role;


--
-- Name: FUNCTION st_centroid(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_centroid(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_centroid(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_centroid(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_centroid(public.geometry) TO service_role;


--
-- Name: FUNCTION st_centroid(public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_centroid(public.geography, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_centroid(public.geography, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_centroid(public.geography, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_centroid(public.geography, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_chaikinsmoothing(public.geometry, integer, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_chaikinsmoothing(public.geometry, integer, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_chaikinsmoothing(public.geometry, integer, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_chaikinsmoothing(public.geometry, integer, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_chaikinsmoothing(public.geometry, integer, boolean) TO service_role;


--
-- Name: FUNCTION st_cleangeometry(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_cleangeometry(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_cleangeometry(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_cleangeometry(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_cleangeometry(public.geometry) TO service_role;


--
-- Name: FUNCTION st_clipbybox2d(geom public.geometry, box public.box2d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clipbybox2d(geom public.geometry, box public.box2d) TO postgres;
GRANT ALL ON FUNCTION public.st_clipbybox2d(geom public.geometry, box public.box2d) TO anon;
GRANT ALL ON FUNCTION public.st_clipbybox2d(geom public.geometry, box public.box2d) TO authenticated;
GRANT ALL ON FUNCTION public.st_clipbybox2d(geom public.geometry, box public.box2d) TO service_role;


--
-- Name: FUNCTION st_closestpoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_closestpoint(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_closestpoint(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_closestpoint(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_closestpoint(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_closestpointofapproach(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_closestpointofapproach(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_closestpointofapproach(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_closestpointofapproach(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_closestpointofapproach(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION st_clusterdbscan(public.geometry, eps double precision, minpoints integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterdbscan(public.geometry, eps double precision, minpoints integer) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterdbscan(public.geometry, eps double precision, minpoints integer) TO anon;
GRANT ALL ON FUNCTION public.st_clusterdbscan(public.geometry, eps double precision, minpoints integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterdbscan(public.geometry, eps double precision, minpoints integer) TO service_role;


--
-- Name: FUNCTION st_clusterintersecting(public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_clusterkmeans(geom public.geometry, k integer, max_radius double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterkmeans(geom public.geometry, k integer, max_radius double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterkmeans(geom public.geometry, k integer, max_radius double precision) TO anon;
GRANT ALL ON FUNCTION public.st_clusterkmeans(geom public.geometry, k integer, max_radius double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterkmeans(geom public.geometry, k integer, max_radius double precision) TO service_role;


--
-- Name: FUNCTION st_clusterwithin(public.geometry[], double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry[], double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry[], double precision) TO anon;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry[], double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry[], double precision) TO service_role;


--
-- Name: FUNCTION st_collect(public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collect(public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_collect(public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_collect(public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_collect(public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_collect(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collect(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_collect(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_collect(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_collect(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_collectionextract(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry) TO service_role;


--
-- Name: FUNCTION st_collectionextract(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_collectionextract(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_collectionhomogenize(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collectionhomogenize(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_collectionhomogenize(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_collectionhomogenize(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_collectionhomogenize(public.geometry) TO service_role;


--
-- Name: FUNCTION st_combinebbox(public.box2d, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box2d, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box2d, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box2d, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box2d, public.geometry) TO service_role;


--
-- Name: FUNCTION st_combinebbox(public.box3d, public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.box3d) TO service_role;


--
-- Name: FUNCTION st_combinebbox(public.box3d, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_combinebbox(public.box3d, public.geometry) TO service_role;


--
-- Name: FUNCTION st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean) TO anon;
GRANT ALL ON FUNCTION public.st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_concavehull(param_geom public.geometry, param_pctconvex double precision, param_allow_holes boolean) TO service_role;


--
-- Name: FUNCTION st_contains(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_contains(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_contains(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_contains(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_contains(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_containsproperly(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_containsproperly(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_convexhull(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_convexhull(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_convexhull(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_convexhull(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_convexhull(public.geometry) TO service_role;


--
-- Name: FUNCTION st_coorddim(geometry public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_coorddim(geometry public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_coorddim(geometry public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_coorddim(geometry public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_coorddim(geometry public.geometry) TO service_role;


--
-- Name: FUNCTION st_coveredby(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_coveredby(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_coveredby(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_coveredby(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_coveredby(text, text) TO service_role;


--
-- Name: FUNCTION st_coveredby(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_coveredby(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_coveredby(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_coveredby(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_coveredby(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION st_coveredby(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_coveredby(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_coveredby(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_coveredby(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_coveredby(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_covers(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_covers(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_covers(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_covers(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_covers(text, text) TO service_role;


--
-- Name: FUNCTION st_covers(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_covers(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_covers(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_covers(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_covers(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION st_covers(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_covers(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_covers(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_covers(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_covers(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_cpawithin(public.geometry, public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_cpawithin(public.geometry, public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_cpawithin(public.geometry, public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_cpawithin(public.geometry, public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_cpawithin(public.geometry, public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_crosses(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_crosses(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_crosses(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_crosses(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_crosses(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer) TO postgres;
GRANT ALL ON FUNCTION public.st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer) TO anon;
GRANT ALL ON FUNCTION public.st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_curvetoline(geom public.geometry, tol double precision, toltype integer, flags integer) TO service_role;


--
-- Name: FUNCTION st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer) TO postgres;
GRANT ALL ON FUNCTION public.st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer) TO anon;
GRANT ALL ON FUNCTION public.st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_delaunaytriangles(g1 public.geometry, tolerance double precision, flags integer) TO service_role;


--
-- Name: FUNCTION st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_dfullywithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_difference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_dimension(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dimension(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_dimension(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_dimension(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_dimension(public.geometry) TO service_role;


--
-- Name: FUNCTION st_disjoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_disjoint(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_disjoint(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_disjoint(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_disjoint(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_distance(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distance(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_distance(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_distance(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_distance(text, text) TO service_role;


--
-- Name: FUNCTION st_distance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_distance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_distance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_distance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_distance(geog1 public.geography, geog2 public.geography, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_distancecpa(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distancecpa(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_distancecpa(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_distancecpa(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_distancecpa(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION st_distancesphere(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision) TO anon;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_distancesphere(geom1 public.geometry, geom2 public.geometry, radius double precision) TO service_role;


--
-- Name: FUNCTION st_distancespheroid(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid) TO postgres;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid) TO anon;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid) TO authenticated;
GRANT ALL ON FUNCTION public.st_distancespheroid(geom1 public.geometry, geom2 public.geometry, public.spheroid) TO service_role;


--
-- Name: FUNCTION st_dump(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dump(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_dump(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_dump(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_dump(public.geometry) TO service_role;


--
-- Name: FUNCTION st_dumppoints(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dumppoints(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_dumppoints(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_dumppoints(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_dumppoints(public.geometry) TO service_role;


--
-- Name: FUNCTION st_dumprings(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dumprings(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_dumprings(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_dumprings(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_dumprings(public.geometry) TO service_role;


--
-- Name: FUNCTION st_dumpsegments(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dumpsegments(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_dumpsegments(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_dumpsegments(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_dumpsegments(public.geometry) TO service_role;


--
-- Name: FUNCTION st_dwithin(text, text, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dwithin(text, text, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_dwithin(text, text, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_dwithin(text, text, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_dwithin(text, text, double precision) TO service_role;


--
-- Name: FUNCTION st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_dwithin(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_dwithin(geog1 public.geography, geog2 public.geography, tolerance double precision, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_endpoint(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_endpoint(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_endpoint(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_endpoint(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_endpoint(public.geometry) TO service_role;


--
-- Name: FUNCTION st_envelope(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_envelope(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_envelope(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_envelope(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_envelope(public.geometry) TO service_role;


--
-- Name: FUNCTION st_equals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_equals(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_equals(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_equals(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_equals(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_estimatedextent(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text) TO service_role;


--
-- Name: FUNCTION st_estimatedextent(text, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text) TO anon;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text) TO service_role;


--
-- Name: FUNCTION st_estimatedextent(text, text, text, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_estimatedextent(text, text, text, boolean) TO service_role;


--
-- Name: FUNCTION st_expand(public.box2d, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(public.box2d, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(public.box2d, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(public.box2d, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(public.box2d, double precision) TO service_role;


--
-- Name: FUNCTION st_expand(public.box3d, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(public.box3d, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(public.box3d, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(public.box3d, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(public.box3d, double precision) TO service_role;


--
-- Name: FUNCTION st_expand(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_expand(box public.box2d, dx double precision, dy double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(box public.box2d, dx double precision, dy double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(box public.box2d, dx double precision, dy double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(box public.box2d, dx double precision, dy double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(box public.box2d, dx double precision, dy double precision) TO service_role;


--
-- Name: FUNCTION st_expand(box public.box3d, dx double precision, dy double precision, dz double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(box public.box3d, dx double precision, dy double precision, dz double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(box public.box3d, dx double precision, dy double precision, dz double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(box public.box3d, dx double precision, dy double precision, dz double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(box public.box3d, dx double precision, dy double precision, dz double precision) TO service_role;


--
-- Name: FUNCTION st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision) TO anon;
GRANT ALL ON FUNCTION public.st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_expand(geom public.geometry, dx double precision, dy double precision, dz double precision, dm double precision) TO service_role;


--
-- Name: FUNCTION st_exteriorring(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_exteriorring(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_exteriorring(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_exteriorring(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_exteriorring(public.geometry) TO service_role;


--
-- Name: FUNCTION st_filterbym(public.geometry, double precision, double precision, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_filterbym(public.geometry, double precision, double precision, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_filterbym(public.geometry, double precision, double precision, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_filterbym(public.geometry, double precision, double precision, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_filterbym(public.geometry, double precision, double precision, boolean) TO service_role;


--
-- Name: FUNCTION st_findextent(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_findextent(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_findextent(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_findextent(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_findextent(text, text) TO service_role;


--
-- Name: FUNCTION st_findextent(text, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_findextent(text, text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_findextent(text, text, text) TO anon;
GRANT ALL ON FUNCTION public.st_findextent(text, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_findextent(text, text, text) TO service_role;


--
-- Name: FUNCTION st_flipcoordinates(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_flipcoordinates(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_flipcoordinates(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_flipcoordinates(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_flipcoordinates(public.geometry) TO service_role;


--
-- Name: FUNCTION st_force2d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_force2d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_force2d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_force2d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_force2d(public.geometry) TO service_role;


--
-- Name: FUNCTION st_force3d(geom public.geometry, zvalue double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_force3d(geom public.geometry, zvalue double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_force3d(geom public.geometry, zvalue double precision) TO anon;
GRANT ALL ON FUNCTION public.st_force3d(geom public.geometry, zvalue double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_force3d(geom public.geometry, zvalue double precision) TO service_role;


--
-- Name: FUNCTION st_force3dm(geom public.geometry, mvalue double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_force3dm(geom public.geometry, mvalue double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_force3dm(geom public.geometry, mvalue double precision) TO anon;
GRANT ALL ON FUNCTION public.st_force3dm(geom public.geometry, mvalue double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_force3dm(geom public.geometry, mvalue double precision) TO service_role;


--
-- Name: FUNCTION st_force3dz(geom public.geometry, zvalue double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_force3dz(geom public.geometry, zvalue double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_force3dz(geom public.geometry, zvalue double precision) TO anon;
GRANT ALL ON FUNCTION public.st_force3dz(geom public.geometry, zvalue double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_force3dz(geom public.geometry, zvalue double precision) TO service_role;


--
-- Name: FUNCTION st_force4d(geom public.geometry, zvalue double precision, mvalue double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_force4d(geom public.geometry, zvalue double precision, mvalue double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_force4d(geom public.geometry, zvalue double precision, mvalue double precision) TO anon;
GRANT ALL ON FUNCTION public.st_force4d(geom public.geometry, zvalue double precision, mvalue double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_force4d(geom public.geometry, zvalue double precision, mvalue double precision) TO service_role;


--
-- Name: FUNCTION st_forcecollection(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcecollection(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcecollection(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcecollection(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcecollection(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcecurve(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcecurve(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcecurve(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcecurve(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcecurve(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcepolygonccw(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcepolygonccw(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcepolygonccw(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcepolygonccw(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcepolygonccw(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcepolygoncw(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcepolygoncw(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcepolygoncw(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcepolygoncw(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcepolygoncw(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcerhr(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcerhr(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcerhr(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcerhr(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcerhr(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcesfs(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry) TO service_role;


--
-- Name: FUNCTION st_forcesfs(public.geometry, version text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry, version text) TO postgres;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry, version text) TO anon;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry, version text) TO authenticated;
GRANT ALL ON FUNCTION public.st_forcesfs(public.geometry, version text) TO service_role;


--
-- Name: FUNCTION st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_frechetdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_fromflatgeobuf(anyelement, bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_fromflatgeobuf(anyelement, bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_fromflatgeobuf(anyelement, bytea) TO anon;
GRANT ALL ON FUNCTION public.st_fromflatgeobuf(anyelement, bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_fromflatgeobuf(anyelement, bytea) TO service_role;


--
-- Name: FUNCTION st_fromflatgeobuftotable(text, text, bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_fromflatgeobuftotable(text, text, bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_fromflatgeobuftotable(text, text, bytea) TO anon;
GRANT ALL ON FUNCTION public.st_fromflatgeobuftotable(text, text, bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_fromflatgeobuftotable(text, text, bytea) TO service_role;


--
-- Name: FUNCTION st_generatepoints(area public.geometry, npoints integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer) TO postgres;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer) TO anon;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer) TO service_role;


--
-- Name: FUNCTION st_generatepoints(area public.geometry, npoints integer, seed integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer, seed integer) TO postgres;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer, seed integer) TO anon;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer, seed integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_generatepoints(area public.geometry, npoints integer, seed integer) TO service_role;


--
-- Name: FUNCTION st_geogfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geogfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geogfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_geogfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geogfromtext(text) TO service_role;


--
-- Name: FUNCTION st_geogfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geogfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_geogfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_geogfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_geogfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_geographyfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geographyfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geographyfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_geographyfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geographyfromtext(text) TO service_role;


--
-- Name: FUNCTION st_geohash(geog public.geography, maxchars integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geohash(geog public.geography, maxchars integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geohash(geog public.geography, maxchars integer) TO anon;
GRANT ALL ON FUNCTION public.st_geohash(geog public.geography, maxchars integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geohash(geog public.geography, maxchars integer) TO service_role;


--
-- Name: FUNCTION st_geohash(geom public.geometry, maxchars integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geohash(geom public.geometry, maxchars integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geohash(geom public.geometry, maxchars integer) TO anon;
GRANT ALL ON FUNCTION public.st_geohash(geom public.geometry, maxchars integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geohash(geom public.geometry, maxchars integer) TO service_role;


--
-- Name: FUNCTION st_geomcollfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomcollfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text) TO service_role;


--
-- Name: FUNCTION st_geomcollfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomcollfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomcollfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_geomcollfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_geomcollfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomcollfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean) TO anon;
GRANT ALL ON FUNCTION public.st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_geometricmedian(g public.geometry, tolerance double precision, max_iter integer, fail_if_not_converged boolean) TO service_role;


--
-- Name: FUNCTION st_geometryfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geometryfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text) TO service_role;


--
-- Name: FUNCTION st_geometryfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geometryfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geometryfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_geometryn(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geometryn(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geometryn(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geometryn(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geometryn(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_geometrytype(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geometrytype(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_geometrytype(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_geometrytype(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_geometrytype(public.geometry) TO service_role;


--
-- Name: FUNCTION st_geomfromewkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromewkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromewkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromewkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromewkb(bytea) TO service_role;


--
-- Name: FUNCTION st_geomfromewkt(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromewkt(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromewkt(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromewkt(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromewkt(text) TO service_role;


--
-- Name: FUNCTION st_geomfromgeohash(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgeohash(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgeohash(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgeohash(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgeohash(text, integer) TO service_role;


--
-- Name: FUNCTION st_geomfromgeojson(json); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(json) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(json) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(json) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(json) TO service_role;


--
-- Name: FUNCTION st_geomfromgeojson(jsonb); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(jsonb) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(jsonb) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(jsonb) TO service_role;


--
-- Name: FUNCTION st_geomfromgeojson(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgeojson(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgeojson(text) TO service_role;


--
-- Name: FUNCTION st_geomfromgml(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgml(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgml(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgml(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgml(text) TO service_role;


--
-- Name: FUNCTION st_geomfromgml(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromgml(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromgml(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromgml(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromgml(text, integer) TO service_role;


--
-- Name: FUNCTION st_geomfromkml(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromkml(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromkml(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromkml(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromkml(text) TO service_role;


--
-- Name: FUNCTION st_geomfrommarc21(marc21xml text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfrommarc21(marc21xml text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfrommarc21(marc21xml text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfrommarc21(marc21xml text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfrommarc21(marc21xml text) TO service_role;


--
-- Name: FUNCTION st_geomfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromtext(text) TO service_role;


--
-- Name: FUNCTION st_geomfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_geomfromtwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromtwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromtwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromtwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromtwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_geomfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_geomfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_geomfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_gmltosql(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_gmltosql(text) TO postgres;
GRANT ALL ON FUNCTION public.st_gmltosql(text) TO anon;
GRANT ALL ON FUNCTION public.st_gmltosql(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_gmltosql(text) TO service_role;


--
-- Name: FUNCTION st_gmltosql(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_gmltosql(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_gmltosql(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_gmltosql(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_gmltosql(text, integer) TO service_role;


--
-- Name: FUNCTION st_hasarc(geometry public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_hasarc(geometry public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_hasarc(geometry public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_hasarc(geometry public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_hasarc(geometry public.geometry) TO service_role;


--
-- Name: FUNCTION st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_hausdorffdistance(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_hexagon(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO service_role;


--
-- Name: FUNCTION st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO postgres;
GRANT ALL ON FUNCTION public.st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO anon;
GRANT ALL ON FUNCTION public.st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_hexagongrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO service_role;


--
-- Name: FUNCTION st_interiorringn(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_interiorringn(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_interiorringn(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_interiorringn(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_interiorringn(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_interpolatepoint(line public.geometry, point public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_interpolatepoint(line public.geometry, point public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_interpolatepoint(line public.geometry, point public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_interpolatepoint(line public.geometry, point public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_interpolatepoint(line public.geometry, point public.geometry) TO service_role;


--
-- Name: FUNCTION st_intersection(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersection(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_intersection(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_intersection(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersection(text, text) TO service_role;


--
-- Name: FUNCTION st_intersection(public.geography, public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersection(public.geography, public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_intersection(public.geography, public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_intersection(public.geography, public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersection(public.geography, public.geography) TO service_role;


--
-- Name: FUNCTION st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersection(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_intersects(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersects(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_intersects(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_intersects(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersects(text, text) TO service_role;


--
-- Name: FUNCTION st_intersects(geog1 public.geography, geog2 public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersects(geog1 public.geography, geog2 public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_intersects(geog1 public.geography, geog2 public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_intersects(geog1 public.geography, geog2 public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersects(geog1 public.geography, geog2 public.geography) TO service_role;


--
-- Name: FUNCTION st_intersects(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_intersects(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_intersects(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_intersects(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_intersects(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_isclosed(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isclosed(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isclosed(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isclosed(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isclosed(public.geometry) TO service_role;


--
-- Name: FUNCTION st_iscollection(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_iscollection(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_iscollection(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_iscollection(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_iscollection(public.geometry) TO service_role;


--
-- Name: FUNCTION st_isempty(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isempty(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isempty(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isempty(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isempty(public.geometry) TO service_role;


--
-- Name: FUNCTION st_ispolygonccw(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ispolygonccw(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_ispolygonccw(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_ispolygonccw(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_ispolygonccw(public.geometry) TO service_role;


--
-- Name: FUNCTION st_ispolygoncw(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ispolygoncw(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_ispolygoncw(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_ispolygoncw(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_ispolygoncw(public.geometry) TO service_role;


--
-- Name: FUNCTION st_isring(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isring(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isring(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isring(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isring(public.geometry) TO service_role;


--
-- Name: FUNCTION st_issimple(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_issimple(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_issimple(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_issimple(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_issimple(public.geometry) TO service_role;


--
-- Name: FUNCTION st_isvalid(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvalid(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry) TO service_role;


--
-- Name: FUNCTION st_isvalid(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvalid(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvalid(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_isvaliddetail(geom public.geometry, flags integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvaliddetail(geom public.geometry, flags integer) TO postgres;
GRANT ALL ON FUNCTION public.st_isvaliddetail(geom public.geometry, flags integer) TO anon;
GRANT ALL ON FUNCTION public.st_isvaliddetail(geom public.geometry, flags integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvaliddetail(geom public.geometry, flags integer) TO service_role;


--
-- Name: FUNCTION st_isvalidreason(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry) TO service_role;


--
-- Name: FUNCTION st_isvalidreason(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvalidreason(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_isvalidtrajectory(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_isvalidtrajectory(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_isvalidtrajectory(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_isvalidtrajectory(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_isvalidtrajectory(public.geometry) TO service_role;


--
-- Name: FUNCTION st_length(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_length(text) TO postgres;
GRANT ALL ON FUNCTION public.st_length(text) TO anon;
GRANT ALL ON FUNCTION public.st_length(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_length(text) TO service_role;


--
-- Name: FUNCTION st_length(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_length(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_length(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_length(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_length(public.geometry) TO service_role;


--
-- Name: FUNCTION st_length(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_length(geog public.geography, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_length(geog public.geography, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_length(geog public.geography, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_length(geog public.geography, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_length2d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_length2d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_length2d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_length2d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_length2d(public.geometry) TO service_role;


--
-- Name: FUNCTION st_length2dspheroid(public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_length2dspheroid(public.geometry, public.spheroid) TO postgres;
GRANT ALL ON FUNCTION public.st_length2dspheroid(public.geometry, public.spheroid) TO anon;
GRANT ALL ON FUNCTION public.st_length2dspheroid(public.geometry, public.spheroid) TO authenticated;
GRANT ALL ON FUNCTION public.st_length2dspheroid(public.geometry, public.spheroid) TO service_role;


--
-- Name: FUNCTION st_lengthspheroid(public.geometry, public.spheroid); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_lengthspheroid(public.geometry, public.spheroid) TO postgres;
GRANT ALL ON FUNCTION public.st_lengthspheroid(public.geometry, public.spheroid) TO anon;
GRANT ALL ON FUNCTION public.st_lengthspheroid(public.geometry, public.spheroid) TO authenticated;
GRANT ALL ON FUNCTION public.st_lengthspheroid(public.geometry, public.spheroid) TO service_role;


--
-- Name: FUNCTION st_letters(letters text, font json); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_letters(letters text, font json) TO postgres;
GRANT ALL ON FUNCTION public.st_letters(letters text, font json) TO anon;
GRANT ALL ON FUNCTION public.st_letters(letters text, font json) TO authenticated;
GRANT ALL ON FUNCTION public.st_letters(letters text, font json) TO service_role;


--
-- Name: FUNCTION st_linecrossingdirection(line1 public.geometry, line2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_linecrossingdirection(line1 public.geometry, line2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_linefromencodedpolyline(txtin text, nprecision integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefromencodedpolyline(txtin text, nprecision integer) TO postgres;
GRANT ALL ON FUNCTION public.st_linefromencodedpolyline(txtin text, nprecision integer) TO anon;
GRANT ALL ON FUNCTION public.st_linefromencodedpolyline(txtin text, nprecision integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefromencodedpolyline(txtin text, nprecision integer) TO service_role;


--
-- Name: FUNCTION st_linefrommultipoint(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefrommultipoint(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_linefrommultipoint(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_linefrommultipoint(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefrommultipoint(public.geometry) TO service_role;


--
-- Name: FUNCTION st_linefromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_linefromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_linefromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefromtext(text) TO service_role;


--
-- Name: FUNCTION st_linefromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_linefromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_linefromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_linefromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_linefromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linefromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_linefromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_lineinterpolatepoint(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoint(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_lineinterpolatepoints(public.geometry, double precision, repeat boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geometry, double precision, repeat boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geometry, double precision, repeat boolean) TO anon;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geometry, double precision, repeat boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_lineinterpolatepoints(public.geometry, double precision, repeat boolean) TO service_role;


--
-- Name: FUNCTION st_linelocatepoint(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linelocatepoint(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_linelocatepoint(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_linelocatepoint(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_linelocatepoint(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_linemerge(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linemerge(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry) TO service_role;


--
-- Name: FUNCTION st_linemerge(public.geometry, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linemerge(public.geometry, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_linemerge(public.geometry, boolean) TO service_role;


--
-- Name: FUNCTION st_linestringfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_linestringfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_linestringfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_linesubstring(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linesubstring(public.geometry, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_linesubstring(public.geometry, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_linesubstring(public.geometry, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_linesubstring(public.geometry, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_linetocurve(geometry public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_linetocurve(geometry public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_linetocurve(geometry public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_linetocurve(geometry public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_linetocurve(geometry public.geometry) TO service_role;


--
-- Name: FUNCTION st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision) TO anon;
GRANT ALL ON FUNCTION public.st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_locatealong(geometry public.geometry, measure double precision, leftrightoffset double precision) TO service_role;


--
-- Name: FUNCTION st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision) TO anon;
GRANT ALL ON FUNCTION public.st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_locatebetween(geometry public.geometry, frommeasure double precision, tomeasure double precision, leftrightoffset double precision) TO service_role;


--
-- Name: FUNCTION st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision) TO anon;
GRANT ALL ON FUNCTION public.st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_locatebetweenelevations(geometry public.geometry, fromelevation double precision, toelevation double precision) TO service_role;


--
-- Name: FUNCTION st_longestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_longestline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_longestline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_longestline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_longestline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_m(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_m(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_m(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_m(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_m(public.geometry) TO service_role;


--
-- Name: FUNCTION st_makebox2d(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makebox2d(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_makebox2d(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_makebox2d(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_makebox2d(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_makeenvelope(double precision, double precision, double precision, double precision, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makeenvelope(double precision, double precision, double precision, double precision, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_makeenvelope(double precision, double precision, double precision, double precision, integer) TO anon;
GRANT ALL ON FUNCTION public.st_makeenvelope(double precision, double precision, double precision, double precision, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_makeenvelope(double precision, double precision, double precision, double precision, integer) TO service_role;


--
-- Name: FUNCTION st_makeline(public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makeline(public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_makeline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makeline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_makeline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_makeline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_makeline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_makepoint(double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_makepoint(double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_makepoint(double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepoint(double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_makepointm(double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepointm(double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_makepointm(double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_makepointm(double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepointm(double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_makepolygon(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry) TO service_role;


--
-- Name: FUNCTION st_makepolygon(public.geometry, public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry, public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry, public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry, public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_makepolygon(public.geometry, public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_makevalid(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makevalid(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_makevalid(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_makevalid(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_makevalid(public.geometry) TO service_role;


--
-- Name: FUNCTION st_makevalid(geom public.geometry, params text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makevalid(geom public.geometry, params text) TO postgres;
GRANT ALL ON FUNCTION public.st_makevalid(geom public.geometry, params text) TO anon;
GRANT ALL ON FUNCTION public.st_makevalid(geom public.geometry, params text) TO authenticated;
GRANT ALL ON FUNCTION public.st_makevalid(geom public.geometry, params text) TO service_role;


--
-- Name: FUNCTION st_maxdistance(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_maxdistance(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO anon;
GRANT ALL ON FUNCTION public.st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_maximuminscribedcircle(public.geometry, OUT center public.geometry, OUT nearest public.geometry, OUT radius double precision) TO service_role;


--
-- Name: FUNCTION st_memsize(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_memsize(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_memsize(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_memsize(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_memsize(public.geometry) TO service_role;


--
-- Name: FUNCTION st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer) TO postgres;
GRANT ALL ON FUNCTION public.st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer) TO anon;
GRANT ALL ON FUNCTION public.st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_minimumboundingcircle(inputgeom public.geometry, segs_per_quarter integer) TO service_role;


--
-- Name: FUNCTION st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision) TO anon;
GRANT ALL ON FUNCTION public.st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_minimumboundingradius(public.geometry, OUT center public.geometry, OUT radius double precision) TO service_role;


--
-- Name: FUNCTION st_minimumclearance(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_minimumclearance(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_minimumclearance(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_minimumclearance(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_minimumclearance(public.geometry) TO service_role;


--
-- Name: FUNCTION st_minimumclearanceline(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_minimumclearanceline(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_minimumclearanceline(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_minimumclearanceline(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_minimumclearanceline(public.geometry) TO service_role;


--
-- Name: FUNCTION st_mlinefromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mlinefromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text) TO service_role;


--
-- Name: FUNCTION st_mlinefromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mlinefromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mlinefromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_mlinefromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_mlinefromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mlinefromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_mpointfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpointfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text) TO service_role;


--
-- Name: FUNCTION st_mpointfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpointfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpointfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_mpointfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_mpointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpointfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_mpolyfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpolyfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text) TO service_role;


--
-- Name: FUNCTION st_mpolyfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpolyfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpolyfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_mpolyfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_mpolyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_mpolyfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_multi(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multi(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_multi(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_multi(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_multi(public.geometry) TO service_role;


--
-- Name: FUNCTION st_multilinefromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multilinefromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_multilinefromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_multilinefromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_multilinefromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_multilinestringfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text) TO service_role;


--
-- Name: FUNCTION st_multilinestringfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_multilinestringfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_multipointfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipointfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_multipointfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_multipointfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipointfromtext(text) TO service_role;


--
-- Name: FUNCTION st_multipointfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_multipointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipointfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_multipolyfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_multipolyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipolyfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_multipolygonfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text) TO service_role;


--
-- Name: FUNCTION st_multipolygonfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_multipolygonfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_ndims(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ndims(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_ndims(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_ndims(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_ndims(public.geometry) TO service_role;


--
-- Name: FUNCTION st_node(g public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_node(g public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_node(g public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_node(g public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_node(g public.geometry) TO service_role;


--
-- Name: FUNCTION st_normalize(geom public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_normalize(geom public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_normalize(geom public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_normalize(geom public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_normalize(geom public.geometry) TO service_role;


--
-- Name: FUNCTION st_npoints(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_npoints(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_npoints(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_npoints(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_npoints(public.geometry) TO service_role;


--
-- Name: FUNCTION st_nrings(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_nrings(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_nrings(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_nrings(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_nrings(public.geometry) TO service_role;


--
-- Name: FUNCTION st_numgeometries(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_numgeometries(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_numgeometries(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_numgeometries(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_numgeometries(public.geometry) TO service_role;


--
-- Name: FUNCTION st_numinteriorring(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_numinteriorring(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_numinteriorring(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_numinteriorring(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_numinteriorring(public.geometry) TO service_role;


--
-- Name: FUNCTION st_numinteriorrings(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_numinteriorrings(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_numinteriorrings(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_numinteriorrings(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_numinteriorrings(public.geometry) TO service_role;


--
-- Name: FUNCTION st_numpatches(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_numpatches(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_numpatches(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_numpatches(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_numpatches(public.geometry) TO service_role;


--
-- Name: FUNCTION st_numpoints(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_numpoints(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_numpoints(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_numpoints(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_numpoints(public.geometry) TO service_role;


--
-- Name: FUNCTION st_offsetcurve(line public.geometry, distance double precision, params text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_offsetcurve(line public.geometry, distance double precision, params text) TO postgres;
GRANT ALL ON FUNCTION public.st_offsetcurve(line public.geometry, distance double precision, params text) TO anon;
GRANT ALL ON FUNCTION public.st_offsetcurve(line public.geometry, distance double precision, params text) TO authenticated;
GRANT ALL ON FUNCTION public.st_offsetcurve(line public.geometry, distance double precision, params text) TO service_role;


--
-- Name: FUNCTION st_orderingequals(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_orderingequals(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_orientedenvelope(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_orientedenvelope(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_orientedenvelope(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_orientedenvelope(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_orientedenvelope(public.geometry) TO service_role;


--
-- Name: FUNCTION st_overlaps(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_overlaps(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_overlaps(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_overlaps(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_overlaps(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_patchn(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_patchn(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_patchn(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_patchn(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_patchn(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_perimeter(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_perimeter(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_perimeter(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_perimeter(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_perimeter(public.geometry) TO service_role;


--
-- Name: FUNCTION st_perimeter(geog public.geography, use_spheroid boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_perimeter(geog public.geography, use_spheroid boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_perimeter(geog public.geography, use_spheroid boolean) TO anon;
GRANT ALL ON FUNCTION public.st_perimeter(geog public.geography, use_spheroid boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_perimeter(geog public.geography, use_spheroid boolean) TO service_role;


--
-- Name: FUNCTION st_perimeter2d(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_perimeter2d(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_perimeter2d(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_perimeter2d(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_perimeter2d(public.geometry) TO service_role;


--
-- Name: FUNCTION st_point(double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_point(double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_point(double precision, double precision, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_point(double precision, double precision, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_point(double precision, double precision, srid integer) TO service_role;


--
-- Name: FUNCTION st_pointfromgeohash(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointfromgeohash(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointfromgeohash(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointfromgeohash(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointfromgeohash(text, integer) TO service_role;


--
-- Name: FUNCTION st_pointfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_pointfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_pointfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointfromtext(text) TO service_role;


--
-- Name: FUNCTION st_pointfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_pointfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_pointfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_pointinsidecircle(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointinsidecircle(public.geometry, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_pointinsidecircle(public.geometry, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_pointinsidecircle(public.geometry, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointinsidecircle(public.geometry, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointm(xcoordinate double precision, ycoordinate double precision, mcoordinate double precision, srid integer) TO service_role;


--
-- Name: FUNCTION st_pointn(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointn(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointn(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointn(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointn(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_pointonsurface(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointonsurface(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_pointonsurface(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_pointonsurface(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointonsurface(public.geometry) TO service_role;


--
-- Name: FUNCTION st_points(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_points(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_points(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_points(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_points(public.geometry) TO service_role;


--
-- Name: FUNCTION st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointz(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, srid integer) TO service_role;


--
-- Name: FUNCTION st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_pointzm(xcoordinate double precision, ycoordinate double precision, zcoordinate double precision, mcoordinate double precision, srid integer) TO service_role;


--
-- Name: FUNCTION st_polyfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polyfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_polyfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_polyfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_polyfromtext(text) TO service_role;


--
-- Name: FUNCTION st_polyfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polyfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_polyfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_polyfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_polyfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_polyfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_polyfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_polyfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_polygon(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygon(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_polygon(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_polygon(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygon(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_polygonfromtext(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonfromtext(text) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text) TO anon;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text) TO service_role;


--
-- Name: FUNCTION st_polygonfromtext(text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonfromtext(text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonfromtext(text, integer) TO service_role;


--
-- Name: FUNCTION st_polygonfromwkb(bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea) TO anon;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea) TO service_role;


--
-- Name: FUNCTION st_polygonfromwkb(bytea, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea, integer) TO anon;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonfromwkb(bytea, integer) TO service_role;


--
-- Name: FUNCTION st_polygonize(public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonize(public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_project(geog public.geography, distance double precision, azimuth double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_project(geog public.geography, distance double precision, azimuth double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_project(geog public.geography, distance double precision, azimuth double precision) TO anon;
GRANT ALL ON FUNCTION public.st_project(geog public.geography, distance double precision, azimuth double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_project(geog public.geography, distance double precision, azimuth double precision) TO service_role;


--
-- Name: FUNCTION st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer) TO postgres;
GRANT ALL ON FUNCTION public.st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer) TO anon;
GRANT ALL ON FUNCTION public.st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_quantizecoordinates(g public.geometry, prec_x integer, prec_y integer, prec_z integer, prec_m integer) TO service_role;


--
-- Name: FUNCTION st_reduceprecision(geom public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_reduceprecision(geom public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_reduceprecision(geom public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_reduceprecision(geom public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_reduceprecision(geom public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_relate(geom1 public.geometry, geom2 public.geometry, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, text) TO postgres;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, text) TO anon;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_relate(geom1 public.geometry, geom2 public.geometry, text) TO service_role;


--
-- Name: FUNCTION st_relatematch(text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_relatematch(text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_relatematch(text, text) TO anon;
GRANT ALL ON FUNCTION public.st_relatematch(text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_relatematch(text, text) TO service_role;


--
-- Name: FUNCTION st_removepoint(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_removepoint(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_removepoint(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_removepoint(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_removepoint(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_removerepeatedpoints(geom public.geometry, tolerance double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_removerepeatedpoints(geom public.geometry, tolerance double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_removerepeatedpoints(geom public.geometry, tolerance double precision) TO anon;
GRANT ALL ON FUNCTION public.st_removerepeatedpoints(geom public.geometry, tolerance double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_removerepeatedpoints(geom public.geometry, tolerance double precision) TO service_role;


--
-- Name: FUNCTION st_reverse(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_reverse(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_reverse(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_reverse(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_reverse(public.geometry) TO service_role;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, public.geometry) TO service_role;


--
-- Name: FUNCTION st_rotate(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotate(public.geometry, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_rotatex(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotatex(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_rotatex(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_rotatex(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotatex(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_rotatey(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotatey(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_rotatey(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_rotatey(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotatey(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_rotatez(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_rotatez(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_rotatez(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_rotatez(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_rotatez(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_scale(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION st_scale(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_scale(public.geometry, public.geometry, origin public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry, origin public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry, origin public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry, origin public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, public.geometry, origin public.geometry) TO service_role;


--
-- Name: FUNCTION st_scale(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_scale(public.geometry, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_scroll(public.geometry, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_scroll(public.geometry, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_scroll(public.geometry, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_scroll(public.geometry, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_scroll(public.geometry, public.geometry) TO service_role;


--
-- Name: FUNCTION st_segmentize(geog public.geography, max_segment_length double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_segmentize(geog public.geography, max_segment_length double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_segmentize(geog public.geography, max_segment_length double precision) TO anon;
GRANT ALL ON FUNCTION public.st_segmentize(geog public.geography, max_segment_length double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_segmentize(geog public.geography, max_segment_length double precision) TO service_role;


--
-- Name: FUNCTION st_segmentize(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_segmentize(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_segmentize(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_segmentize(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_segmentize(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_seteffectivearea(public.geometry, double precision, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_seteffectivearea(public.geometry, double precision, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_seteffectivearea(public.geometry, double precision, integer) TO anon;
GRANT ALL ON FUNCTION public.st_seteffectivearea(public.geometry, double precision, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_seteffectivearea(public.geometry, double precision, integer) TO service_role;


--
-- Name: FUNCTION st_setpoint(public.geometry, integer, public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_setpoint(public.geometry, integer, public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_setpoint(public.geometry, integer, public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_setpoint(public.geometry, integer, public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_setpoint(public.geometry, integer, public.geometry) TO service_role;


--
-- Name: FUNCTION st_setsrid(geog public.geography, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_setsrid(geog public.geography, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_setsrid(geog public.geography, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_setsrid(geog public.geography, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_setsrid(geog public.geography, srid integer) TO service_role;


--
-- Name: FUNCTION st_setsrid(geom public.geometry, srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_setsrid(geom public.geometry, srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_setsrid(geom public.geometry, srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_setsrid(geom public.geometry, srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_setsrid(geom public.geometry, srid integer) TO service_role;


--
-- Name: FUNCTION st_sharedpaths(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_sharedpaths(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_sharedpaths(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_sharedpaths(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_sharedpaths(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_shiftlongitude(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_shiftlongitude(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_shiftlongitude(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_shiftlongitude(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_shiftlongitude(public.geometry) TO service_role;


--
-- Name: FUNCTION st_shortestline(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_shortestline(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_shortestline(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_shortestline(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_shortestline(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_simplify(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_simplify(public.geometry, double precision, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_simplify(public.geometry, double precision, boolean) TO service_role;


--
-- Name: FUNCTION st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean) TO anon;
GRANT ALL ON FUNCTION public.st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_simplifypolygonhull(geom public.geometry, vertex_fraction double precision, is_outer boolean) TO service_role;


--
-- Name: FUNCTION st_simplifypreservetopology(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_simplifypreservetopology(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_simplifypreservetopology(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_simplifypreservetopology(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_simplifypreservetopology(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_simplifyvw(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_simplifyvw(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_simplifyvw(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_simplifyvw(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_simplifyvw(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_snap(geom1 public.geometry, geom2 public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_snap(geom1 public.geometry, geom2 public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_snap(geom1 public.geometry, geom2 public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_snap(geom1 public.geometry, geom2 public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_snap(geom1 public.geometry, geom2 public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_snaptogrid(public.geometry, double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_snaptogrid(geom1 public.geometry, geom2 public.geometry, double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_split(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_split(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_split(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_split(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_split(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_square(size double precision, cell_i integer, cell_j integer, origin public.geometry) TO service_role;


--
-- Name: FUNCTION st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO postgres;
GRANT ALL ON FUNCTION public.st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO anon;
GRANT ALL ON FUNCTION public.st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_squaregrid(size double precision, bounds public.geometry, OUT geom public.geometry, OUT i integer, OUT j integer) TO service_role;


--
-- Name: FUNCTION st_srid(geog public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_srid(geog public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_srid(geog public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_srid(geog public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_srid(geog public.geography) TO service_role;


--
-- Name: FUNCTION st_srid(geom public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_srid(geom public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_srid(geom public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_srid(geom public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_srid(geom public.geometry) TO service_role;


--
-- Name: FUNCTION st_startpoint(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_startpoint(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_startpoint(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_startpoint(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_startpoint(public.geometry) TO service_role;


--
-- Name: FUNCTION st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_subdivide(geom public.geometry, maxvertices integer, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_summary(public.geography); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_summary(public.geography) TO postgres;
GRANT ALL ON FUNCTION public.st_summary(public.geography) TO anon;
GRANT ALL ON FUNCTION public.st_summary(public.geography) TO authenticated;
GRANT ALL ON FUNCTION public.st_summary(public.geography) TO service_role;


--
-- Name: FUNCTION st_summary(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_summary(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_summary(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_summary(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_summary(public.geometry) TO service_role;


--
-- Name: FUNCTION st_swapordinates(geom public.geometry, ords cstring); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_swapordinates(geom public.geometry, ords cstring) TO postgres;
GRANT ALL ON FUNCTION public.st_swapordinates(geom public.geometry, ords cstring) TO anon;
GRANT ALL ON FUNCTION public.st_swapordinates(geom public.geometry, ords cstring) TO authenticated;
GRANT ALL ON FUNCTION public.st_swapordinates(geom public.geometry, ords cstring) TO service_role;


--
-- Name: FUNCTION st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_symdifference(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_symmetricdifference(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_symmetricdifference(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_symmetricdifference(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_symmetricdifference(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_symmetricdifference(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision) TO anon;
GRANT ALL ON FUNCTION public.st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_tileenvelope(zoom integer, x integer, y integer, bounds public.geometry, margin double precision) TO service_role;


--
-- Name: FUNCTION st_touches(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_touches(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_touches(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_touches(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_touches(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_transform(public.geometry, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_transform(public.geometry, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_transform(public.geometry, integer) TO anon;
GRANT ALL ON FUNCTION public.st_transform(public.geometry, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_transform(public.geometry, integer) TO service_role;


--
-- Name: FUNCTION st_transform(geom public.geometry, to_proj text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, to_proj text) TO postgres;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, to_proj text) TO anon;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, to_proj text) TO authenticated;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, to_proj text) TO service_role;


--
-- Name: FUNCTION st_transform(geom public.geometry, from_proj text, to_srid integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_srid integer) TO postgres;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_srid integer) TO anon;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_srid integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_srid integer) TO service_role;


--
-- Name: FUNCTION st_transform(geom public.geometry, from_proj text, to_proj text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_proj text) TO postgres;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_proj text) TO anon;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_proj text) TO authenticated;
GRANT ALL ON FUNCTION public.st_transform(geom public.geometry, from_proj text, to_proj text) TO service_role;


--
-- Name: FUNCTION st_translate(public.geometry, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_translate(public.geometry, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_translate(public.geometry, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_transscale(public.geometry, double precision, double precision, double precision, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_transscale(public.geometry, double precision, double precision, double precision, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_transscale(public.geometry, double precision, double precision, double precision, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_transscale(public.geometry, double precision, double precision, double precision, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_transscale(public.geometry, double precision, double precision, double precision, double precision) TO service_role;


--
-- Name: FUNCTION st_triangulatepolygon(g1 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_triangulatepolygon(g1 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_triangulatepolygon(g1 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_triangulatepolygon(g1 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_triangulatepolygon(g1 public.geometry) TO service_role;


--
-- Name: FUNCTION st_unaryunion(public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_unaryunion(public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_unaryunion(public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_unaryunion(public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_unaryunion(public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_union(public.geometry[]); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_union(public.geometry[]) TO postgres;
GRANT ALL ON FUNCTION public.st_union(public.geometry[]) TO anon;
GRANT ALL ON FUNCTION public.st_union(public.geometry[]) TO authenticated;
GRANT ALL ON FUNCTION public.st_union(public.geometry[]) TO service_role;


--
-- Name: FUNCTION st_union(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO anon;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_union(geom1 public.geometry, geom2 public.geometry, gridsize double precision) TO service_role;


--
-- Name: FUNCTION st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_voronoilines(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO service_role;


--
-- Name: FUNCTION st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_voronoipolygons(g1 public.geometry, tolerance double precision, extend_to public.geometry) TO service_role;


--
-- Name: FUNCTION st_within(geom1 public.geometry, geom2 public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_within(geom1 public.geometry, geom2 public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_within(geom1 public.geometry, geom2 public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_within(geom1 public.geometry, geom2 public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_within(geom1 public.geometry, geom2 public.geometry) TO service_role;


--
-- Name: FUNCTION st_wkbtosql(wkb bytea); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_wkbtosql(wkb bytea) TO postgres;
GRANT ALL ON FUNCTION public.st_wkbtosql(wkb bytea) TO anon;
GRANT ALL ON FUNCTION public.st_wkbtosql(wkb bytea) TO authenticated;
GRANT ALL ON FUNCTION public.st_wkbtosql(wkb bytea) TO service_role;


--
-- Name: FUNCTION st_wkttosql(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_wkttosql(text) TO postgres;
GRANT ALL ON FUNCTION public.st_wkttosql(text) TO anon;
GRANT ALL ON FUNCTION public.st_wkttosql(text) TO authenticated;
GRANT ALL ON FUNCTION public.st_wkttosql(text) TO service_role;


--
-- Name: FUNCTION st_wrapx(geom public.geometry, wrap double precision, move double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_wrapx(geom public.geometry, wrap double precision, move double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_wrapx(geom public.geometry, wrap double precision, move double precision) TO anon;
GRANT ALL ON FUNCTION public.st_wrapx(geom public.geometry, wrap double precision, move double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_wrapx(geom public.geometry, wrap double precision, move double precision) TO service_role;


--
-- Name: FUNCTION st_x(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_x(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_x(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_x(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_x(public.geometry) TO service_role;


--
-- Name: FUNCTION st_xmax(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_xmax(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_xmax(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_xmax(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_xmax(public.box3d) TO service_role;


--
-- Name: FUNCTION st_xmin(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_xmin(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_xmin(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_xmin(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_xmin(public.box3d) TO service_role;


--
-- Name: FUNCTION st_y(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_y(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_y(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_y(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_y(public.geometry) TO service_role;


--
-- Name: FUNCTION st_ymax(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ymax(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_ymax(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_ymax(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_ymax(public.box3d) TO service_role;


--
-- Name: FUNCTION st_ymin(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_ymin(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_ymin(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_ymin(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_ymin(public.box3d) TO service_role;


--
-- Name: FUNCTION st_z(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_z(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_z(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_z(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_z(public.geometry) TO service_role;


--
-- Name: FUNCTION st_zmax(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_zmax(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_zmax(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_zmax(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_zmax(public.box3d) TO service_role;


--
-- Name: FUNCTION st_zmflag(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_zmflag(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_zmflag(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_zmflag(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_zmflag(public.geometry) TO service_role;


--
-- Name: FUNCTION st_zmin(public.box3d); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_zmin(public.box3d) TO postgres;
GRANT ALL ON FUNCTION public.st_zmin(public.box3d) TO anon;
GRANT ALL ON FUNCTION public.st_zmin(public.box3d) TO authenticated;
GRANT ALL ON FUNCTION public.st_zmin(public.box3d) TO service_role;


--
-- Name: FUNCTION unlockrows(text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.unlockrows(text) TO postgres;
GRANT ALL ON FUNCTION public.unlockrows(text) TO anon;
GRANT ALL ON FUNCTION public.unlockrows(text) TO authenticated;
GRANT ALL ON FUNCTION public.unlockrows(text) TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: FUNCTION updategeometrysrid(character varying, character varying, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, integer) TO postgres;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, integer) TO anon;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, integer) TO authenticated;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, integer) TO service_role;


--
-- Name: FUNCTION updategeometrysrid(character varying, character varying, character varying, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, character varying, integer) TO postgres;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, character varying, integer) TO anon;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, character varying, integer) TO authenticated;
GRANT ALL ON FUNCTION public.updategeometrysrid(character varying, character varying, character varying, integer) TO service_role;


--
-- Name: FUNCTION updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer) TO postgres;
GRANT ALL ON FUNCTION public.updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer) TO anon;
GRANT ALL ON FUNCTION public.updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer) TO authenticated;
GRANT ALL ON FUNCTION public.updategeometrysrid(catalogn_name character varying, schema_name character varying, table_name character varying, column_name character varying, new_srid_in integer) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- Name: FUNCTION can_insert_object(bucketid text, name text, owner uuid, metadata jsonb); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) TO postgres;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: FUNCTION get_size_by_bucket(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.get_size_by_bucket() TO postgres;


--
-- Name: FUNCTION list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) TO postgres;


--
-- Name: FUNCTION list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text) TO postgres;


--
-- Name: FUNCTION operation(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.operation() TO postgres;


--
-- Name: FUNCTION search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) TO postgres;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.update_updated_at_column() TO postgres;


--
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- Name: FUNCTION st_3dextent(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_3dextent(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_3dextent(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_3dextent(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_3dextent(public.geometry) TO service_role;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement) TO postgres;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement) TO anon;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement) TO service_role;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement, boolean); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean) TO postgres;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean) TO anon;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean) TO authenticated;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean) TO service_role;


--
-- Name: FUNCTION st_asflatgeobuf(anyelement, boolean, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean, text) TO anon;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asflatgeobuf(anyelement, boolean, text) TO service_role;


--
-- Name: FUNCTION st_asgeobuf(anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement) TO anon;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement) TO service_role;


--
-- Name: FUNCTION st_asgeobuf(anyelement, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement, text) TO anon;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asgeobuf(anyelement, text) TO service_role;


--
-- Name: FUNCTION st_asmvt(anyelement); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement) TO anon;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement) TO service_role;


--
-- Name: FUNCTION st_asmvt(anyelement, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text) TO anon;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text) TO service_role;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer) TO anon;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer) TO service_role;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text) TO anon;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text) TO service_role;


--
-- Name: FUNCTION st_asmvt(anyelement, text, integer, text, text); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text, text) TO postgres;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text, text) TO anon;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text, text) TO authenticated;
GRANT ALL ON FUNCTION public.st_asmvt(anyelement, text, integer, text, text) TO service_role;


--
-- Name: FUNCTION st_clusterintersecting(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterintersecting(public.geometry) TO service_role;


--
-- Name: FUNCTION st_clusterwithin(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_clusterwithin(public.geometry, double precision) TO service_role;


--
-- Name: FUNCTION st_collect(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_collect(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_collect(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_collect(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_collect(public.geometry) TO service_role;


--
-- Name: FUNCTION st_extent(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_extent(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_extent(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_extent(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_extent(public.geometry) TO service_role;


--
-- Name: FUNCTION st_makeline(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_makeline(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_makeline(public.geometry) TO service_role;


--
-- Name: FUNCTION st_memcollect(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_memcollect(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_memcollect(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_memcollect(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_memcollect(public.geometry) TO service_role;


--
-- Name: FUNCTION st_memunion(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_memunion(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_memunion(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_memunion(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_memunion(public.geometry) TO service_role;


--
-- Name: FUNCTION st_polygonize(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_polygonize(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_polygonize(public.geometry) TO service_role;


--
-- Name: FUNCTION st_union(public.geometry); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_union(public.geometry) TO postgres;
GRANT ALL ON FUNCTION public.st_union(public.geometry) TO anon;
GRANT ALL ON FUNCTION public.st_union(public.geometry) TO authenticated;
GRANT ALL ON FUNCTION public.st_union(public.geometry) TO service_role;


--
-- Name: FUNCTION st_union(public.geometry, double precision); Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION public.st_union(public.geometry, double precision) TO postgres;
GRANT ALL ON FUNCTION public.st_union(public.geometry, double precision) TO anon;
GRANT ALL ON FUNCTION public.st_union(public.geometry, double precision) TO authenticated;
GRANT ALL ON FUNCTION public.st_union(public.geometry, double precision) TO service_role;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE trips; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trips TO anon;
GRANT ALL ON TABLE public.trips TO authenticated;
GRANT ALL ON TABLE public.trips TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE vehicles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicles TO anon;
GRANT ALL ON TABLE public.vehicles TO authenticated;
GRANT ALL ON TABLE public.vehicles TO service_role;


--
-- Name: TABLE active_trips_optimized; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.active_trips_optimized TO anon;
GRANT ALL ON TABLE public.active_trips_optimized TO authenticated;
GRANT ALL ON TABLE public.active_trips_optimized TO service_role;


--
-- Name: TABLE backup_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.backup_data TO anon;
GRANT ALL ON TABLE public.backup_data TO authenticated;
GRANT ALL ON TABLE public.backup_data TO service_role;


--
-- Name: TABLE companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.companies TO anon;
GRANT ALL ON TABLE public.companies TO authenticated;
GRANT ALL ON TABLE public.companies TO service_role;


--
-- Name: TABLE departments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.departments TO anon;
GRANT ALL ON TABLE public.departments TO authenticated;
GRANT ALL ON TABLE public.departments TO service_role;


--
-- Name: TABLE expense_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expense_categories TO anon;
GRANT ALL ON TABLE public.expense_categories TO authenticated;
GRANT ALL ON TABLE public.expense_categories TO service_role;


--
-- Name: TABLE expense_receipts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expense_receipts TO anon;
GRANT ALL ON TABLE public.expense_receipts TO authenticated;
GRANT ALL ON TABLE public.expense_receipts TO service_role;


--
-- Name: TABLE expenses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.expenses TO anon;
GRANT ALL ON TABLE public.expenses TO authenticated;
GRANT ALL ON TABLE public.expenses TO service_role;


--
-- Name: TABLE fuel_prices; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fuel_prices TO anon;
GRANT ALL ON TABLE public.fuel_prices TO authenticated;
GRANT ALL ON TABLE public.fuel_prices TO service_role;


--
-- Name: TABLE fuel_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fuel_types TO anon;
GRANT ALL ON TABLE public.fuel_types TO authenticated;
GRANT ALL ON TABLE public.fuel_types TO service_role;


--
-- Name: TABLE reservation_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reservation_status TO anon;
GRANT ALL ON TABLE public.reservation_status TO authenticated;
GRANT ALL ON TABLE public.reservation_status TO service_role;


--
-- Name: TABLE reservations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reservations TO anon;
GRANT ALL ON TABLE public.reservations TO authenticated;
GRANT ALL ON TABLE public.reservations TO service_role;


--
-- Name: TABLE pending_reservations_optimized; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pending_reservations_optimized TO anon;
GRANT ALL ON TABLE public.pending_reservations_optimized TO authenticated;
GRANT ALL ON TABLE public.pending_reservations_optimized TO service_role;


--
-- Name: TABLE performance_metrics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.performance_metrics TO anon;
GRANT ALL ON TABLE public.performance_metrics TO authenticated;
GRANT ALL ON TABLE public.performance_metrics TO service_role;


--
-- Name: TABLE permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.permissions TO anon;
GRANT ALL ON TABLE public.permissions TO authenticated;
GRANT ALL ON TABLE public.permissions TO service_role;


--
-- Name: TABLE pois; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.pois TO anon;
GRANT ALL ON TABLE public.pois TO authenticated;
GRANT ALL ON TABLE public.pois TO service_role;


--
-- Name: TABLE reminder_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reminder_types TO anon;
GRANT ALL ON TABLE public.reminder_types TO authenticated;
GRANT ALL ON TABLE public.reminder_types TO service_role;


--
-- Name: TABLE reminders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reminders TO anon;
GRANT ALL ON TABLE public.reminders TO authenticated;
GRANT ALL ON TABLE public.reminders TO service_role;


--
-- Name: TABLE role_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.role_permissions TO anon;
GRANT ALL ON TABLE public.role_permissions TO authenticated;
GRANT ALL ON TABLE public.role_permissions TO service_role;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.roles TO anon;
GRANT ALL ON TABLE public.roles TO authenticated;
GRANT ALL ON TABLE public.roles TO service_role;


--
-- Name: TABLE standard_routes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.standard_routes TO anon;
GRANT ALL ON TABLE public.standard_routes TO authenticated;
GRANT ALL ON TABLE public.standard_routes TO service_role;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscriptions TO anon;
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;


--
-- Name: TABLE system_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.system_logs TO anon;
GRANT ALL ON TABLE public.system_logs TO authenticated;
GRANT ALL ON TABLE public.system_logs TO service_role;


--
-- Name: TABLE trip_purposes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_purposes TO anon;
GRANT ALL ON TABLE public.trip_purposes TO authenticated;
GRANT ALL ON TABLE public.trip_purposes TO service_role;


--
-- Name: TABLE trip_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trip_types TO anon;
GRANT ALL ON TABLE public.trip_types TO authenticated;
GRANT ALL ON TABLE public.trip_types TO service_role;


--
-- Name: TABLE user_backups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_backups TO anon;
GRANT ALL ON TABLE public.user_backups TO authenticated;
GRANT ALL ON TABLE public.user_backups TO service_role;


--
-- Name: TABLE user_backup_summary; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_backup_summary TO anon;
GRANT ALL ON TABLE public.user_backup_summary TO authenticated;
GRANT ALL ON TABLE public.user_backup_summary TO service_role;


--
-- Name: TABLE user_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_requests TO anon;
GRANT ALL ON TABLE public.user_requests TO authenticated;
GRANT ALL ON TABLE public.user_requests TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: TABLE user_stats_mv; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_stats_mv TO anon;
GRANT ALL ON TABLE public.user_stats_mv TO authenticated;
GRANT ALL ON TABLE public.user_stats_mv TO service_role;


--
-- Name: TABLE vehicle_assignments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle_assignments TO anon;
GRANT ALL ON TABLE public.vehicle_assignments TO authenticated;
GRANT ALL ON TABLE public.vehicle_assignments TO service_role;


--
-- Name: TABLE vehicle_status; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle_status TO anon;
GRANT ALL ON TABLE public.vehicle_status TO authenticated;
GRANT ALL ON TABLE public.vehicle_status TO service_role;


--
-- Name: TABLE vehicle_statuses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle_statuses TO anon;
GRANT ALL ON TABLE public.vehicle_statuses TO authenticated;
GRANT ALL ON TABLE public.vehicle_statuses TO service_role;


--
-- Name: TABLE vehicle_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.vehicle_types TO anon;
GRANT ALL ON TABLE public.vehicle_types TO authenticated;
GRANT ALL ON TABLE public.vehicle_types TO service_role;


--
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads TO postgres;


--
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;
GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO postgres;


--
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- Name: user_stats_mv; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: postgres
--

REFRESH MATERIALIZED VIEW public.user_stats_mv;


--
-- PostgreSQL database dump complete
--

\unrestrict NNVwXFbwtykDHx3l1LgP9fWirsvHZEfenrRsh9IZchuxINSN7Dz3v8wVydXG9UG

--
-- PostgreSQL database cluster dump complete
--

