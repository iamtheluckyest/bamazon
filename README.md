# bamazon app

##Purpose
This app simulates the functionality of an online store, by storing product information such as price and stock in a database. Different users can then interact with this product information depending on their role: customer or manager.

##Functions
###Customer
Customers can:
* View all products with all information except stock quantity
* Select a product and quantity to buy
	* If a greater quantity is selected than the stock, the customer will be informed.
	* Upon a successful purchase, the total cost will be reported to the customer.
	
###Manager
Managers can:
* View all products with all information, including stock quantity
* View low inventory only (fewer than 5 in stock)
* Increase inventory
* Add a new product

