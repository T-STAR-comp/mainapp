const DeleteUID = async (uniqueData, db) => {
  if (!uniqueData) {
    return null;
  }

  const sql = 'DELETE FROM ticket_uid WHERE UID = ?';

  try {
    const [result] = await db.execute(sql, [uniqueData]);

    if (result.affectedRows > 0) {
      return 1; // Success
    } else {
      return 0; // UID not found
    }
  } catch (err) {
    console.error('❌ Error deleting UID:', err);
    return 2; // Error occurred
  }
};

module.exports = { DeleteUID };
