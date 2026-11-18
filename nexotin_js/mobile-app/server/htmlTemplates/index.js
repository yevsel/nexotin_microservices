const orderTemplate = `<!DOCTYPE html>
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
            <h1>New Order Notification</h1>
        </div>
        <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order ID:</strong> #12345</p>
            <p><strong>Customer Name:</strong> John Doe</p>
            <p><strong>Order Total:</strong> $150.00</p>
            <p><strong>Shipping Address:</strong> 123 Main St, Cityville</p>
        </div>
        <div class="footer">
            <p>This is an automated email. Please do not reply.</p>
            <p>&copy; 2024 Nexotin. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

const vendorWelcomeTemplate = (name)=>{

return        `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Nexotin</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                }
        
                header {
                    background-color: #363851;
                    color: #fff;
                    text-align: center;
                    padding: 20px 0;
                }
        
                header h1 {
                    font-size: 24px;
                }
        
                main {
                    max-width: 800px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h2 {
                    color: #333;
                    font-size: 20px;
                    margin-top: 0;
                }
        
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #555;
                }
        
                ul {
                    list-style-type: disc;
                    margin-left: 20px;
                }
                li{
                    color:#333;
                }
                footer {
                    background-color: #333;
                    color: #fff;
                    text-align: center;
                    padding: 10px 0;
                }
            </style>
        </head>
        <body>
            <header>
                <h1>Welcome to Nexotin!</h1>
            </header>
            <main>
                <section>
                    <p>Dear ${name},</p>
                    <p>Congratulations on successfully creating your vendor account on Nexotin, your gateway to the fashion world!</p>
                    <p>At Nexotin, you are now part of a vibrant community where you can showcase your unique fashion creations to a wide audience. We are thrilled to have you as part of our platform and look forward to helping you grow your fashion business.</p>
                    <p>Here's what you can do as a Nexotin vendor:</p>
                    <ul>
                        <li>List your latest fashion products for sale.</li>
                        <li>Post short videos about your product, to gain more user engagement.</li>
                        <li>Connect with fashion enthusiasts and potential customers.</li>
                        <li>Manage your inventory and orders with ease.</li>
                    </ul>
                    <p>If you have any questions or need assistance in setting up your shop, uploading products, or anything else, please don't hesitate to reach out to our support team. We are here to assist you every step of the way.</p>
                    <p>Thank you for choosing Nexotin as your platform to share your passion for fashion. We wish you great success and can't wait to see your beautiful creations!</p>
                </section>
            </main>
            <footer>
                <p>&copy; 2024 Nexotin. All rights reserved.</p>
            </footer>
        </body>
        </html>
        `}
        

module.exports={vendorWelcomeTemplate}