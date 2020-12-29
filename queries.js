const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_db'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('successfully connected to database');
});

class Query {
  constructor(departmentAnswer, roleAnswer, employeeAnswer) {
    this.department = departmentAnswer;
    this.role = roleAnswer;
    this.employee = employeeAnswer;
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
  getDepartment() {
    return new Promise((resolve, reject) => {
      connection.query('SELECT name FROM department WHERE ?', { name: this.department }, (err, res) => {
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
          resolve(this.createDepartment());
        }
      });
    });
  }

  // creates new department based on user input
  createDepartment() {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO department SET ?', { name: this.department }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          });
        }
      });
      resolve(`Department ${this.department} created!`);
    });
  }

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

  getRole() {
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
          resolve(this.createRole());
        }
      });
    });
  }

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

  getEmployee() {
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
          resolve(this.createEmployee());
        }
      });
    });
  }

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
}

module.exports = Query;
