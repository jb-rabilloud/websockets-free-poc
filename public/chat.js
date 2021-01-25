//Make connection
const socket = io.connect("http://localhost:3000")

//Query DOM
const message = document.getElementById('message')
const handle = document.getElementById('handle')
const button = document.getElementById('send')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')

let activeUsers = []
let typingTimer
let doneTypingInterval = 2000

const addActiveUser = (name) => {
    const timestamp = new Date().getTime()
    activeUsers = [...activeUsers, { name: name, activeTimestamp: timestamp }]
    feedback.innerHTML += '<div id="' +  name  +  '"><p><em>' + name + ' is typing...</em></p></div>'
}

const removeInactiveUser = (name) => {
    activeUsers = activeUsers.filter(user => {
        const shouldBeRemoved = (user.name === name)
        if (shouldBeRemoved) {
            const userToRemove = document.getElementById(name)
            userToRemove.remove()
        }
        return !shouldBeRemoved
    })   
}

const doneTyping = () => {
    socket.emit('feedback', {
        isTyping: false,
        handle: handle.value
    })
}

//Emit events
button.addEventListener('click', () => {
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    })
})

message.addEventListener('keyup', () => {
    clearTimeout(typingTimer)
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
})

message.addEventListener('keypress', () => {
    clearTimeout(typingTimer)
    socket.emit('feedback', {
        isTyping: true,
        handle: handle.value
    })
})

//Listen for events 
socket.on('chat', (data) => {
    output.innerHTML += '<p><strong>' + data.handle + ':</strong>' + data.message + '</p>'
})



socket.on('feedback', (data) => {
    console.log(data)
    const userName = data.handle
    if (data.isTyping) {
        const oldUser = activeUsers.filter(user => user.name === userName)
        if (oldUser.length === 0) {
            addActiveUser(userName)
        }
    } else {
        removeInactiveUser(userName)
    }
})