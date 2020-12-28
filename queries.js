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
  };

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
      })
    })
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
          })
        } else {
          resolve(this.createDepartment());
        }
      })
    })
  }

  // creates new department based on user input
  createDepartment() {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO department SET ?', { name: this.department }, (err, res) => {
        if (err) {
          reject({
            name: 'Query Failed',
            message: err
          })
        };
      })
      resolve(`Department ${this.department} created!`)
    })
  }
};

module.exports = Query;
