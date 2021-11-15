const db = require('./db/connection')
const inquirer = require('inquirer');
const cTable = require('console.table');

// promts the user what to select
const promptUser = () => {
    return inquirer.prompt([
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
        if (choice === 'view all departments') {
            viewDepartments();
        }
        if (choice === 'view all roles') {
            viewRoles();
        }
        if (choice === 'view all employees') {
            viewEmployees();
        }
        if (choice === 'add a department') {
            addDepartment();
        }
        if (choice === 'add a role') {
            addRole();
        }
        if (choice === 'add an employee') {
            addEmployee();
        }
        if (choice === 'update employee role') {
            updateRole();
        }
        if (choice === 'exit') {
            console.log('GOODBYE')
            process.exit(0)
        }
    });
};

// views all of the departments
viewDepartments = () => {
    const sql = `SELECT * FROM department ORDER BY id ASC`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

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

addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentInfo',
            message: 'What department would you like to add?'
        }
    ])
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

addRole = () => {
    db.query('SELECT * FROM department', (err, data) => {
        if (err) {
            throw err;
        }
        const departments = data.map(department => {
            return {
                name: department.name,
                value: department.id
            }
        })
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

addEmployee = () => {
    db.query(`SELECT * FROM role`, (err, roleData) => {
        if (err) {
            throw err;
        }
        db.query(`SELECT * FROM employee`, (err, employeeData) => {
            if (err) {
                throw err;
            }
            const roles = roleData.map(role => {
                return {
                    name: role.title,
                    value: role.id
                }
            })
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

updateRole = () => {
    const sql = `SELECT CONCAT(employee.first_name, " ", employee.last_name) AS name, employee.id AS id FROM employee;`
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        const employees = result.map(employee => {
            return {
                name: employee.name,
                value: employee.id
            }
        })
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeChoice',
                message: 'Choose which employee you would like to update:',
                choices: employees
            }
        ])
        .then(choice => {
            const employee = choice.employeeChoice;
            const params = [];
            const sql = `SELECT role.title AS title, role.id AS id FROM role`;
            db.query(sql, params, (err, result) => {
                const newRoles = result.map(newRole => {
                    return {
                        name: newRole.title,
                        value: newRole.id
                    }
                })
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleChoice',
                        message: 'Choose the employees updated role:',
                        choices: newRoles
                    }
                ])
                .then((answers) => {
                        const roleChoice = answers.roleChoice;
                    params.push(roleChoice);
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
