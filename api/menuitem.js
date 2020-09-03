const express = require('express');
const menuItemRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// **/api/menus/:menuId/menu-items**
// - GET
//   - Returns a 200 response containing all saved menu items related to the menu with the supplied menu ID on the `menu items` property of the response body
//   - If a menu with the supplied menu ID doesn't exist, returns a 404 response
// - POST
//   - Creates a new menu item, related to the menu with the supplied menu ID, with the information from the `menuItem` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu item on the `menuItem` property of the response body
//   - If any required fields are missing, returns a 400 response
//   - If a menu with the supplied menu ID doesn't exist, returns a 404 response

// **/api/menus/:menuId/menu-items/:menuItemId**
// - PUT
//   - Updates the menu item with the specified menu item ID using the information from the `menuItem` property of the request body and saves it to the database. Returns a 200 response with the updated menu item on the `menuItem` property of the response body
//   - If any required fields are missing, returns a 400 response
//   - If a menu with the supplied menu ID doesn't exist, returns a 404 response
//   - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response
// - DELETE
//   - Deletes the menu item with the supplied menu item ID from the database. Returns a 204 response.
//   - If a menu with the supplied menu ID doesn't exist, returns a 404 response
//   - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response

module.exports = menuItemRouter;