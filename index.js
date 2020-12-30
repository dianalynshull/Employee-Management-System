const inquirer = require('inquirer');
const Query = require('./queries');
require('console.table');

const startEmployeeManager = () => {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'Create a department, role, and/or employee',
      'View departments, roles, and/or employees',
      'Edit a department, role, and/or employee',
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
      case 'Quit':
        console.log('Thanks for using the Employee Manager!');
        return;
    }
  });
};
startEmployeeManager();

// Create Function
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
        // starts with getAllRolesIndex function to get roles as a choice for the employee creation
        getAllRolesIndex('create');
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
// View Function
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
        getAllRolesIndex('view');
        return;
      case 'View employees':
        getAllEmps(null, 'view');
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

// Edit Function
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
        getAllRolesIndex('edit');
        return;
      case 'Edit employees':
        getAllEmps(null, 'edit');
        return;
      case 'Go Back':
        startEmployeeManager();
        return;
    }
  });
};
// options for the user to navigate after completing an edit case option
const editCaseWhereTo = () => {
  inquirer.prompt({
    name: 'whereTo',
    type: 'list',
    message: 'What would you like to do?',
    choices: ['Edit something else', 'Start Over', 'Quit']
  }).then(answer => {
    switch (answer.whereTo) {
      case 'Edit something else':
        editCase();
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

// DEPARTMENT FUNCTIONS
// gets all departments
const getAllDeps = async (type) => {
  const departmentQuery = new Query();
  try {
    const getDeps = await departmentQuery.getAllDepartments();
    switch (type) {
      case 'create':
        getRoleInfo(getDeps, type);
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
    checkDupDep(answer, type);
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
    checkDupDep(answer, type);
    return;
  });
};
// async function that runs Query function getDepartment to see if a department name is a duplicate
const checkDupDep = async (answer, type) => {
  const departmentQuery = new Query();
  departmentQuery.department = answer;
  try {
    const checkDep = await departmentQuery.getDepartment(type);
    console.log(checkDep);
    switch (type) {
      case 'create':
        createCaseWhereTo();
        return;
      case 'edit': {
        editCaseWhereTo();
        return;
      }
    }
  } catch (err) {
    if (err.name === 'Duplicate') {
      enteredDupDep(type);
      return;
    }
  }
};
// advises the user if their department name is a duplicate and gives them options on what to do next
const enteredDupDep = (type) => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The department you entered has already exists. Would you like to try again?'
  }).then(answer => {
    switch (type) {
      case 'create':
        if (!answer.tryAgain) {
          createCaseWhereTo();
          return;
        }
        getDepInfo(type);
        return;
      case 'edit':
        if (!answer.tryAgain) {
          editCaseWhereTo();
          return;
        }
        getAllDeps(type);
        return;
    }
  });
};

// ROLE FUNCTIONS
// gets all roles
const getAllRolesIndex = async (type) => {
  const roleQuery = new Query();
  try {
    const getRoles = await roleQuery.getAllRoles();
    switch (type) {
      case 'create':
        getAllEmps(getRoles, type);
        return;
      case 'view':
        console.table(getRoles);
        viewCaseWhereTo();
        return;
      case 'edit':
        selectRoleEdit(getRoles, type);
        return;
    }
  } catch (err) {
    console.log(err);
  }
};
// gathers user's role info
const getRoleInfo = (departments, type) => {
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
      getRoleInfo(departments, type);
      return;
    }
    checkDupRole(answer, type);
    return;
  });
};
const selectRoleEdit = (departments, type) => {
  const mappedRoles = departments.map(({ id, title }) => ({ value: id, name: title }));
  inquirer.prompt([
    {
      name: 'id',
      type: 'list',
      message: 'What role would you like to edit?',
      choices: mappedRoles
    },
    {
      name: 'type',
      type: 'list',
      message: 'What would you like to update?',
      choices: ['Title', 'Salary']
    },
    {
      name: 'value',
      message: 'Enter the new value'
    }
  ]).then(answer => {
    switch (answer.type) {
      case 'Title':
        const role = { id: answer.id, title: answer.value };
        checkDupRole(role, type);
        return;
      case 'Salary':
        const roleInfo = { id: answer.id, salary: answer.value };
        const roleQuery = new Query();
        roleQuery.role = roleInfo;
        roleQuery.editRole(type);
        return;
    }
  });
};
// async function that funs Query function getRole to see if a role title is a duplicate
const checkDupRole = async (answer, type) => {
  const roleQuery = new Query();
  roleQuery.role = answer;
  try {
    const checkRole = await roleQuery.getRole(type);
    console.log(checkRole);
    switch (type) {
      case 'create':
        createCaseWhereTo();
        return;
      case 'edit':
        editCaseWhereTo();
        return;
    }

  } catch (err) {
    if (err.name === 'Duplicate') {
      enteredDupRole(type);
      return;
    }
  }
};
// advises the user if their role title is a duplicate and gives them options on what to do next
const enteredDupRole = (type) => {
  inquirer.prompt({
    name: 'tryAgain',
    type: 'confirm',
    message: 'The role you entered already exists. Would you like to try again?'
  }).then(answer => {
    switch (type) {
      case 'create':
        if (!answer.tryAgain) {
          createCaseWhereTo();
          return;
        }
        console.log('test');
        getAllDeps(type);
        return;
    }
  });
};

// EMPLOYEE FUNCTIONS
// gets all employees
const getAllEmps = async (roles, type) => {
  const employeeQuery = new Query();
  try {
    const getEmployees = await employeeQuery.getAllEmployees();
    switch (type) {
      case 'create':
        getEmpInfo(roles, getEmployees, type);
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
// gathers user's role info
const getEmpInfo = (roles, employees, type) => {
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
    checkDupEmp(answer, type);
  });
};
// async function that runs Query function to see if an employee might be a duplicate
const checkDupEmp = async (answer, type) => {
  const employeeQuery = new Query();
  employeeQuery.employee = answer;
  try {
    const checkEmp = await employeeQuery.getEmployee(type);
    if (checkEmp.name === 'Potential Duplicate') {
      enteredDupEmp(checkEmp, employeeQuery, type);
      return;
    }
    switch (type) {
      case 'create':
        console.log(checkEmp);
        createCaseWhereTo();
        return;
    }
  } catch (err) {
    console.log(err);
  }
};

const enteredDupEmp = (checkEmp, employeeQuery, type) => {
  inquirer.prompt({
    name: 'verify',
    type: 'confirm',
    message: `${checkEmp.message}. Would you like to continue with creation?`
  }).then(async (answer) => {
    switch (type) {
      case 'create':
        if (!answer.verify) {
          createCaseWhereTo();
          return;
        }
        const createEmp = await employeeQuery.createEmployee();
        console.log(createEmp);
        createCaseWhereTo();
        return;
    }
  });
};