const express = require('express')
const bodyPaser=require('body-parser');
const app = express();
const {mongoose}=require('./db/mongoose')
const { Task, List } = require('./db/models/index');
var cors = require('cors');

app.use(cors())

app.use(bodyPaser.json());

app.get('/lists', (req, res) => {
    // return an array of all the lists in DB
    List.find({}).then((lists)=>{
        res.send(lists);
    })
})

app.post('/lists', (req, res) => {
    // create a new list and return it 
    let title=req.body.title;
    let newList=new List({
        title:title
    })
    newList.save().then((listDoc)=>{
        res.send(listDoc);
    })
})

app.patch('/lists/:id', (req, res) => {
    // Update a specific list 
    List.findOneAndUpdate({_id:req.params.id},{
        $set:req.body
    }).then(()=>{
        res.sendStatus(200)
    })
})

app.delete('/lists/:id', (req, res) => {
    // Delete a specific list
    List.findOneAndDelete({_id:req.params.id}).then((removedList)=>{
        res.send(removedList);
    })
})

app.get('/lists/:listId/tasks',(req,res)=>{
    // Return all tasks of a specific list
    Task.find({
        _listId:req.params.listId
    }).then((tasks)=>{
        res.send(tasks)
    })
})

app.post('/lists/:listId/tasks',(req,res)=>{
    // Return all tasks of a specific list
    const newTask=new Task({
        title:req.body.title,
        _listId:req.params.listId
    });

    newTask.save().then((newTaskDoc)=>{
        res.send(newTaskDoc)
    })

})
app.patch('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specified by taskId)
    Task.findOneAndUpdate({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
            $set: req.body
        }
    ).then(() => {
        res.send({ message: 'Updated successfully.' })
    })
        
});

app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specified by taskId)
    Task.findOneAndDelete({
        _id: req.params.taskId,
        _listId: req.params.listId
    }, {
            $set: req.body
        }
    ).then((removedTask) => {
        res.send(removedTask)
    })
        
});

app.get('/lists/:listId/tasks/:taskId', (req, res) => {
    // We want to update an existing task (specified by taskId)
    Task.findOne({
        _id: req.params.taskId,
        _listId: req.params.listId
    }
    ).then((task) => {
        res.send(task)
    })
        
});


app.listen(3000, () => {
    console.log("The server is up and running at port 3000")
})