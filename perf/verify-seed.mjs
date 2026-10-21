import Database from 'better-sqlite3';
const d = new Database('database/ksync.db', { readonly: true });
console.log('=== organisers added ===');
console.table(d.prepare("SELECT id, username, email, organization_name, organization_type, social_handle, is_verified_organizer, status FROM users WHERE id >= 6").all());
console.log('\n=== organiser bio (website/socials) ===');
for (const r of d.prepare('SELECT organization_name, bio FROM users WHERE id >= 6').all()) console.log(`- ${r.organization_name}: ${r.bio}`);
console.log('\n=== new events, full detail ===');
for (const e of d.prepare(`SELECT id, event_name, event_date, start_time, venue_name, city, state, promoter_name,
   official_ticket_url, official_source_url, poster_image, ticket_info
   FROM events WHERE id BETWEEN 25 AND 30 ORDER BY event_date`).all()) {
  console.log(`\n#${e.id} ${e.event_name}\n   ${e.event_date} ${e.start_time} | ${e.venue_name}, ${e.city}, ${e.state}\n   promoter : ${e.promoter_name}\n   tickets  : ${e.ticket_info}\n   buy      : ${e.official_ticket_url}\n   source   : ${e.official_source_url}\n   poster   : ${e.poster_image}`);
}
console.log('\n=== counts ===');
for (const t of ['users', 'artists', 'venues', 'events']) console.log(`  ${t}: ${d.prepare(`SELECT COUNT(*) c FROM "${t}"`).get().c}`);
d.close();
