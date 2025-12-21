# ISO/IEC 25010 Software Quality Questionnaire
## Grading Management System with Blockchain Integration

**System Name:** Grading Management System  
**Evaluation Date:** _______________  
**Evaluator Name:** _______________  
**Role:** (Admin / Teacher / Student / Parent / External Evaluator)

---

## Instructions
Please rate each statement on a scale of 1 to 5, where:
- **1 = Strongly Disagree**
- **2 = Disagree**
- **3 = Neutral**
- **4 = Agree**
- **5 = Strongly Agree**

---

## 1. FUNCTIONAL SUITABILITY

### 1.1 Functional Completeness

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 1.1.1 | The system provides all necessary features for managing student enrollment, including adding, updating, dropping, and re-enrolling students. | | |
| 1.1.2 | The system supports comprehensive grade management, including prelim, midterm, final grades, and automatic GPA calculation. | | |
| 1.1.3 | The system provides complete attendance tracking functionality for all classes and subjects. | | |
| 1.1.4 | The system includes all required features for managing teachers, including assignment to classes and subjects. | | |
| 1.1.5 | The system provides complete parent/guardian management features, including linking parents to their children. | | |
| 1.1.6 | The system supports full curriculum management, including courses, subjects, classes, and course-year-subject mapping. | | |
| 1.1.7 | The system provides comprehensive blockchain integration for grade and attendance records, ensuring data immutability. | | |
| 1.1.8 | The system includes all necessary communication features (announcements, messages, contact forms). | | |
| 1.1.9 | The system provides complete certificate generation and verification functionality with blockchain hashes. | | |
| 1.1.10 | The system supports academic year and semester management for organizing academic periods. | | |

### 1.2 Functional Correctness

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 1.2.1 | Student enrollment calculations (active, inactive, dropped counts) are always accurate. | | |
| 1.2.2 | Grade calculations (prelim, midterm, final, GPA) are computed correctly according to the specified formulas. | | |
| 1.2.3 | Attendance records are accurately recorded and aggregated. | | |
| 1.2.4 | Blockchain hash generation for grades and attendance produces consistent and verifiable results. | | |
| 1.2.5 | Student status changes (enrollment, dropping, re-enrollment) are processed correctly. | | |
| 1.2.6 | Parent-student relationships are correctly maintained and displayed. | | |
| 1.2.7 | Class enrollment limits and constraints are properly enforced. | | |
| 1.2.8 | Academic year and semester filtering works accurately across all modules. | | |
| 1.2.9 | Certificate verification using blockchain hashes correctly identifies authentic certificates. | | |
| 1.2.10 | Statistics and reports (student counts, grade distributions, attendance rates) are calculated accurately. | | |

### 1.3 Functional Appropriateness

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 1.3.1 | The workflow for enrolling students matches the actual administrative process. | | |
| 1.3.2 | The grade entry process is intuitive and matches how teachers record grades. | | | | 1.3.3 | The attendance marking process is appropriate for classroom use. | | |
| 1.3.4 | The student drop/re-enroll process follows institutional policies. | | |
| 1.3.5 | The blockchain verification process is suitable for external parties (employers, agencies). | | |
| 1.3.6 | The parent portal provides appropriate access to their children's academic information. | | |
| 1.3.7 | The certificate generation process produces documents suitable for official use. | | |
| 1.3.8 | The communication features (announcements, messages) support effective school-home communication. | | |
| 1.3.9 | The curriculum management features align with the school's academic structure. | | |
| 1.3.10 | The reporting and statistics features provide information relevant to decision-making. | | |

---

## 2. PERFORMANCE EFFICIENCY

### 2.1 Time Behavior

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 2.1.1 | The system loads dashboard pages quickly (within 2-3 seconds). | | |
| 2.1.2 | Student search and filtering operations respond promptly. | | |
| 2.1.3 | Grade entry and submission is fast enough for teachers to use efficiently. | | |
| 2.1.4 | Attendance marking operations complete without noticeable delay. | | |
| 2.1.5 | Blockchain hash generation and verification processes complete in reasonable time. | | |
| 2.1.6 | Report generation (statistics, transcripts) completes within acceptable time limits. | | |
| 2.1.7 | Certificate generation and download is fast enough for practical use. | | |
| 2.1.8 | Bulk operations (bulk enrollment, bulk grade entry) process efficiently. | | |
| 2.1.9 | Page navigation between modules is smooth without significant loading delays. | | |
| 2.1.10 | Data export operations (CSV, PDF) complete in reasonable time. | | |

