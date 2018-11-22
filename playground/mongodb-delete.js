const {MongoClient, ObjectID} = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser : true})

client.connect((err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.")
  }
  console.log("Connected to MongoDB server...")
  const db = client.db("TodoApp")

  db.collection("Todos").deleteMany({text: "Something to do"}).then((result) => {
    console.log(result)
  })

  // deleteOne

  // findOneAndDelete

})