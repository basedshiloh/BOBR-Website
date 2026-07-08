export async function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    const { runMigrations } = await import('./lib/migrate');
    await runMigrations();

    // Check for a due scheduled backup on startup, then every hour
    const { checkAndRunScheduledBackup } = await import('./lib/backup');
    checkAndRunScheduledBackup().catch(() => {});
    setInterval(() => { checkAndRunScheduledBackup().catch(() => {}); }, 60 * 60 * 1000);
  }
}
