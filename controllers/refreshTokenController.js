// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) { this.users = data }
// }

const User = require('../model/User'); //now that we importd the user model, we can refresh the token etc..


const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    //const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();  //syntac becasue property name and value name are the same refreshToken

    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }