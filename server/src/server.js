import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Parse --port / -p CLI flag
function parsePortFromArgs() {
  const args = process.argv.slice(2);
  let portArg;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--port=')) {
      const v = Number(a.split('=')[1]);
      if (Number.isFinite(v) && v > 0) return v;
    }
    if (a === '--port' || a === '-p') {
      const next = Number(args[i + 1]);
      if (Number.isFinite(next) && next > 0) return next;
    }
  }
  return undefined;
}

const DEFAULT_PORT = 4000;
const envPort = Number(process.env.PORT);
const cliPort = parsePortFromArgs();
let PORT = Number.isFinite(cliPort) ? cliPort : (Number.isFinite(envPort) ? envPort : DEFAULT_PORT);

// Middlewares
app.use(cors());
app.use(express.json());

// SQLite DB setup
const dataDir = path.join(__dirname, '../data');
try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
const dbPath = path.join(dataDir, 'app.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL
    )`
  );
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// Registration route
app.post('/register', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Некорректные данные' });
  }

  // Check existing user
  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }

    if (row) {
      return res.json({ success: false, message: 'Аккаунт уже существует, войдите' });
    }

    try {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      db.run('INSERT INTO users (email, passwordHash) VALUES (?, ?)', [email, passwordHash], function (insertErr) {
        if (insertErr) {
          if (insertErr.message?.includes('UNIQUE')) {
            return res.json({ success: false, message: 'Аккаунт уже существует, войдите' });
          }
          console.error('Insert error:', insertErr);
          return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }

        return res.json({ success: true, message: 'Регистрация успешна' });
      });
    } catch (hashErr) {
      console.error('Hash error:', hashErr);
      return res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
  });
});

function startServer(desiredPort, attempted = new Set()) {
  if (attempted.has(desiredPort)) {
    console.error('Failed to bind to any port. Last tried:', desiredPort);
    process.exit(1);
  }
  attempted.add(desiredPort);

  const server = app.listen(desiredPort, () => {
    console.log(`Server is running on http://localhost:${desiredPort}`);
  });
  server.on('error', (err) => {
    if (/** @type {any} */(err).code === 'EADDRINUSE') {
      if (desiredPort === DEFAULT_PORT) {
        const fallback = 4001;
        console.warn(`Port ${desiredPort} in use. Trying fallback port ${fallback}...`);
        startServer(fallback, attempted);
      } else {
        console.error(`Port ${desiredPort} is already in use. You can specify a different port with --port=XXXX`);
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServer(PORT);


