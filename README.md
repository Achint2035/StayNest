
# 🏠 StayNest — Student Accommodation Platform

StayNest is a student accommodation web project designed to help students explore PG and accommodation listings, view property details, filter available options, and shortlist properties they prefer.

This project brings together a React frontend and a PHP/MySQL backend in one repository. It was developed as part of my hands-on learning journey, with guidance and coding assistance from ChatGPT.

## 🎯 Project Objective

Finding suitable accommodation can be challenging for students moving to a new city for education. StayNest aims to make the process more organized by providing a place to explore accommodation options and manage shortlisted properties.

## ✨ Features

- Browse available accommodation listings.
- View property details.
- Filter properties based on available options.
- User login functionality.
- Shortlist preferred properties.
- View and manage shortlisted properties.
- Responsive frontend interface.

*Note: Features may depend on the current implementation and local configuration.*

## 🛠️ Tech Stack

**Frontend**
- React
- JavaScript
- HTML5
- CSS3
- Bootstrap (where used)

**Backend**
- PHP
- MySQL
- AJAX (where used)

**Development Tools**
- Visual Studio Code
- Git and GitHub
- XAMPP
- ChatGPT for learning guidance, coding assistance, and debugging

## 📁 Project Structure

```text
StayNest/
├── staynest-react/          # React frontend
├── student-accommodation/   # PHP backend and related resources
└── README.md                # Project documentation
```

## ⚙️ Getting Started

### Prerequisites

Install the following tools before running the project:

- [Node.js and npm](https://nodejs.org/)
- [XAMPP](https://www.apachefriends.org/)
- A web browser
- Git (optional, for version control)

### 1. Set Up the Backend

1. Start Apache and MySQL from XAMPP.
2. Copy the `student-accommodation` folder into your XAMPP `htdocs` directory.
3. Open phpMyAdmin and create/import the required database using the project's SQL file.
4. Configure your local database connection in `config/db.php`.
5. Never upload database passwords or private credentials to GitHub.

### 2. Set Up the Frontend

1. Open a terminal inside the `staynest-react` folder.
2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the Vite development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in the terminal.

### 3. Connect Frontend and Backend

Make sure the PHP backend is running through XAMPP and that the frontend API requests point to the correct local backend URL.

Database configuration and API paths may need adjustment depending on your local setup.

## 🤖 AI-Assisted Development

ChatGPT was used as a learning and development assistant during this project for coding guidance, debugging, understanding implementation steps, and organizing the frontend and backend.

The project is also an opportunity for me to strengthen my understanding of React, PHP, MySQL, Git, and full-stack web development.

## 📚 What I'm Learning

- Building frontend interfaces with React.
- Connecting a frontend to a PHP backend.
- Working with MySQL databases.
- Understanding API requests and application flow.
- Debugging and improving web applications.
- Using Git and GitHub to manage and present projects.

## 🚀 Future Improvements

- Improve the user experience and responsive design.
- Add more property search and filtering options.
- Improve validation, error handling, and security.
- Add clearer setup instructions and project screenshots.
- Explore deployment so the project can be accessed online.

## 👨‍💻 Author

**Achint**

B.Tech CSE (Data Science & Artificial Intelligence)

GitHub: [@Achint2035](https://github.com/Achint2035)

---

⭐ Thank you for checking out StayNest!
