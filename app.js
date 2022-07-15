const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
const morgan = require('morgan')
const { loadContact, detailContact, addContact } = require('./utils/contact');

app.set('view engine', 'ejs');
app.use(expressLayouts);

// middleware
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
})

// built in middleware
app.use(express.static('public'))
app.use(express.urlencoded())

// 3rd party middleware
app.use(morgan('dev')); 

app.get('/', (req, res, next) => {
    res.render('index',
        {
            nama: 'Alya',
            title: 'Webserver EJS',
            layout: 'layout/main-layout',
        });
});

app.get('/about', (req, res, next) => {
    res.render('about', { title: 'about', layout: 'layout/main-layout', });
});

app.get('/contact', (req, res, next) => {
    const contact = loadContact();
    res.render('contact', { 
        title: 'contact',
        layout: 'layout/main-layout',
        contact,
    });
});

// tambah data
app.get('/contact/add', (req, res) => {
    res.render('add-contact', { 
        title: 'tambah contact',
        layout: 'layout/main-layout',
    });
})

// proses data 
app.post('/contact', (req, res) => {
    addContact(req.body)
    res.redirect('/contact')
})

// detail contact
app.get('/contact/:name', (req, res, next) => {
    const contact = detailContact(req.params.name);
    res.render('detail', { 
        title: 'detail',
        layout: 'layout/main-layout',
        contact,
    });
});

app.get('/product/:id?', (req, res) => {
    res.send(`product id : ${req.params.id} <br> category id : ${req.query.category}`);
});

app.use('/', (req, res) => {
    res.status(404)
    res.send('Not Found 404')
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});