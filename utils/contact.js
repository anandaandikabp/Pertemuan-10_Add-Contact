const fs = require('fs');

// buat folder jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}
// buat file json jika belum ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]','utf-8');
}

// load data kontak
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json','utf-8');
    const contacts = JSON.parse(file);
    return contacts;
};

// menampilkan detail kontak yang dicari
const detailContact = (name) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.name === name);
    if (!contact) {
        console.log((`${name} tidak ditemukan`));
        return false;
    } else {
        console.log(contact.name);
        console.log(contact.email);
        console.log(contact.mobile);
    }
    return contact;
}

// save data
const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

// tambah data
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContact(contacts);
}

module.exports = {loadContact, detailContact, addContact};