# Book API

This Book API provides complete CRUD operations. Admins can query, create, update, and delete book and catalog information. Users can register and, upon logging in, update their personal information, view all books, query specific books, and add favorite books to their account. The backend is built with Node.js, and the database uses MongoDB.

## Features

### Admin

- **Manage Books**: Query, create, update, delete book information (Admin only)
- **Manage Catalogs**: Query, create, update, delete catalog information (Admin only)

### User

- **Authentication**: Register, login
- **Profile Management**: Update personal information
- **Book Interaction**: View all books, query specific books, add favorite books

## Technologies

- **Backend**: Node.js
- **Database**: MongoDB

## Endpoints

### Categories

- **GET /categories**: Retrieve all categories
- **POST /categories**: Create a new category (Admin only)
- **GET /categories/:id**: Retrieve a specific category by its ID
- **PUT /categories/:id**: Update a specific category (Admin only)
- **DELETE /categories/:id**: Delete a specific category (Admin only)

### Books

- **GET /books**: Retrieve all books
- **POST /books**: Create a new book (Admin only)
- **GET /books/:id**: Retrieve a specific book
- **PUT /books/:id**: Update a specific book by its ID(Admin only)
- **DELETE /books/:id**: Delete a specific book (Admin only)

### Users

- **POST /users**: Register a new user
- **POST /users/login**: Login a user
- **GET /users/me**: Retrieve the current user's information
- **PUT /users/me**: Update the current user's information

### User Collections

- **GET /users/collections**: Retrieve the current user's favorite books
- **POST /users/collections**: Add a book to the current user's favorite books
- **DELETE /users/collections/:id**: Remove a book from the current user's favorite books
