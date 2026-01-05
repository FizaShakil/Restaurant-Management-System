# Restaurant Management System

## Overview

The **Restaurant Management System** is a full-stack web application developed to streamline restaurant operations through a digital platform that supports role-based access control, product management, order billing, and PDF invoice generation. It simplifies the management of products, categories, billing, and user authentication while providing a seamless and responsive interface for both administrators and staff.

This system was designed to address the operational inefficiencies commonly found in small to mid-sized restaurants, reducing manual workload and ensuring secure, centralized control of restaurant resources.

---
## User Interface


## Tech Stack

**Frontend:**

* React.js
* Redux for state management
* Tailwind CSS for responsive design
* Axios for API communication

**Backend:**

* Node.js
* Express.js
* MySQL for relational database management
* bcrypt for password hashing
* JWT for secure authentication
* Puppeteer & EJS for PDF invoice generation

**Tools & Other Technologies:**

* RESTful APIs
* Three-Layer Architecture
* Crow’s Foot ER Diagram
* Postman for API testing
* Git & GitHub for version control

---

## Features

* **User Authentication & Authorization**: Secure login and role-based access (admin/staff).
* **Product Management**: Admin can add, update, delete and toggle the status of menu items.
* **Category Management**: Create and associate categories for food and drinks.
* **Order Management**: Place orders with dynamic product quantities and auto-calculated totals.
* **Billing System**: Store complete bill details including UUID and user info.
* **PDF Generation**: Automatically generate printable invoices using Puppeteer and EJS templates.
* **Session-based Orders**: Support for guest users with session IDs.
* **Responsive UI**: Mobile-first design using Tailwind CSS.

---

## Database Schema

The system uses a normalized relational database with the following tables:

* `user`: Stores user credentials and roles.
* `category`: Manages product categories.
* `product`: Stores product data and category associations.
* `bill`: Records invoice information including dynamic product details in JSON.

Refer to the Crow’s Foot ER diagram for visual schema representation.

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/restaurant-management-system.git
   ```

2. **Backend Setup:**

   * Configure `.env` with MySQL credentials and JWT secret.
   * Run SQL scripts to create and populate tables.
   * Start the backend:

     ```bash
     cd server
     npm install
     npm run dev
     ```

3. **Frontend Setup:**

   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access Application:**
   Navigate to `http://localhost:3000`


## ER-Diagram

![ER Diagram](https://github.com/FizaShakil/Restaurant-Management-System/blob/main/Client/src/assets/er-diagram.png)


## Future Work

* **Online Payment Integration**: Enable Stripe or PayPal for secure online payments.
* **Analytics Dashboard**: Include charts and reports for sales, top-selling items, and user activity.
* **Inventory Management**: Track stock levels and notify when items are low in quantity.
* **Multi-branch Support**: Scale to support multiple restaurant locations under a single platform.
* **Customer Management**: Add functionality to save frequent customer data for loyalty programs.
* **Cloud platform Integration**: Use the cloud platforms for storing images of products

---

## License

This project is licensed under the MIT License.

---

## Contact

For queries, contributions, or feedback, please contact the project maintainer at `fizashakilofficial@gmail.com`.

