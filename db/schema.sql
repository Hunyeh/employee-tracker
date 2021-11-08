DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);

CREATE TABLE role(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INTEGER,
    FOREIGN KEY(department_id) 
    REFERENCES department(id)
);

CREATE TABLE employee(
    id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    FOREIGN KEY (role_id)
    REFERENCES role (id),
    manager_id INTEGER,
    FOREIGN KEY (manager_id)
    REFERENCES employee (id)
);