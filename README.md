# Book Notes App

A web application to manage your personal library, built as a capstone project for [Angela Yu's Full-Stack Web Development Course](https://www.udemy.com/course/the-complete-web-development-bootcamp/). Track books you've read, plan future reads, and organize your reading journey with a clean and responsive interface.

## Features
- Add books using the Open Library API (search by title).
- Edit, delete, and filter books by status (`reading`, `planned`, `finished`).
- Rate and review books with a 0-10 rating system.
- Display book covers and details in a responsive UI.

## Tech Stack
- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: EJS, CSS, JavaScript
- **API**: Open Library API for book data
- **Tools**: Git, pgAdmin for database management

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/oizzoo/capstone-Book-proj.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file based on `.env.example`:
     ```plaintext
     # Environment variables for PostgreSQL database connection
     DB_USER=postgres
     DB_HOST=localhost
     DB_NAME=book_notes
     DB_PASS=your_password
     DB_PORT=5432
     ```
4. Create the database and table:
   ```bash
   psql -U <your_user> -d <your_db> -f schema.sql
   ```
5. (Optional) Load sample data:
   ```bash
   psql -U <your_user> -d <your_db> -f seed.sql
   ```
6. Run the application:
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

## Project Background
This project was developed as part of Angela Yu's Full-Stack Web Development Course on Udemy. It demonstrates skills in backend development (Node.js, Express, PostgreSQL), frontend templating (EJS), and API integration (Open Library API). The app showcases CRUD operations, database management, and responsive design.

## Future Improvements
- Migrate frontend to React for a more dynamic UI.
- Implement user authentication for personalized libraries.

## License
MIT License