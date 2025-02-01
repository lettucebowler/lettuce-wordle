import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	out: './drizzle',
	schema: './src/schema/drizzle.ts',
	dialect: 'sqlite',
	driver: 'd1-http',
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
		token: process.env.CLOUDFLARE_D1_TOKEN!
	}
});
