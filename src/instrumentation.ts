export async function register() {
  // Only run migrations in the Node.js runtime (not Edge), and not during build.
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    const { runMigrations } = await import('./lib/migrate');
    await runMigrations();
  }
}
