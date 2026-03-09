import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProduction = process.env.NODE_ENV === "production";

  app.use(express.json());
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "spotify-melodix-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        // Local HTTP dev cannot use secure cookies, otherwise Spotify login never sticks.
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        httpOnly: true,
      },
    })
  );

  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REDIRECT_URI = `${process.env.APP_URL || "http://localhost:3000"}/auth/callback`;

  // API Routes
  app.get("/api/auth/url", (req, res) => {
    if (!SPOTIFY_CLIENT_ID) {
      return res.status(500).json({ error: "Spotify Client ID not configured" });
    }

    const scope = "user-read-private user-read-email user-library-read";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      show_dialog: "true",
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
  });

  app.get("/auth/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication could not be completed. You can close this window.</p>
          </body>
        </html>
      `);
    }

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token, refresh_token, expires_in } = response.data;
      
      // Store in session
      (req.session as any).spotifyAccessToken = access_token;
      (req.session as any).spotifyRefreshToken = refresh_token;
      (req.session as any).spotifyTokenExpires = Date.now() + expires_in * 1000;

      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication successful. This window should close automatically.</p>
          </body>
        </html>
      `);
    } catch (error: any) {
      console.error("Spotify Token Exchange Error:", error.response?.data || error.message);
      res.status(500).send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Authentication failed. You can close this window and try again.</p>
          </body>
        </html>
      `);
    }
  });

  app.get("/api/me", async (req, res) => {
    const token = (req.session as any).spotifyAccessToken;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Failed to fetch profile" });
    }
  });

  app.get("/api/spotify/search", async (req, res) => {
    const token = (req.session as any).spotifyAccessToken;
    const query = req.query.q as string;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        params: { q: query, type: "track", limit: 20 },
        headers: { Authorization: `Bearer ${token}` },
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { error: "Search failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
