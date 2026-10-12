<?php
// login.php - User Authentication with Firebase Google Sign-In
ob_start();

require_once __DIR__ . '/config/auth.php';
require_once __DIR__ . '/includes/functions.php';

$base_url = (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';
if (is_logged_in()) {
    header("Location: {$base_url}/index.php");
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($email) || empty($password)) {
        $error = "Please fill in all fields.";
    } else {
        $stmt = $pdo->prepare("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? OR u.username = ?");
        $stmt->execute([$email, $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            if ($user['status'] !== 'ACTIVE') {
                $error = "Account is currently suspended. Please contact system admin.";
            } else {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role_name'] = $user['role_name'];
                $_SESSION['full_name'] = $user['full_name'];

                log_activity($user['id'], 'USER_LOGIN', 'users', $user['id'], 'User logged in');

                set_flash_message('success', "Welcome back, {$user['full_name']}!");
                
                if (strtolower($user['role_name']) === 'admin') {
                    header("Location: {$base_url}/admin/dashboard.php");
                } elseif (strtolower($user['role_name']) === 'organizer') {
                    header("Location: {$base_url}/organizer/dashboard.php");
                } else {
                    header("Location: {$base_url}/index.php");
                }
                exit;
            }
        } else {
            $error = "Invalid email/username or password.";
        }
    }
}

$page_title = "Log In | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';
?>

<div class="max-w-md mx-auto px-4 py-16">
    <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md shadow-pink-500/20">
                <i class="fas fa-lock"></i>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Log In to K-Sync</h1>
            <p class="text-xs text-slate-500 mt-1 font-medium">Access personalized event tracking, saved events & organizer dashboard.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                <i class="fas fa-triangle-exclamation me-1"></i> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <!-- GOOGLE / SUPABASE AUTH BUTTONS -->
        <div class="mb-6 space-y-2.5">
            <button type="button" id="google-signin-btn" onclick="handleFirebaseGoogleSignIn('Fan')" 
                    class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-sm transition-all flex items-center justify-center">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4 me-2 inline" alt="Google">
                <span>Continue with Firebase Google</span>
            </button>
            <button type="button" id="supabase-google-btn" onclick="handleSupabaseGoogleSignIn('Fan')" 
                    class="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-sm transition-all flex items-center justify-center">
                <i class="fas fa-bolt text-emerald-600 me-2 text-sm"></i>
                <span>Continue with Supabase Auth</span>
            </button>
            <div class="relative flex py-3 items-center">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-3 text-slate-400 text-[10px] font-semibold uppercase">Or sign in with email</span>
                <div class="flex-grow border-t border-slate-200"></div>
            </div>
        </div>

        <!-- EMAIL LOGIN FORM -->
        <form method="POST" action="" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email or Username</label>
                <input type="text" name="email" required placeholder="admin@ksync.my / fan@ksync.my"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required placeholder="••••••••"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-pink-500/20 transition-all">
                Sign In
            </button>
        </form>

        <!-- Quick Demo Credentials -->
        <div class="mt-8 pt-6 border-t border-slate-100 text-xs">
            <p class="font-bold text-slate-800 mb-2 flex items-center"><i class="fas fa-key text-amber-500 me-1.5"></i> Quick Demo Credentials:</p>
            <div class="space-y-1 text-slate-600 font-mono text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong class="text-emerald-700">Organizer / Fanclub:</strong> organizer@ksync.my / password123</p>
                <p><strong class="text-pink-700">K-Pop Fan:</strong> fan@ksync.my / password123</p>
            </div>
        </div>

        <div class="mt-6 text-center text-xs text-slate-600 font-medium">
            Don't have an account? <a href="<?= $base_url ?>/register.php" class="text-pink-600 font-bold hover:underline">Register Now</a>
        </div>
    </div>
</div>

<?php include __DIR__ . '/includes/firebase_init.php'; ?>
<?php include __DIR__ . '/includes/supabase_auth_init.php'; ?>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
