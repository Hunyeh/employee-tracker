const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// promts the user what to select
const promptUser = () => {
     inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update employee role',
                'exit'
            ]
        }
    ])
    .then((answerData) => {
        // takes user data, depending what they choose the following will happen:
        const { choice } = answerData;
        switch (choice) {
            case 'view all departments':
                viewDepartments();
                break;
            case 'view all roles':
                viewRoles();
                break;
            case 'view all employees':
                viewEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update employee role':
                updateRole();
                break;
            default:
                console.log('GOODBYE'),
                process.exit(0)
                break;
        }
    });
};

// views all of the departments
viewDepartments = () => {
    // select everything from the department table sorting by abc order
    const sql = `SELECT * FROM department ORDER BY id ASC`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

// select everything from the role table sorting by abc order
viewRoles = () => {
    const sql = `SELECT * FROM role ORDER BY id ASC`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

// select everything from the employee table sorting by abc order
viewEmployees = () => {
    const sql = `SELECT * FROM employee ORDER BY id ASC`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

// adds a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentInfo',
            message: 'What department would you like to add?'
        }
    ])
    // taking user data and insert it into the department table
    .then(answerData => {
        const sql = `INSERT INTO department (name)
                     VALUES ("${answerData.departmentInfo}")`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log('New department was added.');
            promptUser();
        })
    })
};

// adding a role
addRole = () => {
    // selects everything from the department table
    db.query('SELECT * FROM department', (err, data) => {
        if (err) {
            throw err;
        }
        // loops through department data and grabs the name and id
        const departments = data.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        })
        // prompt the user
        inquirer.prompt([
            {
                type: 'input',
                name: 'titleInfo',
                message: 'What is the title of the role you are adding?'
            },
            {
                type: 'input',
                name: 'salaryInfo',
                message: 'What is the salary of the employee you are adding?'
            },
            {
                type: 'list',
                name: 'departmentIdInfo',
                message: 'What is the department ID of the role you are adding?',
                choices: departments
            }
        ])
        .then(answerData => {
            // takes user data and inserts it into the role table
            const sql = `INSERT INTO role (title, salary, department_id)
                         VALUES ("${answerData.titleInfo}", ${answerData.salaryInfo}, ${answerData.departmentIdInfo})`;
            db.query(sql, (err, rows) => {
                if (err) {
                    throw err;
                }
                console.log('New role was added.');
                promptUser();
            })
        })
    })
};

// adding an employee
addEmployee = () => {
    // select everything from the role table
    db.query(`SELECT * FROM role`, (err, roleData) => {
        if (err) {
            throw err;
        }
        // select everything from the employee table
        db.query(`SELECT * FROM employee`, (err, employeeData) => {
            if (err) {
                throw err;
            }
            // loop through role data to grab the title and id
            const roles = roleData.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
            // loops through managers to grab their first/last name and their id
            const managers = employeeData.map(manager => {
                return {
                    name: manager.first_name + ' ' + manager.last_name,
                    value: manager.id
                }
            })
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: 'What is the first name of the employee you are adding?'
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: 'What is the last name of the employee you are adding?'
                },
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'Choose the role from the following:',
                    choices: roles
                },
                {
                    type: 'list',
                    name: 'managerId',
                    message: 'Choose the manager from the following:',
                    choices: managers
                }
            ])
            .then(answerData => {
                // takes the user data and inserts it into the employee table:
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES ("${answerData.firstName}", "${answerData.lastName}", ${answerData.roleId}, ${answerData.managerId})`, (err, data) => {
                    if (err) {
                        throw err;
                    }
                    console.log('New employee has been added.')
                    promptUser();
                });
            })
        })
    })
};

// update an existing role
updateRole = () => {
    // slecting first/last name from the employee table
    const sql = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS id FROM employee`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        // loop through employee table to get the name and id
        const employees = result.map(employee => {
            return {
                name: employee.name,
                value: employee.id
            }
        })
        // prompt the user
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeChoice',
                message: 'Choose which employee you would like to update:',
                choices: employees
            }
        ])
        // take user data
        .then(choice => {
            const employee = choice.employeeChoice;
            const params = [];
            // select the title and id from the role table
            const sql = `SELECT role.title AS title, role.id AS id FROM role`;
            db.query(sql, params, (err, result) => {
                // loop through the selected employee and grab the title and id
                const newRoles = result.map(newRole => {
                    return {
                        name: newRole.title,
                        value: newRole.id
                    }
                })
                // promt the user
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: 'Choose the employees new updated role:',
                        choices: newRoles
                    }
                ])
                // take the user data 
                .then((answers) => {
                    const roleChoice = answers.roleChoice;
                    // pushes the new role to the role id
                    params.push(roleChoice);
                    // push the info to the selected employee
                    params.push(employee);
                    const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
                    db.query(sql, params, (err, result) => {
                        if (err) {
                            throw err
                        }
                        console.log(result);
                        viewEmployees();
                    })
                })
            })
        })
    })
};

promptUser();