<?php
// submission-success.php - Public Event Submission Confirmation & Tracking Code Receipt (UC20)

$page_title = "Submission Confirmation | K-Sync Malaysia";
require_once __DIR__ . '/includes/header.php';

$code = trim($_GET['code'] ?? '');
$event = null;

if (!empty($code)) {
    $stmt = $pdo->prepare("
        SELECT e.*, a.name as artist_name, c.name as category_name
        FROM events e
        LEFT JOIN artists a ON e.artist_id = a.id
        LEFT JOIN event_categories c ON e.category_id = c.id
        WHERE e.tracking_code = ?
    ");
    $stmt->execute([$code]);
    $event = $stmt->fetch();
}
?>

<div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Success Banner Card -->
    <div class="glass-card p-8 rounded-3xl border border-emerald-200/90 shadow-xl text-center relative overflow-hidden bg-white/95">
        <div class="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 mb-6">
            <i class="fas fa-circle-check"></i>
        </div>

        <span class="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            Submission Received (Pending Review)
        </span>

        <h1 class="text-3xl font-black text-slate-900 tracking-tight mt-4">
            Thank You for Submitting!
        </h1>
        <p class="text-slate-600 text-sm mt-2 max-w-lg mx-auto font-medium">
            Your K-Pop event details have been queued for administrative review. To ensure fan safety and prevent misinformation, our team verifies all official links and posters before publishing.
        </p>

        <?php if ($event): ?>
            <!-- Tracking Reference Code Box -->
            <div class="mt-8 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-left relative overflow-hidden shadow-2xl border border-slate-700">
                <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                        <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <i class="fas fa-barcode text-pink-400 me-2"></i> Your Official Reference Code (UC20)
                        </div>
                        <div class="text-2xl sm:text-3xl font-mono font-black text-pink-400 tracking-wider mt-1 select-all" id="ref-code">
                            <?= htmlspecialchars($event['tracking_code']) ?>
                        </div>
                        <p class="text-xs text-slate-300 font-medium mt-1">
                            Save this code to check your verification status or make corrections.
                        </p>
                    </div>

                    <div class="flex items-center space-x-2 shrink-0">
                        <button type="button" onclick="copyRefCode()" id="btn-copy-code"
                                class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center cursor-pointer">
                            <i class="fas fa-copy me-1.5 text-pink-300"></i> Copy Code
                        </button>
                    </div>
                </div>
            </div>

            <!-- Event Summary Preview Card -->
            <div class="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center">
                    <i class="fas fa-file-invoice text-indigo-500 me-2"></i> Submission Summary
                </h3>

                <div class="flex flex-col sm:flex-row gap-5 items-start">
                    <img src="<?= htmlspecialchars($event['poster_image']) ?>" alt="Poster" 
                         class="w-24 h-32 object-cover rounded-xl shadow-md border border-slate-200 shrink-0">
                    <div class="space-y-2 flex-grow">
                        <h4 class="text-base font-black text-slate-900 leading-snug">
                            <?= htmlspecialchars($event['event_name']) ?>
                        </h4>
                        <div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                            <span class="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-700 font-bold">
                                <?= htmlspecialchars($event['category_name'] ?? 'K-Pop Event') ?>
                            </span>
                            <?php if ($event['artist_name']): ?>
                                <span class="px-2.5 py-0.5 rounded-lg bg-pink-100 text-pink-700 font-bold">
                                    <?= htmlspecialchars($event['artist_name']) ?>
                                </span>
                            <?php endif; ?>
                            <span class="px-2.5 py-0.5 rounded-lg bg-slate-200 text-slate-700">
                                <i class="far fa-calendar me-1"></i> <?= date('d M Y', strtotime($event['event_date'])) ?>
                            </span>
                        </div>
                        <p class="text-xs text-slate-500">
                            <i class="fas fa-location-dot me-1 text-slate-400"></i> <?= htmlspecialchars($event['venue_name']) ?>, <?= htmlspecialchars($event['city']) ?>
                        </p>
                        <p class="text-xs text-slate-500">
                            <i class="fas fa-user-circle me-1 text-slate-400"></i> Submitter: <span class="font-bold text-slate-700"><?= htmlspecialchars($event['submitter_name'] ?? 'Organizer') ?></span> (<?= htmlspecialchars($event['submitter_email'] ?? '') ?>)
                        </p>
                    </div>
                </div>
            </div>

            <!-- Review Timeline Stepper (UC57 Preview) -->
            <div class="mt-8 pt-6 border-t border-slate-100 text-left">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 mb-6 flex items-center">
                    <i class="fas fa-timeline text-pink-500 me-2"></i> Review Timeline
                </h3>

                <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div class="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                        <div class="w-7 h-7 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center text-xs font-bold mb-2">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="text-xs font-bold text-emerald-900">1. Submitted</div>
                        <div class="text-[10px] text-emerald-700 font-semibold mt-0.5">Assigned Ref Code</div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center ring-2 ring-amber-400/50">
                        <div class="w-7 h-7 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center text-xs font-bold mb-2 animate-pulse">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="text-xs font-bold text-amber-900">2. In Queue</div>
                        <div class="text-[10px] text-amber-700 font-semibold mt-0.5">Est. 24-48 Hours</div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-center opacity-70">
                        <div class="w-7 h-7 rounded-full bg-slate-300 text-slate-700 mx-auto flex items-center justify-center text-xs font-bold mb-2">
                            3
                        </div>
                        <div class="text-xs font-bold text-slate-700">3. Verification</div>
                        <div class="text-[10px] text-slate-500 font-semibold mt-0.5">Evidence & Source Check</div>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-center opacity-70">
                        <div class="w-7 h-7 rounded-full bg-slate-300 text-slate-700 mx-auto flex items-center justify-center text-xs font-bold mb-2">
                            4
                        </div>
                        <div class="text-xs font-bold text-slate-700">4. Decision</div>
                        <div class="text-[10px] text-slate-500 font-semibold mt-0.5">Publish Live or Feedback</div>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a href="<?= $base_url ?>/check-submission.php?code=<?= urlencode($event['tracking_code']) ?>" 
                   class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-xs shadow-lg shadow-pink-500/25 transition-all text-center">
                    <i class="fas fa-magnifying-glass me-2"></i> Track Submission Status Now (UC21)
                </a>
                <a href="<?= $base_url ?>/events.php" 
                   class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center">
                    Return to Event Discovery
                </a>
            </div>

        <?php else: ?>
            <div class="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                Reference code missing or not found.
            </div>
            <div class="mt-6">
                <a href="<?= $base_url ?>/check-submission.php" class="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs">
                    Look up submission by code or email
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>

<script>
function copyRefCode() {
    const code = document.getElementById('ref-code').innerText.trim();
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-code');
        btn.innerHTML = '<i class="fas fa-check me-1.5 text-emerald-400"></i> Copied!';
        btn.classList.add('bg-emerald-600/30', 'border-emerald-400/40');
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy me-1.5 text-pink-300"></i> Copy Code';
            btn.classList.remove('bg-emerald-600/30', 'border-emerald-400/40');
        }, 2000);
    });
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
