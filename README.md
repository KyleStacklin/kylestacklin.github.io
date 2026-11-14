# kylestacklin.github.io

A Risk of Rain 2 item database, tier list, and flashcards app, published as a personal site at https://kylestacklin.github.io.

## Features

- **Item database** — browse all Risk of Rain 2 items in a grid or list view, with search and filtering by rarity and tags
- **Tier list** — per-character (Commando, Huntress, Railgunner, etc.) S/A/B/C/F item tier rankings
- **Flashcards** — quiz yourself by matching an item's description to the correct item

## Tech Stack

- React 18 + TypeScript, bootstrapped with Create React App
- MobX / mobx-react-lite for UI state
- react-jss for styling

## Getting Started

```bash
npm install
npm start
```

This runs the app in development mode at http://localhost:3000.

## Deployment

```bash
npm run deploy
```

This builds the app and publishes the `build` folder to GitHub Pages via [gh-pages](https://github.com/tschaub/gh-pages). The `predeploy` script runs `npm run build` automatically before deploying.
