Connection string:
postgresql://neondb_owner:npg_KETyZ4InGxF1@ep-fragrant-lab-azdeuz71-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

#### After change please do below if doesent reflect in Vercel CMS

pnpm payload generate:importmap
pnpm run build
git status

If git status shows the generated import map changed, then:

git add .
git commit -m "Update Payload admin components"
git push

#### After change please do below if doesent reflect in Vercel CMS

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

---

the changes i made in local cms code and teasted it and worked fine, the changes we did , like adding vector lines , landing page etc, i comitted the changes and pushed, it reflected in vercel.. but did not work. later i did "pnpm payload generate:importmap " and "pnpm run build" . i did not commit after that but just pushed it. do you know how it sorted the problem ?

Yes — and the important part is: if you truly made no new Git commit after running those two commands, the git push itself did not send any new file changes to Vercel.

git push only pushes commits, not whatever happens to be sitting modified on your Mac.

So this sequence:

pnpm payload generate:importmap
pnpm run build
git push

with no intervening:

git add .
git commit ...

normally means Git would say something like:

Everything up-to-date

and the remote repository would remain unchanged.

So why did it start working?

The likely explanation is related to Payload's generated import map and a fresh build/redeployment state.

Payload uses an automatically generated file such as:

src/app/(payload)/admin/importMap.js

to map strings from payload.config.ts, for example:

beforeLogin: ['@/components/BeforeLogin']

to the actual React module that Payload Admin must load.

Payload's documentation says this import map is regenerated:

when the application starts,
during HMR in development,
during a production build,
or manually with payload generate:importmap.

So when we changed:

beforeLogin
beforeDashboard

and other Admin components, the generated map may temporarily have been stale or inconsistent with the config.

Running:

pnpm payload generate:importmap

forced Payload to rebuild that mapping locally.

Then:

pnpm run build

performed a clean production-style initialization/build and regenerated/validated the Admin-side configuration again. Payload specifically documents production build/startup as one of the points where the import map is regenerated.

But that still doesn't explain Vercel changing without a commit

Correct.

There are a few possibilities.

The most likely is that the deployment you thought had failed or was broken was subsequently redeployed from the same Git commit. On that fresh Vercel build, Payload regenerated the import map correctly during startup/build, and the issue disappeared.

So conceptually:

Same Git commit
│
│ first Vercel build
▼
import-map/build state problem
│
▼
Admin behaves incorrectly

Same Git commit
│
│ fresh Vercel build
▼
Payload regenerates import map
│
▼
Admin now works

A redeployment does not require a new Git commit. Vercel can rebuild exactly the same commit again.

Another possibility

pnpm payload generate:importmap may have modified:

src/app/(payload)/admin/importMap.js

but unless you subsequently committed that file, that modification stayed only on your Mac.

You can verify what happened now with:

git status

If you see something like:

modified:
src/app/(payload)/admin/importMap.js

then the generated file changed locally but was never pushed.

Also run:

git log --oneline -5

That tells us exactly what commits Vercel could possibly have received.

And:

git status

tells us what is only on your Mac.

Why the import map matters

Suppose your Payload config contains:

beforeLogin: ['@/components/BeforeLogin']

That's just a string path.

Payload Admin cannot directly render a string.

The generated import map turns it into something conceptually like:

import BeforeLogin from '@/components/BeforeLogin'

export const importMap = {
'@/components/BeforeLogin': BeforeLogin,
}

Then Payload can do:

payload.config.ts
│
│ "@ /components/BeforeLogin"
▼
generated importMap
│
▼
actual React component
│
▼
Payload Admin renders it

That's why changing custom Admin components and then regenerating the import map is often useful.

What should we do going forward?

Whenever we change something under:

admin: {
components: {
...
}
}

or add/move a custom Payload Admin component, use this sequence:

pnpm payload generate:importmap
pnpm run build
git status

If git status shows the generated import map changed, then:

git add .
git commit -m "Update Payload admin components"
git push

That gives Git/Vercel a deterministic snapshot.

For normal content schema changes such as:

Homepage
Mission
Services
Featured Products

we usually won't need to think about the import map unless we're also changing Admin React components.

So what you saw was not really Git magically pushing uncommitted code. More likely a fresh Payload/Vercel build regenerated the derived Admin configuration correctly from the already-committed source code.

And that distinction — source code vs generated code vs build output — is actually a very useful thing to understand before we continue Phase 2.
