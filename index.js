const inquirer = require('inquirer');

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
        console.log('create case');
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

startEmployeeManager();