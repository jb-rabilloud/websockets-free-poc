const express = require('express')
const socket = require('socket.io')

const app = express()

const NODE_PORT = 3010

const server = app.listen(NODE_PORT, () => {
    console.log(`listening on port ${NODE_PORT}` )
})

//Static files
app.use(express.static('public'))


//Socket setuo
const io = socket(server)

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id)

    socket.on('chat',(data) => {
        io.sockets.emit('chat', data)
    })

    socket.on('feedback',(data) => {
        socket.broadcast.emit('feedback', data)
    })
})