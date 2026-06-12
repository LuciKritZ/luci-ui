# Luci UI

Luci UI is a modern AI-powered platform for generating dynamic themes, UI layout variations, and
specialized React component artifacts using the Gemini API.

## Features

- **AI-Driven Theme Generation**: Create complete color palettes based on simple natural language
  prompts.
- **Dynamic Theme Variations**: Produce alternative style combinations derived from an existing
  theme.
- **UI Artifact Creation**: Generate functional, styled React components tailored to your design
  preferences using Tailwind CSS.
- **Action Definition Management**: Easily adjust the generative AI prompts and models from the
  administrative dashboard.
- **Secure Local Key Management**: Your Gemini API keys are encrypted at rest (AES-256-GCM) directly
  in your MongoDB database.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose ORM
- **AI Integration**: `@google/genai` (Gemini API)
- **Authentication**: JWT & secure local credential hashing (bcrypt)

## Run Locally

**Prerequisites:** Node.js (v18+) and MongoDB.

### 1. Configure Environment Variables

Create a `.env.local` file at the root of the project by copying the example or creating a new one:

```bash
cp .env.example .env.local
```

Ensure you set:

- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure, random string for signing JSON Web Tokens.
- `ENCRYPTION_KEY`: A robust 32-byte hexadecimal string for encrypting API keys (e.g.
  `openssl rand -hex 32`).
- `ALLOWED_EMAILS`: A comma-separated list of emails allowed to sign up.

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize the Database

Before running the application, you must seed the database to create an administrative user and
insert the AI Action Definitions.

1. Open `scripts/seed-init-db.ts`
2. Update the `SEED_USER` constant at the top of the file with your desired admin credentials
   (email, name, password).
3. Run the script:

```bash
npx tsx scripts/seed-init-db.ts
```

_Note: The password provided will be securely hashed before being stored in the database._

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:9000` to log in with the admin user you just created.

## Run with Docker

You can easily run the entire stack (MongoDB and the Next.js app) using Docker Compose.

1. Configure your `.env.local` as described above.
2. Build and start the containers:

```bash
docker compose up --build -d
```

The application will be available at `http://localhost:9000`.
