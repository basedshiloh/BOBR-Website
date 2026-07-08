import 'server-only';
import postgres from 'postgres';

// Single connection pool for the lifetime of the process.
// DATABASE_URL format: postgres://user:pass@host:5432/dbname
// Falls back to a dummy URL at build time — all query functions have try/catch
// and return empty data, so the build succeeds without a live database.
const db = postgres(process.env.DATABASE_URL || 'postgres://localhost:5432/placeholder', {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default db;
