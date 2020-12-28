const inquirer = require('inquirer');
const Query = require('./queries');

const startEmployeeManager = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Add a department, role, and/or employee',
      'View/Edit a department, role, and/or employee',
      'Delete a department, role, and/or employee',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'Add a department, role, and/or employee':
        createCase();
        return;
      case 'View/Edit a department, role, and/or employee':
        console.log('view/edit case');
        return;
      case 'Delete a department, role, and/or employee':
        console.log('delete case');
        return;
      case 'Exit':
        console.log('Thanks for using the Employee Manager!');
        return;
    }
  });
};

// Create functions
const createCase = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to add?',
    choices: [
      'Add a department',
      'Add a role',
      'Add an employee',
      'Go Back'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'Add a department':
        createDepartment();
        return;
      case 'Add a role':
        console.log('creating a role')
        return;
      case 'Add an employee':
        console.log('Creating an employee');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};

const createDepartment = async () => {
  try {
    
  }
}

const gatherDepartmentInfo = () => {
  inquirer.prompt({
    name: 'department',
    message: 'Enter the name of the department you would like to add'
  }).then(answer => {
    const query = new Query();
    query.department = answer.department;
    query.checkDup();
  })
}

startEmployeeManager();