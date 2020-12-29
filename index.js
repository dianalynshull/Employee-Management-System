const inquirer = require('inquirer');
const Query = require('./queries');
const consoleTable = require('console.table');

const startEmployeeManager = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Create a department, role, and/or employee',
      'View departments, roles, and/or employees',
      'Edit a department, role, and/or employee',
      'Delete a department, role, and/or employee',
      'Quit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'Create a department, role, and/or employee':
        createCase();
        return;
      case 'View departments, roles, and/or employees':
        viewCase();
        return;
      case 'Edit a department, role, and/or employee':
        editCase();
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

startEmployeeManager();

// Create function
const createCase = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to create?',
    choices: [
      'Create a department',
      'Create a role',
      'Create an employee',
      'Go Back'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'Create a department':
        getDepInfo('create');
        return;
      case 'Create a role':
        // starts with getAllDeps function to get departments as a choice for the role creation
        getAllDeps('create');
        return;
      case 'Create an employee':
        // starts with getAllRoles function to get roles as a choice for the employee creation
        getAllRoles('create');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};
// options for the user to navigate after completing an create case option
const createCaseWhereTo = () => {
  inquirer.prompt({
    name: 'whereTo',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['Create something else', 'Start Over', 'Quit']
  }).then(answer => {
    switch (answer.whereTo) {
      case 'Create something else':
        createCase();
        return;
      case 'Start Over':
        startEmployeeManager();
        return;
      case 'Quit':
        console.log('Thanks for using Employee Manager!');
        return;
    }
  });
};
// View Functions
const viewCase = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to view?',
    choices: [
      'View departments',
      'View roles',
      'View employees',
      'Go Back'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View departments':
        getAllDeps('view');
        return;
      case 'View roles':
        getAllRoles('view');
        return;
      case 'View employees':
        getAllEmployees(null, 'view');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};
// options for the user to navigate after completing an view case option
const viewCaseWhereTo = () => {
  inquirer.prompt({
    name: 'whereTo',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['View something else', 'Start Over', 'Quit']
  }).then(answer => {
    switch (answer.whereTo) {
      case 'View something else':
        viewCase();
        return;
      case 'Start Over':
        startEmployeeManager();
        return;
      case 'Quit':
        console.log('Thanks for using Employee Manager!');
        return;
    }
  });
};

const editCase = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to edit?',
    choices: [
      'Edit departments',
      'Edit roles',
      'Edit employees',
      'Go Back'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'Edit departments':
        getAllDeps('edit');
        return;
      case 'Edit roles':
        getAllRoles('edit');
        return;
      case 'Edit employees':
        getAllEmployees(null, 'edit');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};

// DEPARTMENT FUNCTIONS
// gets all departments
const getAllDeps = async (type) => {
  const departmentQuery = new Query();
  try {
    const getDeps = await departmentQuery.getAllDepartments();
    switch (type) {
      case 'create':
        getRoleInfo(getDeps);
        return;
      case 'view':
        console.table(getDeps);
        viewCaseWhereTo();
        return;
      case 'edit': {
        selectDepEdit(getDeps, type);
        return;
      }
    }
  } catch (err) {
    console.log(err);
  }
};
// gathers user's department info
const getDepInfo = (type) => {
  inquirer.prompt({
    name: 'name',
    message: 'Enter the name of the department you would like to create'
  }).then(answer => {
    checkDupDepCreate(answer, type);
    return;
  });
};
// gives all departments for the user to select which one to edit
const selectDepEdit = (departments, type) => {
  const mappedDepartments = departments.map(({ id, name }) => ({ value: id, name: name }));
  inquirer.prompt([
    {
      name: 'id',
      type: 'list',
      message: 'Select the department you would like to edit',
      choices: mappedDepartments
    },
    {
      name: 'name',
      message: 'Enter the new name of the department'
    }
  ]).then(answer => {
    checkDupDepEdit(answer, type);
    return;
  });
};
// async function that runs Query function getDepartment to see if a department name is a duplicate
const checkDupDepCreate = async (answer, type) => {
  const departmentQuery = new Query();
  departmentQuery.department = answer;
  try {
    const checkDep = await departmentQuery.getDepartment(type);
    console.log(checkDep);
    createCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
    if (err.name === 'Duplicate') {
      enteredDupDep();
      return;
    }
  }
};

