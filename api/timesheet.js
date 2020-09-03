const express = require('express');
const timesheetRouter = express.Router({ mergeParams: true });
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// /api/employees/:employeeId/timesheets

timesheetRouter.get('/', (req, res, next) => {
  db.all(`SELECT * FROM Timesheet WHERE Timesheet.employee_id = ${req.employeeId}`,
  (err, timesheets) => {
    if (err) {
      next(err)
    }
    res.status(200).json({ timesheets: timesheets })
  })
})

const validateBody = (req, res, next) => {
  req.hours = req.body.timesheet.hours;
  req.rate = req.body.timesheet.rate;
  req.date = req.body.timesheet.date;

  if ( !req.hours || !req.rate || !req.date ) {
    return res.sendStatus(400);
  }
  next();
}

timesheetRouter.post('/', validateBody, (req, res, next) => {
  db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)`,
  {
    $hours: req.hours,
    $rate: req.rate,
    $date: req.date,
    $employeeId: req.employeeId
  },
  function(err) {
    if (err) {
      next(err)
    }
    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`,
    (err, timesheet) => {
      res.status(201).json({ timesheet: timesheet })
    })
  })
})

// **/api/employees/:employeeId/timesheets/:timesheetId**

timesheetRouter.param('timesheetId', (req, res, next, timesheetId) => {
  db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${timesheetId}`,
  (err, timesheet) => {
    if (err) {
      next(err)
    } else if (timesheet) {
      req.timesheet = timesheet;
      req.timesheetId = timesheetId;
      next();
    } else {
      res.sendStatus(404);
    }
  })
})
//   - If an timesheet with the supplied timesheet ID doesn't exist, returns a 404 response

timesheetRouter.put('/:timesheetId', validateBody, (req, res, next) => {
  db.run(`UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date, employee_id = $employeeId WHERE Timesheet.id = $timesheetId`,
  {
    $hours: req.hours,
    $rate: req.rate,
    $date: req.date,
    $employeeId: req.employeeId,
    $timesheetId: req.timesheetId
  },
  function(err) {
    if (err) {
      next(err)
    }
    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.timesheetId}`,
    (err, timesheet) => {
      res.status(200).json({ timesheet: timesheet })
    })
  })
})
//   - Updates the timesheet with the specified timesheet ID using the information from the `timesheet` property of the request body and saves it to the database. Returns a 200 response with the updated timesheet on the `timesheet` property of the response body


timesheetRouter.delete('/:timesheetId', (req, res, next) => {
  db.run(`DELETE FROM Timesheet WHERE Timesheet.id = ${req.timesheetId}`,
  function(err) {
    if (err) {
      next(err)
    }
    res.sendStatus(204);
  })
})
//   - Deletes the timesheet with the supplied timesheet ID from the database. Returns a 204 response.

module.exports = timesheetRouter;