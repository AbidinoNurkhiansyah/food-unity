Setting URL endpoints
Midtrans requires the URL endpoints for the following scenarios:

Payment Notification URL\*
https://humvee-vertebrae-trombone.ngrok-free.dev/api/midtrans-callback
Address where we will send the notification via HTTP Post request.

Recurring Notification URL\*
http://humvee-vertebrae-trombone.ngrok-free.dev/notification/handling
Address where we will send the recurring notification via HTTP Post request.

Pay Account Notification URL\*
http://humvee-vertebrae-trombone.ngrok-free.dev/notification/handling
Address where we will send the pay account status notification via HTTP Post request

Finish Redirect URL\*
https://humvee-vertebrae-trombone.ngrok-free.dev/payment/success
Customer sent here if payment is successful

Unfinish Redirect URL\*
https://humvee-vertebrae-trombone.ngrok-free.dev/payment/pending

Error Redirect URL\*
https://humvee-vertebrae-trombone.ngrok-free.dev/payment/error
