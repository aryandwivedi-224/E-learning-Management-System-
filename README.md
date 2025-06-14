
E-Learning Management System
Introduction
The E-Learning Management System is a modern web application designed to streamline online learning and teaching processes. Built on the MERN stack, this project supports two distinct roles:

Instructor: Capable of creating, editing, and managing courses. Instructors can upload lectures, update or delete them, and view a comprehensive dashboard with revenue insights.
Student: Can browse available courses, purchase those that interest them, attend classes, and monitor their progress throughout each course.
This platform leverages MongoDB for its flexible database structure and integrates third-party services like Cloudinary for media storage and Razorpay for payment processing.

Project Screenshot
Figure 1: Dashboard Overview and Course Details

Tech Stack
The project integrates the following technologies:

Frontend: React, Redux, HTML5, CSS3, and Bootstrap (or Tailwind CSS) for a responsive, engaging UI.
Backend: Node.js and Express to build a robust REST API.
Database: MongoDB, which powers dynamic collections for users, courses, purchases, and videos.
Authentication & Security: JWT for authentication, alongside secure routes and data handling.
Payment Gateway: Razorpay, ensuring a safe and efficient payment process.
Cloud Storage: Cloudinary for handling media (images/videos) uploads.
Additional Tools: npm for package management, and Git for version control.
Cloning the Repository
To clone the repository locally, run the following commands in your terminal:

Bash

# Clone the repository
git clone https://github.com/aryandwivedi-224/E-learning-Management-System-.git

# Navigate into the project directory
cd e-learning-management-system
Replace the GitHub URL with the actual repository URL.

Setup & Installation
Follow these steps to set up and run the application locally:

Backend Setup
Navigate to the Backend Folder:

Bash

cd backend
Install Dependencies:

Bash

npm install

Create the Configuration File:
Create a .env file in the backend folder with the following content:

Code snippet

PORT=8080
MONGO_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret>
SECRET_KEY=<Your Secret Key>

# Cloudinary Setup
API_KEY=<Your Cloudinary API Key>
API_SECRET=<Your Cloudinary API Secret>
CLOUD_NAME=<Your Cloudinary Cloud Name>

# Instructor Code
INSTRUCTOR_CODE=admin123

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=<Your Razorpay Key ID>
RAZORPAY_KEY_SECRET=<Your Razorpay Key Secret>
RAZORPAY_WEBHOOK_SECRET=<Your Razorpay Webhook Secret>
Ensure you replace the placeholder values (<...) with your actual configuration values.

Start the Backend Server:

Bash

npm start
Frontend Setup
Navigate to the Frontend Folder:
Typically, your frontend code is located in another folder (e.g., client):

Bash

cd ../frontend
Install Dependencies:

Bash

npm install
Run the Frontend Application:

Bash

npm run dev
Your React application should now be running on your local development server.

Further Steps
Database Models
The MongoDB collections include four primary types:

User: Stores information for both students and instructors.
Course: Contains course details, metadata, and associated lectures.
Purchase: Tracks course purchases made by students.
Video: Manages video lectures associated with courses.
Routing & Authentication
Ensure that the API endpoints are secured and that the user authentication flow using JWT is properly handled.

Payment & Media Integration
Verify that Cloudinary and Razorpay configurations are working as expected for media uploads and payment processing.






