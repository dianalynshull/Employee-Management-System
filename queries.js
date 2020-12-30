const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_db'
});

class Query {
  constructor(departmentAnswer, roleAnswer, employeeAnswer) {
    this.department = departmentAnswer;
    this.role = roleAnswer;
    this.employee = employeeAnswer;
    this.value;
  }

  getAllDepartments() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM department', (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
        resolve(res);
      });
    });
  }

  // queries the database to verify if user department is a duplicate
  getDepartment(type) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT name FROM department WHERE ?', { name: this.department.name }, (err, res) => {
        const response = res[0];
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        } else if (response) {
          reject({
            name: 'Duplicate',
            message: 'This deparmtent already exists'
          });
        } else {
          switch (type) {
            case 'create':
              resolve(this.createDepartment());
              return;
            case 'edit':
              resolve(this.editDepartment());
              return;
          }
        }
      });
    });
  }

  // creates new department based on user input
  createDepartment() {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO department SET ?', { name: this.department.name }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve(`Department ${this.department.name} created!`);
    });
  }

  // edits an already created department
  editDepartment() {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE department SET ? WHERE ?', [{ name: this.department.name }, { id: this.department.id }], (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve(`Department ${this.department.name} updated!`);
    });
  }

  // gets all roles
  getAllRoles() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT id, title FROM role', (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
        resolve(res);
      });
    });
  }

  // queries the database to verify if user role is a duplicate
  getRole(type) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT title FROM role WHERE ?', { title: this.role.title }, (err, res) => {
        const response = res[0];
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        } else if (response) {
          reject({
            name: 'Duplicate',
            message: 'This role already exists'
          });
        } else {
          switch (type) {
            case 'create':
              resolve(this.createRole());
              return;
            case 'edit':
              this.role.value = this.role.title;
              resolve(this.editRole(this.role.value, 'title'));
              return;
          }
        }
      });
    });
  }

  // creates new role based on user input
  createRole() {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO role SET ?', { title: this.role.title, salary: this.role.salary, department_id: this.role.department }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve(`Role ${this.role.title} created!`);
    });
  }

  // creates new role based on user input
  editRole(roleValue, column) {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE role SET ${column} = '${roleValue}' WHERE ?`, { id: this.role.id }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
        resolve(`Role ${column} has been updated to ${roleValue}!`);
      });
    });
  }

  // gets all employees
  getAllEmployees() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, role.id, role.title FROM employee INNER JOIN role ON employee.role_id=role.id', (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
        resolve(res);
      });
    });
  }

  // queries the database to verify if employee entered is a duplicate
  getEmployee(type) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT first_name, last_name, role_id FROM employee WHERE first_name = '${this.employee.firstName}' AND last_name = '${this.employee.lastName}' AND role_id = '${this.employee.role}'`, (err, res) => {
        const response = res[0];
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        } else if (response) {
          resolve({
            name: 'Potential Duplicate',
            message: 'An employee with that name and role already exists'
          });
        } else {
          switch (type) {
            case 'create':
              resolve(this.createEmployee());
              return;
          }
        }
      });
    });
  }

  // creates new employee based on user input
  createEmployee() {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO employee SET ?', { first_name: this.employee.firstName, last_name: this.employee.lastName, role_id: this.employee.role, manager_id: this.employee.manager }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve(`Employee ${this.employee.firstName} ${this.employee.lastName} created!`);
    });
  }
  
  // edits an employee role based on user input
  editEmployee() {
    return new Promise((resolve, reject) => {
      connection.query('UPDATE employee SET ? WHERE ?', [{ role_id: this.employee.role }, { id: this.employee.id }], (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve('Employee role updated!');
    });
  }
}

module.exports = Query;
