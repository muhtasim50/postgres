CREATE DATABASE school;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

INSERT INTO users(user_name, email, department, user_password)
VALUES('seemanta', 'seemanta@gmail.com', 'CSE', 'seemanta123');

CREATE TABLE departments(
    deptName VARCHAR(255) NOT NULL
);

INSERT INTO departments(deptName)
VALUES('CSE'), ('EEE'), ('IPE'), ('Chem'), ('Phy'), ('Bangla');
