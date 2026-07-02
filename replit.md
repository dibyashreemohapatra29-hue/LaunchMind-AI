# LaunchMind-AI

A full-stack web application scaffold built with React, Vite, TypeScript, Node.js, Express, and Tailwind CSS.

## Structure

```
launchmind-ai/
├── client/          # React + Vite + TypeScript + Tailwind CSS (port 5173)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/          # Node.js + Express + TypeScript (port 3000)
│   └── src/
│       └── index.ts
├── package.json
└── pnpm-workspace.yaml
```

## Development

The client proxies `/api/*` requests to the server automatically (configured in `vite.config.ts`).

## User Preferences

- No emojis in the UI
