const bcrypt= require('bcrypt');

const users = require('../models/users');

const loginController = async (req, res) => {
    const { username, password } = req.body;
    try {

        const user = await users.findOne({username:username});
        if (user) {
            const resObj= {'name': user.name,'username': user.username};
            console.log("authenticted");
            await bcrypt.compare(password, user.password) ? 
                res.json({ user: resObj, success: true, message: "Logged in successfully" }) : 
                res.json({ success: false, message: "Incorrect Password" });
        }

        else res.json({ success: false, message: "User does not exist" });

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }

}

const registerController = async (req, res) => {
    console.log("registration api hit");
    const { name, username, password } = req.body;
    try {
        const user = await users.findOne({username:username});
        if (!user) {
            const encryptedPassword=await bcrypt.hash(password,10);

            const newUser = new users({ name, username, password: encryptedPassword });
            await newUser.save();

            console.log("New user created.");

            res.json({ success: true, message: "Registered successfully" });
        }
        else {
            res.json({ success: false, message: "Email already in use" });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }

}

module.exports = {loginController, registerController};