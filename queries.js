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
    this.employee = employeeAnswer
  };
};

module.exports = Query;
