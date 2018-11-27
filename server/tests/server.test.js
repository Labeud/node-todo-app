const expect = require("expect")
const request = require("supertest")
const {ObjectId} = require("mongodb")

const {app} = require("../server") 
const {Todo} = require("../models/todo")

const todos = [{
  _id: new ObjectId(),
  text: "First test"
}, {
  _id: new ObjectId(),
  text: "Second test",
  completed: true,
  completedAt: 1000
}]

beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos).then(() => done())
  })

})

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