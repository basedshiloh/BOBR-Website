import 'server-only';
import postgres from 'postgres';

// During `next build`, NEXT_PHASE is set to 'phase-production-build'.
// Coolify injects DATABASE_URL as a build ARG, but the DB host is only
// reachable at runtime (not from the isolated build container). Use a
// dummy URL during build so the pool never attempts a real connection.
// All query functions have try/catch and return empty data on failure.
const buildTime = process.env.NEXT_PHASE === 'phase-production-build';
const dbUrl = buildTime
  ? 'postgres://localhost:5432/placeholder'
  : (process.env.DATABASE_URL || 'postgres://localhost:5432/placeholder');

const db = postgres(dbUrl, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default db;
