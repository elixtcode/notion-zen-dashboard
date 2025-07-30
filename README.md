# Project: Notion Zen Dashboard

A minimalist, mobile-friendly web app built with React, TypeScript, and Tailwind CSS, designed to embed seamlessly in Notion. It helps track focus time, break durations, and task-based productivity in a single clean interface.

I used an AI-generated layout as a starting point to save time, then customized the timer behavior, added key features, and refined the interface to suit my workflow all coded and versioned through GitHub.

### Live Demo  
https://notion-zen-dashboard.lovable.app/

---

## Features & Key Learnings
- Built dual timers using createTimer function for better reusability
- Ensured each timer runs independently with no interference
- Added sound alarms that auto-stop (no infinite noise)
- Built with **Tailwind CSS** and **shadcn/ui** for a clean, accessible layout.
- Designed and deployed the dashboard with full **Notion embed compatibility**  

---

## About the Setup

To accelerate initial layout setup, I used an AI-assisted tool (Lovable) to scaffold the basic file structure and layout components. But I customized the app beyond the initial scaffold to make it fully usable inside Notion and make it mobile-friendly.

---

<details>
<summary>ℹ️ Project Scaffolding & Deployment Info (from Lovable)</summary>

### URL  
https://lovable.dev/projects/9706c1c5-398c-4184-bf44-f1659b767ddc

### Editing Options

You can:
- Edit via the [Lovable interface](https://lovable.dev/projects/9706c1c5-398c-4184-bf44-f1659b767ddc)
- Clone and edit locally via GitHub and push changes
- Use GitHub Codespaces
- Directly edit files within GitHub

### Local Setup

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm i
npm run dev
