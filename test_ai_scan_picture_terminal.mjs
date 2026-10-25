// test_ai_scan_picture_terminal.mjs - Automated Verification of AI Picture Upload & Terminal Extraction
import assert from 'assert';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:9000';

async function runTest() {
  console.log('--- Testing AI Scan Picture Upload & 1-by-1 Terminal Extraction ---');

  // 1. Verify JSON URL mode extraction
  console.log('1. Testing POST /api/ai/extract-poster with URL payload...');
  const jsonRes = await fetch(`${BASE_URL}/api/ai/extract-poster`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      poster_url: 'https://ime.co/wp-content/uploads/2026/07/01_BND_1080x1350.jpg',
      caption_text: 'BOYNEXTDOOR TOUR KNOCK ON Vol.2 IN KUALA LUMPUR'
    })
  });
  assert.strictEqual(jsonRes.status, 200, 'POST /api/ai/extract-poster returns HTTP 200 for JSON');
  const jsonBody = await jsonRes.json();
  assert.strictEqual(jsonBody.status, 'success', 'Response status is success');
  assert(jsonBody.data.event_name.includes('BOYNEXTDOOR'), 'Extracted event name matches artist');
  assert(jsonBody.data.venue_name, 'Extracted venue name present');
  console.log('✓ JSON extraction verified successfully:', jsonBody.data.event_name);

  // 2. Verify Direct Picture Upload via multipart/form-data
  console.log('2. Testing POST /api/ai/extract-poster with direct picture file upload...');
  
  // Create a dummy test image buffer
  const dummyBuffer = Buffer.from('fake-image-bytes-for-multimodal-test');
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  
  const multipartHeader = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="poster_image_file"; filename="boynextdoor_kl_test.jpg"\r\n` +
    `Content-Type: image/jpeg\r\n\r\n`
  );
  const multipartFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
  const multipartBody = Buffer.concat([multipartHeader, dummyBuffer, multipartFooter]);

  const fileRes = await fetch(`${BASE_URL}/api/ai/extract-poster`, {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: multipartBody
  });

  assert.strictEqual(fileRes.status, 200, 'POST /api/ai/extract-poster returns HTTP 200 for direct picture upload');
  const fileJson = await fileRes.json();
  assert.strictEqual(fileJson.status, 'success', 'Direct picture response status is success');
  assert(fileJson.data.event_name, 'Extracted event name present from picture');
  assert(fileJson.data.poster_url, 'Extracted poster URL present from uploaded picture');
  assert.strictEqual(fileJson.poster_source, 'picture_file_upload', 'Identified picture file upload source');
  console.log('✓ Direct picture file upload verified successfully:', fileJson.data.poster_url);

  // 3. Verify HTML markup in event-form.ejs
  console.log('3. Testing /organizer/events/new HTML structure...');
  const formRes = await fetch(`${BASE_URL}/organizer/events/new`);
  // Note: /organizer/events/new requires login redirect when unauthenticated
  assert(formRes.status === 200 || formRes.status === 302, 'Route is reachable');

  const formViewContent = fs.readFileSync('views/organizer/event-form.ejs', 'utf-8');
  assert(formViewContent.includes('aiPictureDropzone'), 'Picture dropzone present in view');
  assert(formViewContent.includes('aiPosterFileInput'), 'Picture file input present in view');
  assert(formViewContent.includes('aiScanTerminalModal'), 'AI Scan Terminal Console modal present in view');
  assert(formViewContent.includes('terminalLaserBeam'), 'Neon laser scanning beam present in view');
  assert(formViewContent.includes('terminalExtractedCardsList'), '1-by-1 extracted entity inspector list present in view');
  assert(formViewContent.includes('btnApplyAiTerminalDetails'), 'Apply extracted details button present in view');
  assert(formViewContent.includes('Gemini 4 Argon') && formViewContent.includes('AI Scan'), 'Required test labels preserved');
  console.log('✓ All HTML, Modal, Terminal, Laser Beam, and 1-by-1 Extraction components verified in view!');

  console.log('\n🎉 ALL AI PICTURE UPLOAD & 1-BY-1 TERMINAL SCAN TESTS PASSED 100%!\n');
}

runTest().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