### 2.2 Resource Utilization

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 2.2.1 | The system uses server resources (CPU, memory) efficiently during normal operations. | | |
| 2.2.2 | The system handles concurrent users (multiple teachers entering grades simultaneously) without performance degradation. | | |
| 2.2.3 | Database queries are optimized and do not cause excessive server load. | | |
| 2.2.4 | Blockchain operations do not consume excessive computational resources. | | |
| 2.2.5 | File uploads (course materials, certificates) are handled efficiently. | | |
| 2.2.6 | The system scales well as the number of students, classes, and records increases. | | |
| 2.2.7 | Network bandwidth usage is reasonable for the functionality provided. | | |
| 2.2.8 | Browser memory usage remains acceptable during extended use. | | |
| 2.2.9 | Background processes (blockchain transactions, notifications) do not impact system responsiveness. | | |
| 2.2.10 | The system efficiently handles large datasets (thousands of students, years of records). | | |

---

## 3. COMPATIBILITY

### 3.1 Co-existence

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 3.1.1 | The system operates without interfering with other applications running on the same server. | | |
| 3.1.2 | The system can coexist with other educational management systems if needed. | | |
| 3.1.3 | Blockchain operations do not conflict with other system processes. | | |
| 3.1.4 | The system's database operations do not interfere with other database-dependent applications. | | |
| 3.1.5 | File storage operations do not conflict with other file management systems. | | |

### 3.2 Interoperability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 3.2.1 | The system can export data in standard formats (CSV, PDF, Excel) for use in other systems. | | |
| 3.2.2 | The system can import student data from external sources (if applicable). | | |
| 3.2.3 | Blockchain verification can be performed by external systems using the provided APIs or methods. | | |
| 3.2.4 | The system's API endpoints are well-documented and follow standard conventions. | | |
| 3.2.5 | Certificate verification can be integrated into third-party verification systems. | | |
| 3.2.6 | The system works with standard web browsers (Chrome, Firefox, Safari, Edge). | | |
| 3.2.7 | The system is compatible with different operating systems (Windows, macOS, Linux) through web access. | | |
| 3.2.8 | Mobile device access (tablets, smartphones) works correctly. | | |
| 3.2.9 | The system can integrate with email systems for notifications. | | |
| 3.2.10 | The system supports integration with external authentication systems (if applicable). | | |

---

## 4. USABILITY

### 4.1 Appropriateness Recognizability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.1.1 | The interface clearly indicates the purpose of each module (Students, Grades, Attendance, etc.). | | |
| 4.1.2 | Navigation menus and buttons are self-explanatory and easy to understand. | | |
| 4.1.3 | Icons and visual elements clearly represent their functions (e.g., trash icon for delete, eye icon for view). | | |
| 4.1.4 | The system's layout and organization match my expectations for an educational management system. | | |
| 4.1.5 | Status indicators (active, inactive, dropped) are visually clear and recognizable. | | |
| 4.1.6 | Error messages clearly explain what went wrong and how to fix it. | | |
| 4.1.7 | Success messages confirm that operations completed successfully. | | |
| 4.1.8 | The role-based interface (Admin, Teacher, Student, Parent) is clearly differentiated. | | |
| 4.1.9 | Form labels and field names are clear and understandable. | | |
| 4.1.10 | The blockchain verification interface is intuitive for external users. | | |

### 4.2 Learnability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.2.1 | New users can learn to use the system without extensive training. | | |
| 4.2.2 | The system provides helpful tooltips or hints for complex operations. | | |
| 4.2.3 | The user guide or help documentation is accessible and useful. | | |
| 4.2.4 | Common tasks (enrolling a student, entering grades) can be learned quickly. | | |
| 4.2.5 | The workflow for completing tasks is logical and easy to follow. | | |
| 4.2.6 | Error recovery (undoing mistakes, canceling operations) is straightforward. | | |
| 4.2.7 | Advanced features (blockchain verification, bulk operations) are learnable with reasonable effort. | | |
| 4.2.8 | The system's terminology matches educational domain language. | | |
| 4.2.9 | Visual cues (colors, icons) help users understand system state and actions. | | |
| 4.2.10 | The system remembers user preferences and settings, reducing learning curve. | | |

