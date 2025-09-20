## ✨ Features
* **User Roles:** Secure authentication with three distinct roles: `admin`, `owner`, and `user`.
* **Dynamic Dashboards:** Each user role gets a unique dashboard with functionalities tailored to their needs.
* **Store Discovery:** Users can browse all registered stores, view their average ratings, and search/filter based on name and address.
* **User Ratings:** Logged-in users can submit and modify their personal ratings (1-5 stars) for any store.
* **Admin Controls:** The admin dashboard provides a centralized view of all users, stores, and ratings, with the ability to add new entries.
* **Secure API:** The backend API is protected with JWT for authentication and authorization, and all data is validated with `Joi`.

***

## 🚀 Quick Start
Ready to get it running on your local machine? Follow these simple steps.

### **1. Clone the repository**
Start by getting a copy of the project.
```bash
git clone <repository-url>
cd Assignment-Store-App
2. Database Setup
Create a MySQL database named store_rating.

Run the SQL script from server/sql/schema.sql to create all the necessary tables.

3. Backend Setup (Server)
Navigate to the server directory and install dependencies.

Bash

cd server
npm install
Create a .env file for your database credentials and security keys.

Code snippet

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating
JWT_SECRET=your_super_secret_key
BCRYPT_SALT_ROUNDS=10
PORT=4000
Start the backend server.

Bash

npm run dev
The server will run on http://localhost:4000.

4. Frontend Setup (Client)
Open a new terminal, go to the client directory, and install dependencies.

Bash

cd ../client
npm install
Create a .env file to connect the frontend to the backend.

Code snippet

VITE_API_URL=http://localhost:4000
Start the frontend development server.

Bash

npm run dev
The application will be live at http://localhost:5173.

🛠️ Tech Stack
Category	Backend	Frontend
Framework	Express.js	React.js
Database	MySQL	
Authentication	Bcrypt & JWT	
Validation	Joi	Joi
API Client		Axios
Tooling	Nodemon	Vite

Export to Sheets
👮 API Endpoints
All API endpoints are protected and validated.

Auth Routes (/auth)
Method	Endpoint	Description
POST	/signup	Registers a new user.
POST	/login	Authenticates a user and returns a JWT.
POST	/update-password	Updates an authenticated user's password.

Export to Sheets
Admin Routes (/admin)
Method	Endpoint	Description
POST	/add-user	Adds a new user to the system.
POST	/add-store	Registers a new store.
GET	/dashboard	Retrieves key metrics for the dashboard.
GET	/users	Gets a list of all users, with optional filtering.
GET	/stores	Gets a list of all stores, with optional filtering.

Export to Sheets
Store Routes (/stores)
Method	Endpoint	Description
GET	/list	Retrieves a list of all stores with average ratings.
GET	/search	Searches stores by name or address.
POST	/rate	Submits a new rating for a store.
POST	/update-rating	Updates an existing rating for a store.

