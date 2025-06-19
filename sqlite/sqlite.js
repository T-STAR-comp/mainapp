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

    // Table 3: log_table
    db.run(`
      CREATE TABLE IF NOT EXISTS log_table (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        tx_ref TEXT,
        url TEXT UNIQUE,
        baseIdentifier TEXT,
        EventName REAL,
        TicketHolder TEXT,
        EventTime TEXT,
        TicketType TEXT,
        EventDate TEXT,
        Venue TEXT
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

  db.run(`
    CREATE TABLE IF NOT EXISTS transport_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    type TEXT TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    balance REAL DEFAULT 0.0,
    path TEXT NOT NULL
  )
    `)

  db.run(`
    CREATE TABLE IF NOT EXISTS transport_Routes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userName TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departures TEXT NOT NULL,
      price REAL NOT NULL,
      state TEXT NOT NULL DEFAULT 'inactive'  -- 'active' or 'inactive'
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ticket_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      UID_val TEXT NOT NULL,
      qrCodeDataURL TEXT NOT NULL,
      route TEXT NOT NULL,
      departure TEXT NOT NULL,
      travel_date TEXT NOT NULL, -- stored in ISO 8601 (YYYY-MM-DD)
      total_price REAL NOT NULL,
      tickets_bought INTEGER NOT NULL,
      seat_number TEXT NOT NULL,
      provider_username TEXT NOT NULL,
      payment_state INTEGER DEFAULT 0, -- 0 = unpaid, 1 = paid,
      verified INTEGER DEFAULT 0 -- 0 = unverified, 1 verified
    );
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

  // Table 7: ticket-type
  db.run(`
    CREATE TABLE IF NOT EXISTS Ticket_type (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT,
      type TEXT,
      uid TEXT,
      price REAL
    )
  `);
});

module.exports = db;
