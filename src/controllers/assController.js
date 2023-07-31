
const createAssignment = async (req, res) => {
    try {
        const { con } = req;
        const { faculty_name, title, subject, question, options, correct_answer } = req.body;

        if (!faculty_name || !title || !subject || !question || !options || !correct_answer) {
            return res.status(400).json({ error: 'All Fields are mandatory' });
        } 

        const optionsJson = JSON.stringify(options);
        const correctAnswersJson = JSON.stringify(correct_answer);

        // First, check if the full_name exists in the database
        con.query("SELECT is_faculty FROM users WHERE full_name=?", [faculty_name], (err, results) => {
            if (err) {
                return res.status(400).json({ error: 'Error Fetching faculty_name' });
            }

            if (results.length === 0) {
                // full_name does not exist, return an error response
                return res.status(400).json({ error: `${faculty_name} does not exist. Only registered faculty members can create assignments.`});
            }

            const isFaculty = results[0].is_faculty;
            
            if (isFaculty !== 1) {
                // is_faculty is not equal to 1, return an error response
                return res.status(400).json({ error: 'User is not a faculty member. Only faculty members can create assignments.' });
            }

            // Both full_name exists and is_faculty is equal to 1, proceed with assignment creation
            con.query("INSERT INTO Assignments (faculty_name, title, subject, question, options, correct_answer) VALUES (?, ?, ?, ?, ?, ?)",
                [faculty_name, title, subject, question, optionsJson, correctAnswersJson],
                (err) => {
                    if (err) {
                        // console.log('Error creating assignment:', err);
                        return res.status(400).json({ error: 'Error Creating Assignment' });
                    }
                    return res.status(201).json({ message: 'Assignment Created' });
                }
            );
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server error' });
    }
};

module.exports={createAssignment} 