import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.celery_app import celery_app

# These are read once when the worker starts.
# If you change .env, restart the worker container.
GMAIL_USER = os.getenv("GMAIL_USER", "nexotincom@gmail.com")
GMAIL_PASSWORD = os.getenv("GMAIL_PASSWORD", "")

# Same HTML the Node app used in htmlTemplates/index.js.
# ${name} is replaced with the vendor's name before sending.
VENDOR_WELCOME_TEMPLATE = """<!DOCTYPE html>
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
        li {
            color: #333;
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
"""


# The decorator turns this normal function into a Celery task.
# The worker finds it by name: app.tasks.email.send_vendor_welcome_email
@celery_app.task(
    # If sending fails, try again up to 3 times, waiting longer each time.
    autoretry_for=(Exception,),
    retry_backoff=True,
    max_retries=3,
)
def send_vendor_welcome_email(to_email: str, name: str) -> None:
    # Build the HTML for this vendor.
    html = VENDOR_WELCOME_TEMPLATE.replace("${name}", name)

    # MIMEMultipart lets us attach an HTML body with a proper content type.
    message = MIMEMultipart()
    message["From"] = GMAIL_USER
    message["To"] = to_email
    message["Subject"] = "Welcome Vendor🎊🎊"
    message.attach(MIMEText(html, "html"))

    # Gmail over implicit TLS (port 465).
    # Port 587 + STARTTLS was being closed on this network, so use 465.
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
        server.login(GMAIL_USER, GMAIL_PASSWORD)
        server.send_message(message)
