import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// Always load backend/.env, even when Node is launched from the project root.
dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
  quiet: true
});