### 4.3 Operability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.3.1 | The system provides clear feedback for all user actions (loading indicators, progress bars). | | |
| 4.3.2 | Form validation prevents errors before submission. | | |
| 4.3.3 | The system allows users to cancel operations before completion. | | |
| 4.3.4 | Search and filter functions are easy to use and effective. | | |
| 4.3.5 | Data entry forms are well-organized and logical. | | |
| 4.3.6 | The system provides confirmation dialogs for destructive actions (delete, drop student). | | |
| 4.3.7 | Pagination and data navigation (next page, previous page) work intuitively. | | |
| 4.3.8 | The system supports keyboard shortcuts for common operations (if applicable). | | |
| 4.3.9 | Bulk selection and operations (select multiple students, bulk actions) are easy to use. | | |
| 4.3.10 | The system allows users to undo or reverse actions when possible. | | |

### 4.4 User Error Protection

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.4.1 | The system prevents accidental deletion of important records (students, grades). | | |
| 4.4.2 | The system validates data entry to prevent invalid information (e.g., grades outside valid range). | | |
| 4.4.3 | The system prevents duplicate entries (e.g., enrolling the same student twice). | | |
| 4.4.4 | The system warns users before performing irreversible actions. | | |
| 4.4.5 | The system prevents grade entry errors (e.g., entering grades for wrong student). | | |
| 4.4.6 | The system validates required fields before allowing form submission. | | |
| 4.4.7 | The system prevents conflicting operations (e.g., dropping an already dropped student). | | |
| 4.4.8 | The system provides clear error messages that help users correct mistakes. | | |
| 4.4.9 | The system prevents unauthorized access to sensitive operations. | | |
| 4.4.10 | The system protects against data loss during operations (auto-save, confirmation dialogs). | | |

### 4.5 User Interface Aesthetics

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.5.1 | The system's visual design is professional and appropriate for an educational institution. | | |
| 4.5.2 | Colors, fonts, and spacing create a pleasant and readable interface. | | |
| 4.5.3 | The interface is consistent across all modules and pages. | | |
| 4.5.4 | Visual elements (buttons, cards, tables) are well-designed and visually appealing. | | |
| 4.5.5 | The system uses appropriate visual hierarchy to guide user attention. | | |
| 4.5.6 | Icons and graphics enhance rather than clutter the interface. | | |
| 4.5.7 | The interface adapts well to different screen sizes (responsive design). | | |
| 4.5.8 | Status indicators (colors for active/inactive/dropped) are visually distinct and meaningful. | | |
| 4.5.9 | Tables and data displays are well-formatted and easy to read. | | |
| 4.5.10 | The overall design creates a positive user experience. | | |

### 4.6 Accessibility

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 4.6.1 | The system is usable by people with visual impairments (screen reader compatibility, high contrast). | | |
| 4.6.2 | Text is readable and appropriately sized. | | |
| 4.6.3 | Color is not the only means of conveying information (status, errors). | | |
| 4.6.4 | The system supports keyboard navigation for all functions. | | |
| 4.6.5 | Form labels are properly associated with input fields. | | |
| 4.6.6 | The system provides alternative text for images and icons. | | |
| 4.6.7 | The interface is accessible on mobile devices with touch navigation. | | |
| 4.6.8 | Error messages are accessible to assistive technologies. | | |
| 4.6.9 | The system supports users with different language preferences (if applicable). | | |
| 4.6.10 | The system meets basic web accessibility standards (WCAG compliance). | | |

---

## 5. RELIABILITY

### 5.1 Maturity

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 5.1.1 | The system operates reliably under normal usage conditions. | | |
| 5.1.2 | The system has been tested and is stable for production use. | | |
| 5.1.3 | Critical operations (grade entry, enrollment) complete successfully consistently. | | |
| 5.1.4 | The system handles edge cases (empty data, boundary values) without crashing. | | |
| 5.1.5 | The system has been used in production without major failures. | | |
| 5.1.6 | Updates and patches have improved system stability. | | |
| 5.1.7 | The system recovers gracefully from minor errors. | | |
| 5.1.8 | Blockchain operations complete reliably without data loss. | | |
| 5.1.9 | Data integrity is maintained even during system updates. | | |
| 5.1.10 | The system has a low rate of bugs or errors in normal operation. | | |

