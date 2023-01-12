const { Client } = require('pg')
const { POSTGRES_URI, DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT} = process.env;

const client = new Client({
    password: DB_PASSWORD,
    user: DB_USERNAME,
    host: POSTGRES_URI,
    database: DB_NAME,
    port: DB_PORT,
})  
// .then(() => {
//     console.log("Successfully connected to database")
// })
// .catch((error) => {
//     console.log("database connection failed.")
//     console.error(error)
//     process.exit(1)
// })

exports.client = client
exports.seedDatabase = () => {
    client.query(`CREATE TABLE IF NOT EXISTS users(
        id SERIAL,
        admin BOOLEAN DEFAULT FALSE,
        name VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(320) UNIQUE NOT NULL,
        password CHAR(64) NOT NULL,
        age REAL NOT NULL,
        height REAL NOT NULL,
        PRIMARY KEY(id)
    );`);
    client.query(`CREATE TABLE IF NOT EXISTS methods(
        id SERIAL,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(500),
        PRIMARY KEY(id)
    );`);
    client.query(`CREATE TABLE IF NOT EXISTS measurments(
        id SERIAL,
        user_id INT NOT NULL,
        method_id INT,
        type VARCHAR(100) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        value REAL,
        PRIMARY KEY(id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(method_id) REFERENCES methods(id) ON DELETE CASCADE
    );`);
    client.query(`CREATE TABLE IF NOT EXISTS ads(
        id SERIAL,
        image_url VARCHAR(2048) NOT NULL,
        target_url VARCHAR(2048) NOT NULL,
        clickCount INT DEFAULT 0,
        PRIMARY KEY(id)
    );`);
    client.query(`
        INSERT INTO users (admin,name,email,password,age,height)
        VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING
    `,[true,'Admin','admin@admin.com','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 23,192])
    client.query(`
        INSERT INTO ads (image_url, target_url)
        VALUES ($1, $2) ON CONFLICT DO NOTHING
    `,['https://placeimg.com/500/300/nature','https://google.com/'])
}
