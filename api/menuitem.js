const express = require('express');
const menuItemRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /api/menus/:menuId/menu-items
menuItemRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.menuId}`,
  function(err, menuItems) {
    if (err) {
      next(err);
    }
    res.status(200).json({ menuItems: menuItems })
  })
})
//   - Returns a 200 response containing all saved menu items related to the menu with the supplied menu ID on the `menu items` property of the response body

const validateMenuItemBody = (req, res, next) => {
  req.name = req.body.menuItem.name;
  req.description = req.body.menuItem.description;
  req.inventory = req.body.menuItem.inventory;
  req.price = req.body.menuItem.price;

  if ( !req.name || !req.description || !req.inventory || !req.price ) {
    return res.sendStatus(400);
  }
  next();
}
//   - If any required fields are missing, returns a 400 response

menuItemRouter.post('/', validateMenuItemBody, (req, res, next) => {
  db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)`,
  {
    $name: req.name,
    $description: req.description,
    $inventory: req.inventory,
    $price: req.price,
    $menuId: req.menuId
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`,
    function(err, menuItem) {
      res.status(201).json({ menuItem: menuItem })
    })
  })
})
//   - Creates a new menu item, related to the menu with the supplied menu ID, with the information from the `menuItem` property of the request body and saves it to the database. Returns a 201 response with the newly-created menu item on the `menuItem` property of the response body


// /api/menus/:menuId/menu-items/:menuItemId
menuItemRouter.param('menuItemId', (req, res, next, menuItemId) => {
  db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${menuItemId}`,
  function(err, menuItem) {
    if (err) {
      next(err);
    } else if (menuItem) {
      req.menuItem = menuItem;
      req.menuItemId = menuItemId;
      next();
    } else {
      res.sendStatus(404);
    }
  })
})
//   - If a menu item with the supplied menu item ID doesn't exist, returns a 404 response

menuItemRouter.put('/:menuItemId', validateMenuItemBody, (req, res, next) => {
  db.run(`UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId`,
  {
    $name: req.name,
    $description: req.description,
    $inventory: req.inventory,
    $price: req.price,
    $menuId: req.menuId,
    $menuItemId: req.menuItemId
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.menuItemId}`,
    function(err, menuItem) {
      res.status(200).json({ menuItem: menuItem })
    })
  })
})
//   - Updates the menu item with the specified menu item ID using the information from the `menuItem` property of the request body and saves it to the database. Returns a 200 response with the updated menu item on the `menuItem` property of the response body

menuItemRouter.delete('/:menuItemId', (req, res, next) => {
  db.run(`DELETE FROM MenuItem WHERE MenuItem.id = ${req.menuItemId}`,
  function(err) {
    if (err) {
      next(err);
    }
    res.sendStatus(204);
  })
})
//   - Deletes the menu item with the supplied menu item ID from the database. Returns a 204 response.

module.exports = menuItemRouter;