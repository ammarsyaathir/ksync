<?php
// includes/header.php - Enhanced Light & Vibrant K-Pop Theme

require_once __DIR__ . '/../config/auth.php';
require_once __DIR__ . '/functions.php';

$base_url = (strpos($_SERVER['REQUEST_URI'], '/ksync_malaysia') !== false) ? '/ksync_malaysia' : '';
$current_user = get_current_user_data();
$unread_count = $current_user ? get_unread_notification_count($current_user['id']) : 0;
$page_title = $page_title ?? 'K-Sync Malaysia | K-Pop Event Discovery Platform';
?>
<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-50 text-slate-800">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($page_title) ?></title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#fdf4ff',
                            100: '#fae8ff',
                            200: '#f5d0fe',
                            300: '#f0abfc',
                            400: '#e879f9',
                            500: '#d946ef',
                            600: '#c026d3',
                            700: '#a21caf',
                            800: '#86198f',
                            900: '#701a75',
                            950: '#4a044e',
                        }
                    },
                    fontFamily: {
                        sans: ['Outfit', 'Inter', 'sans-serif'],
                    },
                    boxShadow: {
                        'glow': '0 0 25px -5px rgba(217, 70, 239, 0.25)',
                        'card-hover': '0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 8px 10px -6px rgba(168, 85, 247, 0.1)',
                    }
                }
            }
        }
    </script>
    <!-- FontAwesome & Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { 
            font-family: 'Outfit', 'Inter', sans-serif;
            background-color: #f8fafc;
            background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
            background-size: 24px 24px;
            color: #0f172a;
        }

        /* Pointer Cursor Consistency */
        a, button, select, input[type="submit"], input[type="button"], input[type="checkbox"], input[type="radio"], label.cursor-pointer, .clickable {
            cursor: pointer !important;
        }

        /* Glass Cards & Navigation */
        .glass-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -2px rgba(0, 0, 0, 0.03);
            transition: all 0.25s ease-in-out;
        }
        .glass-card:hover {
            box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04);
            border-color: #cbd5e1;
            transform: translateY(-2px);
        }
        .glass-nav {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid #e2e8f0;
        }

        /* Standard Text Gradient for Brand Only */
        .brand-gradient {
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Micro-Animations & Glow Effects */
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 12px rgba(236, 72, 153, 0.2); }
            50% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
        }
        @keyframes floatAnim {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
        }
        .glow-effect {
            animation: pulseGlow 3s infinite ease-in-out;
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="flex flex-col min-h-screen text-slate-800 antialiased selection:bg-pink-500 selection:text-white">
<?php include __DIR__ . '/navbar.php'; ?>

<!-- Flash Message Notifications -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-4">
    <?php foreach (get_flash_messages() as $type => $msg): ?>
        <?php 
            $colorMap = [
                'success' => 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-500/10',
                'error' => 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-500/10',
                'info' => 'bg-cyan-50 border-cyan-200 text-cyan-800 shadow-cyan-500/10',
                'warning' => 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-500/10',
            ];
            $iconMap = [
                'success' => 'fa-check-circle text-emerald-500',
                'error' => 'fa-exclamation-circle text-rose-500',
                'info' => 'fa-info-circle text-cyan-500',
                'warning' => 'fa-triangle-exclamation text-amber-500',
            ];
            $alertClass = $colorMap[$type] ?? $colorMap['info'];
            $alertIcon = $iconMap[$type] ?? $iconMap['info'];
        ?>
        <div class="p-4 mb-3 rounded-2xl border flex items-center justify-between <?= $alertClass ?> shadow-lg animate-fade-in">
            <div class="flex items-center space-x-3">
                <i class="fas <?= $alertIcon ?> text-lg"></i>
                <span class="font-bold text-sm"><?= htmlspecialchars($msg) ?></span>
            </div>
            <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-slate-600 transition-colors"><i class="fas fa-xmark"></i></button>
        </div>
    <?php endforeach; ?>
</div>

<main class="flex-grow">
