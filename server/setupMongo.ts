import { MongoClient } from 'mongodb'
import { Task, List, User } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const tasks: Task[] = [
  {
      name: "Course project",
      description: "Course project fall 22",
      tags: [
          "course",
          "project",
          "fall22"
      ],
      status: "in progress",
      startDate: "2021-10-01",
      dueDate: "2021-12-31",
      priority: "high",
      pinned: false,
      list_id: 1,
      owner: "jd"
  }
]

const lists: List[] = [
  {
      name: "School",
      owner: "admin"
  },
  {
      name: "Work",
      owner: "admin"
  },
  {
      name: "Home",
      owner: "admin"
  },
  {
      name: "Test",
      owner: "admin"
  }
]

const users: Partial<User>[] = [
  {
      _id: "jd",
      name: "John Doe",
  }
]

const admins: User[] = [
  {
    _id: "admin",
    name: "Admin",
    sub: "87db1582-22a6-427b-b963-45ccfe2fde4d",
    preferred_username: "admin",
    given_name: "Admin",
    family_name: "Admin",
    email: "admin@duke.edu",
    email_verified: false,
  }
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("getitdone")

  // drop existing collections
  if (await db.listCollections({ name: "tasks" }).hasNext()) {
    console.log("dropping old tasks", await db.dropCollection("tasks"))
  }
  if (await db.listCollections({ name: "lists" }).hasNext()) {
    console.log("dropping old lists", await db.dropCollection("lists"))
  }
  if (await db.listCollections({ name: "users" }).hasNext()) {
    console.log("dropping old users", await db.dropCollection("users"))
  }
  if (await db.listCollections({ name: "admins" }).hasNext()) {
    console.log("dropping old admins", await db.dropCollection("admins"))
  }

  // add data
  console.log("inserting tasks", await db.collection("tasks").insertMany(tasks as any))
  console.log("inserting lists", await db.collection("lists").insertMany(lists as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))
  console.log("inserting admins", await db.collection("admins").insertMany(admins as any))

  process.exit(0)
}

main()
