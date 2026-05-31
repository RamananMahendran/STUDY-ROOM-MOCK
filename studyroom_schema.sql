-- ============================================================
-- StudyRoom.co.in — Full PostgreSQL Schema
-- All 4 Backend Devs (BE1 + BE2 + BE3 + BE4)
-- ============================================================


-- ============================================================
-- EXTENSIONS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "citext";     -- case-insensitive email


-- ============================================================
-- BE1 — Auth + Users + Payments
-- ============================================================

CREATE TABLE users (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT          NOT NULL,
  email           CITEXT        NOT NULL UNIQUE,
  avatar_url      TEXT,
  role            TEXT          NOT NULL DEFAULT 'free'
                                CHECK (role IN ('free', 'pro', 'admin')),
  streak_count    INTEGER       NOT NULL DEFAULT 0,
  last_active_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Stores Google / GitHub OAuth links per user
-- One user can have multiple OAuth providers
CREATE TABLE oauth_accounts (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        TEXT          NOT NULL CHECK (provider IN ('google', 'github')),
  provider_id     TEXT          NOT NULL,
  access_token    TEXT,
  refresh_token   TEXT,
  token_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);

-- NextAuth / custom sessions
CREATE TABLE sessions (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token           TEXT          NOT NULL UNIQUE,
  expires_at      TIMESTAMPTZ   NOT NULL,
  ip_address      TEXT,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Tracks daily study activity for streak calculation
CREATE TABLE streaks (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date            DATE          NOT NULL,
  studied_minutes INTEGER       NOT NULL DEFAULT 0,
  problems_solved INTEGER       NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

-- One active subscription per user
CREATE TABLE subscriptions (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_sub_id     TEXT        UNIQUE,               -- Razorpay subscription ID
  plan                TEXT        NOT NULL CHECK (plan IN ('monthly', 'annual')),
  status              TEXT        NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end   TIMESTAMPTZ NOT NULL,
  cancelled_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual payment records (one per billing cycle)
CREATE TABLE payments (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  subscription_id     UUID        REFERENCES subscriptions(id) ON DELETE SET NULL,
  razorpay_payment_id TEXT        UNIQUE,
  razorpay_order_id   TEXT,
  amount_paise        INTEGER     NOT NULL,             -- stored in paise (100 paise = ₹1)
  currency            TEXT        NOT NULL DEFAULT 'INR',
  status              TEXT        NOT NULL CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
  captured_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Raw Razorpay webhook payloads — processed idempotently
CREATE TABLE webhook_events (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        TEXT          NOT NULL UNIQUE,        -- Razorpay event ID (idempotency key)
  event_type      TEXT          NOT NULL,               -- e.g. payment.captured
  payload         JSONB         NOT NULL,
  processed       BOOLEAN       NOT NULL DEFAULT FALSE,
  processed_at    TIMESTAMPTZ,
  error           TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- BE2 — Real-time Engine (Socket.io)
-- ============================================================

CREATE TABLE study_rooms (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT          NOT NULL,
  slug            TEXT          NOT NULL UNIQUE,
  description     TEXT,
  owner_id        UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_private      BOOLEAN       NOT NULL DEFAULT FALSE,
  invite_code     TEXT          UNIQUE,
  max_members     INTEGER       NOT NULL DEFAULT 10,
  is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Who is currently in (or has been in) a room
CREATE TABLE room_members (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         UUID          NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            TEXT          NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  left_at         TIMESTAMPTZ,
  is_online       BOOLEAN       NOT NULL DEFAULT FALSE,
  socket_id       TEXT,                                 -- current Socket.io socket ID
  UNIQUE (room_id, user_id)
);

-- Group chat messages per room
CREATE TABLE chat_messages (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         UUID          NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE,
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  content         TEXT          NOT NULL,
  message_type    TEXT          NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'code')),
  edited_at       TIMESTAMPTZ,
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- One Pomodoro timer per room (synced to all members)
CREATE TABLE pomodoro_timers (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         UUID          NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE UNIQUE,
  started_by      UUID          NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  status          TEXT          NOT NULL DEFAULT 'idle'
                                CHECK (status IN ('idle', 'running', 'paused', 'break')),
  mode            TEXT          NOT NULL DEFAULT 'work' CHECK (mode IN ('work', 'short_break', 'long_break')),
  duration_secs   INTEGER       NOT NULL DEFAULT 1500,  -- 25 minutes default
  started_at      TIMESTAMPTZ,
  ends_at         TIMESTAMPTZ,
  cycles_done     INTEGER       NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- One shared notes document per room
CREATE TABLE shared_notes (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id         UUID          NOT NULL REFERENCES study_rooms(id) ON DELETE CASCADE UNIQUE,
  content         TEXT          NOT NULL DEFAULT '',
  version         INTEGER       NOT NULL DEFAULT 0,     -- CRDT/OT version counter
  updated_by      UUID          REFERENCES users(id) ON DELETE SET NULL,
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Periodic snapshots for recovery (OT history)
CREATE TABLE note_snapshots (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id         UUID          NOT NULL REFERENCES shared_notes(id) ON DELETE CASCADE,
  content         TEXT          NOT NULL,
  version         INTEGER       NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- BE3 — Code Judge + Problems DB
-- ============================================================

CREATE TABLE problems (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT          NOT NULL,
  slug            TEXT          NOT NULL UNIQUE,
  description     TEXT          NOT NULL,              -- markdown
  difficulty      TEXT          NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags            TEXT[]        NOT NULL DEFAULT '{}', -- e.g. {array, dp, graph}
  constraints     TEXT,
  hints           TEXT[],
  starter_code    JSONB,                               -- {python: "...", java: "...", cpp: "..."}
  is_premium      BOOLEAN       NOT NULL DEFAULT FALSE,
  acceptance_rate NUMERIC(5,2)  NOT NULL DEFAULT 0,
  created_by      UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Each problem has multiple test cases
CREATE TABLE test_cases (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id      UUID          NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  input           TEXT          NOT NULL,
  expected_output TEXT          NOT NULL,
  is_hidden       BOOLEAN       NOT NULL DEFAULT TRUE,  -- hidden = not shown to user
  order_index     INTEGER       NOT NULL DEFAULT 0,
  explanation     TEXT,                                 -- shown only for visible cases
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Every code submission by a user
CREATE TABLE submissions (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id      UUID          NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  language        TEXT          NOT NULL CHECK (language IN ('python', 'javascript', 'java', 'cpp', 'go', 'rust')),
  code            TEXT          NOT NULL,
  status          TEXT          NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'running', 'accepted', 'wrong_answer',
                                                  'time_limit_exceeded', 'memory_limit_exceeded',
                                                  'runtime_error', 'compile_error')),
  runtime_ms      INTEGER,
  memory_kb       INTEGER,
  judge0_token    TEXT,                                 -- Judge0 submission token for polling
  error_message   TEXT,                                 -- compile / runtime error output
  test_results    JSONB,                                -- per-test-case pass/fail array
  submitted_from  TEXT CHECK (submitted_from IN ('solo', 'pair', 'interview')),
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Pair coding sessions — two users solving one problem together
CREATE TABLE pair_sessions (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code       TEXT          NOT NULL UNIQUE,        -- shareable 6-char code
  problem_id      UUID          REFERENCES problems(id) ON DELETE SET NULL,
  host_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  guest_id        UUID          REFERENCES users(id) ON DELETE SET NULL,
  status          TEXT          NOT NULL DEFAULT 'waiting'
                                CHECK (status IN ('waiting', 'active', 'ended')),
  current_code    TEXT          NOT NULL DEFAULT '',    -- shared editor state
  language        TEXT          NOT NULL DEFAULT 'python',
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Cursor positions broadcast via Socket.io, stored for reconnection recovery
CREATE TABLE pair_cursors (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID          NOT NULL REFERENCES pair_sessions(id) ON DELETE CASCADE,
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  line_number     INTEGER       NOT NULL DEFAULT 1,
  column_number   INTEGER       NOT NULL DEFAULT 1,
  color           TEXT          NOT NULL DEFAULT '#7F77DD',
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, user_id)
);

-- Mock interview scheduling between two users
CREATE TABLE interview_slots (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  interviewer_id  UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  interviewee_id  UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  problem_id      UUID          REFERENCES problems(id) ON DELETE SET NULL,
  scheduled_at    TIMESTAMPTZ   NOT NULL,
  duration_mins   INTEGER       NOT NULL DEFAULT 60,
  status          TEXT          NOT NULL DEFAULT 'scheduled'
                                CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled', 'no_show')),
  meeting_url     TEXT,
  feedback        TEXT,
  rating          SMALLINT      CHECK (rating BETWEEN 1 AND 5),
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CHECK (interviewer_id != interviewee_id)
);


-- ============================================================
-- BE4 — DB + DevOps + Infra
-- ============================================================

-- Leaderboard scores (recalculated and cached periodically)
CREATE TABLE leaderboard_entries (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period          TEXT          NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'alltime')),
  score           INTEGER       NOT NULL DEFAULT 0,
  problems_solved INTEGER       NOT NULL DEFAULT 0,
  streak_days     INTEGER       NOT NULL DEFAULT 0,
  rank            INTEGER,
  computed_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, period)
);

-- Raw analytics events (page views, feature usage, errors)
CREATE TABLE analytics_events (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID          REFERENCES users(id) ON DELETE SET NULL,
  event_name      TEXT          NOT NULL,               -- e.g. problem_viewed, room_joined
  properties      JSONB,                                -- flexible key-value metadata
  ip_address      TEXT,
  user_agent      TEXT,
  session_id      TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Audit trail for sensitive actions (payments, role changes, deletions)
CREATE TABLE audit_logs (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id        UUID          REFERENCES users(id) ON DELETE SET NULL,
  action          TEXT          NOT NULL,               -- e.g. user.role_changed
  target_type     TEXT,                                 -- e.g. users, submissions
  target_id       UUID,
  old_value       JSONB,
  new_value       JSONB,
  ip_address      TEXT,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);


-- ============================================================
-- INDEXES
-- Performance indexes on all high-traffic query paths
-- ============================================================

-- users
CREATE INDEX idx_users_email            ON users(email);
CREATE INDEX idx_users_role             ON users(role);

-- sessions
CREATE INDEX idx_sessions_token         ON sessions(token);
CREATE INDEX idx_sessions_user_id       ON sessions(user_id);

-- streaks
CREATE INDEX idx_streaks_user_date      ON streaks(user_id, date DESC);

-- oauth_accounts
CREATE INDEX idx_oauth_user_id          ON oauth_accounts(user_id);

-- subscriptions
CREATE INDEX idx_subs_user_id           ON subscriptions(user_id);
CREATE INDEX idx_subs_razorpay_id       ON subscriptions(razorpay_sub_id);

-- payments
CREATE INDEX idx_payments_user_id       ON payments(user_id);

-- webhook_events
CREATE INDEX idx_webhooks_unprocessed   ON webhook_events(processed) WHERE processed = FALSE;

-- study_rooms
CREATE INDEX idx_rooms_owner            ON study_rooms(owner_id);
CREATE INDEX idx_rooms_slug             ON study_rooms(slug);

-- room_members
CREATE INDEX idx_members_room           ON room_members(room_id);
CREATE INDEX idx_members_user           ON room_members(user_id);
CREATE INDEX idx_members_online         ON room_members(room_id) WHERE is_online = TRUE;

-- chat_messages
CREATE INDEX idx_chat_room_created      ON chat_messages(room_id, created_at DESC);

-- problems
CREATE INDEX idx_problems_difficulty    ON problems(difficulty);
CREATE INDEX idx_problems_tags          ON problems USING GIN(tags);
CREATE INDEX idx_problems_slug          ON problems(slug);
CREATE INDEX idx_problems_premium       ON problems(is_premium);

-- test_cases
CREATE INDEX idx_testcases_problem      ON test_cases(problem_id);

-- submissions
CREATE INDEX idx_subs_user_problem      ON submissions(user_id, problem_id);
CREATE INDEX idx_subs_status            ON submissions(status) WHERE status = 'pending';
CREATE INDEX idx_subs_created           ON submissions(created_at DESC);

-- pair_sessions
CREATE INDEX idx_pair_host              ON pair_sessions(host_id);
CREATE INDEX idx_pair_guest             ON pair_sessions(guest_id);
CREATE INDEX idx_pair_room_code         ON pair_sessions(room_code);

-- interview_slots
CREATE INDEX idx_interviews_interviewer ON interview_slots(interviewer_id);
CREATE INDEX idx_interviews_interviewee ON interview_slots(interviewee_id);
CREATE INDEX idx_interviews_scheduled   ON interview_slots(scheduled_at);

-- leaderboard
CREATE INDEX idx_leaderboard_period_rank ON leaderboard_entries(period, rank);
CREATE INDEX idx_leaderboard_user        ON leaderboard_entries(user_id);

-- analytics
CREATE INDEX idx_analytics_event_name  ON analytics_events(event_name);
CREATE INDEX idx_analytics_user_id     ON analytics_events(user_id);
CREATE INDEX idx_analytics_created     ON analytics_events(created_at DESC);

-- audit_logs
CREATE INDEX idx_audit_actor            ON audit_logs(actor_id);
CREATE INDEX idx_audit_target           ON audit_logs(target_type, target_id);


-- ============================================================
-- updated_at auto-update trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_subscriptions_updated
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_rooms_updated
  BEFORE UPDATE ON study_rooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_problems_updated
  BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_submissions_updated
  BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_interview_slots_updated
  BEFORE UPDATE ON interview_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
