import session from 'express-session';
import MongoStore from 'connect-mongo';
export const cookieName = process.env.SESSION_NAME || 'smart_college.sid';
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.SESSION_COOKIE_SECURE === 'true',
  sameSite: process.env.SESSION_COOKIE_SAME_SITE || 'lax',
  path: '/'
};
export default function sessionConfig() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must have at least 32 characters');
  if (!process.env.SESSION_MONGODB_URI) throw new Error('SESSION_MONGODB_URI is required');
  // Read only database names; replica-set URIs may contain multiple hosts.
  const databaseName = uri => uri.split('?')[0].slice(uri.split('?')[0].lastIndexOf('/') + 1);
  const appDB = databaseName(process.env.MONGODB_URI);
  const sessionDB = databaseName(process.env.SESSION_MONGODB_URI);
  if (!appDB || !sessionDB) throw new Error('Both MongoDB URIs must explicitly name a database');
  if (appDB === sessionDB) throw new Error('Sessions must use a separate database');
  return session({
    name: cookieName,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.SESSION_MONGODB_URI,
      collectionName: 'sessions'
    }),
    cookie: {
      ...cookieOptions,
      maxAge: Number(process.env.SESSION_MAX_AGE || 86400000)
    }
  });
}
