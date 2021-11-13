USE employee_db;

INSERT INTO department (name)
VALUES ('Finance'),
       ('Sales'),
       ('Engineering'),
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', '100000', 2),
       ('Salesperson', '80000', 2),
       ('Lead Engineer', '150000', 3),
       ('Software Engineer', '120000', 3),
       ('Accountant', '125000', 1),
       ('Legal Team Lead', '250000', 4),
       ('Lawyer', '190000', 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
Values ('John', 'Doe', 1, null),
       ('Billy', 'Bob', 2, 1),
       ('Sara', 'Jones', 3, null),
       ('Bob', 'Sanders', 3, 3),
       ('Rodney', 'Holmes', 4, 3),
       ('Kaitlyn', 'Smith', 5, null),
       ('Emily', 'Johnson', 6, null),
       ('Ron', 'Fleming', 7, 6);