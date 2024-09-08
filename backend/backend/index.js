const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let ADMINS = [];
let DATA = [];
let USERDB = {};

// Read admin data from file, or initialize to empty array if file does not exist
try {
    ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
} catch {
    ADMINS = [];
}

// Read data from db.json (Company records)
try {
    DATA = JSON.parse(fs.readFileSync('db.json', 'utf8')).records || [];
} catch {
    DATA = [];
}

// Read user-specific data from userdb.json (Checked status, notes)
try {
    USERDB = JSON.parse(fs.readFileSync('userdb.json', 'utf8'));
} catch {
    USERDB = {};
}

const SECRET = 'my-secret-key';

// Middleware to authenticate the JWT token
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user; // Attach the user to the request
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Admin Signup
app.post('/admin/signup', async (req, res) => {
    const { username, password } = req.body;
    const admin = ADMINS.find(a => a.username === username);
    if (admin) {
        return res.status(403).json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tokenNumber = uuidv4();
    const newAdmin = { username, password: hashedPassword, tokenNumber };

    ADMINS.push(newAdmin);
    fs.writeFileSync('admins.json', JSON.stringify(ADMINS, null, 2));

    const token = jwt.sign({ username, role: 'admin', tokenNumber }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Admin created successfully', token });
});

// Admin Login
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    const admin = ADMINS.find(a => a.username === username);

    if (admin && bcrypt.compareSync(password, admin.password)) {
        const token = jwt.sign({ username, role: 'admin', tokenNumber: admin.tokenNumber }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } else {
        res.status(403).json({ message: 'Invalid username or password' });
    }
});

// Fetch user-specific data merged with company data
app.get('/data', authenticateJwt, (req, res) => {
    const tokenNumber = req.user.tokenNumber;

    // Fetch user data or default to empty list
    const userData = USERDB[tokenNumber] || [];

    // Merge company data with user-specific checked/note data
    const mergedData = DATA.map(record => {
        const userRecord = userData.find(r => r.id === record.id) || {};
        return {
            ...record,
            checked: userRecord.checked || false,
            note: userRecord.note || ''
        };
    });

    res.json(mergedData);
});

// Update checked status based on token number
app.post('/data/check', authenticateJwt, (req, res) => {
    const { id, checked } = req.body;
    const tokenNumber = req.user.tokenNumber;

    // If user doesn't have any records in USERDB, create an empty entry
    if (!USERDB[tokenNumber]) {
        USERDB[tokenNumber] = [];
    }

    // Update or add the checked status for the given ID
    const itemIndex = USERDB[tokenNumber].findIndex(record => record.id === id);
    if (itemIndex !== -1) {
        USERDB[tokenNumber][itemIndex].checked = checked;
    } else {
        USERDB[tokenNumber].push({ id, checked });
    }

    fs.writeFileSync('userdb.json', JSON.stringify(USERDB, null, 2));
    res.json({ message: 'Checked status updated successfully' });
});

// Update note based on token number
app.post('/data/note', authenticateJwt, (req, res) => {
    const { id, note } = req.body;
    const tokenNumber = req.user.tokenNumber;

    // If user doesn't have any records in USERDB, create an empty entry
    if (!USERDB[tokenNumber]) {
        USERDB[tokenNumber] = [];
    }

    // Update or add the note for the given ID
    const itemIndex = USERDB[tokenNumber].findIndex(record => record.id === id);
    if (itemIndex !== -1) {
        USERDB[tokenNumber][itemIndex].note = note;
    } else {
        USERDB[tokenNumber].push({ id, note });
    }

    fs.writeFileSync('userdb.json', JSON.stringify(USERDB, null, 2));
    res.json({ message: 'Note updated successfully' });
});
app.get('/admin/me', authenticateJwt, (req, res) => {
    const { username } = req.user;
    res.json({ username });
  });
  
// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
