<?php
// calendar.php - Redirect to Events Discovery
require_once __DIR__ . '/config/database.php';
header("Location: {$base_url}/events.php");
exit;
