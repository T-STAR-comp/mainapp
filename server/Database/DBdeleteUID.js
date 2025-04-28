const db = require('../../sqlite/sqlite.js');

const DeleteUID = (uniqueData) => {
  if (!uniqueData) {
    return null;
  }

  const sql = 'DELETE FROM ticket_uid WHERE UID = ?';

  return new Promise((resolve, reject) => {
    db.run(sql, [uniqueData], function (err) {
      if (err) {
        console.error('❌ Error deleting UID:', err.message);
        return reject(2); // Error occurred
      }

      if (this.changes > 0) {
        resolve(1); // Success
      } else {
        resolve(0); // No rows affected (UID not found)
      }
    });
  });
};

module.exports = { DeleteUID };