### 5.2 Availability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 5.2.1 | The system is available when needed (high uptime percentage). | | |
| 5.2.2 | Scheduled maintenance windows are communicated and reasonable. | | |
| 5.2.3 | The system recovers quickly from server restarts or failures. | | |
| 5.2.4 | The system handles high traffic periods (end of semester, grade entry) without downtime. | | |
| 5.2.5 | Backup systems ensure availability even during primary system failures. | | |
| 5.2.6 | The system provides status information when unavailable. | | |
| 5.2.7 | Emergency access to critical functions is available when possible. | | |
| 5.2.8 | The system's availability meets institutional requirements. | | |
| 5.2.9 | Network issues do not cause extended unavailability. | | |
| 5.2.10 | The system is accessible from different locations and networks. | | |

### 5.3 Fault Tolerance

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 5.3.1 | The system continues operating when non-critical components fail. | | |
| 5.3.2 | Data is not lost when operations are interrupted. | | |
| 5.3.3 | The system handles invalid user input gracefully without crashing. | | |
| 5.3.4 | Network interruptions do not cause data corruption. | | |
| 5.3.5 | The system recovers from database connection failures. | | |
| 5.3.6 | Partial failures (e.g., one module failing) do not bring down the entire system. | | |
| 5.3.7 | The system validates data before processing to prevent faults. | | |
| 5.3.8 | Blockchain operations have error handling and recovery mechanisms. | | |
| 5.3.9 | The system logs errors for troubleshooting without exposing sensitive information. | | |
| 5.3.10 | Critical operations have rollback capabilities if they fail. | | |

### 5.4 Recoverability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 5.4.1 | The system can restore data from backups if needed. | | |
| 5.4.2 | Data recovery procedures are documented and tested. | | |
| 5.4.3 | The system maintains transaction logs for recovery purposes. | | |
| 5.4.4 | Blockchain records provide an additional layer of data recovery verification. | | |
| 5.4.5 | The system can recover from corrupted data states. | | |
| 5.4.6 | User actions can be audited and traced for recovery. | | |
| 5.4.7 | The system provides data export capabilities for backup purposes. | | |
| 5.4.8 | Recovery time after failures is acceptable. | | |
| 5.4.9 | The system maintains data consistency during recovery operations. | | |
| 5.4.10 | Recovery procedures do not result in data loss. | | |

---

## 6. SECURITY

### 6.1 Confidentiality

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 6.1.1 | Student personal information is protected from unauthorized access. | | |
| 6.1.2 | Grade information is only accessible to authorized users (teachers, students, parents, admins). | | |
| 6.1.3 | The system uses secure authentication (passwords, sessions) to protect data. | | |
| 6.1.4 | Role-based access control properly restricts access to sensitive functions. | | |
| 6.1.5 | Parent accounts can only access their own children's information. | | |
| 6.1.6 | Teachers can only access information for their assigned classes. | | |
| 6.1.7 | Administrative functions are restricted to authorized administrators. | | |
| 6.1.8 | Data transmission is encrypted (HTTPS) to protect information in transit. | | |
| 6.1.9 | Sensitive data is stored securely in the database. | | |
| 6.1.10 | The system logs access to sensitive information for audit purposes. | | |

### 6.2 Integrity

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 6.2.1 | Grade records cannot be modified after final submission without proper authorization. | | |
| 6.2.2 | Blockchain hashes ensure that grade and attendance records have not been tampered with. | | |
| 6.2.3 | The system prevents unauthorized modification of student records. | | |
| 6.2.4 | Data validation ensures that only valid information is stored. | | |
| 6.2.5 | The system maintains referential integrity (e.g., grades linked to valid students). | | |
| 6.2.6 | Certificate hashes can be verified to ensure certificates have not been altered. | | |
| 6.2.7 | Audit trails track who made changes and when. | | |
| 6.2.8 | The system prevents data corruption during operations. | | |
| 6.2.9 | Blockchain verification provides proof of data integrity. | | |
| 6.2.10 | The system validates data consistency across related records. | | |

### 6.3 Non-repudiation

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 6.3.1 | The system records who entered each grade and when. | | |
| 6.3.2 | The system tracks who enrolled or dropped students. | | |
| 6.3.3 | Blockchain transactions provide cryptographic proof of actions. | | |
| 6.3.4 | Certificate generation records include creator and timestamp information. | | |
| 6.3.5 | The system maintains logs that cannot be easily altered. | | |
| 6.3.6 | Actions are tied to specific user accounts, preventing anonymous changes. | | |
| 6.3.7 | The system provides evidence of when records were created or modified. | | |
| 6.3.8 | Blockchain records serve as immutable proof of academic records. | | |
| 6.3.9 | The system prevents users from denying actions they performed. | | |
| 6.3.10 | Audit logs are protected from tampering. | | |

