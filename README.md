# Mini Messageboard

A lightweight, modern web application built with Node.js, Express, and EJS that allows users to view, post, and read individual details of short messages. This project demonstrates backend architecture fundamentals, connecting an application securely to a cloud database, form validation, and robust error logging.

---

## Features

- **Home Page (`/`):** Displays a clean, chronological timeline of all submitted messages with names, text, and formatted timestamps directly from a live database.
- **New Message Form (`/new`):** A dedicated, styled form with server-side validation to safely compose and post a new note.
- **Message Detail Page (`/message/:id`):** A dynamic route using URL parameters and database primary keys to securely pull and view an individual message's expanded details.
- **Production Ready:** Configured with strict environment configurations (`NODE_ENV`), safe database connection pooling, and dynamic port binding for seamless deployment on Render.
- **Clean Styling:** Customized completely with pure, semantic CSS using a modern, responsive, and mobile-friendly UI layout.

---

## Tech Stack

| Layer               | Technology                                 |
| ------------------- | ------------------------------------------ |
| Runtime Environment | Node.js                                    |
| Server Framework    | Express.js                                 |
| Database            | PostgreSQL (`pg` connection pool)          |
| Form Validation     | express-validator                          |
| Templating Engine   | EJS (Embedded JavaScript)                  |
| Styling             | Vanilla CSS (served via static middleware) |
| Environment Control | dotenv                                     |
| Version Control     | Git and GitHub                             |

---

## Project Structure

```
mini-message-board/
├── public/
│   └── style.css              # Core stylesheet including custom error banner elements
├── views/
│   ├── index.ejs              # Main messageboard feed template mapped to DB records
│   ├── form.ejs               # New message submission form with validation alerts
│   └── message-detail.ejs     # Individual message detail view template
├── .gitignore                 # Ensures node_modules/ and sensitive .env files remain untracked
├── db.js                      # Centralized PostgreSQL Pool configuration with network-aware SSL
├── app.js                     # Express server architecture and validation middleware
├── package-lock.json
└── package.json               # Project metadata, script entry points, and dependencies
```

---

## Setup and Installation

Follow these steps to run this project locally on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/JANS66/mini-message-board.git
cd mini-message-board
```

### 2. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
```

### 3. Configure Local Environment Variables

Create a `.env` file in the root of your project directory and append your connection details:

```env
PORT=3000
DATABASE_URL=postgres://your_db_user:your_db_password@your_db_host:5432/your_db_name
NODE_ENV=development
```

### 4. Run the Development Server

Launch the application locally using Node:

```bash
node app.js
```

### 5. View the App

Open your web browser and navigate to:

```
http://localhost:3000
```

---

## How It Works

**Persistent Cloud Storage:** App messages are fetched from and written to a PostgreSQL database via the `pg` client pool. Unlike local memory arrays, application instances can scale up or restart without wiping the messaging history.

**Defense in Depth Input Validation:** The `/new` endpoint runs request payloads through `express-validator` middleware. Inputs are `.trim()` sanitized and checked against standard length boundaries before querying the server. If an input breaches a boundary, the server catches the issue and securely displays custom error blocks inside the EJS frontend template without altering user inputs.

**Secure Networking (SSL):** The pool wrapper `db.js` dynamically checks environment settings (`NODE_ENV`). When testing outside the hosting architecture (e.g., a local machine), it securely enforces SSL handshakes using `rejectUnauthorized: false` to talk to remote endpoints. On external production nodes, it relies on zero-overhead internal connections.

**Dynamic URL Parameters:** Rather than using temporary array loop indices, the web framework generates detail links (`/message/:id`) mapped to sequential primary auto-incrementing table IDs created inside the Postgres instance.

---

## Production Deployment

This project is fully configured for immediate execution on cloud container platforms like Render:

1. The script uses conditional port assignment (`process.env.PORT || 3000`).
2. Ensure `DATABASE_URL` is tied to your service instance inside the platform dashboard environment variables panel.
3. Explicitly pass `NODE_ENV=production` as an environment variable within the platform dashboard to activate native security configurations.
4. The `package.json` file contains the dedicated `"start": "node app.js"` lifecycle command, which the deployment container fires automatically to boot your system.
