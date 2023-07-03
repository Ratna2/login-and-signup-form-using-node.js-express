const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")
const { name } = require("ejs")


function initialize(passport, getUserByUsername, getUserById){
    // Function to authenticate users
    const authenticateUsers = async (username, password, done) => {
        // Get users by email
        const user = getUserByUsername(username)
        if (user == null){
            return done(null, false, {message: "No user found with that name"})
        }
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done (null, false, {message: "Password Incorrect"})
            }
        } catch (e) {
            console.log(e);
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUsers))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize