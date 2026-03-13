# Discomon - Discord GBA Emulator Activity

A Discord Activity that loads a Game Boy Advance emulator using EmulatorJS.

## Features
- Discord Embedded App SDK integration for seamless authorization.
- GBA emulation via EmulatorJS.
- Full-stack setup with Vite (React) and Express.

## Setup Instructions

### 1. Create a Discord Application
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Create a new application.
3. Copy the **Client ID** and **Client Secret**.
4. In the **OAuth2** section, add the following Redirect URI:
   - `http://localhost:5173` (or your production URL).
5. In the **URL Mappings** section (if available/required for Activities), add:
   - `https://cdn.emulatorjs.org`
   - `https://raw.githubusercontent.com` (for ROM hosting)

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
PORT=3001
```

### 3. Installation
```bash
npm install
npm install:all
```

### 4. Running Locally
```bash
npm run dev
```
This will start:
- Client (Vite): `http://localhost:5173`
- Server (Express): `http://localhost:3001`

### 5. Testing in Discord
To test the activity in Discord, you'll need to use a tool like `cloudflared` or `ngrok` to expose your local server.
1. Map your local `5173` port to a public URL.
2. Update the **External Proxy Host** in the Discord Developer Portal with this URL.

## Development
- **Client**: Located in `/client`. Uses React and TypeScript.
- **Server**: Located in `/server`. Handles the OAuth2 code exchange.

## Dependencies
- `@discord/embedded-app-sdk`
- `EmulatorJS` (via CDN)
- `React` + `Vite`
- `Express` + `Axios`
