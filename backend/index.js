const express = require('express')
const bodyPaser = require('body-parser');
const app = express();
const { mongoose } = require('./db/mongoose')
const { Task, List, User } = require('./db/models/index');
const jwt = require('jsonwebtoken');
var cors = require('cors');

app.use(cors())

app.use(bodyPaser.json());

const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );
    next();
});


// Cheking if the user has valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            // invalid JWT
            res.status(401).send('invalid JWT');
        }
        else {
            req.user_id = decoded._id;
            next();
        }
    })
}

// Check if the user if authentic - by verifying the refresh token 
let verifySession = (req, res, next) => {
    let refreshToken = req.header('x-refresh-token');
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            return Promise.reject({ 'error': 'user not found, Make sure the refreshToken and user id is correct' });
        }
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        // RefreshToken exist , but check if the session has expired 
        let isSessionValid = false;
        user.sessions.forEach((session) => {
            if (session.token == refreshToken) {
                if (User.hasRefreshTokenExpired(session.expiresAt) == false) {
                    isSessionValid = true;
                }
            }
        })
        if (!isSessionValid) Promise.reject({ 'error': 'refresh Token expired' })
        next();
    }).catch((e) => {
        res.status(401).send(e);
    })
}

app.get('/lists', authenticate, (req, res) => {
    // return an array of all the lists in DB of a perticular authenticated User
    List.find({
        _userId: req.user_id
    }).then((lists) => {
        res.send(lists);
    })
})

app.post('/lists', authenticate, (req, res) => {
    // create a new list and return it 
    let title = req.body.title;
    let newList = new List({
        title: title,
        _userId: req.user_id
    })
    newList.save().then((listDoc) => {
        res.send(listDoc);
    })
})

app.patch('/lists/:id', authenticate, (req, res) => {
    // Update a specific list 
    List.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.sendStatus(200)
    })
})

app.delete('/lists/:id', authenticate, (req, res) => {
    // Delete a specific list
    List.findOneAndDelete({ _id: req.params.id, _userId: req.user_id }).then((removedList) => {
        res.send(removedList);
        // Also Delete All the tasks in that lists 
        deleteTasksFromList(removedList._id)
    })
})

app.get('/lists/:listId/tasks', authenticate, (req, res) => {
    // Return all tasks of a specific list
    Task.find({
        _listId: req.params.listId
    }).then((tasks) => {
        res.send(tasks)
    })
})

app.post('/lists/:listId/tasks', authenticate, (req, res) => {
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canCreateTask) => {
        if (!canCreateTask) {
            res.sendStatus(404);
        }

        // Return all tasks of a specific list
        const newTask = new Task({
            title: req.body.title,
            _listId: req.params.listId
        });

        newTask.save().then((newTaskDoc) => {
            res.send(newTaskDoc)
        })

    })
})
app.patch('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {

    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canEditTask) => {
        if (!canEditTask) res.sendStatus(404);

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
    })

});

app.delete('/lists/:listId/tasks/:taskId', authenticate, (req, res) => {
    List.findOne({
        _id: req.params.listId,
        _userId: req.user_id
    }).then((list) => {
        if (list) {
            return true;
        }
        return false;
    }).then((canDeleteTask) => {
        if (!canDeleteTask) res.sendStatus(404);

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

// User routes
app.post('/users', (req, res) => {
    let body = req.body;
    let newUser = new User(body);
    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return { accessToken, refreshToken };
        })
    }).then((authTokens) => {
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser)
    }).catch((e) => {
        res.send(400).send(e);
    })
})

app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user
            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.get('/users/me/access-token', verifySession, (req, res) => {
    // The user is suthenticated and we have user_id and userObject
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    })
})


// Delete Task Method 
let deleteTasksFromList = (_listId) => {
    Task.deleteMany({
        _listId
    }).then(() => {
        console.log(_listId, 'Deleted');
    })
}


app.listen(3000, () => {
    console.log("The server is up and running at port 3000")
})