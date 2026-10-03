# 🏙️ Civic AI

### AI-Powered Platform for Smarter Civic Problem Reporting and Community Solutions

**Civic AI** is a smart digital platform designed to help citizens report local civic problems, understand community issues, track complaints, and support authorities in managing problems more efficiently.

The platform uses **Artificial Intelligence, data analysis, and a digital reporting system** to connect citizens, government authorities, organizations, and communities on a single platform.

Instead of relying only on traditional complaint systems, Civic AI provides a modern approach where citizens can report problems such as:

* 🛣️ Damaged roads
* 💡 Broken street lights
* 🗑️ Garbage and waste problems
* 🚰 Water supply issues
* 🚦 Traffic and signal problems
* 🌳 Public space and environmental issues
* 🏫 Problems around public institutions
* 🏥 Local healthcare facility issues
* ⚡ Electricity-related civic problems
* 🚧 Infrastructure damage
* 🐕 Stray animal-related civic concerns
* 🌧️ Drainage and waterlogging problems

The system organizes reported problems, identifies important issues, and provides useful information through dashboards and AI-assisted analysis.

---

# 📌 Table of Contents

* [About the Project](#-about-the-project)
* [Problem Statement](#-problem-statement)
* [Our Solution](#-our-solution)
* [Objectives](#-objectives)
* [Key Features](#-key-features)
* [How Civic AI Works](#-how-civic-ai-works)
* [AI Features](#-ai-features)
* [User Roles](#-user-roles)
* [System Workflow](#-system-workflow)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Frontend](#-frontend)
* [Backend](#-backend)
* [Database](#-database)
* [AI/ML Module](#-aiml-module)
* [Authentication](#-authentication)
* [API Structure](#-api-structure)
* [Dashboard](#-dashboard)
* [Complaint Management](#-complaint-management)
* [AI-Based Priority Detection](#-ai-based-priority-detection)
* [Installation](#-installation)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Example Workflow](#-example-workflow)
* [Future Improvements](#-future-improvements)
* [Advantages](#-advantages)
* [Use Cases](#-use-cases)
* [Security](#-security)
* [Performance](#-performance)
* [Project Objectives](#-project-objectives)
* [Expected Impact](#-expected-impact)
* [Screenshots](#-screenshots)
* [Future Scope](#-future-scope)
* [Contributing](#-contributing)
* [License](#-license)
* [Author](#-author)

---

# 📖 About the Project

Civic problems are an important part of everyday life. Citizens regularly face problems related to roads, garbage, water, electricity, drainage, public infrastructure, transportation, and other services.

Traditional complaint systems can sometimes make it difficult for citizens to:

1. Report a problem quickly.
2. Track the status of a complaint.
3. Know whether the authority received the complaint.
4. Understand which department is responsible.
5. Know which problems are more urgent.
6. Communicate updates effectively.

**Civic AI** attempts to solve these problems by providing a centralized digital platform.

The platform allows citizens to submit a complaint using text, images, location information, and categories.

AI can then help analyze the submitted information and provide useful classification or prioritization.

---

# 🚨 Problem Statement

Many cities and communities face civic problems every day.

However, there can be a gap between:

**Citizen → Problem Reporting → Authority → Action → Citizen Feedback**

Traditional systems may involve manual processes, disconnected departments, or limited visibility into complaint status.

For example:

> A citizen sees a large pothole on a busy road.

The citizen should be able to:

```text
Open Civic AI
      ↓
Report Problem
      ↓
Upload Photo
      ↓
Add Location
      ↓
AI Analyzes Complaint
      ↓
Problem Classified
      ↓
Priority Assigned
      ↓
Relevant Department Notified
      ↓
Complaint Resolved
      ↓
Citizen Receives Update
```

Civic AI aims to make this process more organized and transparent.

---

# 💡 Our Solution

Civic AI provides a single platform where citizens and authorities can interact around civic problems.

The platform combines:

* Citizen reporting
* Image upload
* Location-based reporting
* AI classification
* Priority analysis
* Complaint tracking
* Authority dashboard
* Notifications
* Data analytics
* Community participation

The main objective is to transform raw citizen complaints into structured and actionable information.

---

# 🎯 Objectives

The major objectives of Civic AI are:

### 1. Easy Problem Reporting

Allow citizens to report civic problems from a simple interface.

### 2. Faster Classification

Use AI to identify the category of a reported issue.

### 3. Priority Identification

Help identify complaints that may require faster attention based on configured criteria.

### 4. Transparency

Allow users to track complaint status.

### 5. Centralized Management

Provide authorities with a single dashboard for managing complaints.

### 6. Data-Driven Decision Making

Generate useful statistics and reports from collected civic data.

### 7. Community Participation

Encourage citizens to actively participate in improving their local environment.

---

# 🚀 Key Features

## 👤 Citizen Registration

Citizens can create an account using:

* Name
* Email
* Phone number
* Password

---

## 🔐 Secure Login

Users can securely log into the platform.

Authentication can be implemented using:

* JWT
* Password hashing
* Protected routes
* Role-based authorization

---

## 📝 Report Civic Problem

Users can create a complaint with:

* Problem title
* Description
* Category
* Image
* Location
* Date
* Additional information

Example:

```text
Title:
Large pothole near main road

Category:
Road & Infrastructure

Description:
There is a large pothole near the main intersection.

Location:
Main Road

Image:
pothole.jpg
```

---

# 📸 Image-Based Reporting

Citizens can upload images related to a civic problem.

For example:

```text
Image
  ↓
AI/Image Processing
  ↓
Object or Problem Detection
  ↓
Category
  ↓
Priority Analysis
```

Possible categories include:

* Garbage
* Pothole
* Broken street light
* Damaged infrastructure
* Water leakage
* Road obstruction

---

# 📍 Location-Based Reporting

Users can provide the location of a problem.

The system can store:

```text
Latitude
Longitude
Address
City
Area
```

This can help authorities understand where complaints are concentrated.

---

# 🤖 AI Features

AI is one of the main components of Civic AI.

Possible AI features include:

### AI Complaint Classification

Automatically classify complaints.

Example:

```text
Input:
"Street light is not working"

AI Output:
Category: Electricity / Street Lighting
```

---

### AI Priority Analysis

The system can estimate priority using configurable factors such as:

* Severity
* Number of affected people
* Location importance
* Safety risk
* Frequency of similar reports
* Infrastructure type
* Report age

Example:

```text
Complaint:
Broken traffic signal

Severity: High
Public Impact: High
Safety Risk: High

Priority:
High
```

The displayed priority should be treated as an AI/system recommendation rather than a final governmental decision.

---

# 🧠 AI Processing Pipeline

A possible AI pipeline is:

```text
Citizen Complaint
       ↓
Text / Image Input
       ↓
Data Preprocessing
       ↓
Feature Extraction
       ↓
AI Model
       ↓
Classification
       ↓
Priority Analysis
       ↓
Structured Complaint
       ↓
Authority Dashboard
```

---

# 👥 User Roles

Civic AI can support multiple types of users.

## 👤 Citizen

Citizens can:

* Register
* Login
* Report problems
* Upload images
* Provide location
* Track complaints
* View updates
* Give feedback

---

## 🧑‍💼 Authority/Admin

Administrators can:

* View complaints
* Filter complaints
* Assign departments
* Update complaint status
* Monitor priority
* View analytics
* Manage users
* Generate reports

---

## 🏢 Department Officer

Department officers can:

* View assigned complaints
* Accept tasks
* Update progress
* Upload resolution evidence
* Mark tasks completed

---

# 🔄 System Workflow

The complete workflow can be represented as:

```text
                 CIVIC AI
                    │
        ┌───────────┴───────────┐
        │                       │
     Citizen                  Admin
        │                       │
        ↓                       ↓
    Register                Dashboard
        │                       │
        ↓                       ↓
      Login                View Reports
        │                       │
        ↓                       ↓
 Report Problem           Assign Department
        │                       │
        ↓                       ↓
 Upload Image             Update Status
        │                       │
        ↓                       ↓
 Add Location             Resolve Problem
        │                       │
        └───────────┬───────────┘
                    ↓
              AI Processing
                    ↓
          Classification/Priority
                    ↓
              Final Resolution
                    ↓
             Citizen Feedback
```

---

# 🛠️ Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap / Tailwind CSS
* React.js *(optional advanced version)*

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## AI / Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* TensorFlow / PyTorch *(optional)*

## Authentication

* JWT
* bcrypt / bcryptjs

## APIs

* REST API
* Geolocation API
* Maps API
* AI/ML API

---

# 📁 Project Structure

A possible project structure:

```text
Civic-AI/
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── report.html
│   ├── complaints.html
│   ├── profile.html
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── dashboard.css
│   │   └── responsive.css
│   │
│   ├── js/
│   │   ├── main.js
│   │   ├── auth.js
│   │   ├── report.js
│   │   ├── dashboard.js
│   │   └── api.js
│   │
│   └── assets/
│       ├── images/
│       └── icons/
│
├── backend/
│   │
│   ├── server.js
│   ├── package.json
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   └── Department.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   └── uploads/
│
├── ai/
│   │
│   ├── model.py
│   ├── train.py
│   ├── predict.py
│   ├── dataset.csv
│   └── requirements.txt
│
├── screenshots/
│
├── .env.example
├── .gitignore
└── README.md
```

---

# 🎨 Frontend

The frontend is responsible for providing a simple and user-friendly interface.

Important pages can include:

### Home Page

```text
Civic AI
"Report. Track. Improve Your Community."

[Report Problem]
[Explore Issues]
[Login]
```

---

### Login Page

Users can enter:

```text
Email
Password

[Login]

Don't have an account?
Create Account
```

---

### Registration Page

```text
Name
Email
Phone
Password
Confirm Password

[Create Account]
```

---

### Citizen Dashboard

The dashboard can display:

```text
Welcome, User

Total Reports       12
Pending              4
In Progress          3
Resolved              5

[Report Problem]

Recent Reports
```

---

# 🖥️ Admin Dashboard

The administrator dashboard can display:

```text
---------------------------------------
          CIVIC AI ADMIN
---------------------------------------

Total Complaints        1,250
Pending                   180
In Progress               320
Resolved                  750

High Priority              45

---------------------------------------

Complaint Categories
Roads              ███████████
Waste              ████████
Water              █████
Electricity        ████

---------------------------------------
```

---

# 🗄️ Database

MongoDB can be used to store application data.

## User Collection

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "hashed_password",
  "role": "citizen"
}
```

---

## Complaint Collection

Example:

```json
{
  "title": "Broken Street Light",
  "description": "Street light is not working.",
  "category": "Street Lighting",
  "priority": "High",
  "status": "Pending",
  "location": {
    "latitude": 22.5726,
    "longitude": 88.3639
  },
  "reportedBy": "user_id"
}
```

---

# 🔐 Authentication

Civic AI can use JWT-based authentication.

Basic flow:

```text
User Login
    ↓
Server Checks Credentials
    ↓
Password Verification
    ↓
JWT Generated
    ↓
Token Sent to Client
    ↓
Client Stores Token
    ↓
Protected API Requests
```

Passwords should never be stored as plain text.

They should be hashed using a suitable password-hashing library.

---

# 🔌 API Structure

Example REST API structure:

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

## Complaints

```text
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/:id
PUT    /api/complaints/:id
DELETE /api/complaints/:id
```

## Admin

```text
GET  /api/admin/dashboard
GET  /api/admin/complaints
PUT  /api/admin/complaints/:id
GET  /api/admin/analytics
```

---

# 📊 Complaint Management

Each complaint can have a status.

```text
Pending
   ↓
Reviewed
   ↓
Assigned
   ↓
In Progress
   ↓
Resolved
   ↓
Closed
```

The citizen can see the current status from their dashboard.

---

# 🧠 AI-Based Priority Detection

One possible priority calculation approach is:

```text
Priority =
Severity
+
Public Impact
+
Safety Risk
+
Location Importance
+
Complaint Frequency
```

For example:

| Factor              |  Value |
| ------------------- | -----: |
| Severity            |   High |
| Public Impact       |   High |
| Safety Risk         |   High |
| Location Importance | Medium |
| Similar Reports     |   High |

The system can then classify the complaint as:

```text
Priority: High
```

This is a decision-support mechanism and should remain configurable and subject to human review.

---

# 🔍 Search and Filtering

Users and administrators can search complaints using:

* Category
* Location
* Status
* Priority
* Date
* Department

Example:

```text
Search:
"Road"

Filters:

Category: Road
Status: Pending
Priority: High
```

---

# 📍 Map Integration

A map interface can display reported problems.

Example:

```text
             MAP
 ┌───────────────────────────┐
 │      📍                   │
 │             📍            │
 │                           │
 │  📍              📍       │
 │                           │
 │        📍                 │
 └───────────────────────────┘
```

Different markers can represent different complaint categories.

---

# 📈 Analytics

The administrator can view:

* Total complaints
* Resolved complaints
* Pending complaints
* High-priority complaints
* Category distribution
* Location-based problems
* Monthly complaint trends
* Resolution time

Example:

```text
Monthly Reports

January      ███████
February     █████████
March        ███████████
April        ██████
May          █████████
```

---

# 📱 Responsive Design

Civic AI should work across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📱 Tablet

The interface should automatically adapt to different screen sizes.

---

# 🔔 Notification System

Users can receive notifications when their complaint changes status.

Example:

```text
🔔 Complaint Update

Your complaint #CIV1024
has been assigned to the
Road Maintenance Department.
```

Another notification:

```text
✅ Complaint Resolved

Your reported road issue
has been marked as resolved.
```

---

# ⭐ Citizen Feedback

After a complaint is resolved, the user can provide feedback.

Example:

```text
How was your experience?

⭐ ⭐ ⭐ ⭐ ⭐

Comment:
"The issue was resolved quickly."
```

This can help measure user satisfaction.

---

# 🧩 Installation

## 1. Clone the Repository

```bash
git clone https://github.com/yourusername/civic-ai.git
```

---

## 2. Open the Project

```bash
cd civic-ai
```

---

## 3. Install Backend Dependencies

```bash
cd backend
npm install
```

---

## 4. Configure Environment Variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

---

## 5. Start Backend

```bash
npm start
```

or:

```bash
node server.js
```

---

## 6. Start Frontend

If using a simple HTML/CSS/JS frontend, open:

```text
frontend/index.html
```

For a modern frontend framework, use the appropriate development command.

---

# ⚙️ Environment Variables

Example:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/civic_ai

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:3000
```

Do not upload your real `.env` file to GitHub.

Add it to `.gitignore`:

```text
.env
node_modules/
uploads/
```

---

# 🧪 Example Workflow

Suppose a citizen finds a garbage problem.

### Step 1

The citizen opens Civic AI.

### Step 2

They click:

```text
Report Problem
```

### Step 3

They enter:

```text
Title:
Garbage accumulation

Description:
Garbage has not been collected for several days.

Category:
Waste Management
```

### Step 4

They upload a photo.

### Step 5

They provide the location.

### Step 6

AI analyzes the report.

```text
Category:
Waste Management

Priority:
Medium

Possible Impact:
Public Health / Environment
```

### Step 7

The complaint appears in the authority dashboard.

### Step 8

An officer is assigned.

### Step 9

The officer updates:

```text
Pending
↓
Assigned
↓
In Progress
↓
Resolved
```

### Step 10

The citizen receives an update.

---

# 🔒 Security

Security is an important part of Civic AI.

Possible security practices include:

* Password hashing
* JWT authentication
* Role-based authorization
* Input validation
* API validation
* Secure environment variables
* File-upload validation
* Rate limiting
* HTTPS in production
* MongoDB access controls

Sensitive information should not be exposed through APIs or frontend code.

---

# ⚡ Performance

Performance can be improved using:

* Database indexing
* Pagination
* API caching
* Image compression
* Lazy loading
* Optimized database queries
* Efficient AI inference
* Frontend code optimization

For example, instead of loading 10,000 complaints at once:

```text
Page 1 → 20 complaints
Page 2 → 20 complaints
Page 3 → 20 complaints
```

This improves dashboard performance.

---

# 🌍 Use Cases

Civic AI can be useful for:

### 🏙️ Smart Cities

Monitoring and managing civic infrastructure.

### 🏘️ Local Communities

Reporting neighborhood problems.

### 🏛️ Government Departments

Managing citizen complaints.

### 🏫 Educational Institutions

Reporting campus infrastructure problems.

### 🏢 Municipal Organizations

Tracking civic service requests.

### 🌱 Environmental Programs

Reporting environmental issues.

---

# 💡 Advantages

Civic AI can provide:

* Faster reporting
* Centralized complaint management
* Better visibility
* AI-assisted classification
* Location-based monitoring
* Data-driven dashboards
* Transparent complaint tracking
* Community participation
* Digital record keeping

---

# 🔮 Future Improvements

Future versions can include:

## 🤖 Advanced AI

Use computer vision models for image-based problem detection.

---

## 🗣️ Voice Reporting

Citizens could report problems using voice.

Example:

```text
User:
"There is a large pothole near the school."

AI:
Category: Road
Location: Detected/confirmed
Priority: High
```

---

## 🌐 Multilingual Support

Support languages such as:

* English
* Hindi
* Bengali
* Odia
* Tamil
* Telugu
* Marathi

---

## 📱 Mobile Application

Develop Android and iOS applications.

Possible technologies:

* Flutter
* React Native

---

## 🛰️ GIS Integration

Advanced geographic analysis can identify areas with repeated civic problems.

---

## 📷 Computer Vision

AI could analyze uploaded images to identify potential issues.

For example:

```text
Image
 ↓
Computer Vision Model
 ↓
Object Detection
 ↓
Problem Classification
```

---

## 📊 Predictive Analytics

Historical complaint data could potentially be used to identify recurring patterns and support preventive maintenance.

---

# 🌐 Smart City Integration

Civic AI can potentially connect with other smart-city systems.

Example:

```text
              CIVIC AI
                  │
      ┌───────────┼───────────┐
      ↓           ↓           ↓
   Traffic      Waste       Water
      │           │           │
      └───────────┼───────────┘
                  ↓
           Central Dashboard
                  ↓
             Data Analytics
```

---

# 🏗️ High-Level Architecture

```text
                  CITIZENS
                     │
                     ↓
              ┌─────────────┐
              │  FRONTEND   │
              │ Web / Mobile│
              └──────┬──────┘
                     │
                     ↓
              ┌─────────────┐
              │ REST APIs   │
              │ Node/Express│
              └──────┬──────┘
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      MongoDB       AI       Services
          │          │          │
          └──────────┼──────────┘
                     ↓
              ADMIN DASHBOARD
                     │
                     ↓
             DEPARTMENT ACTION
                     │
                     ↓
                RESOLUTION
                     │
                     ↓
               CITIZEN UPDATE
```

---

# 📌 Project Modules

Civic AI can be divided into the following modules:

### Module 1 — Authentication

Registration and login.

### Module 2 — Citizen Dashboard

View personal reports.

### Module 3 — Complaint Reporting

Submit civic problems.

### Module 4 — AI Analysis

Classify and analyze complaints.

### Module 5 — Location Services

Store and visualize locations.

### Module 6 — Admin Dashboard

Manage all reports.

### Module 7 — Department Management

Assign problems to departments.

### Module 8 — Notification

Send status updates.

### Module 9 — Analytics

Generate statistics.

### Module 10 — Feedback

Collect citizen responses.

---

# 📸 Screenshots

Add your project screenshots here.

Example:

```markdown
## Home Page

![Home Page](screenshots/home.png)

## Login Page

![Login Page](screenshots/login.png)

## Citizen Dashboard

![Dashboard](screenshots/dashboard.png)

## Report Problem

![Report Problem](screenshots/report.png)

## Admin Dashboard

![Admin Dashboard](screenshots/admin.png)
```

---

# 🧪 Testing

Testing can include:

### Frontend Testing

* Form validation
* Responsive layout
* Navigation
* Button functionality

### Backend Testing

* API requests
* Authentication
* Database operations
* Error handling

### AI Testing

* Classification accuracy
* Different complaint descriptions
* Image recognition performance
* Priority consistency

---

# 📊 Example Complaint Data

| ID     | Category     | Priority | Status      |
| ------ | ------------ | -------- | ----------- |
| CIV001 | Road         | High     | In Progress |
| CIV002 | Waste        | Medium   | Pending     |
| CIV003 | Water        | High     | Resolved    |
| CIV004 | Street Light | Low      | Resolved    |
| CIV005 | Drainage     | High     | Assigned    |

---

# 🎯 Expected Impact

Civic AI aims to improve communication between citizens and authorities by providing a structured digital workflow for civic problem reporting.

Potential outcomes include:

* Better complaint visibility
* More organized issue management
* Faster identification of urgent problems
* Better use of civic data
* Improved citizen participation
* More transparent service tracking

The actual impact would depend on deployment, data quality, institutional processes, and how authorities use the platform.

---

# 🌟 Project Vision

The long-term vision of Civic AI is:

> **"Use technology and responsible AI to make civic problem reporting more accessible, organized, transparent, and data-driven."**

The platform is designed around a simple principle:

```text
See a Problem
      ↓
Report It
      ↓
Understand It
      ↓
Assign It
      ↓
Resolve It
      ↓
Track the Result
```

---

# 🔭 Future Scope

Civic AI can eventually evolve into a broader civic technology platform with:

* AI-powered civic assistants
* Voice-based complaint registration
* Multilingual support
* Mobile applications
* GIS-based analytics
* Computer vision
* Predictive maintenance
* Open civic data dashboards
* Smart notifications
* Department performance analytics
* Community discussion systems
* Integration with existing government systems

---

# 🤝 Contributing

Contributions are welcome.

### Step 1

Fork this repository.

### Step 2

Create a new branch:

```bash
git checkout -b feature/new-feature
```

### Step 3

Make your changes.

### Step 4

Commit your changes:

```bash
git add .
git commit -m "Add new feature"
```

### Step 5

Push your branch:

```bash
git push origin feature/new-feature
```

### Step 6

Create a Pull Request.

---

# 📝 License

This project can be distributed under the MIT License.

You may create a `LICENSE` file in the repository and update this section according to your chosen license.

---

# 👨‍💻 Author

**Your Name**

CSE / AIML Student
Interested in:

* Artificial Intelligence
* Machine Learning
* Web Development
* Software Development
* Smart City Technologies
* Civic Technology

---

# 📬 Contact

If you have suggestions, ideas, or feedback about the project, feel free to open an issue in this repository.

---

# ⭐ Support

If you find this project useful:

⭐ Star the repository

🍴 Fork the repository

🐛 Report bugs

💡 Suggest new features

🤝 Contribute to the project

---

# 🏁 Conclusion

**Civic AI** is designed as a technology-driven approach to civic problem management.

It brings together:

```text
Citizens
   +
Artificial Intelligence
   +
Web Technology
   +
Location Services
   +
Database
   +
Analytics
   +
Authorities
   ↓
Better Civic Problem Management
```

The project demonstrates how **AI, web development, databases, and data analytics** can work together to create a platform for reporting and managing community problems.

---

## 🚀 Built With

```text
HTML
CSS
JavaScript
Node.js
Express.js
MongoDB
Mongoose
Python
Machine Learning
REST APIs
JWT
```

### ❤️ Made for Smarter Communities

**Civic AI — Report. Track. Understand. Improve.**
