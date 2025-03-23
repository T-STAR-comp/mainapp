const CreateDBConnection = require('./dbRouter.js');

const DeleteUID = async (uniqueData) => {

    if (!uniqueData) {
        return null;
    }

    try {
        const connection = await CreateDBConnection();
        const [results] = await connection.execute(
            'DELETE FROM ticket_uid WHERE UID = ?', [uniqueData]
        );

        connection.end(); // Close connection

        if (results.affectedRows > 0) {
            return 1;
        } else {
            return 0;
        }
        } catch (err) {
            return 2;
        }
    };

module.exports = { DeleteUID };
