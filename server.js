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
            exitApp();
        }
    });
};

// views all of the departments
viewDepartments = () => {
    const sql = 'SELECT * FROM department ORDER BY id ASC';
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.table(rows);
        promptUser();
    })
};

viewRoles = () => {

};

viewEmployees = () => {

};

addDepartment = () => {

};

addRole = () => {

};

addEmployee = () => {

};

updateRole = () => {

};

exitApp = () => {

};

promptUser();
