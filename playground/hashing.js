const {SHA256} = require("crypto-js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const password = "123abc"

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash)
//   })
// })

const hashedPassword = "$2a$10$yaZD0sgnyxzaxTt0zLTU/u/c5gxS5y3E230ATDdOeP/yC9wtmMww."

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res)
})


// const data = {
//   id: 10
// }

// const token = jwt.sign(data, "somesecret")
// console.log(token)

// const decoded = jwt.verify(token, "somesecret")
// console.log(decoded)

// jwt.sign
// jwt.verify

// const message = "I am user 256"
// const hash = SHA256(message).toString()

// console.log(hash)

// const data = {
//   id: 4
// }
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "somesecret").toString()
// }

// const resultHash = SHA256(JSON.stringify(token.data) + "somesecret").toString()

// if (resultHash === token.hash) {
//   console.log("Data was not changed")
// } else {
//   console.log("Data was not changed. Do not trust!")
// }