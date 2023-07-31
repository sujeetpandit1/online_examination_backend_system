const attendAssignment = async (req, res) => {
    const { con } = req;
    const { assignmentId, full_name, answer } = req.body;
  
    // Check if the assignmentId exists
    con.query("SELECT * FROM assignments WHERE id=?", [assignmentId], (err, results) => {
      if (err) {
        // console.log('Error fetching assignment:', err);
        return res.status(500).json({ error: 'Error fetching assignment' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Assignment not found' });
      }
     
      // Update the student's attended_assignments array with the attended assignment details
      const assignmentDetails = {
        id: assignmentId,
        title: results[0].title,
        subject: results[0].subject,
        question: results[0].question,
        options: results[0].options,
        correct_answer: results[0].correct_answer.trim(),
        answer, 
      };
      // Fetch the current attended_assignments of the user (student) with the given full_name
      con.query("SELECT attended_assignments FROM users WHERE full_name=? AND role='student' AND is_faculty=0", [full_name], (err, userResults) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching user' });
        }
  
        if (userResults.length === 0) {
          return res.status(400).json({ message: 'You are not authorized to attend the assignment' });
        }
  
        const attendedAssignments = userResults[0]?.attended_assignments || []; // Get current attended_assignments or an empty array if it's null
  
        // Check if the student has already attended the assignment
        if (attendedAssignments.some((assignment) => assignment.id === assignmentId)) {
          return res.status(409).json({ message: 'You have already attended this assignment' });
        }
  
        attendedAssignments.push(assignmentDetails); // Add the attended assignment details to the array
  
        // Update the user's attended_assignments array with the new array
        con.query("UPDATE users SET attended_assignments=? WHERE full_name=?", [JSON.stringify(attendedAssignments), full_name], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Error attending assignment' });
            }

            const correctAnswer = results[0].correct_answer;
            const marksEarned = correctAnswer === answer ? 10 : 0; // 10 marks for correct answer, 0 for incorrect answer
            // console.log(marksEarned);    
            // Insert the marks into the assignment_marks table
            con.query("INSERT INTO marks (full_name, assignment_id, marks) VALUES (?, ?, ?)", [full_name, assignmentId, marksEarned],(err) => {
                if (err) {
                  return res.status(500).json({ error: 'Error saving marks' });
                }
                return res.status(200).json({ message: 'Successfully attended assignment and saved marks' });
              }
            );
          }
        );
      });
    });
  };
  
  module.exports = { attendAssignment };
  