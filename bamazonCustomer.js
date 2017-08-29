var inquirer = require ('inquirer');
var mysql = require ('mysql');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var productIds = [];
    var table = new Table({
        head: ['Id', 'Item', 'Dpmt', 'Price ($)']
      , colWidths: [5, 25, 25, 15]
    });
    for (i=0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]);
        productIds.push(res[i].item_id);
    };
    console.log(table.toString());
    selectItem(productIds, res);
});

function selectItem(productIds, res){
    inquirer.prompt([
        {
            type : "input",
            message : "Enter the item id of the product you would like to buy: ",
            validate: function(input){
                return input != '';
            },
            name: "productId"
        }
    ]).then(function(response){
        if(productIds.indexOf(parseInt(response.productId)) < 0){
            console.log("That's not a valid item id.");
        } else {
            var selectedItem = res.filter(function( obj ) {
                return obj.item_id == response.productId;
              });
            // console.log(selectedItem)
            selectQuantity(productIds, res, selectedItem);
        };
    });
};

function selectQuantity(productIds, res, selectedItem) {
    inquirer.prompt([
        {
            type : "input",
            message : "Quantity: ",
            validate : function(input) {
                return (!isNaN(input));
            },
            name: "quantity"
        }
    ]).then(function(response) {
        response.quantity = parseInt(response.quantity);
        if(response.quantity > selectedItem[0].stock_quantity) {
            console.log("We only have " + selectedItem[0].stock_quantity + " in stock. Please select a different quantity.");
            selectQuantity(productIds, res, selectedItem);
        } else {
            var newStock = selectedItem[0].stock_quantity - response.quantity;
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity : newStock
                    },
                    {
                        item_id : selectedItem[0].item_id
                    }
                ],
                function(err, res) {
                    if (err) throw err;
                    console.log("Purchase successful! Your total was $" + (selectedItem[0].price * response.quantity));
                    connection.end();
                }
            );
        };
    });
};
