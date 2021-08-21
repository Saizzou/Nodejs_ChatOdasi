const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
// Utils .js dosyalarimiz:
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// PORT düzenleme
const PORT = 3000 || process.env.PORT;

//Sabit(Statik) dosya atanimi
app.use(express.static(path.join(__dirname, 'public')));


// Admin adi:
const admin = 'Devilz';

//client baglantisinda calistirma:
io.on('connection', socket =>{
    socket.on('odayakatil',({username,room}) =>{
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


        //Bir kullanici baglandiginda Client Console gidecek log:
        socket.emit('message', formatMessage(admin,`${username}, ${user.room} odasina katildi`));

        //Bir kullanici baglandiginda Client haric diger herkese gidecek olan log:
        socket.broadcast.to(user.room).emit(
            'message', formatMessage(admin, `${username} odaya katildi`)
            );
        
        // Kullanici ve oda bilgisini gönder
        io.to(user.room).emit(
            'roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Yeni chatMessage dinlemesi:
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
        //console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });

    //Bir kullanici cikis yaptiginda log:
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);

        if(user){
            io.to(user.room).emit(
                'message', formatMessage(admin,`${user.username} odadan ayrildi!`)
                );
        
            // Kullanici ve oda bilgisini gönder
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

        }
    });
});

server.listen(PORT, () => console.log(`Server ${PORT} üzerinde aktiv durumda!`));