### 6.4 Accountability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 6.4.1 | User actions are logged and can be traced to specific user accounts. | | |
| 6.4.2 | The system maintains audit trails for critical operations (grade changes, enrollment). | | |
| 6.4.3 | Administrators can review user activity logs. | | |
| 6.4.4 | The system tracks access to sensitive information. | | |
| 6.4.5 | Failed login attempts are logged for security monitoring. | | |
| 6.4.6 | The system provides reports on user activities when needed. | | |
| 6.4.7 | Blockchain records provide additional accountability through cryptographic proof. | | |
| 6.4.8 | The system can identify who made specific changes to records. | | |
| 6.4.9 | Logs are retained for an appropriate period for audit purposes. | | |
| 6.4.10 | The system supports compliance with data protection regulations. | | |

### 6.5 Authenticity

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 6.5.1 | User authentication verifies that users are who they claim to be. | | |
| 6.5.2 | The system prevents unauthorized access through strong password requirements. | | |
| 6.5.3 | Session management prevents unauthorized access to user accounts. | | |
| 6.5.4 | Certificate verification confirms that certificates are authentic and issued by the institution. | | |
| 6.5.5 | Blockchain hashes provide cryptographic proof of data authenticity. | | |
| 6.5.6 | The system verifies user permissions before allowing operations. | | |
| 6.5.7 | Two-factor authentication or additional security measures are available (if applicable). | | |
| 6.5.8 | The system prevents session hijacking or unauthorized access. | | |
| 6.5.9 | User identity is verified for sensitive operations. | | |
| 6.5.10 | The system ensures that data comes from legitimate sources. | | |

---

## 7. MAINTAINABILITY

### 7.1 Modularity

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 7.1.1 | The system is organized into logical modules (Students, Grades, Attendance, etc.). | | |
| 7.1.2 | Changes to one module do not require changes to other modules. | | |
| 7.1.3 | The codebase is well-organized and follows consistent structure. | | |
| 7.1.4 | Features can be added or modified without affecting existing functionality. | | |
| 7.1.5 | The system's architecture supports independent development of different modules. | | |
| 7.1.6 | Database schema is organized logically by functional area. | | |
| 7.1.7 | API endpoints are organized by functional domain. | | |
| 7.1.8 | Frontend components are reusable across different pages. | | |
| 7.1.9 | Blockchain functionality is separated from core business logic. | | |
| 7.1.10 | The system's modularity facilitates team development and maintenance. | | |

### 7.2 Reusability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 7.2.1 | Code components can be reused across different parts of the system. | | |
| 7.2.2 | Common functions (authentication, validation) are implemented once and reused. | | |
| 7.2.3 | Database models and relationships are designed for reuse. | | |
| 7.2.4 | UI components (forms, tables, modals) are reusable. | | |
| 7.2.5 | API services can be reused by different frontend components. | | |
| 7.2.6 | Blockchain operations are implemented as reusable functions. | | |
| 7.2.7 | Validation rules are centralized and reusable. | | |
| 7.2.8 | Reporting functions can be reused for different types of reports. | | |
| 7.2.9 | The system uses standard libraries and frameworks to leverage existing code. | | |
| 7.2.10 | Reusable components reduce development time for new features. | | |

### 7.3 Analysability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 7.3.1 | Code is well-documented and easy to understand. | | |
| 7.3.2 | Database schema and relationships are clearly defined. | | |
| 7.3.3 | Error logs provide sufficient information for troubleshooting. | | |
| 7.3.4 | The system's architecture and design are documented. | | |
| 7.3.5 | Code follows consistent naming conventions and coding standards. | | |
| 7.3.6 | Dependencies between modules are clear and documented. | | |
| 7.3.7 | Blockchain integration logic is understandable and traceable. | | |
| 7.3.8 | API endpoints and their purposes are documented. | | |
| 7.3.9 | Data flow through the system can be traced and understood. | | |
| 7.3.10 | The system provides tools or logs for analyzing performance issues. | | |

### 7.4 Modifiability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 7.4.1 | New features can be added without modifying existing code extensively. | | |
| 7.4.2 | Configuration changes (academic year, grading formulas) can be made easily. | | |
| 7.4.3 | UI changes can be made without affecting backend logic. | | |
| 7.4.4 | Database schema changes can be implemented through migrations. | | |
| 7.4.5 | The system supports customization of workflows and processes. | | |
| 7.4.6 | Grade calculation formulas can be modified if needed. | | |
| 7.4.7 | Report formats and content can be customized. | | |
| 7.4.8 | User roles and permissions can be modified. | | |
| 7.4.9 | The system can be extended with new modules or features. | | |
| 7.4.10 | Changes can be tested and deployed without disrupting operations. | | |

