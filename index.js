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
      'Quit'
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
      case 'Quit':
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
        getDepInfo();
        return;
      case 'Add a role':
        // STARTS WITH GET DEPS SO THAT WE CAN BUILD THE ROLE DEPARMTNET CHOICES
        getAllDeps();
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

// GATHERS THE USER'S DEPARTMENT INFORMATION AND SENDS IT TO CHECKDUPDEP FUNCTION
const getDepInfo = () => {
  inquirer.prompt({
    name: 'department',
    message: 'Enter the name of the department you would like to add'
  }).then(answer => {
    checkDupDep(answer);
  })
}

// ASYNC FUNCTION THAT RUNS QUERIES FUNCTION GETDEPARTMENT TO CATCH IF DEPARTMENT NAME IS A DUPLICATE OR IF THE QUERY FAILS
// IF GETDEPARTMENT FUNCTION RESOLVES
const checkDupDep = async (answer) => {
  const departmentQuery = new Query();
  departmentQuery.department = answer.department;
  try {
    const createDep = await departmentQuery.getDepartment();
    console.log(createDep);
    addCaseWhereTo();
  } catch (err) {
    console.log(err);
    enteredDupDep();
  }
}

// ADVISES THE USER THAT THE DEPARTMENT THEY ENTERED IS ALREADY IN THE DATABASE AND ASKS WHAT THEY WOULD LIKE TO DO NEXT
const enteredDupDep = () => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The department you entered has already been created. Would you like to create another department?'
  }).then(answer => {
    if (!answer.tryAgain) {
      addCaseWhereTo();
      return;
    }
    getDepInfo();
    return;
  })
}
// GETS ALL DEPARTMENTS
const getAllDeps = async () => {
  const departmentQuery = new Query();
  try {
    const getDeps = await departmentQuery.getAllDepartments();
    console.log(getDeps);
  } catch (err) {
    console.log(err);
  }
}

// GIVES THE USER OPTIONS TO NAGIVATE FROM THE ADD CASE OPTIONS
const addCaseWhereTo = () => {
  inquirer.prompt({
    name: 'whereTo',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['Add something else', 'Start Over', 'Quit']
  }).then(answer => {
    switch (answer.whereTo) {
      case 'Add something else':
        createCase();
        return;
      case 'Start Over':
        startEmployeeManager();
        return;
      case 'Quit':
        console.log('Thanks for using Employee Manager!');
        return;
    }
  })
}

startEmployeeManager();