Phase 1
Build CMS
↓
Phase 2
Connect Website
↓
Phase 3
Add Authentication
↓
Phase 4
Products
↓
Phase 5
Media Library
↓
Phase 6
SEO
↓
Phase 7
Deployment

### Currently, Our homepage text is hardcoded like this:

<h1>
Building Trusted Digital Solutions
</h1>

<p>
Harnessing modern technology...
</p>

That works...

…but marketing cannot change it.

Instead we want:

Payload Admin

Homepage
│
├── Hero Title
├── Hero Subtitle
├── Mission
├── Services
├── Audience
└── Vision

When someone edits those fields and clicks Save, the website updates automatically.

> > > Open src/globals/Homepage.ts

We'll build our first Global.

import type { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
slug: "homepage",

label: "Homepage",

fields: [
{
name: "heroTitle",
type: "text",
required: true,
},

    {
      name: "heroSubtitle",
      type: "textarea",
    },

    {
      name: "mission",
      type: "textarea",
    },

    {
      name: "services",
      type: "textarea",
    },

    {
      name: "audience",
      type: "textarea",
    },

    {
      name: "vision",
      type: "textarea",
    },

],
};

Don't worry if this looks strange.

In the next lesson I'll explain every single property.

Step 4 – Register the Global

Now open

src/payload.config.ts

Somewhere near the top you'll see imports similar to:

import { postgresAdapter } from "@payloadcms/db-postgres";

Add another import:

import { Homepage } from "./globals/Homepage";

Now find:

