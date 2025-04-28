# Subscription Tracker API

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express.js-4.x-blue)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

A backend service built with Node.js and Express.js for managing user subscriptions, sending email reminders, and handling renewals.  
Built with scalability, security, and real-world patterns in mind.

---

## 🚀 Features

- **User Authentication**: JWT-based secure authentication
- **Role-Based Access Control**: Admin and user roles with different permissions
- **User Management**: Full CRUD operations for user profiles
- **Subscription Management**: Create and manage subscriptions
- **Automated Reminders**: Email notifications for upcoming renewals (Upstash QStash)
- **Data Safety**: Soft deletion for both users and subscriptions
- **Error Handling**: Centralized error management system
- **Cancellation Flow**: Proper subscription cancellation process
- **Security**: Robust authorization middleware, Arcjet for Rate Limit and Bot Protection
- **Notifications**: Email alerts for subscription events
- **Logging**: Winston-based logging system

---

## ⚙️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Scheduling**: Upstash QStash
- **Email**: Nodemailer/Upstash Email
- **Logging**: Winston
- **Configuration**: dotenv
- **Security**: Arcjet middleware

---

## 📚 API Endpoints

| Method | Endpoint                                  | Description              | Protected | Roles          |
| ------ | ----------------------------------------- | ------------------------ | --------- | -------------- |
| GET    | `/api/v1/users`                           | Get all users            | ✅        | Admin          |
| GET    | `/api/v1/users/:id`                       | Get single user          | ✅        | Self or Admin  |
| PUT    | `/api/v1/users/:id`                       | Update user info         | ✅        | Self only      |
| DELETE | `/api/v1/users/:id`                       | Delete user              | ✅        | Self or Admin  |
| POST   | `/api/v1/subscriptions`                   | Create new subscription  | ✅        | User           |
| GET    | `/api/v1/subscriptions/user/:id`          | Get user's subscriptions | ✅        | Self or Admin  |
| PUT    | `/api/v1/subscriptions/:id/cancel`        | Cancel subscription      | ✅        | Owner or Admin |
| GET    | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals    | ✅        | User           |

> 🔐 All sensitive routes are protected by `authorize` middleware with proper role-checks.

---

## 🛠 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/lenlo121500/subscription-tracker
cd subscription-tracker

```

2. Install dependencies

   - npm install

3. Create a .env file and configure:

   - PORT=5000
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret
   - SERVER_URL=http://localhost:5000
   - QSTASH_TOKEN=your_upstash_qstash_token

4. Start the server
   - npm run dev

---

## Directory Structure

subscription-tracker-api/
├── .gitignore
├── README.md
├── app.js
├── config/
│ ├── arcjet.js
│ ├── env.js
│ ├── nodemailer.js
│ └── upstash.js
├── controllers/
│ ├── auth.controller.js
│ ├── subscription.controller.js
│ ├── user.controller.js
│ └── workflow.controller.js
├── database/
│ └── mongodb.js
├── middlewares/
│ ├── arcjet.middleware.js
│ ├── auth.middleware.js
│ └── error.middleware.js
├── models/
│ ├── subscription.model.js
│ └── user.model.js
├── routes/
│ ├── auth.route.js
│ ├── subscription.route.js
│ ├── user.route.js
│ └── workflow.route.js
├── utils/
│ ├── email-template.js
│ ├── logger.js
│ └── send-email.js
├── package-lock.json
├── package.json
└── workflow.txt

---

## Subscription Reminder Workflow

```mermaid
flowchart TD
    A[User creates a Subscription] --> B[Trigger Workflow with Subscription ID]

    B --> C[Retrieve Subscription Details from Database]

    C --> D{Subscription Exists?}
    D -- No --> E[Log Error and Exit]
    D -- Yes --> F{Status Active?}

    F -- No --> G[Log Inactive Status and Exit]
    F -- Yes --> H{Renewal Date Passed?}

    H -- Yes --> I[Log Renewal Date Passed and Exit]
    H -- No --> J[Start Reminder Scheduling]

    J --> K[For Each Reminder Date]
    K --> L{Reminder Date in Future?}

    L -- Yes --> M[Wait Until Reminder Date]
    L -- No --> N[Immediately Send Reminder Email]

    M --> N
    N --> O{More Reminders?}

    O -- Yes --> K
    O -- No --> P[Workflow Completed]

---

##  Future Improvements
  - Implement Soft Deletion for Users

  - Add Refresh Tokens for Authentication

  - Full Admin Dashboard (Stats, Active Subscriptions, Revenue)

  - Add Stripe for Paid Subscription Payments

  - Add Webhooks for external event listening

  - Build Public API Docs (Swagger or Postman)

  - Add Grace Period logic before full subscription cancellation

  - Implement Email Templates for better UX

  - Multi-language Support (Localization)

  - Deploy to Vercel, Render, or AWS

---

## Contributing

Contributions are welcome!
Fork the project, create a branch, commit your changes, and open a pull request.


```
