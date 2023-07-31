const bcrypt = require('bcrypt');

const userCreate = async (req, res) => {
    try {
        const { con } = req;
        const { full_name, email, password, role } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({ error: 'All Fields are mandatory' });
        }

        const validRoles = ['faculty', 'student'];
        const isFaculty = role === 'faculty' ? 1 : 0;

        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Allowed roles: faculty or student' });
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        con.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return res.status(400).json({ error: 'Error checking duplicacy' });
            }
            if (results.length > 0) {

                if (results.some((user) => user.full_name === full_name)) {
                    return res.status(400).json({ error: `${full_name} already exists` });
                }

                if (results.some((user) => user.email === email)) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
            }

            const hashPassword = bcrypt.hashSync(password, 10);

            if (role === 'faculty') {
                con.query(
                    'INSERT INTO users (full_name, email, password, role, is_faculty, class) VALUES (?,?,?,?,?,?)',
                    [full_name, email, hashPassword, role, isFaculty, null],
                    (err, results) => {
                        if (err) {
                            return res.status(400).json({ error: 'Error creating user' + err.stack });
                        }
                        return res.status(201).json({ id: results.insertId, full_name, role });
                    }
                );
            } else if (role === 'student') {
                const { class: studentClass } = req.body;
                if (!studentClass) {
                    return res.status(400).json({ error: 'Class field is required for students' });
                }

                con.query(
                    'INSERT INTO users (full_name, email, password, role, is_faculty, class) VALUES (?,?,?,?,?,?)',
                    [full_name, email, hashPassword, role, isFaculty, studentClass],
                    (err, results) => {
                        if (err) {
                            return res.status(400).json({ error: 'Error creating user' + err.stack });
                        }
                        return res.status(201).json({ id: results.insertId, full_name, role, class: studentClass });
                    }
                );
            }
        });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server error' });
    }
}

module.exports = { userCreate };
