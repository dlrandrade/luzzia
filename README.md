# Run and deploy your AI Studio app

This repository contains everything you need to run the application locally and deploy it to Vercel with a Neon Postgres database.

## Run Locally

**Prerequisites:** Node.js and access to a Postgres database.

1. Install dependencies:
   `npm install`
2. Configure the environment in `.env` with your database credentials and any other required keys. This repository already includes a sample configuration targeting Neon.
3. Generate the Prisma client:
   `npm run prisma:generate`
4. Run the app:
   `npm run dev`

When deploying to Vercel make sure the same environment variables from `.env` are configured in your project settings so the Serverless Functions can connect to the database.
