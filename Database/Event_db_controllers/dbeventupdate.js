const UpdateDatabase = async (db, amount, EventName) => {
  const sql = `
    UPDATE eventdetails 
    SET TotalRev = TotalRev + ? 
    WHERE EventName = ?
  `;
  const params = [amount, EventName];

  try {
    const [result] = await db.execute(sql, params);

    if (result.affectedRows > 0) {
      return 'ok';
    } else {
      return 'no_changes';
    }
  } catch (err) {
    throw err;
  }
};

module.exports = {
  UpdateDatabase,
};
