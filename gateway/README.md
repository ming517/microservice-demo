An API gateway that connects between client and microservices.

# Setup
- Run `npm install`
- Setup `.env` as following, feel free to change according your preferences.
```
PORT=8080 #port
ORDER_API_HOST=http://localhost:3000 #order microservice app url
PAYMENT_API_HOST=http://localhost:3001 #payment microservice app url
```