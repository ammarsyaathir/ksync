<?php
// register.php - User Account Registration with Firebase Google Auth

$page_title = "Register Account | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';

$base_url = (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';
if (is_logged_in()) {
    header("Location: {$base_url}/index.php");
    exit;
}

$error = '';
$pre_role = $_GET['role'] ?? 'fan';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $full_name = trim($_POST['full_name'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $role_name = trim($_POST['role'] ?? 'Fan');

    if (empty($full_name) || empty($username) || empty($email) || empty($password)) {
        $error = "All fields are required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Please enter a valid email address.";
    } else {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$email, $username]);
        if ($stmt->fetch()) {
            $error = "Username or Email address is already registered.";
        } else {
            $stmtRole = $pdo->prepare("SELECT id FROM roles WHERE LOWER(name) = LOWER(?)");
            $stmtRole->execute([$role_name]);
            $role_id = $stmtRole->fetchColumn() ?: 3;

            $password_hash = password_hash($password, PASSWORD_DEFAULT);

            $ins = $pdo->prepare("INSERT INTO users (role_id, full_name, username, email, password_hash) VALUES (?, ?, ?, ?, ?)");
            $ins->execute([$role_id, $full_name, $username, $email, $password_hash]);
            $new_id = $pdo->lastInsertId();

            log_activity($new_id, 'USER_REGISTER', 'users', $new_id, "New {$role_name} account created");

            set_flash_message('success', "Account registered successfully! Please log in with your credentials.");
            header("Location: {$base_url}/login.php");
            exit;
        }
    }
}
?>

<div class="max-w-lg mx-auto px-4 py-16">
    <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
        <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md shadow-pink-500/20">
                <i class="fas fa-user-plus"></i>
            </div>
            <h1 class="text-2xl font-bold text-slate-900">Join K-Sync Malaysia</h1>
            <p class="text-xs text-slate-500 mt-1 font-medium">Create your account to discover, save, or submit K-Pop events.</p>
        </div>

        <?php if ($error): ?>
            <div class="p-3 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center">
                <i class="fas fa-triangle-exclamation me-1"></i> <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <!-- GOOGLE / SUPABASE SIGN-UP BUTTONS -->
        <div class="mb-6 space-y-2.5">
            <button type="button" id="google-signin-btn" onclick="triggerGoogleSignUp()" 
                    class="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-sm transition-all flex items-center justify-center">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-4 h-4 me-2 inline" alt="Google">
                <span>Sign up with Firebase Google</span>
            </button>
            <button type="button" id="supabase-google-btn" onclick="triggerSupabaseSignUp()" 
                    class="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 shadow-sm transition-all flex items-center justify-center">
                <i class="fas fa-bolt text-emerald-600 me-2 text-sm"></i>
                <span>Sign up with Supabase Auth</span>
            </button>
            <div class="relative flex py-3 items-center">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-3 text-slate-400 text-[10px] font-semibold uppercase">Or register with email</span>
                <div class="flex-grow border-t border-slate-200"></div>
            </div>
        </div>

        <form method="POST" action="" class="space-y-4">
            <!-- Account Type Selection -->
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Account Role</label>
                <div class="grid grid-cols-2 gap-3">
                    <label class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2 cursor-pointer hover:border-pink-300">
                        <input type="radio" name="role" id="role-fan" value="Fan" <?= strtolower($pre_role) !== 'organizer' ? 'checked' : '' ?> class="text-pink-600 focus:ring-pink-500">
                        <div>
                            <p class="text-xs font-bold text-slate-900">K-Pop Fan</p>
                            <p class="text-[10px] text-slate-500 font-medium">Discover & Save Events</p>
                        </div>
                    </label>

                    <label class="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center space-x-2 cursor-pointer hover:border-pink-300">
                        <input type="radio" name="role" id="role-org" value="Organizer" <?= strtolower($pre_role) === 'organizer' ? 'checked' : '' ?> class="text-pink-600 focus:ring-pink-500">
                        <div>
                            <p class="text-xs font-bold text-slate-900">Event Organizer</p>
                            <p class="text-[10px] text-slate-500 font-medium">Submit & Manage Events</p>
                        </div>
                    </label>
                </div>
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" name="full_name" required placeholder="e.g. Nur Aina Zahra"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <input type="text" name="username" required placeholder="e.g. aina_blink"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" name="email" required placeholder="name@domain.com"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input type="password" name="password" required placeholder="Minimum 6 characters" minlength="6"
                       class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm font-medium">
            </div>

            <button type="submit" class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-sm shadow-md shadow-pink-500/20 transition-all">
                Create Account
            </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-600 font-medium">
            Already registered? <a href="<?= $base_url ?>/login.php" class="text-pink-600 font-bold hover:underline">Log In</a>
        </div>
    </div>
</div>

<?php include __DIR__ . '/includes/firebase_init.php'; ?>
<?php include __DIR__ . '/includes/supabase_auth_init.php'; ?>
<script>
function triggerGoogleSignUp() {
    const selectedRole = document.getElementById('role-org').checked ? 'Organizer' : 'Fan';
    handleFirebaseGoogleSignIn(selectedRole);
}
function triggerSupabaseSignUp() {
    const selectedRole = document.getElementById('role-org').checked ? 'Organizer' : 'Fan';
    handleSupabaseGoogleSignIn(selectedRole);
}
</script>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
