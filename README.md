# GradReady: Student Clearance Tracking Web Application for IT Students in University of San Agustin 

![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen) ![Stack](https://img.shields.io/badge/Stack-React_|_Spring_Boot_|_PostgreSQL-blue)

---

## Project Meaning & Scope

GradReady is a web application designed to completely digitize the student clearance process. Currently, schools rely on manual, paper-based workflows that are prone to lost documentation, confusing approval tracking, and long processing times. The meaning and core goal of this project is to eliminate these inefficiencies by providing a centralized platform where students can monitor their requirements and administrators can efficiently manage approvals, resulting in a much faster and more organized administrative workflow.

* **Target Users:** The system will support University Students, Professors, University Staff, and System Administrators.
* **Clearance Tracking:** A visual "Matrix" for students to see their requirements across different departments (Library, Finance, etc.).
* **Status Management:** A strict progression workflow (Pending -> Submitted -> Needs Revision -> Cleared) for updating requirements.   
* **Administrative Control:** System Admins will have a secure "undo" function to fix administrative errors and will manage role-based access control.
* **Notifications:** A dashboard-based "batch" alert system for System Admins and Department Heads to track updates.
* **Information Directory:** A module indicating office availability, room numbers, and operating hours.
* **Data Handling:** The system will process raw data inputs, validate roles, upload specific file types (PDF/JPEG under 25mb), and execute database mapping.


## Team & Responsibilities

Developed by BSIT students at the University of San Agustin.

* **Alexander Michael S. Tolosa (Project Lead & Backend)**
    * Oversees the overall project architecture and timeline.
    * Develops the backend logic, REST APIs, and database mapping using Java + Spring Boot.
    * Handles data ingestion, validation logic, and role-based access control.
* **Matthew P. Tabat (Frontend Developer)**
    * Crafts the user interfaces and client-side logic using React.js.
    * Implements responsive styling and UI components using Tailwind CSS.
* **Ella Jean Venus (Database Administrator & Integration)**
    * Designs and normalizes the PostgreSQL database schema hosted on Supabase.
    * Writes and optimizes SQL queries to link student data to departmental clearance statuses.
* **Harry Leonard C. Villa (Quality Assurance & Testing)**
    * Tests backend API endpoints and frontend component functionality.
    * Conducts end-to-end user flow testing for the clearance process and validates extraction rules.
* **Sam Robert B. Susvilla (UI/UX Designer & Documentation)**
    * Designs wireframes and user flows for the Student and Department dashboards.
    * Manages project documentation, GitHub repositories, and system flowcharts.

## Tech Stack

**Frontend:**
* React.js
* Tailwind CSS

**Backend & Database:**
* Java (+Spring Boot)
* PostgreSQL (Hosted via Supabase)

## Architecture & Folder Structure
```text
gradready-frontend/
├── public/
│   └── index.html
├── src/
│   ├── assets/                 # Images, icons, and global CSS
│   ├── components/             # Reusable UI elements
│   │   ├── common/             # Buttons, Inputs, Modals, Spinners
│   │   └── layout/             # Navbar, Sidebar, Page wrappers
│   ├── context/                # Global state (e.g., AuthProvider for RBAC)
│   ├── pages/                  # Main route views
│   │   ├── Auth/               # Login and Registration views
│   │   ├── Student/            # Cumulative Clearance Summary, Matrix
│   │   └── Admin/              # Master Dashboard, Notification alerts
│   ├── services/               # Axios/Fetch configurations for API calls
│   │   ├── api.js              # Base API instance with interceptors
│   │   ├── authService.js      # Login/Logout calls
│   │   └── clearanceService.js # Data fetching and status updates
│   ├── utils/                  # Helper functions (date formatting, validators)
│   ├── App.jsx                 # Route definitions (React Router)
│   └── main.jsx                # Entry point
├── tailwind.config.js          # Tailwind theme and plugin configuration
└── package.json

gradready-backend/
├── src/
│   ├── main/
│   │   ├── java/com/csit221/gradready/
│   │   │   ├── GradReadyApplication.java    # Main entry point
│   │   │   ├── config/                      # Global configurations
│   │   │   │   ├── CorsConfig.java          # Cross-Origin settings for React
│   │   │   │   └── SecurityConfig.java      # Spring Security & RBAC rules
│   │   │   ├── controllers/                 # REST API Endpoints
│   │   │   │   ├── AuthController.java      # Handles login/tokens
│   │   │   │   └── ClearanceController.java # Endpoints for matrix and status changes
│   │   │   ├── dto/                         # Data Transfer Objects (Request/Response bodies)
│   │   │   │   ├── LoginRequest.java
│   │   │   │   └── StatusUpdateDto.java     
│   │   │   ├── models/                      # JPA Entities (Database Tables)
│   │   │   │   ├── User.java
│   │   │   │   ├── StudentProfile.java
│   │   │   │   ├── Department.java
│   │   │   │   └── ClearanceTransaction.java
│   │   │   ├── repositories/                # Spring Data JPA Interfaces
│   │   │   │   ├── UserRepository.java
│   │   │   │   └── ClearanceRepository.java 
│   │   │   ├── services/                    # Core Business Logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── ClearanceService.java    # Status progression logic 
│   │   │   │   └── FileStorageService.java  # PDF/JPEG upload handling 
│   │   │   └── exceptions/                  # Custom error handling
│   │   │       ├── GlobalExceptionHandler.java
│   │   │       └── InvalidRoleException.java
│   │   └── resources/
│   │       └── application.yml              # Supabase PostgreSQL connection details
└── pom.xml                                  # Maven dependencies
