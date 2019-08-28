const express = require('express');
const fs = require('fs');
const app = express();
const port = '4001';
const mongoose = require('mongoose');
let rawdata = fs.readFileSync('contactData.json');
let contactData = JSON.parse(rawdata);

// Start node server
app.listen(port, () => {
    console.log('Server Listening to port ' + port)
});

// Connect to Mongoose
mongoose.connect( "mongodb://localhost:27017/contactlist", {useNewUrlParser: true});

// Create schema for contact list 
var Schema = mongoose.Schema;
var contact = new Schema({
    name: String,
    phone: String
}, { collection: 'contact' });
var Contact = mongoose.model('Contact', contact, 'contact');

// Create schema for message list 
var messages = new Schema({
    name: String,
    phone: String,
    message: String
}, { collection: 'messages' });
var Messages = mongoose.model('Messages', messages, 'messages');

app.use(express.json());

// Set access control for client requests
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
});

// Get specific contact
app.use('/contacts/:id', (req, res) => {
    // Retrieve Data From MongoDB
    Contact.find({ _id: req.params.id }).then( (doc) => {
        res.status(200).send(doc);
    });

    // Retrieve Data From JSON File
    // var list = contactData.contactList;
    // for ( let i = 0; i < list.length; i++ ) {
    //     if ( list[i].id == userId ) {
    //         var userToUpdate = {
    //             id: list[i].id,
    //             name: list[i].name,
    //             phone: list[i].phone
    //         }
    //     }
    // }
    // res.status(200).send(doc);
});

// Get contact list
app.use('/contacts', (req, res) => {
    // Retrieve Data From MongoDB
    Contact.find().then( (doc) => {
        res.status(200).send(doc)
    });

    // Retrieve Data From JSON File
    // var list = contactData.contactList;
    // res.status(200).send(list);
});

// Add New User
app.post('/addUser',(req,res) => {
    // Insert user in MongoDB
    var addNewUser = new Contact({
        name: req.body.name,
        phone: req.body.phone
    });
    addNewUser.save( (err, doc) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({ status: 200, message: "success" });
        }
    });

    // Insert data in json file
    // let addData = { 
    //     id: contactData.contactList.length + 1,
    //     name: req.body.name,
    //     phone: req.body.phone
    // };
    // contactData.contactList.push(addData);
    // let data = JSON.stringify(contactData, null, 2);
    // fs.writeFile('contactData.json', data, (err) => {
    //     if (err) throw err;
    //     return res.status(200).json({
    //         status: 200,
    //         message: "success"
    //     });
    // });

});

// Update specific user
app.put('/updateUser', (req, res) => {
    // Update user in MongoDB
    Contact.findOne({ _id: req.body._id }).then( (doc) => {
        doc.name = req.body.name;
        doc.phone = req.body.phone;
        doc.save();
        return res.status(200).json({
            status: 200,
            message: "success"
        });
    });

    // Update user in JSON file
    // var list = contactData.contactList;
    // for (let i = 0; i < list.length; i++ ) {
    //     if ( list[i].id == req.body.id ) {
    //         list[i].name = req.body.name;
    //         list[i].phone = req.body.phone;
    //     }
    // }
    // let data = JSON.stringify(contactData, null, 2);
    // fs.writeFile('contactData.json', data, (err) => {
    //     if (err) throw err;
    //     return res.status(200).json({
    //         status: 200,
    //         message: "success"
    //     });
    // });
});

// Delete specific user
app.put('/deleteUser', (req, res) => {
    // Update user in MongoDB
    Contact.findByIdAndDelete(req.body.id).exec();
    Contact.find().then( (doc) => {
        res.status(200).json({
            status: 200,
            message: "success",
            doc: doc
        });
    });
    
    // Update user in JSON File
    // var list = contactData.contactList;
    // for (let i = 0; i < list.length; i++ ) {
    //     if ( list[i].id == req.body.id ) {
    //         list.splice(i, 1);
    //     }
    // }
    // let data = JSON.stringify(contactData, null, 2);
    // fs.writeFile('contactData.json', data, (err) => {
    //     if (err) throw err;
    //     return res.status(200).json({
    //         status: 200,
    //         message: "success",
    //         responseData: contactData
    //     });
    // });
});

// Get message list
app.get('/messages', (req, res) => {
    // Retrieve Data From MongoDB
    Messages.find().then( (doc) => {
        res.status(200).send(doc)
    });

    // Retrieve Data From JSON File
    // var msgList = contactData.messageList;
    // res.status(200).send(msgList);
});

// Add message to list
app.post('/sendMessage', (req, res) => {
    // Insert message in MongoDB
    var addNewMessage = new Messages({
        name: req.body.name,
        phone: req.body.phone,
        message: req.body.message
    }, { versionKey: false });
    addNewMessage.save( (err, doc) => {
        if (err) {
            throw err;
        } else {
            return res.status(200).json({ status: 200, message: "success" });
        }
    });

    // Insert message in JSON file
    // let addMessage = { 
    //     id: contactData.messageList.length + 1,
    //     recieverPhone: req.body.senderName,
    //     recieverName: req.body.senderPhone,
    //     message: req.body.message
    // };
    // contactData.messageList.push(addMessage);
    // let data = JSON.stringify(contactData, null, 2);
    // fs.writeFile('contactData.json', data, (err) => {
    //     if (err) throw err;
    //     return res.status(200).json({
    //         status: 200,
    //         message: "success"
    //     });
    // });
});

// Delete specific message from list
app.put('/deleteMessage', (req, res) => {
    // Update user in MongoDB
    Messages.findByIdAndDelete(req.body.id).exec();
    Messages.find().then( (doc) => {
        res.status(200).json({
            status: 200,
            message: "success",
            doc: doc
        });
    });

    // Update user in JSON file
    // var list = contactData.messageList;
    // for (let i = 0; i < list.length; i++ ) {
    //     if ( list[i].id == req.body.id ) {
    //         list.splice(i, 1);
    //     }
    // }
    // let data = JSON.stringify(contactData, null, 2);
    // fs.writeFile('contactData.json', data, (err) => {
    //     if (err) throw err;
    //     return res.status(200).json({
    //         status: 200,
    //         message: "success",
    //         responseData: contactData
    //     });
    // });
});

