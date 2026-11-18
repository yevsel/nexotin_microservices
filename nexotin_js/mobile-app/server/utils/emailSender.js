const nodemailer = require("nodemailer")
const generateOrderHTML = require("../utils/orderHtmlTemplate")

function sendWelcomeEmail (email,html,subject){

    const mailOptions = {
        from:"nexotincom@gmail.com",
        // to:"sel3491justice@gmail.com",
        to:email,
        subject:subject,
        html:html
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"nexotincom@gmail.com",
            pass:"jgpaliftfxgpznmz"
        }
    })
        // transporter.s
        transporter.sendMail(mailOptions,(err,data)=>{
        if(err) return "EMAIL FAILED"
        return "EMAIL SENT"
    })    

}

function sendEmail (to,orders,buyerLocation,orderNumber){
    
    // console.log(generateOrderHTML(orders,buyerLocation,orderNumber))
    // return 

    // console.log("SEND EMAIL TO",to)

    const mailOptions = {
        from:"nexotincom@gmail.com",
        // to:"sel3491justice@gmail.com",
        to:to,
        subject:"",
        html:generateOrderHTML(orders,buyerLocation,orderNumber)
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"nexotincom@gmail.com",
            pass:"jgpaliftfxgpznmz"
        }
    })
        transporter.sendMail(mailOptions,(err,data)=>{
        if(err) "EMAIL FAILED"
        return "EMAIL SENT"
    })    
}
//TODO send email with nodemailer

// transporter.sendMail(mailOptions,(err,data)=>{
//     if(err) console.log(err.message)
//     console.log(data)
//     return
// })

function sendForgotPassword(email,shortCode){
    const mailOptions = {
        from:"nexotincom@gmail.com",
        // to:"sel3491justice@gmail.com",
        to:email,
        subject:"Password recovery code",
        html:`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recovery Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                table {
                    background-color: #fff;
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                h2 {
                    color: #333;
                }
                p {
                    color: #555;
                    font-size: 16px;
                }
                strong {
                    font-size: 20px;
                    color: #007bff;
                }
            </style>
        </head>
        <body>
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                    <td>
                        <h2>Verification Code</h2>
                        <p>Here is your 5-digit verification code: <strong>${shortCode}</strong></p>
                        <p>Enter this code to continue the process.</p>
                        <p>If you did not request this code, please disregard this email.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"nexotincom@gmail.com",
            pass:"jgpaliftfxgpznmz"
        }
    })
        transporter.sendMail(mailOptions,(err,data)=>{
        if(err) "EMAIL FAILED"
        return "EMAIL SENT"
    })    
}

function sendBulkEmail(listOfEmails){
    
    const mailOptions = {
        from:"nexotincom@gmail.com",
        to:[...listOfEmails],
        subject:"Testing nodemailer version1",
        html:`<!DOCTYPE html>
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
                    <p>&copy; 2023 Nexotin. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`
    }
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"nexotincom@gmail.com",
            pass:"jgpaliftfxgpznmz"
        }
    })
        transporter.sendMail(mailOptions,(err,data)=>{
        if(err) return "Email failed"
        return "Email sent"
    })
}

module.exports={sendEmail,sendBulkEmail,sendWelcomeEmail,sendForgotPassword}