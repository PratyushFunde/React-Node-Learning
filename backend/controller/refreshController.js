const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
require('dotenv').config();
const fsPromises=require('fs').promises;
const path=require('path');

exports.handleRefresh=async(req,res)=>{
     const {user,password}=req.body;
    
        const usersDB = {
            users: require("../model/users.json"),
            setUsers: function (data) {
                this.users = data;
            }
        }
    
        if (!user || !password) {
            res.status(400).json({ 'message': "Username and password are required !" });
        }
    
        const foundeUser=usersDB.users.find(person=>person.username===user);
    
        if(!foundeUser)
        {
            res.sendStatus(401);
        }
    
        // Found the user now check the DB
    
        // const match = await bcrypt.compare(password,foundeUser.password);
    
        if(match)
        {
            //Create JWT here
            const accessToken=jwt.sign(
                {"username":foundeUser.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'10s'}
            );
    
            const refreshToken=jwt.sign(
                {"username":foundeUser.username},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            );
    
            // Writing DB with refresh token to the current user
            const otherUsers=usersDB.users.filter(person=>person.username !==foundeUser.username)
    
            const currentUser={...foundeUser,refreshToken};
    
            usersDB.setUsers([...otherUsers,currentUser]);
    
            await fsPromises.writeFile(
                path.join(__dirname,"..",'model','users.json'),
                JSON.stringify(usersDB.users)
            )
            res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000});
    
            res.json({accessToken})
        }
        else{
            res.sendStatus(401);
        }
}