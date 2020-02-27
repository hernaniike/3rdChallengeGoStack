<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src="https://raw.githubusercontent.com/Rocketseat/bootcamp-gostack-desafio-02/master/.github/logo.png" width="300px" />
</h1>

<h3 align="center">
  FastFeet: Back-end
</h3>

<h3 align="center">
  :warning: Step 2/4 Final Challenge :warning:
</h3>

<p align="center">
<a href="#rocket-about-the-challenge">About the challenge</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#Tools-used">Tools</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#how-to-install-the-project-in-your-machine">How to install </a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a href="#functionality">Functionality</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;


## :rocket: About the challenge
This is the second part of the challenge

Continue developing an app for a fictitious freight company, The FastFeet.

In this part of the project it was finished the backend of this application.
An API has many functionalities and it is part of the final project for our backend, front-end and mobile app.

## **Tools used**
During the challenge the tools below were used:

- NodeJS
- Yarn
- Express
- Sucrase
- Nodemon
- ESLint
- Prettier
- EditorConfig
- [Yup] (https://github.com/jquense/yup)
- [Sequelize] (https://sequelize.org/master/) (PostgreSQL);
- [jsonwebtoken] (https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs] (https://www.npmjs.com/package/bcryptjs)
- [date-fns] (https://date-fns.org/)
- [Multer] (https://github.com/expressjs/multer)
- [NodeMailer] (https://nodemailer.com/about/)
- [Handlebars] (https://handlebarsjs.com/) (Templates Engines)

## **How to install the project in your machine**
1. Git clone.
2. Install all dependencies of the project:&nbsp;&nbsp;&nbsp; `yarn add`&nbsp;  ou &nbsp; `npm install`
3. Configure from file .env your local variables.
5. Run seeds and migrations:
```sh
yarn sequelize db:migrate
yarn sequelize db:seed:all
```
6. After that, start your application running `yarn dev` in your terminal.

## **Functionality**

### **1. Admin Autentication**

Log in permission for a user using email and password.

- The auth was done using JWT(json web token).
- Input data validation.
- Admin hast access to all application, he can manage all delivery guys, recipients and orders.

### **2. Recipient Management**

- You must have admin permission for manage recipients like create/update/delete.
- Input Data Validation
- Recipient does not has a password.

### **3. Delivery Guys Management**

CRUD for delivery guys

- Delivery Guys management can be done only by admin.
- Input data validation.
- Delivery Guy can not log in the system.
- Delivery Guy may check deliveries attached to him.
- Delivery Guy may start one delivery order as long he started between business hours(08:00~18:00) and he did less than 5 deliveries in that day.
- Delivery Guy may finish one deliver, as long he send a picture with recipient signature.
- Delivery Guy may register any issue with your deliveries.

### **4. Order Management**

CRUD for orders.

- Orders Management can be done only by admins.
- Input Data Validation.
- Start Delivery can be done only between business hours.
- If one order has a problem, only admin can cancel it.
- When the order is created and email it will be sent to the Delivery Guy attached to that delivery.
- When the order is canceled and email it will be sent to the Delivery Guy attached to that delivery.

## :memo: Hernani Ike
Challenge done by Hernani Ike.
