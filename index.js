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

// CREATE CASES
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
        // starts with getAllDeps function to get departments as a choice for the role creation
        getAllDeps('role');
        return;
      case 'Add an employee':
        // starts with getAllDeps function to get departments as a choice for the employee creation
        getAllDeps('employee');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};
// options for the user to navigate after completing an add case option
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
// gets all departments
const getAllDeps = async (type) => {
  const departmentQuery = new Query();
  try {
    const getDeps = await departmentQuery.getAllDepartments();
    if (type === 'role') {
      getRoleInfo(getDeps);
    } else if (type === 'employee') {
      getEmployeeInfo(getDeps);
    }
    else (console.log('Please pass a type'))
    return;
  } catch (err) {
    console.log(err);
  }
}

// DEPARTMENT FUNCTIONS
// gathers user's department info
const getDepInfo = () => {
  inquirer.prompt({
    name: 'department',
    message: 'Enter the name of the department you would like to add'
  }).then(answer => {
    checkDupDep(answer);
    return;
  })
}
// async function that runs Query function getDepartment to see if a department name is a duplicate
const checkDupDep = async (answer) => {
  const departmentQuery = new Query();
  departmentQuery.department = answer.department;
  try {
    const createDep = await departmentQuery.getDepartment();
    console.log(createDep);
    addCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
    if (err.name === 'Duplicate') {
      enteredDupDep();
      return;
    }
  }
}
// advises the user if their department name is a duplicate and gives them options on what to do next
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

// ROLE FUNCTIONS
// gathers user's role infor
const getRoleInfo = (departments) => {
  const mappedDepartments = departments.map(({ id, name }) => ({ value: id, name: name }));
  inquirer.prompt([
    {
      name: 'title',
      message: 'What is the role title?' 
    },
    {
      name: 'salary',
      type: 'number',
      message: 'What is the expected salary for the role?'
    },
    {
      name: 'department',
      type: 'list',
      message: 'Select a department for the role',
      choices: mappedDepartments
    }
  ]).then(answer => {
    if (isNaN(answer.salary)) {
      console.log('Salary needs to be a numerical value. Please try again');
      const sendDepartments = departments;
      getRoleInfo(sendDepartments);
      return;
    }
    checkDupRole(answer)
    return;
  })
}
// async function that funs Query function getRole to see if a role title is a duplicate
const checkDupRole = async (answer) => {
  const roleQuery = new Query();
  roleQuery.role = answer;
  try {
    const createRole = await roleQuery.getRole();
    console.log(createRole);
    addCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
    if (err.name === 'Duplicate') {
      enteredDupRole();
      return;
    }
  }
}
// advises the user if their role title is a duplicate and gives them options on what to do next
const enteredDupRole = () => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The role you entered has already been created. Would you like to create another role?'
  }).then(answer => {
    if (!answer.tryAgain) {
      addCaseWhereTo();
      return;
    }
    getAllDeps();
    return;
  })
}


startEmployeeManager();