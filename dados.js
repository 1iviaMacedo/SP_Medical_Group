const express = require('express');
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 5000;

app.use(session({
    secret: 'sua_chave_secreta',
    resave: true,
    saveUninitialized: true,
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: 'aluno',
    database: 'mydb'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
    console.log('Conexão com o banco de dados MySQL estabelecida.');
});

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(express.static('img'));
app.set('view engine', 'ejs');

// READ
app.get('/cadastro', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('cadastro', { dados: result });
    });
});

app.get('/login1', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('login1', { dados: result });
    });
});

app.post('/login1', (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} senha: ${password}`)

    const query = 'SELECT * FROM users WHERE name = ? AND email = ?';

    console.log(`${query}`)

    db.query(query, [username, password], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            res.redirect('/dashboard');
        } else {
            // res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
            res.redirect('/dashboard');
        }
    });
});

app.get('/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render('inicio', { usernamekm           : req.session.username });
    } else {
        res.send('Faça login para acessar esta página. <a href="/">Login</a>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login1');
    });
});


app.get('/login2', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('login2', { dados: result });
    });
});

app.get('/', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('login1', { dados: result });
    });
});

app.get('/agendar', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (req.session.loggedin) {
            res.render('agendar', { usernamekm           : req.session.username });
        } else {
            res.send('Faça login para acessar esta página. <a href="/">Login</a>');
        }
    });
});

app.get('/consultas', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (req.session.loggedin) {
            res.render('consultas', { usernamekm           : req.session.username });
        } else {
            res.send('Faça login para acessar esta página. <a href="/">Login</a>');
        }
    });
});

app.get('/inicio', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('inicio', { dados: result });
    });
});

app.get('/erro', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (req.session.loggedin) {
            res.render('erro', { usernamekm           : req.session.username });
        } else {
            res.send('Faça login para acessar esta página. <a href="/">Login</a>');
        }
    });
});

app.get('/index', (req, res) => {
    db.query('SELECT * FROM dados', (err, result) => {
        if (err) throw err;
        res.render('index', { dados: result });
    });
});

// CREATE
app.post('/add', (req, res) => {
    const { email, CPF, senha } = req.body;
    const sql = 'INSERT INTO dados (email, CPF, senha ) VALUES (?, ?, ?)';
    db.query(sql, [email, CPF, senha], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// UPDATE
app.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const { email, CPF } = req.body;
    const sql = 'UPDATE dados SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [email, id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// DELETE
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM dados WHERE id = ?';

    db.query(sql, id, (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



// Rota para fazer logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
