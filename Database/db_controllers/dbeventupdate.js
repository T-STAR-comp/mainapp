const createDBConnection = require('../db_router');

const UpdateDatabase = async (amount, EventName) => {
    const conn = await createDBConnection();
    
    try {
        const [result] = await conn.execute(
            'UPDATE eventdetails SET TotalRev = TotalRev + ? WHERE EventName = ?',
            [amount, EventName]
        );

        if (result.affectedRows > 0) {
            //console.log('db has been mutated');
            return 'ok';
        } else {
            //console.log('No rows were updated.');
            return 'no_changes';
        }
    } catch (err) {
        //console.error('Database update failed:', err);
        throw err; // Re-throw error to let caller handle it
    } finally {
        await conn.end(); // Ensure the connection is closed
    }
};


module.exports = {
    UpdateDatabase,
}