const { getMessages, createNewMessage } = require('./chatController');
const groups = require('../models/groups');

const onlineUsers = [];

const setUserId = (io,socket) => {
    const username = socket.user;
    onlineUsers.push({username,socketId:socket.id});                               // add connected user to online list
    const onlineUsersList = onlineUsers.map(user => user.username);
    console.log(onlineUsersList);                                               
    io.emit('online-users', onlineUsersList);                           // emit the updated list of online users to all other users.
}

const getUsers = async (username, cb) => {
    try {
        const lists = await groups.find(
            { participants: { $all: [username] } })              // Select all records with username as a participant
            .sort({updatedAt:-1})                                // returns array of groups names.     
               
        const groupList = lists.map( rec => ({ group_name: rec.group_name, group_id: rec.group_id }) );
        cb(groupList);

    } catch (error) {
        console.log(error);
    }
}

const handleConnectionRequest = async ( groupId, cb, socket) => {

    try {
        const chat = await getMessages( groupId);            // new conversation created            
        cb(chat);
        socket.join(groupId);
    } catch (error) {
        console.log(error);
    }

}

const handleSendMessageEvent = async (msg, sender, groupId, io) => {
    console.log("message received on server: " + msg);
    try {
        io.to(groupId).emit('receive-msg', msg, sender, groupId);
        await createNewMessage(sender, msg, groupId);

    } catch (error) {
        console.log(error);
    }

};

const disconnectionHandler = ( io, socket)=>{
    console.log(`${socket.id} disconnected. ${socket.user} is offline now.`);

    const index = onlineUsers.findIndex(user => user.socketId === socket.id)           // on disconnection, delete the record off the list.
    onlineUsers.splice(index,1);

    const onlineUsersList = onlineUsers.map(user => user.username);

    io.emit('online-users', onlineUsersList);
}

module.exports = { handleConnectionRequest, handleSendMessageEvent, setUserId, getUsers, disconnectionHandler };
