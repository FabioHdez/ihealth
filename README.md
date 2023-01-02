# iHealth
## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Hosting](#hosting)

## General Info
This project is a mockup of a health clinic. Some features of this web application include creating and managing clients/patients, employees and appointments. The main purpose of this app is to provide an organized way to administer the clinic's information.
	
## Technologies
Project is created with:
* NodeJS
* ExpressJS
* MongoDB
* Handlebars
* PassportJS
	
## Setup
To run this project, you will need to setup a .env file with the following variables: PORT, DB_USER, DB_PASS, DB_CONECTION, SESSION_SECRET.
To get DB_USER, DB_PASS and DB_CONNECTION you will need a MongoDB Atlas account and an empty database.
SESSION_SECRET is for passportJS' session middleware.
The file should look somthing like this:

```
PORT = 3000
DB_USER = myUser
DB_PASS = Or45My3uDRsm
DB_CONNECTION = mongodb+srv://<DB_USER>:<DB_PASS>@<clustername>.mongodb.net/test?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true
SESSION_SECRET = mysecretsession
```
On the DB_CONNECTION remove "<>" and replace with actual values

## Hosting
This project is currently hosted at https://fabioihealth.herokuapp.com/ it may take a 5 to 10 seconds to load because the application is hosted on a free tier of heroku's "dinos" which take a while to turn on.

## Screenshots
### Homepage
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/Homepage.png?raw=true)
### Homepage Appointment Section
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/HomepageAppt.png?raw=true)
### Login
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/Login.png?raw=true)
### Employee Section
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/Employees.png?raw=true)
### New Employee
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/New%20Employee.png?raw=true)
### Appointment Section
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/Appt.png?raw=true)
### Homepage
![alt text](https://raw.githubusercontent.com/FabioHdez/ihealth/main/Screenshots/New%20Appt.png?raw=true)

