const {ObjectId} = require("mongodb")
const jwt = require("jsonwebtoken")

const {Todo} = require("./../../models/todo")
const {User} = require("./../../models/user")

const todos = [{
  _id: new ObjectId(),
  text: "First test"
}, {
  _id: new ObjectId(),
  text: "Second test",
  completed: true,
  completedAt: 1000
}]

const userOneId = new ObjectId()
const userTwoId = new ObjectId()
const users = [{
  _id: userOneId,
  email: "alex@teubout.com",
  password: "userOnePass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: userOneId, access: "auth"}, "abc123").toString()
  }]
}, {
  _id: userTwoId,
  email: "alexb@teubin.com",
  password: "blablabla"

}]

const populateTodos = (done) => {
  Todo
    .deleteMany({})
    .then(() => {
      return Todo.insertMany(todos)
    })
    .then(() => done())
}

const populateUsers = (done) => {
  User
    .deleteMany({})
    .then(() => {
      const userOne = new User(users[0]).save()
      const userTwo = new User(users[1]).save()

      return Promise.all([userOne, userTwo])
    })
    .then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}