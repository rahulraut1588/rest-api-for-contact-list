const express = require('express');
const fs = require('fs');
const app = express();
const port = '4001';
var bodyParser = require("body-parser");

let rawdata = fs.readFileSync('contactData.json');
let contactData = JSON.parse(rawdata);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
});

app.listen(port, () => {
    console.log('Server Listening to port ' + port)
});

app.use('/contacts', (req, res) => {
    var list = contactData.contactList;
    res.status(200).send(list);
});

app.use('/contacts/:id', (req, res) => {
    var userId = req.params.id;
    var list = contactData.contactList;
    for ( let i = 0; i < list.length; i++ ) {
        if ( list[i].id == userId ) {
            var userToUpdate = {
                id: list[i].id,
                name: list[i].name,
                phone: list[i].phone
            }
        }
    }
    res.status(200).send(userToUpdate);
});

app.post('/addUser',(req,res) => {
    let addData = { 
        id: contactData.contactList.length + 1,
        name: req.body.name,
        phone: req.body.phone
    };
    contactData.contactList.push(addData);
    let data = JSON.stringify(contactData, null, 2);
    fs.writeFile('contactData.json', data, (err) => {
        if (err) throw err;
        return res.status(200).json({
            status: 200,
            message: "success"
        });
    });
});

app.put('/updateUser', (req, res) => {
    var list = contactData.contactList;
    for (let i = 0; i < list.length; i++ ) {
        if ( list[i].id == req.body.id ) {
            list[i].name = req.body.name;
            list[i].phone = req.body.phone;
        }
    }
    let data = JSON.stringify(contactData, null, 2);
    fs.writeFile('contactData.json', data, (err) => {
        if (err) throw err;
        return res.status(200).json({
            status: 200,
            message: "success"
        });
    });
});

app.put('/deleteUser', (req, res) => {
    var list = contactData.contactList;
    for (let i = 0; i < list.length; i++ ) {
        if ( list[i].id == req.body.id ) {
            list.splice(i, 1);
        }
    }
    let data = JSON.stringify(contactData, null, 2);
    fs.writeFile('contactData.json', data, (err) => {
        if (err) throw err;
        return res.status(200).json({
            status: 200,
            message: "success",
            responseData: contactData
        });
    });
});

app.use('/messages', (req, res) => {
    var msgList = contactData.messageList;
    res.status(200).send(msgList);
});

app.post('/sendMessage', (req, res) => {
    console.log(req.body);
    let addMessage = { 
        id: contactData.messageList.length + 1,
        recieverPhone: req.body.senderName,
        recieverName: req.body.senderPhone,
        message: req.body.message
    };
    contactData.messageList.push(addMessage);
    let data = JSON.stringify(contactData, null, 2);
    fs.writeFile('contactData.json', data, (err) => {
        if (err) throw err;
        return res.status(200).json({
            status: 200,
            message: "success"
        });
    });
});

app.put('/deleteMessage', (req, res) => {
    var list = contactData.messageList;
    for (let i = 0; i < list.length; i++ ) {
        if ( list[i].id == req.body.id ) {
            list.splice(i, 1);
        }
    }
    let data = JSON.stringify(contactData, null, 2);
    fs.writeFile('contactData.json', data, (err) => {
        if (err) throw err;
        return res.status(200).json({
            status: 200,
            message: "success",
            responseData: contactData
        });
    });
});

