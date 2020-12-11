const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();



// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerHTML = message.username + " ";
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  switch (room) {
    case "Homework":
      roomName.innerHTML = "<i class='fas fa-book-open'></i> " + room;
      break;
    case "Programming":
    case "WEEBCHAT Development":
      roomName.innerHTML = "<i class='fas fa-code'></i> " + room;
      break;
    case "Games":
      roomName.innerHTML = "<i class='fas fa-gamepad'></i> " + room;
      break;
    case "Hanging Out":
      roomName.innerHTML = "<i class='fas fa-comment-dots'></i> " + room;
      break;
    case "Anime":
      roomName.innerHTML = "<i class='fas fa-tv'></i> " + room;
      break;
    default:
      roomName.innerText = room;
  }
  document.title = room + " | WEEBCHAT"
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }

// Change css theme
function switch_style(css) {
  document.getElementById("theme").href = "css/" + css + ".css";
}
