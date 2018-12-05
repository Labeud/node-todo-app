const expect = require("expect")
const request = require("supertest")
const {ObjectId} = require("mongodb")

const {app} = require("../server") 
const {Todo} = require("../models/todo")
const {User} = require("../models/user")
const {todos, populateTodos, users, populateUsers} = require("./seed/seed")

beforeEach(populateUsers)
beforeEach(populateTodos)

describe("POST /todos", () => {

  it("should create a new todo", (done) => {
    const text = "Test"
    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        } else {
          Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1)
            expect(todos[0].text).toBe(text)
            done()
          }).catch((e) => done(e))
        }
      })
  })

  it("should not create todo with invalid data", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err)
        } else {
          Todo.find().then((todos) => {
            expect(todos.length).toBe(2)
            done()
          }).catch((e) => done(e))
        }
      })
  })
})

describe("GET /todos", () => {

  it("should get all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
  })
})

describe("GET /todos/:id", () => {
  it("should return todo doc", (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  })

  it("should return a 404 if todo not found", (done) => {
    const testId = new ObjectId()
    request(app)
      .get(`/todos/${testId.toHexString()}`)
      .expect(404)
      .end(done)
  })

  it("should return a 404 for non-object ids", (done) => {
    request(app)
      .get(`/todos/123abc`)
      .expect(404)
      .end(done)
  })
})

describe("DELETE /todos/:id", () => {
  it("should remove a todo", (done) => {
    const hexId = todos[0]._id.toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeNull()
          done()
        }).catch((err) => done(err))
      })

  })

  it("should return 404 if todo not found", (done) => {
    const hexId = new ObjectId().toHexString()
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  })

  it("should return 404 if object id is invalid", (done) => {
    request(app)
      .delete("/todos/123abc")
      .expect(404)
      .end(done)
  })
})

describe("PATCH todos/:id", () => {
  it("should update the todo", (done) => {
    const hexId = todos[0]._id.toHexString()
    const update = {
      text: "This is from the test",
      completed: true
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(update)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(update.text)
        expect(res.body.todo.completed).toBe(true)
        expect(res.body.todo.completedAt).not.toBeNull()
      })
      .end(done)
  })
  
  it("should clear completedAt when todo is not completed", (done) => {
    const hexId = todos[0]._id.toHexString()
    const update = {
      text: "This is from the test!!",
      completed: false
    }

    request(app)
      .patch(`/todos/${hexId}`)
      .send(update)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(update.text)
        expect(res.body.todo.completed).toBe(false)
        expect(res.body.todo.completedAt).toBeNull()
      })
      .end(done)

  })
})

describe("GET /users/me", () => {
  it("should return user if authenticated", (done) => {
    request(app)
      .get("/users/me")
      .set("x-auth", users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done)
  })

  it("should return 401 if not authenticated", (done) => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
})

describe("POST /users", () => {
  it("should create a user", (done) => {
    const email = "test@test.com"
    const password = "123jklkshd"

    request(app)
      .post("/users")
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers["x-auth"]).toBeDefined()
        expect(res.body.email).toBe(email)
        expect(res.body._id).toBeDefined()
      })
      .end((err) => {
        if (err) {
          return done(err)
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeDefined()
          expect(user.password).not.toBe(password)
          done()
        })
      })
  })

  it("should return validation errors if request invalid", (done) => {
    const email = "test"
    const password = "123"

    request(app)
      .post("/users")
      .send({email, password})
      .expect(400)
      .end(done)
    
  })

  it("should not cretae user if email in use", (done) => {
    const email = users[0].email

    request(app)
      .post("/users")
      .send({email, password: "blabla234"})
      .expect(400)
      .end(done)
  })
})