const checkDupDepEdit = async (answer, type) => {
  const departmentQuery = new Query();
  departmentQuery.department = answer;
  try {
    const checkDep = await departmentQuery.getDepartment(type);
    console.log(checkDep);
    // createCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
    if (err.name === 'Duplicate') {
      enteredDupDep();
      return;
    }
  }
};
// advises the user if their department name is a duplicate and gives them options on what to do next
const enteredDupDep = () => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The department you entered has already been created. Would you like to create another department?'
  }).then(answer => {
    if (!answer.tryAgain) {
      createCaseWhereTo();
      return;
    }
    getDepInfo();
    return;
  });
};

// ROLE FUNCTIONS
// gets all roles
const getAllRoles = async (type) => {
  const roleQuery = new Query();
  try {
    const getRoles = await roleQuery.getAllRoles();
    switch (type) {
      case 'create':
        getAllEmployees(getRoles, type);
        return;
      case 'view':
        console.table(getRoles);
        viewCaseWhereTo();
        return;
    }
  } catch (err) {
    console.log(err);
  }
};
// gathers user's role info
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
    checkDupRole(answer);
    return;
  });
};
// async function that funs Query function getRole to see if a role title is a duplicate
const checkDupRole = async (answer) => {
  const roleQuery = new Query();
  roleQuery.role = answer;
  try {
    const createRole = await roleQuery.getRole();
    console.log(createRole);
    createCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
    if (err.name === 'Duplicate') {
      enteredDupRole();
      return;
    }
  }
};
// advises the user if their role title is a duplicate and gives them options on what to do next
const enteredDupRole = () => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The role you entered has already been created. Would you like to create another role?'
  }).then(answer => {
    if (!answer.tryAgain) {
      createCaseWhereTo();
      return;
    }
    getAllDeps();
    return;
  });
};

// EMPLOYEE FUNCTIONS

// gets all employees
const getAllEmployees = async (roles, type) => {
  const roleList = roles;
  const employeeQuery = new Query();
  try {
    const getEmployees = await employeeQuery.getAllEmployees();
    switch (type) {
      case 'create':
        getEmpInfo(roleList, getEmployees);
        return;
      case 'view':
        console.table(getEmployees);
        viewCaseWhereTo();
        return;
    }
  } catch (err) {
    console.log(err);
  }
};

// *note* in the future might adjust the to create a getRolesByDep and getEmpByDep function and create an inquirer question to get the department the employee will be in. Once that's gathered, the getRolesByDep will only get roles in that department and the getEmpByDep will only get employees in that department for the manager selection

// gathers user's role info
const getEmpInfo = (roles, employees) => {
  const mappedRoles = roles.map(({ id, title }) => ({ value: id, name: title }));
  const mappedEmployees = employees.map(({ id, first_name, last_name, title }) => ({ value: id, name: `${first_name} ${last_name} - ${title}` }));
  mappedEmployees.push({ value: null, name: 'Employee Will/Does Not Have Manager' });
  inquirer.prompt([
    {
      name: 'firstName',
      message: 'Enter the first name of the employee'
    },
    {
      name: 'lastName',
      message: 'Enter the last name of the employee'
    },
    {
      name: 'role',
      type: 'list',
      message: 'Select a role for the employee',
      choices: mappedRoles
    },
    {
      name: 'manager',
      type: 'list',
      message: 'Select a manager for the employee (if the employee does not have a manager please select that option)',
      choices: mappedEmployees
    }
  ]).then(answer => {
    checkDupEmp(answer);
  });
};

const checkDupEmp = async (answer) => {
  const employeeQuery = new Query();
  employeeQuery.employee = answer;
  try {
    const createEmployee = await employeeQuery.getEmployee();
    if (createEmployee.name === 'Potential Duplicate') {
      enteredDupEmp(createEmployee, employeeQuery);
      return;
    }
    console.log(createEmployee);
    createCaseWhereTo();
    return;
  } catch (err) {
    console.log(err);
  }
};

const enteredDupEmp = (employee, Query) => {
  const dupEmployee = employee;
  const employeeQuery = Query;
  inquirer.prompt({
    name: 'verify',
    type: 'confirm',
    message: `${dupEmployee.message}. Would you like to continue with creation?`
  }).then(async (answer) => {
    if (!answer.verify) {
      createCaseWhereTo();
      return;
    }
    const createEmployee = await employeeQuery.createEmployee();
    console.log(createEmployee);
    createCaseWhereTo();
    return;
  });
};