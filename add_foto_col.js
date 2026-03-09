import mysql from 'mysql2/promise';

async function run() {
    try {
        const db = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'minggu7' });
        try {
            await db.execute('ALTER TABLE users ADD COLUMN foto LONGTEXT');
            console.log('Added foto column');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('Column foto already exists');
            else console.error(e);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
