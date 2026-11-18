const { model } = require("mongoose")

// let template=

// let details=`<div class="order-details">
// <h2>Order Details</h2>
// <p><strong>Order Number:</strong> #12345</p>
// <p><strong>Customer Name:</strong> John Doe</p>
// <p><strong>Order Total:</strong> $150.00</p>
// <p><strong>Shipping Address:</strong> 123 Main St, Cityville</p>
// </div>`

function generateMainHTML (orderHTML,orderNumber,buyerLocation){
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Order Notification</title>
        <style>
            /* Add your CSS styling here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .logo {
                max-width: 150px;
            }
            .order-details {
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
                margin-bottom: 20px;
            }
            .footer {
                text-align: center;
                margin-top: 20px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img class="logo" src="http://www.nexotin.com/wp-content/uploads/2022/04/logo-Nexotin-white-transparent.png" alt="Nexotin Logo">
                <h1><strong>New Order Notification</strong></h1>
                <h2>Order Number: #${orderNumber}</h2>
                <h2>Shipping Location: <br>${buyerLocation.data.description}</br></h2>
            </div>
                ${orderHTML}
            <div class="footer">
                <p>This is an automated email. Please do not reply.</p>
                <p>&copy; 2024 Nexotin. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`
}


function generateOrderHTML (orders,buyerLocation,orderNumber){
    // console.log("ORDERS",orders)
    let bulkDetails=""
    for(order of orders){
        // console.log("NAME",order.name)
        bulkDetails+=
        `<div class="order-details">
        <h2>Order Details</h2>
        <p>Product name: <strong>${order.name}</strong></p>
        <p>Price: <strong>GHC ${order.price}</strong></p>
        <p>Quantity: <strong>${order.quantity}</strong></p>
        <p>Color: <strong>${order?.selectedColor}</strong></p>
        <p>Size: <strong>${order?.selectedSize}</strong></p>
        <p><strong>Order Total:</strong> GHC <strong>${Number(order.price)*Number(order.quantity)}</strong></p>
        </div>`
    }
    let mainHTML = generateMainHTML(bulkDetails,orderNumber,buyerLocation)
    return mainHTML
}

module.exports=generateOrderHTML