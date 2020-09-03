const express = require('express');
const apiRouter = express.Router();
const employeeRouter = require('./employee');
const menuRouter = require('./menu');

apiRouter.use('/employees', employeeRouter);
apiRouter.use('/menus', menuRouter);

module.exports = apiRouter;