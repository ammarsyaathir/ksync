<?php
// includes/firebase_init.php - Official K-Sync Malaysia Firebase SDK & Auth Helper Script
?>
<!-- Firebase Web SDK CDN (Compat Version for Native Browser Support) -->
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>

<script>
// Official User Firebase Configuration for k-sync-malaysia
const firebaseConfig = {
  apiKey: "AIzaSyAI6j0xuTti4MvqbpHWhSb1O4TFiEYrjFc",
  authDomain: "k-sync-malaysia.firebaseapp.com",
  projectId: "k-sync-malaysia",
  storageBucket: "k-sync-malaysia.firebasestorage.app",
  messagingSenderId: "276342828455",
  appId: "1:276342828455:web:52a2c83eca0e4215385a82",
  measurementId: "G-BZRE4PMHP5"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global Google Auth Provider instance
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

/**
 * Triggers Google Sign-In pop-up via Firebase Auth and syncs session with PHP backend
 */
function handleFirebaseGoogleSignIn(selectedRole = 'Fan') {
    const btn = document.getElementById('google-signin-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Connecting to Google...';
    }

    firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log("Welcome!", user.displayName);
            
            // Send authenticated Google user payload to PHP backend
            const formData = new FormData();
            formData.append('email', user.email || '');
            formData.append('full_name', user.displayName || '');
            formData.append('uid', user.uid || '');
            formData.append('photo_url', user.photoURL || '');
            formData.append('role', selectedRole);

            fetch('<?= $base_url ?>/ajax/firebase_google_auth.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = data.redirect;
                } else {
                    alert('Google Authentication Error: ' + data.message);
                    if (btn) {
                        btn.disabled = false;
                        btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 me-2.5 inline" alt="Google"> Continue with Google';
                    }
                }
            })
            .catch(err => {
                console.error('Backend sync error:', err);
                alert('Server error processing Google sign in.');
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 me-2.5 inline" alt="Google"> Continue with Google';
                }
            });
        })
        .catch((error) => {
            console.error("Sign-in failed:", error.message);
            if (error.code === 'auth/popup-closed-by-user') {
                // User closed popup manually
            } else if (error.code === 'auth/unauthorized-domain') {
                alert("Firebase Auth Note: To complete Google login on localhost, ensure 'localhost' is added to Authorized Domains in your Firebase Console (Authentication > Settings > Authorized domains).");
            } else {
                alert("Google Sign-in Error: " + error.message);
            }
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 me-2.5 inline" alt="Google"> Continue with Google';
            }
        });
}
</script>
