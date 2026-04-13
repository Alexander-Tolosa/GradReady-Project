# GradReady: Student Clearance Tracking Application for University of San Agustin 

![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen) ![Stack](https://img.shields.io/badge/Stack-React_|_Spring_Boot_|_PostgreSQL-blue)

---

## Project Meaning & Scope

The reliance on manual, paper-based student clearance workflows in many schools presents significant tracking challenges, resulting in lost documentation, ambiguous approval tracking, student confusion, and extended processing times.

GradReady addresses these inefficiencies by digitizing the student clearance process. By allowing users to configure specific requirements and systematically monitor their fulfillment status, the system fosters a more rapid, organized, and manageable administrative workflow.

* **Registration & Initialization:** Streamlines adding student names and clearance records into the system.
* **Clearance Requirements Matrix:** Displays a dynamic list of clearance requirements across departments (e.g., Library, Guidance, Finance).
* **Status Management Module:** Tracks requirement statuses through a granular progression (Pending -> Submitted -> Needs Revision -> Cleared) with a secure 'undo' function for administrative errors.
* **Cumulative Clearance Summary:** Provides a top-level view of the overall clearance status for each student.
* **Faculty Dashboard Notifications:** Implements a batch or dashboard-based alert system for administrators to ensure no clearance requests are missed.
* **Role-Based Access Control (RBAC):** Ensures sensitive student records are compartmentalized and managed securely by authorized departmental staff.

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
* Java (Spring Boot)
* PostgreSQL (Supabase)

## Architecture & Folder Structure
```text
gradready/
├── backend/                    # Java API for Database & Logic
│   ├── src/main/java/          # Core Java source code
│   │   ├── controllers/        # REST API endpoints for clearance
│   │   ├── models/             # JPA Entities (Student, Department)
│   │   ├── repositories/       # Database access interfaces
│   │   └── services/           # Business logic & RBAC
│   ├── src/main/resources/     # App configs & Supabase connections
│   └── pom.xml                 # Maven dependencies
├── frontend/                   # React UI & Dashboard
│   ├── src/
│   │   ├── components/         # Reusable UI (Buttons, Matrix)
│   │   ├── pages/              # Main views (Admin, Student)
│   │   ├── App.jsx             # Main routing
│   │   └── main.jsx            # React entry point
│   ├── package.json            # Node dependencies
│   └── tailwind.config.js      # Tailwind directives
└── README.md                   # Project documentation
