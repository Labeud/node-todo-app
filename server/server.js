require("./config/config.js")

const express = require("express")
const _ = require("lodash")
const bodyParser = require("body-parser")
const {ObjectId} = require("mongodb")
const {mongoose} = require("./db/mongoose")

const {User} = require("./models/user")
const {Todo} = require("./models/todo")
const {authenticate} = require("./middleware/authenticate")

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post("/todos", authenticate, (req, res) => {
  let todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })

  todo
    .save()
    .then((todo) => {
      res.status(200).send(todo)
    })
    .catch((e) => {
      res.status(400).send(e)
    })

})

app.get("/todos", authenticate, (req, res) => {

  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({todos})
  }).catch((err) => {
    res.status(400).send({err})
  })
})

app.get("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send()
    })
})

app.delete("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
    })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send()
      }
      res.send({todo})
    })
    .catch((e) => {
      res.status(400).send()
    })
})

app.patch("/todos/:id", authenticate, (req, res) => {
  const id = req.params.id
  const body = _.pick(req.body, ["text", "completed"])
  

  if (!ObjectId.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      return res.status(404).send()
    }
    res.send({todo})
  }).catch((e) => {
    res.status(400).send()
  })
})

app.post("/users", (req, res) => {
  const body = _.pick(req.body, ["email", "password"])
  const user = new User(body)

  user
    .save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then((token) => {
      res.status(200).header("x-auth", token).send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
})

app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user)
})

app.post("/users/login", (req, res) => {
  const body = _.pick(req.body, ["email", "password"])

  User
    .findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken().then((token) => {
        res.status(200).header("x-auth", token).send(user)
      })
    })
    .catch((err) => {
      res.status(400).send(err)
    })
})

app.delete("/users/me/token", authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send()
    })
    .catch(() => {
      res.status(400).send()
    })
})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

module.exports = {app}