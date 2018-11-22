// const MongoClient = require("mongodb").MongoClient
const {MongoClient, ObjectID} = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser : true})
const obj = new ObjectID()

client.connect((err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.")
  }
  console.log("Connected to MongoDB server...")
  const db = client.db("TodoApp")

  // db.collection("Todos").insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log("Unable to insert todo. ", err)
  //   }

  //   console.log(result.ops[0]._id.getTimestamp())
  // })

  // db.collection("Users").insertOne({
  //   name: "Alexandre BEDOS",
  //   age: 30,
  //   location: "Paris"
  // }, (err, result) => {
  //   if (err) {
  //     return console.log("Unable to insert user. ", err)
  //   }

  //   console.log(result.ops)
  // })

  client.close()
})