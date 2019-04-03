const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//mongoose connection

mongoose.connect('mongodb://localhost/todo')


app.set('view engin', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//mongoose schema
let todoSchema = new mongoose.Schema({
    name: String,
    desc: String
});

let Todo = mongoose.model('Todo', todoSchema);



//==================Express Routes==============//
app.get('/', sendStartPage);
app.post('/', postHandler);

function sendStartPage(req, res) {
    Todo.find({}, function (err, todoList){
        if(err) console.log(err);
        else {
            res.render('todo.ejs', {todoList: todoList});
        }
    });
}

function postHandler(req, res){
    let params = req.body;
    let action = params.action;

    if (action === 'create') {
        let taskName = params.taskName;
        let taskDesc = params.taskDesc;

        Todo.insertMany([{name : taskName, desc : taskDesc}], function(err, result) {
            if(err) {
                console.log(err);
                res.send({status : 'error'});
            }
            else {
                console.log(result);
                res.send({status : 'success', data : result});
            }
        })
    }
    else if (action === 'delete') {
        let id = params.id;

        Todo.deleteOne({_id : id}, function(err, result) {
            if(err) {
                console.log(err);
                res.send({status : 'error'});
            }
            else {
                console.log(result);
                res.send({status : 'success', data : id});
            }
        })
    }
    else if (action === 'show') {
        let id = params.id;

        Todo.find({_id : id}, function(err, result) {
            if(err) {
                console.log(err);
                res.send({status : 'error'});
            }
            else {
                console.log(result);
                res.send({status : 'success', data : result});
            }
        })
    }
    else if (action === 'edit') {
        let id = params.id;

        Todo.find({_id : id}, function(err, result) {
            if(err) {
                console.log(err);
                res.send({status : 'error'});
            }
            else {
                console.log(result);
                res.send({status : 'success', data : id});
            }
        })
    }
}


//catch all ather routes
app.get('*', function(req, res){
    res.send('<h1>Invalid page</h1>');
});


// server listening port 3000

app.listen(3000, function() {
    console.log('server started port 3000');
});