<?php
// includes/verify_token.php - Server-side verification of Firebase + Supabase tokens.
//
// SECURITY: The browser must never be trusted to assert who it is. These helpers
// verify the JWT signature and standard claims before any identity is used.
// No Composer dependencies are required (uses curl + openssl).

if (!function_exists('ks_base64url_decode')) {
    function ks_base64url_decode($data) {
        $data = strtr($data, '-_', '+/');
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode($data, true);
    }
}

if (!function_exists('ks_fetch_google_certs')) {
    // Google's x509 certificates for Firebase ID tokens (cached for 1 hour).
    function ks_fetch_google_certs() {
        $cacheFile = sys_get_temp_dir() . '/ks_google_certs.json';
        if (is_file($cacheFile) && (time() - filemtime($cacheFile) < 3600)) {
            $cached = json_decode(file_get_contents($cacheFile), true);
            if (is_array($cached) && !empty($cached)) {
                return $cached;
            }
        }

        $url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 200 || empty($body)) {
            return [];
        }
        $certs = json_decode($body, true);
        if (!is_array($certs)) {
            return [];
        }
        @file_put_contents($cacheFile, $body);
        return $certs;
    }
}

if (!function_exists('verify_firebase_id_token')) {
    /**
     * Verify a Firebase ID token. Returns the verified claims array.
     * Throws Exception when the token is missing, malformed, forged, expired or
     * has the wrong issuer/audience.
     */
    function verify_firebase_id_token($idToken) {
        $projectId = getenv('FIREBASE_PROJECT_ID') ?: 'k-sync-malaysia';

        if (!is_string($idToken) || substr_count($idToken, '.') !== 2) {
            throw new Exception('Missing or malformed ID token');
        }

        [$headerB64, $payloadB64, $signatureB64] = explode('.', $idToken);
        $header = json_decode(ks_base64url_decode($headerB64), true);
        $payload = json_decode(ks_base64url_decode($payloadB64), true);

        if (!is_array($header) || !is_array($payload)) {
            throw new Exception('Malformed token');
        }
        // Reject "none" and asymmetric-mismatch attacks.
        if (($header['alg'] ?? '') !== 'RS256') {
            throw new Exception('Unsupported token algorithm');
        }
        $kid = $header['kid'] ?? '';
        if ($kid === '') {
            throw new Exception('Token is missing a key id');
        }

        $certs = ks_fetch_google_certs();
        if (empty($certs[$kid])) {
            throw new Exception('Unknown token signing key');
        }

        $publicKey = openssl_pkey_get_public($certs[$kid]);
        if (!$publicKey) {
            throw new Exception('Invalid signing certificate');
        }
        $verified = openssl_verify("$headerB64.$payloadB64", ks_base64url_decode($signatureB64), $publicKey, OPENSSL_ALGO_SHA256);
        if ($verified !== 1) {
            throw new Exception('Invalid token signature');
        }

        $now = time();
        if (($payload['iss'] ?? '') !== "https://securetoken.google.com/$projectId") {
            throw new Exception('Invalid token issuer');
        }
        if (($payload['aud'] ?? '') !== $projectId) {
            throw new Exception('Invalid token audience');
        }
        if (empty($payload['sub'])) {
            throw new Exception('Invalid token subject');
        }
        if (!empty($payload['exp']) && $now > ($payload['exp'] + 60)) {
            throw new Exception('Token has expired');
        }
        if (!empty($payload['iat']) && $payload['iat'] > ($now + 60)) {
            throw new Exception('Token used before it was issued');
        }

        return $payload;
    }
}

if (!function_exists('verify_supabase_jwt')) {
    /**
     * Verify a Supabase access token (HS256, signed with the project's JWT secret).
     * Requires SUPABASE_JWT_SECRET. Throws Exception on any failure.
     */
    function verify_supabase_jwt($jwt) {
        $secret = getenv('SUPABASE_JWT_SECRET') ?: '';
        if ($secret === '') {
            throw new Exception('Supabase token verification is not configured');
        }
        if (!is_string($jwt) || substr_count($jwt, '.') !== 2) {
            throw new Exception('Missing or malformed Supabase token');
        }

        [$headerB64, $payloadB64, $signatureB64] = explode('.', $jwt);
        $header = json_decode(ks_base64url_decode($headerB64), true);
        $payload = json_decode(ks_base64url_decode($payloadB64), true);

        if (!is_array($header) || !is_array($payload)) {
            throw new Exception('Malformed token');
        }
        if (($header['alg'] ?? '') !== 'HS256') {
            throw new Exception('Unsupported token algorithm');
        }

        $expected = hash_hmac('sha256', "$headerB64.$payloadB64", $secret, true);
        $provided = ks_base64url_decode($signatureB64);
        if ($provided === false || !hash_equals($expected, $provided)) {
            throw new Exception('Invalid token signature');
        }

        $now = time();
        if (empty($payload['sub'])) {
            throw new Exception('Invalid token subject');
        }
        if (!empty($payload['exp']) && $now > ($payload['exp'] + 60)) {
            throw new Exception('Token has expired');
        }

        return $payload;
    }
}
