const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect or create the SQLite database
const dbPath = path.resolve(__dirname, 'data.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});

db.serialize(() => {
  // Table 1: eventdetails
  db.run(`
    CREATE TABLE IF NOT EXISTS eventdetails (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      EventName TEXT,
      ImageURL TEXT,
      Venue TEXT,
      Location TEXT,
      FirstDate TEXT,
      SecondDate TEXT,
      Time TEXT,
      StandardPrice INTEGER,
      VipPrice INTEGER,
      QRcodeURL TEXT,
      StandardBaseID TEXT,
      VipBaseID TEXT,
      EventURL TEXT,
      EventDesc TEXT,
      TicketsSold INTEGER DEFAULT 0,
      DailyRev INTEGER DEFAULT 0,
      TotalRev INTEGER DEFAULT 0,
      Status INTEGER,
      RegTime TEXT DEFAULT CURRENT_TIMESTAMP,
      Date TEXT DEFAULT CURRENT_DATE
    )
  `);

  // Table 2: customer_records
  db.run(`
    CREATE TABLE IF NOT EXISTS customer_records (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      first_name TEXT,
      surname TEXT,
      num_tickets INTEGER,
      total REAL,
      ticket_UID TEXT,
      date TEXT
    )
  `);

  // Table 3: landingpage_status
  db.run(`
    CREATE TABLE IF NOT EXISTS landingpage_status (
      landingstate INTEGER DEFAULT 0
    )
  `);

  // Table 4: maintainancepage_status
  db.run(`
    CREATE TABLE IF NOT EXISTS maintainancepage_status (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      maintainancestate TEXT
    )
  `);

  // Table 5: ticket_details
  db.run(`
    CREATE TABLE IF NOT EXISTS ticket_details (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_UID TEXT
    )
  `);

  // Table 6: ticket_uid
  db.run(`
    CREATE TABLE IF NOT EXISTS ticket_uid (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      UID TEXT
    )
  `);
});

module.exports = db;
