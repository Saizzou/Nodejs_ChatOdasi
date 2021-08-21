const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const chatMessages = document.querySelector('.chat-messages');

// Kullanici adi ve oda bilgisini qs ile (chat.htmlde bulunur) alma:
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
const socket = io();

// Odaya Katilim:
socket.emit('odayakatil', { username, room});

// Oda ve Kullanici Bilgisi
socket.on('roomUsers', ({room, users})=> {
    outputRoomName(room),
    outputUsers(users);
});

socket.on('message', message=>{
    console.log(message);
    outputMessage(message);

    //Daima Asagi kaydir
    chatMessages.scrollTop = chatMessages.scrollHeight;
});


//Mesajlarin gönderimi
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    //Gönderilen mesajlari yakala
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }
    
    // Mesajlari servere gönder:
    socket.emit('chatMessage', msg);

    // Text kismini bosalt:
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//Mesajlarin sitede yayinlamasi
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Oda Bilgisinin sitede yayinlanmasi
function outputRoomName(room){
    roomName.innerText = room;
}

// Kullanicilarin sitede yayinlanmasi
function outputUsers(users){
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Cikmak istediginizden emin misiniz?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});