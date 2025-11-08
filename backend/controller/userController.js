
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');
const { decode } = require('querystring');

exports.test = async (req, res) => {
    res.status(200).json({ "message": "User route is working !" })
}

exports.registerUser = async (req, res) => {
    const usersDB = {
        users: require("../model/users.json"),
        setUsers: function (data) {
            this.users = data;
        }
    }

    const fsPromises = require("fs").promises;
    const path = require('path');


    const { user, password } = req.body;
    console.log(user, password)

    if (!user || !password) {
        res.status(400).json({ 'message': "Username and password are required !" });
    }

    const duplicate = usersDB.users.find(person => person.username === user);

    if (duplicate) {
        return res.sendStatus(409);
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            "username": user,
            "roles":{"User":2001},
            "password": hashedPassword,
        };

        usersDB.setUsers([...usersDB.users, newUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", 'users.json'),
            JSON.stringify(usersDB.users)
        )

        console.log(usersDB.users);
        res.status(201).json({ message: `New user created ${user} ` })

    } catch (err) {
        console.log("Error in registering user ", err)
        res.status(500).json({ message: err.message })
    }

}

exports.login = async (req, res) => {

    const { user, password } = req.body;

    const usersDB = {
        users: require("../model/users.json"),
        setUsers: function (data) {
            this.users = data;
        }
    }

    if (!user || !password) {
        res.status(400).json({ 'message': "Username and password are required !" });
    }

    const foundeUser = usersDB.users.find(person => person.username === user);

    if (!foundeUser) {
        res.sendStatus(401);
    }

    // Found the user now check the DB

    const match = await bcrypt.compare(password, foundeUser.password);

    if (match) {
        const roles=Object.values(foundeUser.roles);
        //Create JWT here
        const accessToken = jwt.sign(
            { UserInfo:{
                "username": foundeUser.username,
                "roles":roles
            } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { "username": foundeUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Writing DB with refresh token to the current user
        const otherUsers = usersDB.users.filter(person => person.username !== foundeUser.username)

        const currentUser = { ...foundeUser, refreshToken };

        usersDB.setUsers([...otherUsers, currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname, "..", 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )

        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        res.json({ accessToken })
    }
    else {
        res.sendStatus(401);
    }

}

exports.handleRefreshToken = (req, res) => {

    const cookies = req.cookies;

    const usersDB = {
        users: require("../model/users.json"),
        setUsers: function (data) {
            this.users = data;
        }
    }

    if (!cookies?.jwt) {
        res.sendStatusstatus(401).json({ 'message': "Cookie.jwt required" });
    }

    console.log("Jwt in cookies", cookies.jwt);
    const recievedRefreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === recievedRefreshToken);

    if (!foundUser) return res.sendStatus(403); // Invalid refresh cookie

    jwt.verify(
        recievedRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

            const roles=Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { UserInfo:{
                    "username": decoded.username,
                    "roles":roles
                } },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );

            res.json({ accessToken })
        }
    )

}

exports.getData = async (req, res) => {
    res.status(200).json({ "message": "This is the data from database " })
}

exports.editData=async(req,res)=>{
    res.status(201).json({"message":"Edited successfylly !"});
}

exports.deleteData=async(req,res)=>{
    res.status(201).json({"message":"Data deleted successfully !"});
}