// src/utils/google-auth.js - Server-side Firebase ID token verification
//
// SECURITY: The browser must never be trusted to assert who it is. The client
// sends the Firebase ID token it obtained from Google, and this module verifies
// the JWT signature against Google's published public keys before any identity
// (email/uid) is used. No Firebase service account is required for verification.
import { createRemoteJWKSet, jwtVerify } from 'jose';

const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'k-sync-malaysia';

// Google's public keys for Firebase ID tokens.
const GOOGLE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export function isGoogleAuthConfigured() {
  return Boolean(FIREBASE_PROJECT_ID);
}

/**
 * Verify a Firebase ID token and return its verified claims.
 * Throws if the token is missing, malformed, expired, or has the wrong issuer/audience.
 * @param {string} idToken
 * @returns {Promise<{ sub: string, email?: string, email_verified?: boolean, name?: string, picture?: string }>}
 */
export async function verifyFirebaseIdToken(idToken) {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Missing ID token');
  }

  const { payload } = await jwtVerify(idToken, GOOGLE_JWKS, {
    issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
    audience: FIREBASE_PROJECT_ID
  });

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('Token is missing a valid subject');
  }

  return payload;
}

export default { isGoogleAuthConfigured, verifyFirebaseIdToken };
