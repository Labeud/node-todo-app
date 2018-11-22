const {MongoClient, ObjectID} = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser : true})

client.connect((err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.")
  }
  console.log("Connected to MongoDB server...")
  const db = client.db("TodoApp")

  db.collection("Todos").findOneAndUpdate({
    _id: new ObjectID("5bf6715514bf1f4cbb0d5f07")
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result)
  })

  // deleteOne

  // findOneAndDelete

})