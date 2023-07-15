const express = require('express');
const db = require('./db');
const path = require('path');
const socket = require('socket.io');


const app = express();


app.use(express.static(path.join(__dirname, '/client')));


app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
});

const server = app.listen(8000, () => {
    console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {

    io.to(socket.id).emit('updateData', db.tasks);

    socket.on('addTask', (task) => {
        console.log('tasksBefore: ', db.tasks);
        db.tasks.push(task);
        console.log('tasks: ', db.tasks);
        console.log('ta: ', task);
        socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', (id) => {
        for (let task of db.tasks) {
            if(task.id === id) {
                const index = db.tasks.indexOf(task);
                db.tasks.splice(index, 1);
                socket.broadcast.emit('removeTask', id);
            }
        }
        console.log('tasks: ', db.tasks);
    })
});
