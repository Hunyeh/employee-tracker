USE employee_db;

INSERT INTO department (name)
VALUES ('Finance'),
       ('Sales'),
       ('Engineering'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', '100000', ''),
       ('Salesperson', '80000', ''),
       ('Lead Engineer', '150000', ''),
       ('Software Engineer', '120000', ''),
       ('Accountant', '125000', ''),
       ('Legal Team Lead', '250000', ''),
       ('Lawyer', '190000', '');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
Values ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', ''),
       ('', '', '', '');