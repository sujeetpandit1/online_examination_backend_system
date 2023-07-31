# Online Examination System

This project is an Online Examination System built with Node.js, Express, and MySQL. It provides functionality for creating assignments, attending assignments, viewing assignments, and generating various reports.

## Installation

To run this application, you need to have Node.js and MySQL installed on your system. Follow the steps below to set up the project:

1. Clone the repository: `git clone https://github.com/yourusername/online-examination.git`
2. Navigate to the project folder: `cd online-examination`
3. Install dependencies: `npm install`
4. Set up the MySQL database using the `online_examination.sql` file provided.

## Configuration

Before running the application, you need to configure the MySQL connection in the `index.js` file. Update the `connection` object with your MySQL credentials.

```javascript
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'online_examination',
});
```

## Usage

To start the application, run the following command:

```bash
npx nodemon src/index.js
```

The application will start running at http://localhost:4000. You can access the various endpoints of the API to perform different operations.

## Endpoints

### Create User

- **POST** `/createUser`
  - Creates a new user (faculty or student) and stores it in the database.

### Create Assignment

- **POST** `/createAssignment`
  - Allows faculty members to create a new assignment and store it in the database.

### View All Assignments

- **GET** `/viewAllAssignment`
  - Retrieves a list of all assignments from the database.

### View Particular Assignment

- **GET** `/viewParticularAssignment`
  - Retrieves a specific assignment based on the provided assignment ID.

### Attend Assignment

- **POST** `/assignments/attend`
  - Allows students to attend an assignment, and the answers are stored in the database.

### View Student Assignment

- **GET** `/viewStudentAssignment`
  - Allows faculty members to view a specific student's assignments.

### View All Student Assignments

- **GET** `/viewAllStudentAssignment`
  - Retrieves a list of all students and their attended assignments from the database.

### View All Attended Assignments

- **GET** `/viewAllAttendentAssignment`
  - Allows students to view all the assignments they have attended.

### View Particular Attended Assignment Result

- **GET** `/viewParticularAttendedAssignmentResult`
  - Allows students to view the result of a specific attended assignment.

### Generate Reports

- **GET** `/reports/studentMarkWise`
  - Generates a PDF report of student marks, sorted by total marks.
- **GET** `/reports/studentSubjectWise`
  - Generates a PDF report of student marks subject-wise.
- **GET** `/reports/allSubStudentReport`
  - Generates a PDF report of each student's marks in all subjects.
- **GET** `/reports/studentClassWise`
  - Generates a PDF report of student marks, grouped by class.

## Middleware

The application uses middleware to log incoming requests and pass the MySQL connection to the request object.

## Controllers

- `userController.js`: Handles user creation functionality.
- `assignmentController.js`: Handles assignment creation functionality.
- `viewController.js`: Handles view-related functionalities, like viewing assignments and attended assignments.
- `attendController.js`: Handles attending assignments and storing answers.
- `reportController.js`: To generate report in pdf.

## Conclusion

This Online Examination System provides a simple API for creating and attending assignments, viewing assignments and results, and generating various reports based on student performance. It can be extended and improved further based on specific requirements.