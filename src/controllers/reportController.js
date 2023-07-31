const PDFDocument = require('pdfkit');

const studentMarkWiseReport = async (req, res) => {
  try {
    const { con } = req;

    con.query(
      "SELECT full_name, SUM(marks) AS totalMarks FROM marks GROUP BY full_name ORDER BY totalMarks DESC",
      (err, data) => {
        if (err) {
          return res.status(400).json({ error: 'Error fetching student marks' });
        }

        if(data.length === 0){
          return res.status(200).json({ error: 'Data Not Available' });
        }

        // Create a new PDF document
        const doc = new PDFDocument();

        // Set the response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="student_marks_report.pdf"');

        // Pipe the PDF document to the response stream
        doc.pipe(res);

        // Add content to the PDF
        doc.fontSize(18).text('Student Mark-wise Report', { align: 'center' });
        doc.moveDown();
        doc.moveDown();
        doc.font('Helvetica-Bold').text(`User: -  ${data[0].full_name}`, { underline: true, align: 'center' });
        doc.moveDown();
        doc.moveDown();
        
        doc.font('Helvetica-Bold');
        doc.text('   Name                 Marks', {align: 'center' });
        doc.moveDown();
        doc.font('Helvetica');

        // Format and add data to the PDF
        data.forEach((item) => {
          const { full_name, totalMarks } = item;
          const padding = 25; // Adjust the padding value as per your preference
          const formattedData = `${full_name.padEnd(padding)}${totalMarks}`;
          doc.text(formattedData, { align: 'center'  });
        });

        // Get the width of the PDF document
        const pdfWidth = doc.page.width;

        // Add date and time at the bottom right corner
        doc.text(`Date: ${new Date().toLocaleDateString()}   Time: ${new Date().toLocaleTimeString()}`, pdfWidth - 200, doc.page.height - 50, { align: 'right' });
    

        // Finalize the PDF and end the response
        doc.end();
      }
    );
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const subjectWiseReport = async (req, res) => {
  try {
    const { con } = req;
    const { subject } = req.query;

    if (!subject) {
      return res.status(400).json({ error: "Subject is missing in the request" });
    }

    con.query(`SELECT * FROM assignments WHERE subject=?`, [subject], (err, assignments) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching student marks' });
      }

      // Extract assignment IDs from the fetched assignments
      const assignmentIds = assignments.map(assignment => assignment.id);

      // Use the extracted assignment IDs to query the marks table
      con.query(`SELECT full_name, SUM(marks) as totalMarks FROM marks WHERE assignment_id IN (?) GROUP BY full_name ORDER BY totalMarks DESC`, [assignmentIds], (err, marks) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching student marks' });
        }

        if(marks.length === 0){
          return res.status(200).json({ error: 'Data Not Available' });
        }
         // Create a new PDF document
         const doc = new PDFDocument({ size: 'A4', margin: 50 });

         // Set the response headers for PDF download
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename="student_marks_report.pdf"');
 
         // Pipe the PDF document to the response stream
         doc.pipe(res);
 
         // Add content to the PDF
         doc.fontSize(18).text('Student Subject-wise Report', { align: 'center' });
         doc.moveDown();
         doc.moveDown();
        //  doc.font('Helvetica-Bold').text(`Subject: -  ${title}`, { align: 'center' });
         doc.font('Helvetica-Bold').text(`Subject: -  ${assignments[0].subject}`, { underline: true, align: 'center' });
         doc.moveDown();
         doc.moveDown();
         
         doc.font('Helvetica-Bold');
         doc.text('   Name                 Marks', {align: 'center' });
         doc.moveDown();
         doc.font('Helvetica');
 
         // Format and add data to the PDF
         marks.forEach((item) => {
           const { full_name, totalMarks } = item;
           const padding = 25; // Adjust the padding value as per your preference
           const formattedData = `${full_name.padEnd(padding)}${totalMarks}`;
           doc.text(formattedData, { align: 'center'  });
         });

         // Get the width of the PDF document
        const pdfWidth = doc.page.width;

        // Add date and time at the bottom right corner
        doc.text(`Date: ${new Date().toLocaleDateString()}   Time: ${new Date().toLocaleTimeString()}`, pdfWidth - 200, doc.page.height - 50, { align: 'right' });
    
        doc.end();

      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const allSubjectStudentReport = async (req, res) => {
  try {
    const { con } = req;
    const { full_name } = req.query;

    if (!full_name) {
      return res.status(400).json({ error: "Student Name is missing in the request" });
    }

    // Fetch all subjects and corresponding scores related to the given student from the database
    con.query(
      `SELECT b.subject, a.marks
        FROM marks AS a
        INNER JOIN assignments AS b ON a.assignment_id = b.id
        WHERE a.full_name = ?`,
      [full_name],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching student marks' });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: `${full_name} Not Found` });
        }

        const subjectTotalMarks = {};

        // Iterate through the output array and add the marks for each subject
        let totalMarks = 0;
        result.forEach((item) => {
          const { subject, marks } = item;
          totalMarks += marks;
          subjectTotalMarks[subject] = (subjectTotalMarks[subject] || 0) + marks;
        });

        // Convert the subjectTotalMarks object to an array of objects
        const totalMarksArray = Object.entries(subjectTotalMarks).map(([subject, marks]) => ({
          subject,
          marks,
        }));

        // Generate PDF
        const doc = new PDFDocument();
        const filename = `${full_name}_report.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        // Write content to the PDF
        doc.fontSize(18).text('Subject-wise Marks', {align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`Student Name: - ${full_name}`, { align: 'center' });
        doc.moveDown();

        doc.font('Helvetica-Bold');
        doc.text('   Subject                 Marks', { align: 'center' });
        doc.moveDown();
        doc.font('Helvetica');

        totalMarksArray.forEach((item) => {
          const { subject, marks } = item;
          doc.text(`${subject}:                 ${marks}`, { align: 'center' });
        });

        doc.moveDown();
        
        doc.fontSize(14).text('Total Marks:            ' + totalMarks, { align: 'center' });

        const pdfWidth = doc.page.width;

        doc.text(`Date: ${new Date().toLocaleDateString()}   Time: ${new Date().toLocaleTimeString()}`, pdfWidth - 200, doc.page.height - 50, { align: 'right' });

        doc.end(); 
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const classWiseReport = async (req, res) => {
  try {
    const { con } = req;
    const { sClass } = req.query;

    if (!sClass) {
      return res.status(400).json({ error: "Class is missing in the request" });
    }

    // "SELECT full_name, SUM(marks) AS totalMarks FROM marks GROUP BY full_name ORDER BY totalMarks DESC",

    con.query(`SELECT a.full_name, SUM(b.marks) as totalMarks
    FROM users as a
    INNER JOIN marks as b ON a.full_name = b.full_name
    WHERE a.class = ?
    GROUP BY a.full_name
    ORDER BY totalMarks DESC`, [sClass], (err, classReport) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching student marks' });
      }

      if (classReport.length === 0) {
        return res.status(404).json({ error: `This ${sClass}'s Student Not Attempted any Assignment` });
      }
  
         // Create a new PDF document
         const doc = new PDFDocument({ size: 'A4', margin: 50 });

         // Set the response headers for PDF download
         res.setHeader('Content-Type', 'application/pdf');
         res.setHeader('Content-Disposition', 'attachment; filename="student_marks_report.pdf"');
 
         // Pipe the PDF document to the response stream
         doc.pipe(res);
 
         // Add content to the PDF
         doc.fontSize(18).text('Student Class-wise Report', { align: 'center' });
         doc.moveDown();
         doc.moveDown();
        //  doc.font('Helvetica-Bold').text(`Subject: -  ${title}`, { align: 'center' });
         doc.font('Helvetica-Bold').text(`Class: -  ${sClass}`, { align: 'center' });
         doc.moveDown();
         doc.moveDown();
         
         doc.font('Helvetica-Bold');
         doc.text('   Name                 Marks', {align: 'center' });
         doc.moveDown();
         doc.font('Helvetica');
 
         // Format and add data to the PDF
         classReport.forEach((item) => {
           const { full_name, totalMarks } = item;
           const padding = 25; // Adjust the padding value as per your preference
           const formattedData = `${full_name.padEnd(padding)}${totalMarks}`;
           doc.text(formattedData, { align: 'center'  });
         });

         // Get the width of the PDF document
        const pdfWidth = doc.page.width;

        // Add date and time at the bottom right corner
        doc.text(`Date: ${new Date().toLocaleDateString()}   Time: ${new Date().toLocaleTimeString()}`, pdfWidth - 200, doc.page.height - 50, { align: 'right' });
    
        doc.end();

    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports={studentMarkWiseReport, subjectWiseReport, classWiseReport, allSubjectStudentReport}