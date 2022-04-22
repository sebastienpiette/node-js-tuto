// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require('../model/User');

// const fsPromises = require('fs').promises;
// const path = require('path');

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // // Delete refreshToken in db
    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: '' };
    // usersDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // );

    //NEW 
    foundUser.refreshToken = ''; //reset it 
    const result = await foundUser.save(); //send the restult // save the changes back to the mongoDB document 
    console.log(result);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = { handleLogout }