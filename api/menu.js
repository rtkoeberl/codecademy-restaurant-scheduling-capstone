const express = require('express');
const menuRouter = express.Router();
const menuItemRouter = require('./menuitem');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /api/menus

menuRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Menu`,
  (err, menus) => {
    if (err) {
      next(err);
    }
    res.status(200).json({ menus: menus })
  })
})


const validateBody = (req, res, next) => {
  req.title = req.body.menu.title

  if ( !req.title ) {
    return res.sendStatus(400)
  }
  next();
}

menuRouter.post('/', validateBody, (req, res, next) => {
  db.run(`INSERT INTO Menu (title) VALUES ($title)`,
  {
    $title: req.title
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`,
    function(err, menu) {
      res.status(201).json({ menu: menu })
    })
  })
})

// /api/menus/:menuId

menuRouter.param('menuId', (req, res, next, menuId) => {
  db.get(`SELECT * FROM Menu WHERE Menu.id = ${menuId}`,
  (err, menu) => {
    if (err) {
      next(err);
    } else if (menu) {
      req.menu = menu;
      req.menuId = menuId;
      next();
    } else {
      res.sendStatus(404);
    }
  })
})

menuRouter.use('/:menuId/menu-items', menuItemRouter);

menuRouter.get('/:menuId', (req, res) => {
  res.status(200).json({ menu: req.menu })
})

menuRouter.put('/:menuId', validateBody, (req, res, next) => {
  db.run(`UPDATE Menu SET title = $title WHERE Menu.id = $menuId`,
  {
    $title: req.title,
    $menuId: req.menuId
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.menuId}`,
    (err, menu) => {
      res.status(200).json({ menu: menu })
    })
  })
})

menuRouter.delete('/:menuId', (req, res, next) => {
  db.get(`SELECT * FROM MenuItem WHERE MenuItem.menu_id = ${req.menuId}`,
  function(err, menu) {
    if (err) {
      next(err);
    } else if (menu) {
      res.sendStatus(400);
    } else {
      db.run(`DELETE FROM Menu WHERE Menu.id = ${req.menuId}`,
      function(err) {
        if (err) {
          next(err)
        }
        res.sendStatus(204)
      })
    }
  })
})
// - Deletes the menu with the supplied menu ID from the database if that menu has no related menu items. Returns a 204 response.
// - If the menu with the supplied menu ID has related menu items, returns a 400 response.

module.exports = menuRouter;