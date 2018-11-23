const express = require("express")
const bodyParser = require("body-parser")

const {mongoose} = require("./db/mongoose")
const {User} = require("./models/user")
const {Todo} = require("./models/todo")

const app = express()
const port = 3000

app.use(bodyParser.json())

app.post("/todos", (req, res) => {
  let todo = new Todo(req.body)

  todo
    .save()
    .then((todo) => {
      res.status(200).send(todo)
    })
    .catch((e) => {
      res.status(400).send(e)
    })

})

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})

module.exports = { app }