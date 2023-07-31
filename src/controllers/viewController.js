const viewAllAssignments = async  (req, res) => {
  try {
    const { con } = req;

    con.query("SELECT * FROM assignments", (err, results) => {
      if (err) {
        // console.log("Error fetching assignments:", err);
        return res.status(400).json({ error: "Error fetching assignments" });
      }
      const filteredResults = results.map((assignment) => {
        const { id, title, subject, question, options } = assignment;
        return { id, title, subject, question, options };
      });

      return res.status(200).json({ assignments: filteredResults });
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done

const viewParticularAssignment = async (req, res) => {
  try {
    const { con } = req;
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is missing in the request" });
    }

    con.query(
      "SELECT * FROM assignments WHERE id=?",
      [assignmentId],
      (err, results) => {
        if (err) {
          return res.status(400).json({ error: "Error fetching assignment" });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "Assignment not found" });
        }
  
        const filteredResults = results.map((assignment) => {
          const { id, title, subject, question, options } = assignment;
          return { id, title, subject, question, options };
        });
  
        return res.status(200).json({ assignments: filteredResults });
      }
    ); 
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done

const viewAllStudentAssignment = async (req, res) => {
  const { con } = req;

  try {
    con.query(
      "select id, full_name, attended_assignments, created_at, updated_at from users where role='student' and is_faculty=0",
      (err, results) => {
        if (err) {
          return res.status(400).json({ error: "Error fetching students assignment" });
        }

        const assignmentsWithNonNullData = results.filter((user) => user.attended_assignments !== null);

        if (assignmentsWithNonNullData.length === 0) {
          return res.status(404).json({ error: "Students Assignment not found" });
        }

        return res.status(200).json({ assignments: assignmentsWithNonNullData });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done


const viewStudentAssignment = async (req, res) => {
  const { con } = req;
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ error: "Student ID is missing in the request" });
  }

  try {
      con.query(
      "select * from users where full_name=? and role='student' and is_faculty=0",
      [studentId],
      (err, results) => {
        if (err) {
          return res.status(400).json({ error: "Error fetching students assignment" });
        }

        if(results.length === 0) {
          return res.status(404).json({ error: "Student not found" });
        }
        
        if(results[0].attended_assignments === undefined || results[0].attended_assignments === null || results[0].attended_assignments === 0){
          return res.status(404).json({ error: "You Have Not attempted any assignment" });
        }

        const attended_assignment_ids = results[0].attended_assignments.map(
          (assignment) => assignment.id
        );

        con.query(
          "SELECT a.subject, a.question, a.options, m.marks FROM assignments a JOIN marks m ON a.id = m.assignment_id WHERE a.id IN (?)",
          [attended_assignment_ids],
          (err, results) => {
            if (err) {
              return res.status(400).json({ error: "Error fetching results" });
            }
            return res.status(200).json({ assignments: results });
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done


const viewAllAttendedAssignments = async (req, res) => {
  try {
    const { con } = req;
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is missing in the request" });
    }

    // Fetch the student's attended assignments
    con.query(
      "SELECT * FROM users WHERE full_name=? and role='student' and is_faculty=0",
      [studentId],
      (err, student) => {
        if (err) {
          return res.status(500).json({ error: "Error fetching student" });
        }

        if (student.length === 0) {
          return res.status(404).json({ error: "Student not found" });
        }

        // console.log(student[0].attended_assignments);
        if(student[0].attended_assignments === undefined || student[0].attended_assignments === null || student[0].attended_assignments === 0){
          return res.status(200).json({ error: "You Have Not attempted any assignment" });
        }

        const attendedAssignments = student.map(
          (item) => item.attended_assignments
        );
      
        // if(!attendedAssignments.some(Boolean) || attendedAssignments.length === 0) {
        //   return res.status(200).json({ error: "You Have Not attempted any assignment" });
        // }

        return res.status(200).json({data: attendedAssignments});
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done

const viewParticularAttendedAssignmentResult = async (req, res) => {
  try {
    const { con } = req;
    const { studentId, assignmentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is missing in the request" });
    }

    if (!assignmentId) {
      return res.status(400).json({ error: "Assignment ID is missing in the request" });
    }

    con.query(
      "select attended_assignments from users where full_name=? and role='student' and is_faculty=0 AND JSON_CONTAINS(JSON_ARRAY(attended_assignments), JSON_OBJECT('id', ?))",
      [studentId, assignmentId],
      (err, results) => {
        if (err) {
          return res.status(400).json({ error: "Error fetching Data" + err.stack });
        }
        // console.log(results);
        if (results.length === 0) {
          return res.status(404).json({ error: "Assignment not found" });
        }

        const attendedAssignments = results[0].attended_assignments;
        const attendedAssignment = attendedAssignments.find(
          (assignment) => assignment.id === assignmentId
        );
        const answer = attendedAssignment.answer;
    
        con.query(
          "select a.question, a.options, a.correct_answer, m.marks from assignments a JOIN marks m on a.id = m.assignment_id  and m.full_name=? WHERE a.id IN(?)",
          [studentId, assignmentId],
          (err, results) => {
            if (err) {
              return res
                .status(400)
                .json({ error: "Error fetching Data" + err.stack });
            }
            results[0].answer = answer;
            return res.status(200).json({data: results});
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
};//done

module.exports = {
  viewAllAssignments,
  viewParticularAssignment,
  viewAllStudentAssignment,
  viewStudentAssignment,
  viewAllAttendedAssignments,
  viewParticularAttendedAssignmentResult,
};
