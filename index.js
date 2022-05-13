const dotenv = require("dotenv").config()
const passport = require("passport")
const twitterStrategy = require("passport-twitter").Strategy
const githubStrategy = require("passport-github2").Strategy
const discordStrategy = require("passport-discord").Strategy
const express = require("express")
const session = require('express-session')
const cors = require("cors")
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.ENVIRONMENT === "production" ? true : false
    }
}))

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    credentials: true
}))

// Passport.js Config

    // Twitter
passport.use(new twitterStrategy({
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SECRET,
    callbackURL: "http://localhost:5000/twitter/callback"
}, (token, tokenSecret, profile, callback) => {
    // Add user to DB
    return callback(null, profile)
}))

    // Github
passport.use(new githubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/github/callback"
}, (token, tokenSecret, profile, callback) => {
    return callback(null, profile)
}))


    // Discord
passport.use(new discordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/discord/callback",
    scope: ["identify", "email", "guilds"]
}, (token, tokenSecret, profile, callback) => {
    return callback(null, profile)
}))


passport.serializeUser((user, callback) => callback(null, user))
passport.deserializeUser((user, callback) => callback(null, user))
app.use(passport.initialize())
app.use(passport.session())

// Routes for Twitter

app.get("/twitter", passport.authenticate("twitter"))

app.get("/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/twitter/error" }), (req, res) => {
    // const user = { id: req.user.id, username: req.user.username, displayName: req.user.displayName }
    console.log(req.user._json)
    if (req.user.verifed) {
        console.log("USER IS VERIFIED")
    }
    else {
        console.log("USER IS NOT VERIFIED")
    }
    // Sucessfull authentication, redirect to the Home Page
    res.redirect("http://localhost:3000/login/success")
})

app.get("/twitter/error", (req, res) => {
    res.status(502).json({ message: "Authentication Error" })
})

// Routes for Gitub 

app.get("/github", passport.authenticate("github", { scope: ["read:user"]}))

app.get("/github/callback", passport.authenticate("github", { failureRedirect: "/github/error"}), (req, res) => {
    console.log(req.user._json)

    res.redirect("http://localhost:3000/login/success")
})


app.get("/github/error", (req, res) => {
    res.status(502).json({ message: "Authentication Error" })
})


// Routes for Discord
app.get("/discord", passport.authenticate("discord"))
app.get("/discord/callback", passport.authenticate("discord", { failureRedirect: "/discord/error"}), (req, res) => {
    console.log(req.user)

    
    res.redirect("http://localhost:3000/login/success")
})

app.get("/discord/error", (req, res) => {
    res.status(502).json({ message: "Authentication Error" })
})

// Common route

app.get("/", (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "successful",
            user: req.user,
            cookies: req.cookies
        })
    }
    
})


app.get("/logout", (req, res) => {
    console.log("Logging out")
    req.logOut()
    res.redirect("http://localhost:3000/")
})

app.listen(PORT, () => console.log("Server listening on port " + PORT))