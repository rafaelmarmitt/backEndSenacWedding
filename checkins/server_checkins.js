require('dotenv').config();
const express = require('express');
cors = require('cors');
mysql = require('mysql2/promise');
const app = express();

app.use(cors(), express.json());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};
