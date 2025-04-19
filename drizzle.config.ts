import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

console.log(process.env.DATABASE_URL)

export default defineConfig({
	schema: './src/lib/server/db/schema',
	dbCredentials: { url: process.env.DATABASE_URL },
	verbose: true,
	strict: true,
	dialect: 'postgresql'
});
