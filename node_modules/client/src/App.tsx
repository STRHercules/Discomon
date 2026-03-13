import { useEffect, useState, useRef } from 'react';
import { DiscordSDK } from '@discord/embedded-app-sdk';
import './App.css';

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID);

declare global {
  interface Window {
    EJS_player: string;
    EJS_core: string;
    EJS_gameUrl: string;
    EJS_pathtodata: string;
    EJS_onMobileStart?: boolean;
  }
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emulatorRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function setupDiscord() {
      try {
        await discordSdk.ready();
        
        const { code } = await discordSdk.commands.authorize({
          client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
          response_type: 'code',
          state: '',
          prompt: 'none',
          scope: ['identify', 'guilds'],
        });

        const response = await fetch('http://localhost:3001/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        const { access_token } = await response.json();

        await discordSdk.commands.authenticate({
          access_token,
        });

        setAuthenticated(true);
      } catch (err: any) {
        console.error('Error during Discord SDK setup:', err);
        setError(err.message || 'Failed to connect to Discord');
      } finally {
        setLoading(false);
      }
    }

    setupDiscord();
  }, []);

  const loadEmulator = () => {
    if (!emulatorRef.current) return;

    window.EJS_player = '#game-container';
    window.EJS_core = 'gba';
    // Using a placeholder ROM for testing. In production, this would be a real URL.
    window.EJS_gameUrl = 'https://raw.githubusercontent.com/binhnd7/gba-roms/master/Pokemon%20-%20Fire%20Red%20Version%20(USA).gba';
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_onMobileStart = true;

    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.async = true;
    document.body.appendChild(script);
  };

  if (loading) {
    return <div className="loading">Initializing Discord SDK...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Discomon GBA</h1>
      </header>
      
      {!authenticated ? (
        <div className="auth-warning">Waiting for authorization...</div>
      ) : (
        <div className="game-wrapper">
          <div id="game-container" ref={emulatorRef} style={{ width: '100%', height: '600px' }}>
            <button className="start-button" onClick={loadEmulator}>
              Click to Start GBA Emulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
