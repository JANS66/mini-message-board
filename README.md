# Mini Messageboard

A lightweight, modern web application built with Node.js, Express, and EJS that allows users to view, post, and read individual details of short messages. This project serves as a foundational demonstration of setting up an Express server, routing, dynamic template rendering, handling HTML form submissions, and deploying to production.

## Features

- **Home Page (`/`):** Displays a clean timeline of all submitted messages with names, text, and timestamps.
- **New Message Form (`/new`):** A dedicated, styled page with validation to compose and post a new note.
- **Message Detail Page (`/message/:id`):** A dynamic route using URL parameters to view a single message's expanded details.
- **Production Ready:** Configured to dynamically bind ports and launch seamlessly on platforms like Render or Railway.
- **Clean Styling:** Customized completely with pure, semantic CSS using a modern, responsive, and mobile-friendly UI layout.

## Tech Stack

| Layer               | Technology                                 |
| ------------------- | ------------------------------------------ |
| Runtime Environment | Node.js                                    |
| Server Framework    | Express.js                                 |
| Templating Engine   | EJS (Embedded JavaScript)                  |
| Styling             | Vanilla CSS (served via static middleware) |
| Version Control     | Git and GitHub                             |

## Project Structure

```text
mini-message-board/
|-- public/
|   └── style.css              # Core stylesheet for the application
|-- views/
|   |-- index.ejs              # Main messageboard feed template
|   |-- form.ejs               # New message submission form template
|   └── message-detail.ejs     # Individual message detail view template
|-- .gitignore                 # Ensures node_modules/ is untracked
|-- app.js                     # Primary Express server and route architecture
|-- package-lock.json
└── package.json               # Project metadata and start configurations
```

## Setup and Installation

Follow these steps to run this project locally on your machine:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/JANS66/mini-message-board.git
   cd mini-messageboard
   ```

2. **Install Dependencies**
   Make sure you have Node.js installed, then run:

   ```bash
   npm install
   ```

3. **Run the Development Server**
   Launch the application using Node:

   ```bash
   node app.js
   ```

4. **View the App**
   Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## How It Works

1. **State Management:** Messages are stored temporarily in an in-memory array inside `app.js`.
2. **Form Parsing:** The application utilizes `express.urlencoded` middleware to process incoming POST body data from the HTML form.
3. **Dynamic Routing:** The application uses array indexes to generate dynamic IDs for individual message viewing (`/message/0`, `/message/1`, etc.).

> **Note:** Because data is managed in a temporary array, the message list will reset back to default states whenever the hosting server sleeps or restarts.

## Production Deployment

This project is tailored for instant deployment on Render, Railway, or similar platforms:

- The port configuration automatically respects production environment variables (`process.env.PORT || 3000`).
- The `package.json` contains a pre-configured `"start": "node app.js"` script which production servers utilize to boot the application.