collections: [

Just below it, add:

globals: [
Homepage,
],

If you already have a globals section, just add Homepage to the array.

If you're unsure, paste your src/payload.config.ts here before changing it. Payload starter templates can differ slightly between versions, and I'd rather guide you based on your exact file than have you guess.

> > > core Payload concepts .
> > > Globals
> > > Collections
> > > Relationships
> > > Media
> > > Blocks

### Excellent. This is actually even better than I expected because you're using the official Payload Website Template, not just a blank Payload project.

How Payload works.
How to simplify a production-ready starter instead of starting from an empty project.
First, let's understand what you're looking at

This file is the heart of Payload.

src/payload.config.ts

Think of it as the application's main configuration.

Payload CMS
│
▼
payload.config.ts
│
├── Database
├── Collections
├── Globals
├── Admin
├── Plugins
└── Authentication

Whenever Payload starts, this file is executed first.

Let's go through it line by line
Database
db: postgresAdapter({
pool: {
connectionString: process.env.DATABASE_URL || '',
},
}),

This tells Payload

"Connect to PostgreSQL using DATABASE_URL."

Exactly the same as Prisma later.

Admin
admin: {
...
}

Everything related to

/admin

is configured here.

Examples:

Login page
Dashboard
Preview
Current user
Branding
Collections
collections: [
Pages,
Posts,
Media,
Categories,
Users,
],

Collections = database tables.

Currently your CMS already has

Pages
Posts
Media
Categories
Users

These came with the starter.

Globals
globals: [
Header,
Footer,
Homepage,
],

This is why I smiled when I saw your config 😊

You already registered

Homepage

So we don't have to modify this file anymore.

That means your import

import { Homepage } from './globals/Homepage'

is correct.

Excellent.

HOWEVER...

This is where I want to slightly change our plan.

Instead of deleting everything that Payload gave us...

I'd rather reuse it.

Why?

Because this starter already contains lots of professional features.

For example:

Media Upload

SEO

Draft Mode

Live Preview

Lexical Editor

Authentication

Access Control

Preview URLs

If we throw everything away,

later we'll end up rebuilding many of these.

What I propose

Instead of fighting the starter...

We'll customize it.

Think of buying a furnished apartment.

You don't demolish it.

You replace the furniture.

That's what we'll do.

Instead of this
Pages

Posts

Categories

We'll gradually turn it into

Homepage

Products

Services

Media

Users

Much easier.

I actually want to use one Payload feature you haven't seen yet

Rather than creating

heroTitle

heroSubtitle

mission

services

vision

all separately...

I'd like to group them.

Editors love grouped fields.

For example

Homepage

Hero
--------------------

Title

Subtitle

Primary Button

Secondary Button

Mission
--------------------

Vision
--------------------

This looks much more professional.

So our Homepage model becomes
Homepage

Hero
│
├── Title
├── Subtitle
├── CTA
└── CTA Link

Mission

Services

Audience

Vision

Instead of

heroTitle

heroSubtitle

heroButton

heroButtonLink

Much cleaner.

This introduces you to another Payload concept
Field

vs

Group Field

Later we'll have

Hero

Statistics

Testimonials

FAQ

Contact

Every section becomes one group.

This scales beautifully.

Even better...

Later...

Your Hero group will become

Hero

Title

Subtitle

Background Image

Primary Button

Secondary Button

Badge

Video

Animation

and we won't need to redesign the CMS.

Our revised learning plan
Module 5

✅ Create Homepage Global

Module 6

Learn Payload Fields

Text

Textarea

Number

Checkbox

Select

Relationship

Upload

Group

Array

Blocks
Module 7

Connect Homepage to NextJS

Module 8

Create Products Collection

Module 9

Media Library

Module 10

SEO

Module 11

Deploy

One thing I want to improve

Now that I know you're using the official Payload Website Template, I think we can do something much better than a basic CMS.

Instead of just teaching "Payload CMS", I'd like to teach you how to build a production-ready CMS that could power Ujan Labs for years.

That means we won't just make it work—we'll make it maintainable, scalable, and easy for non-technical users to edit.

I also want to explain the reasoning behind every design choice, because those same patterns will be valuable when we start building your School ERP. I think you'll get much more long-term value from understanding why the architecture is designed this way, not just what code to write.

sure , please help to proceed with next lesson

Perfect. This is where the real learning begins.

Up to now we've mostly been setting up tools. From this lesson onward, we're actually designing a CMS, which is much more interesting.

Module 5.1 – Understanding Payload Fields

Before we write any code, I want you to understand how Payload thinks about data.

Imagine you're building a paper form.

Student Admission Form

Student Name:

---

Age:

---

Class:

---

Photo:

---

Each box is a field.

Payload works exactly the same way.

Homepage

Hero Title

---

Hero Subtitle

---

Mission

---

Vision

---

Each input is simply a field with a type.

Payload Field Types

These are the ones you'll use most often.

Type Example
text Company Name
textarea Mission Statement
number Employee Count
checkbox Featured Product
select Product Category
upload Company Logo
relationship Product → Category
group Hero Section
array Team Members
blocks Page Builder

Don't worry about all of them today. We'll learn them gradually.

Our Goal

Rather than creating lots of separate fields like:

heroTitle
heroSubtitle
heroButton
heroButtonLink

we'll organize them professionally.

Think of your homepage like this:

Homepage
│
├── Hero
│
├── Mission
│
├── Services
│
├── Featured Product
│
├── Audience
│
└── Vision

Notice how every section of the website becomes a section inside the CMS.

That's exactly how professional CMSs are designed.

Step 1 — Improve Homepage.ts

Open:

src/globals/Homepage.ts

If you created a very simple version earlier, we're going to replace it with something more structured.

Create the file like this:

import type { GlobalConfig } from "payload";

export const Homepage: GlobalConfig = {
slug: "homepage",

label: "Homepage",

fields: [
{
name: "hero",
label: "Hero Section",
type: "group",
fields: [
{
name: "badge",
label: "Badge",
type: "text",
defaultValue: "UJAN LABS",
},
{
name: "title",
label: "Title",
type: "text",
required: true,
},
{
name: "subtitle",
label: "Subtitle",
type: "textarea",
},
{
name: "primaryButtonText",
label: "Primary Button Text",
type: "text",
defaultValue: "Request Demo",
},
{
name: "secondaryButtonText",
label: "Secondary Button Text",
type: "text",
defaultValue: "Contact Us",
},
],
},

    {
      name: "mission",
      label: "Mission",
      type: "textarea",
    },

    {
      name: "services",
      label: "Services",
      type: "textarea",
    },

    {
      name: "featuredProduct",
      label: "Featured Product",
      type: "textarea",
    },

    {
      name: "audience",
      label: "Target Audience",
      type: "textarea",
    },

    {
      name: "vision",
      label: "Vision",
      type: "textarea",
    },

],
};
What did we just do?

This is the first new Payload concept.

Instead of:

Homepage

heroTitle
heroSubtitle
heroButton

you'll now see:

Homepage

▼ Hero Section

Badge

Title

Subtitle

Primary Button

Secondary Button

Everything related to the Hero is grouped together.

This makes the editor much easier to use.

Why use a Group?

Suppose six months from now you want to add:

Hero

Title

Subtitle

Background Image

Video

Statistics

Animation

Gradient Color

Badge

Buttons

You simply add more fields inside the hero group.

You don't have to redesign your CMS.

This is why experienced Payload developers use groups extensively.

Step 2 — Restart the Server

After saving the file:

pnpm dev

(or restart it if it's already running).

Payload will update the schema automatically.

Step 3 — Visit the Admin

Open:

http://localhost:3000/admin

(or whatever port your CMS is running on).

You should now see:

Homepage

▼ Hero Section

Badge

Title

Subtitle

Primary Button Text

Secondary Button Text

Mission

Services

Featured Product

Target Audience

Vision

If you don't see it immediately, let me know what appears under the left-hand menu. Since you're using the official website template, the starter may already include its own Homepage global, and we'll adjust accordingly.

Homework (5 minutes)

Populate it with your real Ujan Labs content.

Hero

Badge: UJAN LABS
Title: Building Trusted Digital Solutions

Subtitle:

To harness modern technology to build trusted digital solutions that connect people, empower organizations, and create opportunities for innovation, growth, and lasting impact.

Mission

Your mission statement.

Services

Complete, easy-to-use school automation.

Featured Product

School ERP with RFID attendance and parent notifications.

Target Audience

Technology SMEs, school managements, startups.

Vision

To empower organizations and communities through trusted technology that creates lasting impact and drives meaningful progress.
What we'll build next (Module 5.2)

This is where it starts getting exciting.

We'll make the Hero even more powerful by adding:

A logo upload (using the Media collection).
Primary and secondary button links.
Background image support.
Validation rules (for example, making button text required only if a link is provided).

These are the kinds of features that make a CMS feel polished and practical for real content editors.

okplease help to proceed

Excellent. This is where Payload starts to become really powerful.

Until now, we've only used simple fields. In this lesson, you'll learn one of the most important concepts in any CMS: relationships.

Module 5.2 – Media & Relationships
The problem

Right now, imagine your Hero looked like this:

Logo

---

You might think:

"I'll just paste the logo filename here."

That works... until someone renames the file.

Or uploads a new logo.

Or wants a dark-mode logo.

Or wants to crop it.

That's why CMSs never store image filenames in text fields.

Instead they create a relationship.

Think of your database like this

You already have a Media Collection.

Media

ID File
----------------------------

1 logo.png
2 hero.jpg
3 school.jpg
4 rfid.png

Your Homepage shouldn't contain:

Logo = logo.png

Instead it contains:

Logo = Media ID 1

Payload automatically finds the image.

This is called a relationship.

This is how professional CMSs work
Homepage
│
│
▼
Media Collection
│
├── Logo
├── Hero Image
├── Product Image
└── Team Photo

No duplicated files.

No duplicated data.

Step 1 — Add a Logo field

Inside your Hero group, after the badge, add:

{
name: "logo",
label: "Company Logo",
type: "upload",
relationTo: "media",
},

Your Hero group will now begin like this:

hero
│
├── badge
├── logo
├── title
├── subtitle
What is happening?

This tells Payload:

type: "upload"

means

"This field uploads or selects a media item."

and

relationTo: "media"

means

"Use the Media collection."

Notice we never say:

relationTo: "Media"

We use the collection slug, which is:

media
Step 2 — Hero Background Image

Now add another upload.

{
name: "backgroundImage",
label: "Hero Background",
type: "upload",
relationTo: "media",
},

Now editors can upload beautiful hero backgrounds.

Step 3 — Featured Product Image

Instead of only text, let's give it an image too.

Replace

featuredProduct

with a group.

{
name: "featuredProduct",
label: "Featured Product",
type: "group",
fields: [
{
name: "title",
type: "text",
},
{
name: "description",
type: "textarea",
},
{
name: "image",
type: "upload",
relationTo: "media",
},
],
},

Now the editor sees

Featured Product

Title

Description

Image

Much nicer.

Step 4 — Better CTA Buttons

Right now we only have button text.

Let's make them useful.

Instead of

Request Demo

we also need

https://ujanlabs.com/demo

Add these fields inside Hero.

{
name: "primaryButtonLink",
label: "Primary Button Link",
type: "text",
},
{
name: "secondaryButtonLink",
label: "Secondary Button Link",
type: "text",
},

Later we'll improve this using Payload's Link field, but for now text keeps it simple.

Your Hero will now look like this
Hero Section

Badge

Logo

Title

Subtitle

Background Image

Primary Button Text

Primary Button Link

Secondary Button Text

Secondary Button Link

That's already looking like a professional CMS.

Why this matters

Notice how we're thinking in terms of content, not code.

The Next.js website won't know or care where the logo comes from.

It will simply receive data like:

{
"hero": {
"title": "Building Trusted Digital Solutions",
"logo": {
"url": "/media/logo.png"
}
}
}

The frontend just renders whatever the CMS provides.

A small improvement to our architecture

At the moment, our Homepage Global is starting to grow. That's normal.

A common pattern is to keep each section in its own file.

Instead of one very long Homepage.ts, we can eventually organize it like this:

src/
├── globals/
│ ├── Homepage.ts
│
├── fields/
│ ├── heroFields.ts
│ ├── missionFields.ts
│ ├── productFields.ts
│ └── seoFields.ts

Then Homepage.ts becomes something like:

fields: [
heroFields,
missionFields,
featuredProductFields,
]

This makes the project much easier to maintain as it grows.

Module 5.3 (Next)

This is the lesson I've been looking forward to, because it's where the two projects finally meet.

We'll connect:

ujanlabs-web
│
▼
Payload REST API
│
▼
Homepage Global

By the end of that module:

You'll edit the Hero title in Payload.
Click Save.
Refresh ujanlabs-web.
The new title will appear automatically.

That will be the first complete end-to-end flow between your CMS and your website, and from then on, every new section (products, services, team, testimonials, etc.) will follow the same pattern. It will also make the reason for building the CMS immediately tangible.
