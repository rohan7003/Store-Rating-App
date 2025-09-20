🏬 Store Rating App

A full-stack web application that allows users to submit ratings for stores registered on the platform.

⚙️ Tech Stack

Frontend: React.js 

Backend: Express.js (Node.js) 

Database: MySQL 

🔑 User Roles & Access


System Administrator 

Can add new stores, normal users, and admin users.

Has access to a dashboard displaying the total number of users, stores, and submitted ratings.

Can view a list of users and stores and apply filters based on Name, Email, Address, and Role.

Can log out from the system.


Normal User 

Can sign up and log in to the platform.

Can view a list of all registered stores.

Can search for stores by Name and Address.

Can submit ratings (between 1 to 5) for individual stores.


Can update their password and modify their submitted rating after logging in.


Can log out from the system.

👉 Just sign up to use as a normal user.


Store Owner 

Can log in to the platform and update their password.

The dashboard allows them to view a list of users who have submitted ratings for their store and see the average rating of their store.

Can log out from the system.

📋 Features


Single Login System with different dashboards based on roles.


Store listings display the Store Name, Address, and Overall Rating.


Rating system: Users can submit and update their ratings.


Admin can manage all users, stores, and roles.


Form Validations: Includes strict rules for Name, Address, Password, and Email.

🛠️ Setup Instructions

# Backend

cd server

npm install

npm start

# Frontend

cd client

npm install

npm run dev
