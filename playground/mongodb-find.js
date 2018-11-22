const {MongoClient, ObjectID} = require("mongodb")

const client = new MongoClient("mongodb://localhost:27017", {useNewUrlParser : true})

client.connect((err, client) => {
  if (err) {
    return console.log("Unable to connect to MongoDB server.")
  }
  console.log("Connected to MongoDB server...")
  const db = client.db("TodoApp")

  // db.collection("Todos").find({
  //   _id: new ObjectID("5bf58c03a9017e0728d1fab3")
  // }).toArray().then((docs) => {
  //   console.log("Todos:")
  //   console.log(docs)
  // }, (err) => {
  //   console.log("Unable to fetch documents.", err)
  // })

  db.collection("Todos").find({
    _id: new ObjectID("5bf58c03a9017e0728d1fab3")
  }).count().then((count) => {
    console.log(`Todos count: ${count}`)
  }, (err) => {
    console.log("Unable to fetch documents.", err)
  })

  // client.close()
})