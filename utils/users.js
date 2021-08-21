const users = [];

// Kullanici Chat Katilim bilgisi
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);
    return user;
}

// Get Kullanici Id
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

// Kullanici cikis bilgisi
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1){
        return users.splice(index, 1)[0];
    }
}

// Get Oda kullanicilari
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};