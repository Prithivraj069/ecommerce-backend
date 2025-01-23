const pool = require('../database');


//get user by email
async function getUserByEmail(email) {
    if(!email || typeof email !== 'string') {
        throw new Error('Invalid email');
    }

    try{
        const [row] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        return row[0];

    } catch (error) {
        throw error;
    }
}

//get user by id
async function getUserById(id) {
    if(!id || typeof id !== 'number') {
        throw new Error('Invalid user Id');
    }

    try {
        const [row] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        return row[0];

    } catch (error) {
        throw error;
    }
}

//create new user
async function createUser({name, email, password, salutation, country, marketingPreferences}) {
if(!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid user data');
}

const connection = await pool.getConnection();
try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
        `INSERT INTO users (name, email, password, salutation, country) VALUES (?, ?, ?, ?, ?)`,
        [name, email, password, salutation, country]
    );

    const userId = userResult.insertId;

    if(Array.isArray(marketingPreferences)) {
        for(const preference of marketingPreferences) {
            const [preferenceResult] = await connection.query(
                `SELECT id FROM marketing_preferences WHERE preference = ?`, [preference]
            );

            if(preferenceResult.length === 0) {
                throw new Error (`Invalid marketing preference: ${preference}`)
            }

            const preferenceId = preferenceResult[0].id;
            await connection.query(
                `INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)`, 
                [userId, preferenceId]
            );
        }
    }
    await connection.commit();
    return userId;

} catch (error) {
    await connection.rollback();
    throw error;
} finally {
    connection.release();
}
}

//update existing user
async function updateUser(id, {name, email, salutation, country, marketingPreferences,}) {
    if(!id || typeof id !== 'number') {
        throw new Error('Invalid user Id');
    }

    const connection = await pool.getConnection();
    try {
       await connection.beginTransaction();

       await connection.query( 
        `UPDATE users SET name = ?, email = ?, salutation = ?, country = ? WHERE id = ?`,
        [name, email, salutation, country, id]
        )

        //update marketing preferences by deleting existing ones and inserting new one
        await connection.query(
            `DELETE FROM user_marketing_preferences WHERE user_id = ?`,
            [id]
        );

        if(Array.isArray(marketingPreferences)) {
            for(const preference of marketingPreferences) {
                const [preferenceResult] = await connection.query(
                    `SELECT id FROM marketing_preferences WHERE preference = ?`,
                    [preference]
                );

                if(preferenceResult.length === 0) {
                    throw new Error(`Invalid marketing preference: ${preference}`);
                }

                const preferenceId = preferenceResult[0].id;
                await connection.query(
                    `INSERT INTO user_marketing_preferences (user_id, preference_id) VALUES (?, ?)`,
                    [id, preferenceId]
                );
            }
        }

       await connection.commit();
    } catch (e) {
        await connection.rollback();
       throw e;
    } finally {
        connection.release();
    }

}

//delete user
async function deleteUser(id) {
    if(!id || typeof id !== 'number') {
        throw new Error ('Invalid user Id');
    }
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        await connection.query(`DELETE FROM user_marketing_preferences WHERE user_idm = ?`, [id]);
        await connection.query(`DELETE FROM users WHERE user_id = ?`, [id]);

        await connection.commit();
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};