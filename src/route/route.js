const express = require('express');
const { userCreate } = require('../controllers/userController');
const { createAssignment } = require('../controllers/assController');
const { viewAllAssignments, viewParticularAssignment, viewAllStudentAssignment, viewStudentAssignment, viewAllAttendedAssignments, viewParticularAttendedAssignmentResult } = require('../controllers/viewController');
const { attendAssignment } = require('../controllers/attendController');
const { studentMarkWiseReport, subjectWiseReport, classWiseReport, allSubjectStudentReport } = require('../controllers/reportController');


const router = express.Router();

/------------Routes--------------------/

router.post('/createUser', userCreate);
router.post('/createAssignment', createAssignment)

//Student Can View All and Particular Assignment
router.get('/viewAllAssignment', viewAllAssignments);
router.get('/viewParticularAssignment', viewParticularAssignment);
router.post('/assignments/attend', attendAssignment);   //Attend Assignment

//Faculty should view the students' individual assignments.
router.get('/viewStudentAssignment', viewStudentAssignment)
router.get('/viewAllStudentAssignment', viewAllStudentAssignment)


//Students should view the assignment results.
router.get('/viewAllAttendentAssignment', viewAllAttendedAssignments)
router.get('/viewParticularAttendedAssignmentResult', viewParticularAttendedAssignmentResult)

//Reports
router.get('/reports/studentMarkWise', studentMarkWiseReport);
router.get('/reports/studentSubjectWise', subjectWiseReport);
router.get('/reports/allSubStudentReport', allSubjectStudentReport);
router.get('/reports/studentClassWise', classWiseReport);




module.exports=router;