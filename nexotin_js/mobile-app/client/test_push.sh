curl -X POST https://exp.host/--/api/v2/push/send \
-H "Content-Type: application/json" \
-d '{
  "to": "ExponentPushToken[hCmOIYJ_yd0Yk7gWJdvRfJ]",
  "title": "Nexotin",
  "body": "Yo check out this product",
  "data": {
    "url": "nexotin-app-scheme://shop/products/682236d1472fccef51bb3084"
  },
  "attachments": [
    {
      "identifier": "image",
      "url": "https://www.vhv.rs/dpng/d/366-3666666_package-delivery-guy-png-transparent-png.png",
      "type": "image/png"
    }
  ]
}'
