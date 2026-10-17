<?php
// admin/logs.php - System Activity & Audit Trail Log Viewer

$page_title = "System Activity Logs | K-Sync Admin";
require_once __DIR__ . '/../includes/header.php';
require_role('admin');

// Fetch logs
$stmt = $pdo->query("
    SELECT l.*, u.username, u.full_name, r.name as role_name
    FROM activity_logs l
    LEFT JOIN users u ON l.user_id = u.id
    LEFT JOIN roles r ON u.role_id = r.id
    ORDER BY l.created_at DESC
    LIMIT 100
");
$logs = $stmt->fetchAll();
?>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <!-- Header Banner -->
    <div class="mb-8 pb-6 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <div class="flex items-center space-x-2 mb-2">
                <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <i class="fas fa-file-shield me-1.5 text-emerald-600"></i> Audit Trail & Logs
                </span>
            </div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight flex items-center">
                System Activity & Audit Logs
            </h1>
            <p class="text-slate-600 text-sm mt-1 font-medium">Audit trail recording authentication, event submissions, verifications, rejections, and profile modifications.</p>
        </div>
        <span class="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-900 text-white shadow-sm flex items-center shrink-0 self-start md:self-auto">
            <i class="fas fa-list-ol me-2 text-emerald-400"></i> Showing Last 100 System Events
        </span>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
                <thead class="bg-slate-50 text-slate-700 uppercase font-bold border-b border-slate-200">
                    <tr>
                        <th class="p-3.5"><i class="far fa-clock me-1.5 text-slate-500"></i> Timestamp</th>
                        <th class="p-3.5"><i class="fas fa-user me-1.5 text-pink-500"></i> User</th>
                        <th class="p-3.5"><i class="fas fa-bolt me-1.5 text-amber-500"></i> Action</th>
                        <th class="p-3.5"><i class="fas fa-database me-1.5 text-indigo-500"></i> Entity Type</th>
                        <th class="p-3.5"><i class="fas fa-align-left me-1.5 text-slate-500"></i> Description</th>
                        <th class="p-3.5 text-right"><i class="fas fa-network-wired me-1.5 text-slate-500"></i> IP Address</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php foreach ($logs as $log): ?>
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="p-3.5 font-mono text-slate-500 font-medium"><?= date('Y-m-d H:i:s', strtotime($log['created_at'])) ?></td>
                            <td class="p-3.5">
                                <?php if ($log['username']): ?>
                                    <strong class="text-slate-900 font-bold"><?= htmlspecialchars($log['full_name']) ?></strong> 
                                    <span class="text-[10px] text-purple-600 font-mono font-semibold">(@<?= htmlspecialchars($log['username']) ?>)</span>
                                <?php else: ?>
                                    <span class="text-slate-400 font-italic">Guest / System</span>
                                <?php endif; ?>
                            </td>
                            <td class="p-3.5">
                                <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                                    <?= htmlspecialchars($log['action']) ?>
                                </span>
                            </td>
                            <td class="p-3.5 text-indigo-700 font-mono font-semibold"><?= htmlspecialchars($log['entity_type'] ?? '-') ?></td>
                            <td class="p-3.5 text-slate-800 font-medium"><?= htmlspecialchars($log['description'] ?? '') ?></td>
                            <td class="p-3.5 text-right font-mono text-slate-500"><?= htmlspecialchars($log['ip_address'] ?? '127.0.0.1') ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
