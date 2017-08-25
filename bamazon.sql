CREATE DATABASE IF NOT EXISTS bamazon_db;

USE bamazon_db;

DROP TABLE IF EXISTS products;

CREATE TABLE products(
item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100),
department_name VARCHAR(100),
price DECIMAL(8, 2), 
stock_quantity INTEGER(10),
PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Watch", "Accessories", 199.99, 50), 
("Necklace", "Accessories", 49.99, 100), 
("Chocolate", "Food", 2.00, 1000),
("Cereal", "Food", 3.00, 500),
("Baseball", "Toys", 5.00, 500),
("Tamagotchi", "Toys", 50.00, 2),
("Chair", "Furniture", 50.00, 2),
("Bed", "Furniture", 400.00, 4),
("Table", "Furniture", 100.00, 10),
("Desk", "Furniture", 100.00, 10),
("Cup", "Kitchen", 3.00, 20),
("Plate", "Kitchen", 3.00, 10),
("Silverware set", "Kitchen", 24.99, 10);