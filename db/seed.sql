USE employee_db;

INSERT INTO department (name)
VALUES 
  ('Engineering'),
  ('Sales'),
  ('Accounting');

INSERT INTO role (title, salary, department_id)
VALUES
  ('Engineering Manager', 150000, 1),
  ('Junior Engineer', 80000, 1),
  ('Senior Engineer', 100000, 1),
  ('Sales Manager', 60000, 2),
  ('Sales Representative', 45000, 2),
  ('Accounting Manager', 85000, 3),
  ('Accountant', 60000, 3);

  INSERT INTO employee (first_name, last_name, role_id, manager_id)
  VALUES
    ('Pennywise', 'The Clown', 1, NULL),
    ('Beverly', 'Marsh', 2, 1),
    ('Bill', 'Denbrough', 3, 1),
    ('Mike', 'Hanlon', 3, 1),
    ('Richie', 'Tozier', 4, NULL),
    ('Eddie', 'Kaspbrak', 5, 4),
    ('Stanley', 'Uris', 6, NULL),
    ('Ben', 'Hanscom', 7, 6);
