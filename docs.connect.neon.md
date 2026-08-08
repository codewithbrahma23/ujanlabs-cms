Connection string:
postgresql://neondb_owner:npg_KETyZ4InGxF1@ep-fragrant-lab-azdeuz71-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

1. Create a Neon project/database

In Neon, create a new project. I’d use something clear like:

Project name: ujanlabs-prod

Neon supports current PostgreSQL versions and gives you a connection URI as part of the project setup.

Once the project is created, Neon will show you a connection string similar to:

postgresql://username:password@ep-xxxxxx.ap-southeast-2.aws.neon.tech/neondb?sslmode=require

Copy that full connection string.

You do not need to manually create Payload tables. Payload/Drizzle will create the schema based on your collections and globals.

Your existing config already handles this:

db: postgresAdapter({
pool: {
connectionString: process.env.DATABASE_URL || '',
},
}),

So the flow becomes:

Payload CMS
↓
process.env.DATABASE_URL
↓
Neon PostgreSQL

2. Add Neon to Vercel

Open your Vercel project for:

ujanlabs-cms

Go to:

Settings
→ Environment Variables

Add:

DATABASE_URL=your-neon-connection-string

Select at least:

Production
Preview

You can also select Development if you want Vercel's local tooling to expose the same value, but it is not necessary for your Mac setup.

Do not replace your local .env database yet. I would keep:

Local development
→ your existing local PostgreSQL

and:

Vercel production
→ Neon

That gives you proper environment separation.

#### 3. Add PAYLOAD_SECRET

3. Add PAYLOAD_SECRET

Your config already has:

secret: process.env.PAYLOAD_SECRET,

Generate one on your Mac:

openssl rand -base64 32

You'll get something like:

longRandomGeneratedValue...

Add it to Vercel:

PAYLOAD_SECRET=longRandomGeneratedValue...

Keep it secret and don't commit it to GitHub.

(base) sandeepbrahma@sandeeps-MacBook-Pro src % openssl rand -base64 32
EqWMVUM72F78HSej1P0K0eMokhyC5KMk91HjIbO7MZE=
(base) sandeepbrahma@sandeeps-MacBook-Pro src %

#### 4. Add the CMS public URL

Eventually we want:

https://cms.ujanlabs.com

But initially Vercel may give you:

https://ujanlabs-cms.vercel.app

For the first deployment, add:

NEXT_PUBLIC_SERVER_URL=https://ujanlabs-cms.vercel.app

Once we connect cms.ujanlabs.com, we can change it to:

NEXT_PUBLIC_SERVER_URL=https://cms.ujanlabs.com

Your project already imports:

import { getServerSideURL } from './utilities/getURL'

and uses:

cors: [getServerSideURL()].filter(Boolean),

So we'll inspect that helper later before changing CORS.

import { put } from "@vercel/blob";

#### 5. Create Vercel Blob

const blob = await put('articles/blob.txt', 'Hello World!', { access: 'private' });

#### 4. Add the CMS public URL

Eventually we want:

https://cms.ujanlabs.com

But initially Vercel may give you:

https://ujanlabs-cms.vercel.app

For the first deployment, add:

NEXT_PUBLIC_SERVER_URL=https://ujanlabs-cms.vercel.app

Once we connect cms.ujanlabs.com, we can change it to:

NEXT_PUBLIC_SERVER_URL=https://cms.ujanlabs.com

Your project already imports:

import { getServerSideURL } from './utilities/getURL'

and uses:

cors: [getServerSideURL()].filter(Boolean),

So we'll inspect that helper later before changing CORS.

5. Create Vercel Blob

Yes — there is currently a free allowance on Vercel's Hobby tier: Vercel lists 1 GB storage/month, 10,000 simple operations, 2,000 advanced operations, and 10 GB data transfer/month included for Blob. That should be more than enough initially for a small company website.

In Vercel:

Dashboard
→ Storage
→ Create
→ Blob

Depending on the current UI, it may appear as:

Storage
→ Create Database
→ Blob

Give it a name such as:

ujanlabs-media

Then connect it to your:

ujanlabs-cms

project.

Vercel should automatically provide:

BLOB_READ_WRITE_TOKEN=...

to the connected project. Payload's Vercel Blob adapter specifically expects this variable.

6. Install the Payload Blob adapter

Inside your original ujanlabs-cms project:

pnpm add @payloadcms/storage-vercel-blob

If you're using npm there instead:

npm install @payloadcms/storage-vercel-blob

Payload's official adapter package is:

@payloadcms/storage-vercel-blob

7. Where should we configure it?

You already have:

import { plugins } from './plugins'

and later:

plugins,

That's good architecture.

I would not put Blob configuration directly into payload.config.ts.

Instead, add it into your existing:

src/plugins/index.ts

or whatever file ./plugins resolves to.

Conceptually, we add:

import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

and then:

vercelBlobStorage({
collections: {
media: true,
},
token: process.env.BLOB_READ_WRITE_TOKEN,
})

Payload will then automatically disable local disk storage for the media collection when the adapter is enabled.

Important: don't enable Blob locally without a token

I recommend making it conditional.

Something like:

vercelBlobStorage({
enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
collections: {
media: true,
},
token: process.env.BLOB_READ_WRITE_TOKEN,
})

That means:

Local Mac
No BLOB_READ_WRITE_TOKEN
↓
Payload uses local media storage

while:

Vercel
BLOB_READ_WRITE_TOKEN exists
↓
Payload uses Vercel Blob

That's ideal for us.

8. One extra option I recommend

Payload notes that Vercel server uploads are limited to around 4.5 MB. The adapter supports:

clientUploads: true

to upload directly from the browser and bypass that server upload limitation.

So eventually I would configure:

vercelBlobStorage({
enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),

collections: {
media: true,
},

token: process.env.BLOB_READ_WRITE_TOKEN,

clientUploads: true,
})

For your current images, which are around 2 MB, this isn't immediately required, but it is a good production setting.

9. What happens to your current local media?

This is important.

Your local CMS currently has files like:

image.png
logo.svg
etc.

stored locally.

Creating Blob storage does not automatically upload those existing files.

So production will initially have:

Neon database
→ empty Payload content

Vercel Blob
→ empty media storage

unless we migrate/copy existing data.

For now, that's okay.

Once production CMS is live, we can:

create the admin user,
add Homepage data,
upload media again through Payload Admin.

Because the site is still small, that is probably much easier than migrating your entire local DB and media folder.

10. What your production environment will look like

After these steps:

Vercel: ujanlabs-cms
│
├── DATABASE_URL
│ ↓
│ Neon
│
├── PAYLOAD_SECRET
│
├── NEXT_PUBLIC_SERVER_URL
│
└── BLOB_READ_WRITE_TOKEN
↓
Vercel Blob

Payload then works like:

Payload Admin
│
├── text/content ───→ Neon PostgreSQL
│
└── images/files ──→ Vercel Blob

And your frontend later does:

ujanlabs-web
│
│ PAYLOAD_API_URL
▼
https://cms.ujanlabs.com
│
▼
/api/globals/homepage
│
▼
Neon + Blob-backed Payload data

DATABASE_URL="YOUR_NEON_CONNECTION_STRING" pnpm payload migrate
postgresql://neondb_owner:npg_KETyZ4InGxF1@ep-fragrant-lab-azdeuz71-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DATABASE_URL="postgresql://neondb_owner:npg_KETyZ4InGxF1@ep-fragrant-lab-azdeuz71-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" pnpm payload migrate
