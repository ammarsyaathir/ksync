<?php
// includes/supabase_auth_init.php - Supabase Auth JS SDK Helper
?>
<!-- Supabase JS SDK CDN -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
// Initialize Supabase Client with User Project Credentials
const SUPABASE_URL = "https://aposfkuaqgxlfdetcdyq.supabase.co";
const SUPABASE_KEY = "sb_publishable_jSPFpJLiBG56Y7_IGRwc9g_wBAIphFU";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Triggers Google OAuth Sign-In via Supabase Auth
 */
async function handleSupabaseGoogleSignIn(selectedRole = 'Fan') {
    const btn = document.getElementById('supabase-google-btn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Connecting to Supabase Auth...';
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '<?= $base_url ?>/login.php'
            }
        });

        if (error) throw error;
    } catch (err) {
        alert("Supabase Google Auth Error: " + err.message);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fab fa-google me-2 text-rose-500"></i> Continue with Google (Supabase)';
        }
    }
}

/**
 * Handles Supabase Email / Password Sign Up
 */
async function handleSupabaseEmailSignUp(email, password, fullName, selectedRole = 'Fan') {
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: fullName,
                    role: selectedRole
                }
            }
        });

        if (error) throw error;

        if (data.user) {
            // Sync with backend DB
            syncSupabaseUser(data.user, fullName, selectedRole);
        }
    } catch (err) {
        alert("Supabase Sign Up Error: " + err.message);
    }
}

/**
 * Handles Supabase Email / Password Sign In
 */
async function handleSupabaseEmailSignIn(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        if (data.user) {
            syncSupabaseUser(data.user, data.user.user_metadata?.full_name || '', 'Fan');
        }
    } catch (err) {
        alert("Supabase Sign In Error: " + err.message);
    }
}

function syncSupabaseUser(user, fullName, role) {
    const formData = new FormData();
    formData.append('email', user.email || '');
    formData.append('full_name', fullName || user.email.split('@')[0]);
    formData.append('uid', user.id || '');
    formData.append('photo_url', user.user_metadata?.avatar_url || '');
    formData.append('role', role);

    fetch('<?= $base_url ?>/ajax/supabase_auth_sync.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            window.location.href = data.redirect;
        } else {
            alert(data.message);
        }
    });
}
</script>
