export function requiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var ${key}`);
  }
  return value;
}

export function optionalEnv(key: string, fallback?: string): string | undefined {
  const value = process.env[key] ?? fallback;
  return value === undefined ? undefined : value;
}
