const express = require('express');
const employeeRouter = express.Router();
const timesheetRouter = require('./timesheet');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /api/employees Routes

employeeRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Employee WHERE Employee.is_current_employee = 1`,
  (err, employees) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ employees: employees });
    }
  })
})

const validateBody = (req, res, next) => {
  req.name = req.body.employee.name;
  req.position = req.body.employee.position;
  req.wage = req.body.employee.wage;
  req.isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

  if ( !req.name || !req.position || !req.wage ) {
    return res.sendStatus(400);
  }
  next();
}

employeeRouter.post('/', validateBody, (req, res, next) => {
  db.run(`INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)`,
  {
    $name: req.name,
    $position: req.position,
    $wage: req.wage,
    $isCurrentEmployee: req.isCurrentEmployee
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`,
    (err, employee) => {
      res.status(201).json({ employee: employee });
    })
  })
})

// /api/employees/:employeeId Routes

employeeRouter.param('employeeId', (req, res, next, employeeId) => {
  db.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`,
  (err, employee) => {
    if (err) {
      next(err);
    } else if (employee) {
      req.employee = employee;
      req.employeeId = employeeId;
      next();
    } else {
      res.sendStatus(404);
    }
  })
})

employeeRouter.use('/:employeeId/timesheets', timesheetRouter);

employeeRouter.get('/:employeeId', (req, res) => {
  res.status(200).json({ employee: req.employee });
})

employeeRouter.put('/:employeeId', validateBody, (req, res, next) => {
  db.run(`UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId`,
  {
    $name: req.name,
    $position: req.position,
    $wage: req.wage,
    $isCurrentEmployee: req.isCurrentEmployee,
    $employeeId: req.employeeId
  },
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.employeeId}`,
    (err, employee) => {
      res.status(200).json({ employee: employee });
    })
  })
})

employeeRouter.delete('/:employeeId', (req, res, next) => {
  db.run(`UPDATE Employee SET is_current_employee = '0' WHERE Employee.id = ${req.employeeId}`,
  function(err) {
    if (err) {
      next(err);
    }
    db.get(`SELECT * FROM Employee WHERE Employee.id = ${req.employeeId}`,
    (err, employee) => {
      res.status(200).json({ employee: employee });
    })
  })
})

module.exports = employeeRouter;