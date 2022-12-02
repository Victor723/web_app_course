import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient } from 'mongodb'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { Issuer, Strategy } from 'openid-client'
import passport from 'passport'
import { keycloak } from "./secrets"
import { Task, List } from './data'

if (process.env.PROXY_KEYCLOAK_TO_LOCALHOST) {
  // NOTE: this is a hack to allow Keycloak to run from the 
  // same development machine as the rest of the app. We have exposed
  // Keycloak to run off port 8081 of localhost, where localhost is the
  // localhost of the underlying laptop, but localhost inside of the
  // server's Docker container is just the container, not the laptop.
  // The following line creates a reverse proxy to the Keycloak Docker
  // container so that localhost:8081 can also be used to access Keycloak.
  require("http-proxy").createProxyServer({ target: "http://keycloak:8080" }).listen(8081)
}

// set up Mongo
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(mongoUrl)
let db: Db
let tasks: Collection
let lists: Collection
let users: Collection
let admins: Collection

// set up Express
const app = express()
const port = parseInt(process.env.PORT) || 8095
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up session
app.use(session({
  secret: 'a just so-so secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  // comment out the following to default to a memory-based store, which,
  // of course, will not persist across load balanced servers
  // or survive a restart of the server
  store: MongoStore.create({
    mongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done: any) => {
  logger.info("serializeUser " + JSON.stringify(user))
  done(null, user)
})
passport.deserializeUser((user: any, done: any) => {
  logger.info("deserializeUser " + JSON.stringify(user))
  done(null, user)
})

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.sendStatus(401)
    return
  }

  next()
}

// logout
app.post(
  "/api/logout", 
  (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      res.redirect("/")
    })
  }
)

// GET current user
app.get("/api/user", (req, res) => {
  res.json(req.user || {})
})

// debug GETs
app.get("/api/hello", (req, res) => { 
  res.status(200).json({ message: "Hello, your username is detected as '" + req.user ? "NOT LOGGED IN" :  req.user.preferred_username + "'."})
})

app.get("/api/tasks", async (req, res) => {
  const tasks = await db.collection("tasks").find().toArray()
  res.status(200).json(tasks)
})

app.get("/api/lists", async (req, res) => {
  const lists = await db.collection("lists").find().toArray()
  res.status(200).json(lists)
})

app.get("/api/user_lists", checkAuthenticated, async (req, res) => {
  const user_lists = await db.collection("lists").find({ owner: req.user.preferred_username }).toArray()
  const updated_lists = user_lists.map(list => {
    const updated_list = Object.assign({}, list, { items: db.collection("tasks").find({ list_id: list._id }).toArray() })
    return updated_list
  })
  res.status(200).json(updated_lists)
})

// Create a new list for the current user
app.post("/api/create_list", checkAuthenticated, async (req, res) => {
  const name = req.body.name
  const existingList = await db.collection("lists").findOne({ name: name, owner: req.user.preferred_username })
  if (existingList) {
    return res.status(400).json({ error: "A list with the given name already exists" })
  }
  const list = await db.collection("lists").insertOne({ name: name, owner: req.user.preferred_username })
  
  // const res = list.map(list => {
  //   const updated_list = Object.assign({}, list, { items: db.collection("tasks").find({ list_id: list._id }).toArray() })
  //   return updated_list
  // })
  res.status(200).json(list)
})

// connect to Mongo
client.connect().then(() => {
  logger.info('connected successfully to MongoDB')
  db = client.db("getitdone")
  tasks = db.collection("tasks")
  lists = db.collection("lists")
  users = db.collection("users")
  admins = db.collection("admins")

  Issuer.discover("http://127.0.0.1:8081/auth/realms/getitdone/.well-known/openid-configuration").then(issuer => {
    const client = new issuer.Client(keycloak)
  
    passport.use("oidc", new Strategy(
      { 
        client,
        params: {
          // this forces a fresh login screen every time
          prompt: "login"
        }
      },
      async (tokenSet: any, userInfo: any, done: any) => {
        logger.info("oidc " + JSON.stringify(userInfo))

        const _id = userInfo.preferred_username
        const admin = await admins.findOne({ _id })
        if (admin != null) {
          userInfo.roles = ["admin"]
        } else {
          await users.updateOne(
            { _id },
            {
              $set: {
                name: userInfo.name
              }
            },
            { upsert: true }
          )
          userInfo.roles = ["user"]
        }

        return done(null, userInfo)
      }
    ))

    app.get(
      "/api/login", 
      passport.authenticate("oidc", { failureRedirect: "/api/login" }), 
      (req, res) => res.redirect("/")
    )
    
    app.get(
      "/api/login-callback",
      passport.authenticate("oidc", {
        successRedirect: "/",
        failureRedirect: "/api/login",
      })
    )    

    // start server
    app.listen(port, () => {
      logger.info(`GetItDone server listening on port ${port}`)
    })
  })
})
