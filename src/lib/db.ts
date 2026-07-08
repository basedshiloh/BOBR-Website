import 'server-only';
import postgres from 'postgres';

// Single connection pool for the lifetime of the process.
// DATABASE_URL format: postgresql://user:pass@host:5432/dbname
const db = postgres(process.env.DATABASE_URL!, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export default db;
