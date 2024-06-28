const { v4: uuidv4 } = require('uuid');

const groups = require('../models/groups');
const messages = require('../models/messages');
const users = require('../models/users');

const createNewConversation = async (groupId) => {

    const doc = await groups.findOne({ group_id: groupId })
        .populate({ path: 'messages', options: { sort: { createdAt: 1 } } });

    if (doc) {
        return doc.messages;
    }
}

const createNewMessage = async (sender, message, groupId) => {

    const newMessage = new messages({ sender, message });
    const messageId = newMessage._id;
    await newMessage.save();

    await groups.findOneAndUpdate({ group_id: groupId }, { $push: { messages: messageId } });
}

const searchQueryHandler = async (req, res) => {

    const searchQuery = req.query.searchQuery;
    if (searchQuery) {
        try {
            const results = await users.find({ username: { $regex: '^' + searchQuery, $options: 'i' } }, 'name username').limit(10);
            res.json({ searchResult: results });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    else {
        res.json({ searchResult: [] });
    }

}


const joinGroupHandler = async (req, res) => {
    try {
        const { groupId, username } = req.body;
        const group = await groups.findOne({ group_id: groupId });

        if (group) {

            if (group.join_requests.includes(username)) {
                res.status(201).json({ success: false, message: "Request already sent. Please wait for admin to respond..." });
            }
            else {
                group.join_requests.push(username);
                await group.save();

                res.status(200).json({ success: true });
            }
        }
        else {
            res.status(201).json({ success: false, message: "Invalid Code!" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }

}

const createGroupHandler = async (req, res) => {
    try {
        const { groupName, username } = req.body;

        const newGroup = new groups({

            group_id: uuidv4(),
            group_name: groupName,
            admin: username,
            participants: [username],
        });

        await newGroup.save();

        if (newGroup) {
            const { group_id, group_name } = newGroup;
            res.status(200).json({ success: true, group: { group_id, group_name } });
        }
        else {
            res.status(401).json({ success: false });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

const addParticipant = async (req, res) => {
    try {
        const { username, groupId } = req.body;
        const user = await users.findOne({ username: username }).exec();

        if (user) {
            const group = await groups.findOne({ group_id: groupId });

            if (group.participants.includes(username)) {
                res.status(200).json({ success: false, message: "Already a member!" });
            }
            else {
                group.participants.push(username);
                await group.save();
                res.status(200).json({ success: true });
            }
        }
        else {
            res.status(201).json({ success: false, message: "Invalid username!" });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

const groupDataHandler = async (req, res) => {
    try {
        const { group_id } = req.query;

        const groupDetails = await groups.findOne({ group_id: group_id }, '-messages').exec();

        if (groupDetails) {
            res.status(200).json({ success: true, groupDetails })
        }
        else {
            res.status(401).json({ success: false })
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

const joinRequestResponseHandler = async (req, res) => {
    try {
        const { group_id, acceptStatus, username } = req.query;

        const group = await groups.findOne({ group_id: group_id }, '-messages').exec();

        if (acceptStatus === 'true') {
            group.participants.push(username);
        }
        group.join_requests = group.join_requests.filter(user => user !== username);

        await group.save();
        res.status(200).json({ success: true, groupList: group });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

const leaveGroupHandler = async (req, res) => {
    try {
        const { group_id, username } = req.query;

        const group = await groups.findOne({ group_id: group_id }).exec();
        
        if (group.participants.length==1){
            await groups.findOneAndDelete({ group_id: group_id });
        }
        else{
            group.participants = group.participants.filter(user => user !== username);
            await group.save();
        }
        
        res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

module.exports = { createNewConversation, createNewMessage, searchQueryHandler, joinGroupHandler, createGroupHandler, addParticipant, groupDataHandler, joinRequestResponseHandler, leaveGroupHandler };