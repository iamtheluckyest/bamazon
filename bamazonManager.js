var inquirer = require ('inquirer');
var mysql = require ('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

chooseAction();

function chooseAction(){ 
    console.log("\n");
    inquirer.prompt([
        {
            type : 'list',
            message : 'What would you like to do?',
            choices : ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "End Session"],
            name : "action"
        }
    ]).then(function(response){
        switch(response.action) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInv();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "End Session":
                connection.end();
                break;
            default:
                console.log("There was an error, sorry!");
        }
    });
};

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (i=0; i < res.length; i++) {
            console.log("\nId: " + res[i].item_id);
            console.log("Item name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock quantity: " + res[i].stock_quantity);
            console.log("-----------------------------------");
        };
        chooseAction();
    });
};

function viewLowInv() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        for (i=0; i < res.length; i++) {
            console.log("\nId: " + res[i].item_id);
            console.log("Item name: " + res[i].product_name);
            console.log("Department: " + res[i].department_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock quantity: " + res[i].stock_quantity);
            console.log("-----------------------------------");
        };
        chooseAction();
    });
};

function addInventory() {
    inquirer.prompt([
        {
            type : 'input',
            message : 'Enter the id number for the product whose inventory you want to increase: ',
            validate : function(input) {
                return (!isNaN(input));
            },
            name : 'productId'
        }
    ]).then(function(response){
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            response.productId = parseInt(response.productId);
            var selectedProduct = [];
            for (i=0; i < res.length; i++) {
                if (res[i].item_id === response.productId) {
                    var selectedProduct = res[i];
                };
            };
            if (selectedProduct === []) {
                console.log("That product id does not exist. Please try again.");
                addInventory();
            } else {
                inquirer.prompt([
                    {
                        type : 'input',
                        message : 'Enter the amount you are adding to the inventory: ',
                        validate : function(input) {
                            return (!isNaN(input));
                        },
                        name : 'quantity'
                    }
                ]).then(function(response) {
                    var newStock = parseInt(response.quantity) + selectedProduct.stock_quantity;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity : newStock
                            },
                            {
                                item_id : selectedProduct.item_id
                            }
                        ],
                        function(err, res) {
                            console.log("Inventory is now " + newStock);
                            chooseAction();
                        }
                    );
                });
            };
        });
    });
}

function addProduct() {
    console.log("\nEnter the information for your new product.")
    inquirer.prompt([
        {
            type : 'input',
            message : "Product name: ",
            validate : function(str) {
                return str !== '';
            },
            name : "name"
        },
        {
            type : 'input',
            message : "Product department: ",
            validate : function(str) {
                return str !== '';
            },
            name : "department"
        },
        {
            type : 'input',
            message : "Price ($): ",
            validate : function(input) {
                return (!isNaN(input));
            },
            name : "price"
        },
        {
            type : 'input',
            message : "Stock quantity: ",
            validate : function(input) {
                return (!isNaN(input));
            },
            name : "stock_quantity"
        }
    ]).then(function(response){
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name : response.name,
                department_name : response.department,
                price : parseFloat(response.price), 
                stock_quantity : parseInt(response.stock_quantity)
            },
            function(err, res){
                if (err) throw err;
                console.log("Product added!");
                chooseAction();
            }
        );
    });
}; 