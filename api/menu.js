const express = require('express');
const menuRouter = express.Router();
const menuItemRouter = require('./menuitem');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = menuRouter;