### 7.5 Testability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 7.5.1 | Individual modules can be tested independently. | | |
| 7.5.2 | Test data can be easily created and managed. | | |
| 7.5.3 | The system supports automated testing of critical functions. | | |
| 7.5.4 | Blockchain operations can be tested in isolation. | | |
| 7.5.5 | User interface components can be tested separately. | | |
| 7.5.6 | API endpoints can be tested independently. | | |
| 7.5.7 | Database operations can be tested with test databases. | | |
| 7.5.8 | Error conditions can be simulated for testing. | | |
| 7.5.9 | The system provides test environments separate from production. | | |
| 7.5.10 | Testing tools and frameworks are integrated or available. | | |

---

## 8. PORTABILITY

### 8.1 Adaptability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 8.1.1 | The system can be adapted to different institutional requirements. | | |
| 8.1.2 | Grading schemes and formulas can be customized. | | |
| 8.1.3 | Academic structures (semesters, trimesters) can be configured. | | |
| 8.1.4 | User roles and permissions can be adapted to different organizational structures. | | |
| 8.1.5 | The system can be configured for different education levels (elementary, high school, college). | | |
| 8.1.6 | Report formats can be customized to meet institutional needs. | | |
| 8.1.7 | The system supports different languages or localization (if applicable). | | |
| 8.1.8 | Certificate templates can be customized. | | |
| 8.1.9 | Communication features can be adapted to different communication needs. | | |
| 8.1.10 | The system can be extended with institution-specific features. | | |

### 8.2 Installability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 8.2.1 | The system can be installed on standard web servers. | | |
| 8.2.2 | Installation procedures are documented and clear. | | |
| 8.2.3 | Database setup and configuration is straightforward. | | |
| 8.2.4 | Dependencies and requirements are clearly specified. | | |
| 8.2.5 | The system can be installed in different hosting environments. | | |
| 8.2.6 | Migration from previous systems (if applicable) is supported. | | |
| 8.2.7 | Initial configuration and setup is manageable. | | |
| 8.2.8 | The system supports different database systems (if applicable). | | |
| 8.2.9 | Installation does not require extensive technical expertise. | | |
| 8.2.10 | Updates and upgrades can be installed without major issues. | | |

### 8.3 Replaceability

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| 8.3.1 | The system can export data in standard formats for migration to other systems. | | |
| 8.3.2 | Data can be extracted without loss of information. | | |
| 8.3.3 | The system uses standard technologies that are not vendor-locked. | | |
| 8.3.4 | Blockchain records can be accessed independently of the main system. | | |
| 8.3.5 | The system does not create dependencies that prevent replacement. | | |
| 8.3.6 | APIs allow integration with replacement systems. | | |
| 8.3.7 | Database schema can be migrated to other database systems. | | |
| 8.3.8 | The system's data format is not proprietary or locked. | | |
| 8.3.9 | Certificate verification can continue even if the main system is replaced. | | |
| 8.3.10 | The system supports data portability standards. | | |

---

## OVERALL ASSESSMENT

### Summary Questions

| # | Question | Rating (1-5) | Comments |
|---|----------|--------------|----------|
| O.1 | Overall, the system meets the functional requirements for a grading management system. | | |
| O.2 | Overall, the system performs efficiently and responsively. | | |
| O.3 | Overall, the system is user-friendly and easy to use. | | |
| O.4 | Overall, the system is reliable and stable. | | |
| O.5 | Overall, the system provides adequate security for educational data. | | |
| O.6 | Overall, the system is maintainable and can be extended. | | |
| O.7 | Overall, the blockchain integration adds value to the system. | | |
| O.8 | Overall, I would recommend this system for use in an educational institution. | | |
| O.9 | The system provides good value for its functionality and features. | | |
| O.10 | I am satisfied with the overall quality of the system. | | |

---

## ADDITIONAL COMMENTS

**Strengths of the System:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

**Areas for Improvement:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

**Specific Recommendations:**
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________

---

**Thank you for your participation in this evaluation!**

---

*This questionnaire is based on ISO/IEC 25010:2011 Systems and software Quality Requirements and Evaluation (SQuaRE) - System and software quality models.*


