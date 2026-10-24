// database/add_fandom_and_debut_to_artists.mjs
// Adds debut_year and fandom_name columns to artists table and populates them for all 33 artists.

import db from '../config/database.js';

const ARTIST_META = [
  { name: 'ENHYPEN', debut_year: 2020, fandom_name: 'ENGENE' },
  { name: 'SEVENTEEN', debut_year: 2015, fandom_name: 'CARAT' },
  { name: 'TWICE', debut_year: 2015, fandom_name: 'ONCE' },
  { name: 'IU (Lee Ji-eun)', debut_year: 2008, fandom_name: 'UAENA' },
  { name: 'IVE', debut_year: 2021, fandom_name: 'DIVE' },
  { name: 'TOMORROW X TOGETHER (TXT)', debut_year: 2019, fandom_name: 'MOA' },
  { name: 'Stray Kids', debut_year: 2018, fandom_name: 'STAY' },
  { name: 'aespa', debut_year: 2020, fandom_name: 'MY' },
  { name: 'BTS (Bangtan Sonyeondan)', debut_year: 2013, fandom_name: 'ARMY' },
  { name: 'BABYMONSTER', debut_year: 2023, fandom_name: 'MONSTIEZ' },
  { name: 'izna', debut_year: 2024, fandom_name: 'NAYA' },
  { name: 'wave to earth', debut_year: 2019, fandom_name: 'Premie' },
  { name: 'Young K (DAY6)', debut_year: 2015, fandom_name: 'My Day' },
  { name: 'The Rose', debut_year: 2017, fandom_name: 'Black Rose' },
  { name: 'Yves', debut_year: 2017, fandom_name: 'Engraving' },
  { name: 'Yesung (SUPER JUNIOR)', debut_year: 2005, fandom_name: 'E.L.F / Clouds' },
  { name: 'Lee Junho (2PM)', debut_year: 2008, fandom_name: 'HOTTEST' },
  { name: 'BOYNEXTDOOR', debut_year: 2023, fandom_name: 'ONEDOOR' },
  { name: 'BLACKPINK', debut_year: 2016, fandom_name: 'BLINK' },
  { name: 'ITZY', debut_year: 2019, fandom_name: 'MIDZY' },
  { name: 'NCT DREAM', debut_year: 2016, fandom_name: 'NCTzen' },
  { name: 'TREASURE', debut_year: 2020, fandom_name: 'Treasure Maker (Teume)' },
  { name: 'TAEYEON', debut_year: 2007, fandom_name: 'SONE' },
  { name: 'RIIZE', debut_year: 2023, fandom_name: 'BRIIZE' },
  { name: 'ZEROBASEONE (ZB1)', debut_year: 2023, fandom_name: 'ZEROSE' },
  { name: 'SUPER JUNIOR', debut_year: 2005, fandom_name: 'E.L.F' },
  { name: 'EXO', debut_year: 2012, fandom_name: 'EXO-L' },
  { name: '(G)I-DLE', debut_year: 2018, fandom_name: 'Neverland' },
  { name: 'LE SSERAFIM', debut_year: 2022, fandom_name: 'FEARNOT' },
  { name: 'ATEEZ', debut_year: 2018, fandom_name: 'ATINY' },
  { name: '2NE1', debut_year: 2009, fandom_name: 'Blackjack' },
  { name: 'MAMAMOO', debut_year: 2014, fandom_name: 'MOOMOO' },
  { name: 'Red Velvet', debut_year: 2014, fandom_name: 'ReVeluv' }
];

async function run() {
  console.log('🚀 Checking and migrating artists table schema for debut_year & fandom_name...');

  try {
    await db.execute("ALTER TABLE artists ADD COLUMN debut_year INT");
    console.log('  + Added column debut_year to artists');
  } catch (e) {
    console.log('  (debut_year column already exists or noted:', e.message, ')');
  }

  try {
    await db.execute("ALTER TABLE artists ADD COLUMN fandom_name TEXT");
    console.log('  + Added column fandom_name to artists');
  } catch (e) {
    console.log('  (fandom_name column already exists or noted:', e.message, ')');
  }

  for (const item of ARTIST_META) {
    const res = await db.execute(`
      UPDATE artists 
      SET debut_year = ?, fandom_name = ?
      WHERE LOWER(name) = LOWER(?)
    `, [item.debut_year, item.fandom_name, item.name]);

    if (res.affectedRows > 0) {
      console.log(`✓ Updated ${item.name}: Debut ${item.debut_year}, Fandom ${item.fandom_name}`);
    } else {
      console.log(`- No match for ${item.name}`);
    }
  }

  console.log('🎉 Migration completed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error migrating artist metadata:', err);
  process.exit(1);
});
