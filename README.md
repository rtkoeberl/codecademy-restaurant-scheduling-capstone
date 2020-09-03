# Expresso: A Codecademy Project

## Project Overview

In this capstone project, I built all of the routing and database logic for an internal tool for a coffee shop called Expresso.

The Expresso internal tool allows users to:
- Create, view, update, and delete menus
- Create, view, update, and delete menu items
- Create, view, update, and delete employees
- Create, view, update, and delete employee's timesheets

### Database Table Properties

* **Employee**
  - id - Integer, primary key, required
  - name - Text, required
  - position - Text, required
  - wage - Integer, required
  - is_current_employee - Integer, defaults to `1`

* **Timesheet**
  - id - Integer, primary key, required
  - hours - Integer, required
  - rate - Integer, required
  - date - Integer, required
  - employee_id - Integer, foreign key, required

* **Menu**
  - id - Integer, primary key, required
  - title - Text, required

* **MenuItem**
  - id - Integer, primary key, required
  - name - Text, required
  - description - Text, optional
  - inventory - Integer, required
  - price - Integer, required
  - menu_id - Integer, foreign key, required
