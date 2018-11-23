const {ObjectId} = require("mongodb")
const {mongoose} = require("../server/db/mongoose")
const {Todo} = require("../server/models/todo")

const id = "5bf7c8176bb24e2e443fe42f"

if (ObjectId.isValid(id)) {
  console.log("Id is not valid")
}

// Returns an array full or empty
Todo.find({
  _id: id
}).then((todos) => {
  console.log("Todos:", todos)
})

// Return a single dcocument or null
Todo.findOne({
  _id: id
}).then((todo) => {
  console.log("Todo:", todo)
})

Todo.findById(id)
  .then((todo) => {
  if (!todo) {
    return console.log("ID not found")
  }
  console.log("Todo by ID:", todo)
})
  .catch(e => console.log(e))