const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    development: {
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
        host: process.env.DEV_DB_HOSTNAME,
        port: process.env.DEV_DB_POST,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true
        }
    }
};
