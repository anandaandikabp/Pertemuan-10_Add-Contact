const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const app = express();
const port = 3000;
const morgan = require('morgan')
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session')
const { loadContact, detailContact, addContact, hapusContact, cekDuplikat, updateContact } = require('./utils/contact');

app.set('view engine', 'ejs');
app.use(expressLayouts);

// middleware
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})

// built in middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// 3rd party middleware
app.use(morgan('dev'));
app.use(cookieParser('secret'))
app.use(flash());

app.use(session({ 
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
 }));

//  index
app.get('/', (req, res, next) => {
    res.render('index',
        {
            nama: 'Andika',
            title: 'Webserver EJS',
            layout: 'layout/main-layout',
        });
});

// about
app.get('/about', (req, res, next) => {
    res.render('about', { 
        title: 'Laman About',
        layout: 'layout/main-layout',
    });
});

app.get('/contact', (req, res, next) => {
    const contact = loadContact();
    res.render('contact', { 
        title: 'Laman Contact',
        layout: 'layout/main-layout',
        contact,
        msg: req.flash('msg'),
    });
});

// tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        title: 'Laman Tambah Contact',
        layout: 'layout/main-layout',
    });
})

// detail
app.get('/contact/:name', (req, res, next) => {
    const contact = detailContact(req.params.name);
    res.render('detail', { 
        title: 'Laman Detail',
        layout: 'layout/main-layout',
        contact,
    });
});

// proses input data dengan validator
app.post('/contact', [
    body('name').custom((value) => {
        const duplikat = cekDuplikat(value);
        if (duplikat) {
            throw new Error('Nama sudah digunakan')
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('mobile', 'Nomor tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Laman Form Tambah Data',
            layout: 'layout/main-layout',
            errors: errors.array(),
        })
    } else {
        addContact(req.body)
        req.flash('msg', 'Data berhasil ditambahkan!')
        res.redirect('/contact')
    }
})

// hapus contact
app.get('/contact/delete/:name', (req, res) => {
    const contact = detailContact(req.params.name);
    if (!contact) {
        res.status(404);
        res.send('<h1>404</h1>')
    } else {
        hapusContact(req.params.name);
        req.flash('msg', 'Data berhasil dihapus!')
        res.redirect('/contact');
    }
});

// edit data
app.get('/contact/edit/:name', (req, res) => {
    const contact = detailContact(req.params.name);
    res.render('edit-contact', {
        title: 'Laman Edit Contact',
        layout: 'layout/main-layout',
        contact,
    });
})

// proses edit
app.post('/contact/update', [
    body('name').custom((value, { req }) => {
        const duplikat = cekDuplikat(value);
        if (value !== req.body.oldName && duplikat) {
            throw new Error('Nama sudah digunakan')
        }
        return true;
    }),
    check('email', 'Email tidak valid').isEmail(),
    check('mobile', 'Nomor tidak valid').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'form edit',
            layout: 'layout/main-layout',
            errors: errors.array(),
            contact: req.body,
        })
    } else {
        updateContact(req.body)
        req.flash('msg', 'Data berhasil diupdate!')
        res.redirect('/contact')
    }
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('Not Found 404')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});