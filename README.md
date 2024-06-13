## Comment Application

This is a NestJS-based Single Page Application (SPA) for managing comments. Users can leave comments, which are stored in a relational database. The application supports CAPTCHA validation, file uploads, real-time updates via WebSockets, and caching.

## Features

-Users can add comments with the following fields:
-User Name (Latin alphabet and numbers) - required
-E-mail (valid email format) - required
-Home page (URL format) - optional
-CAPTCHA (Latin alphabet and numbers) - required
-Text (comment content, with limited HTML tags) - required
-CAPTCHA validation to prevent spam
-File uploads (images and text files):
-Images are resized to 320x240 pixels
-Text files are limited to 100KB
-Comments are displayed in a cascading manner, allowing replies to comments
-Sorting of top-level comments by User Name, Email, or date (both ascending and descending)
-Pagination of comments (25 comments per page)
-Protection against XSS attacks and SQL injection
-Real-time updates using WebSockets
-Caching of comments and top-level comments count to improve performance
-Event-driven architecture for handling comment creation

## Technologies Used

- **NestJS**: Backend framework
- **TypeORM**: ORM for database interactions
- **PostgreSQL**: Relational database
- **Sharp**: Image processing library
- **svg-captcha**: CAPTCHA generation
- **WebSockets**: Real-time communication
- **CacheManager**: Caching
- **EventEmitter**: Event-driven architecture

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database

### Installation

1. Clone the repository:

   git clone https://github.com/YehorCherevko/comment-app
   cd comment-app

2. Install the dependencies:

npm install

3. Set up the environment variables:

Create a .env file in the root directory and add the following variables:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_DATABASE=comments_db

SESSION_SECRET=your_secret_key

PORT=3000

UPLOAD_DIR=./uploads

4. Run the database migrations:

npm run typeorm migration:run

Running the Application

1. Start the NestJS application:

npm run start

The application will run on http://localhost:3000.

API Endpoints
GET /captcha: Generate a CAPTCHA image. The CAPTCHA text is stored in the session.
POST /comments: Create a new comment. Required fields: userName, email, text, captcha. Optional fields: homePage, file.
GET /comments: Fetch all top-level comments with pagination and sorting. Query parameters: page, limit, sortBy, sortOrder.
GET /comments/count: Get the count of top-level comments.

Testing with Postman
Generate CAPTCHA:

Make a GET request to /captcha to get the CAPTCHA image.
The CAPTCHA text will be stored in the session.
Create Comment:

Make a POST request to /comments with the following fields: userName, email, homePage (optional), text, captcha, and file (optional).
Ensure the CAPTCHA text matches the one in the session. If it matches, the comment will be created; otherwise, an error will be thrown.
Fetch Comments:

Make a GET request to /comments with pagination and sorting parameters to fetch the comments.

File Uploads
Images:
Allowed formats: JPG, PNG, GIF
Maximum size: 320x240 pixels
Text Files:
Format: TXT
Maximum size: 100KB

Security
XSS Protection: All text inputs are sanitized to prevent XSS attacks.
SQL Injection Protection: Parameterized queries are used to prevent SQL injection.

Caching
Comments: Cached for 60 seconds to improve performance.
Top-level Comments Count: Cached for 60 seconds to improve performance.

Event-Driven Architecture
Comment Created Event: An event is emitted when a new comment is created, allowing for additional actions to be taken in response to the event.
