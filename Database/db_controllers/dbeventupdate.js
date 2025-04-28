const db = require('../../sqlite/sqlite.js');

const UpdateDatabase = (amount, EventName) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE eventdetails 
      SET TotalRev = TotalRev + ? 
      WHERE EventName = ?
    `;
    const params = [amount, EventName];

    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else if (this.changes > 0) {

        resolve('ok');
      } else {
        resolve('no_changes');
      }
    });
  });
};

module.exports = {
  UpdateDatabase,
};
