import { MongoClient } from 'mongodb'
import { Task, List, User } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const tasks: Task[] = [
  {
      id: 1,
      name: "Course project",
      description: "Course project fall 22",
      tags: [
          "course",
          "project",
          "fall22"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-12-31",
      priority: "high",
      pinned: true,
      list_id: 1
  },
  {
      id: 2,
      name: "Assignment 1",
      description: "Assignment 1 for fall 22",
      tags: [
          "assignment",
          "fall22"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-10-31",
      priority: "high",
      pinned: true,
      list_id: 1
  },
  {
      id: 3,
      name: "Buy groceries",
      description: "Buy groceries for the week",
      tags: [
          "groceries",
          "food"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-10-07",
      priority: "medium",
      pinned: false,
      list_id: 2
  },
  {
      id: 4,
      name: "Buy a new phone",
      description: "Buy a new phone",
      tags: [
          "phone",
          "electronics"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-10-07",
      priority: "high",
      pinned: false,
      list_id: 2
  },
  {
      id: 5,
      name: "Buy a new laptop",
      description: "Buy a new laptop",
      tags: [
          "laptop",
          "electronics"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-10-07",
      priority: "high",
      pinned: false,
      list_id: 2
  },
  {
      id: 6,
      "name": "Buy a new car",
      description: "Buy a new car",
      tags: [
          "car",
          "transportation"
      ],
      status: "in progress",
      start_date: "",
      due_date: "",
      priority: "high",
      pinned: false,
      list_id: 2
  },
  {
      id: 7,
      name: "Buy a new house",
      description: "Buy a new house",
      tags: [
          "house",
          "real estate"
      ],
      status: "in progress",
      start_date: "2021-10-01",
      due_date: "2021-10-07",
      priority: "high",
      pinned: false,
      list_id: 2
  }
]

const lists: List[] = [
  {
      id: 1,
      name: "School",
      owner: "johndoe"
  },
  {
      id: 2,
      name: "Work",
      owner: "johndoe"
  },
  {
      id: 3,
      name: "Home",
      owner: "janedoe"
  }
]

const users: User[] = [
  {
      _id: "johndoe",
      name: "John Doe",
      sub: "87db1582-21a6-427b-b963-45ccfe2fde4d",
      preferred_username: "johndoe",
      given_name: "John",
      family_name: "Doe",
      email: "johndoe@duke.edu",
      email_verified: false,
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

  // set up unique index for upsert
  db.collection("tasks").createIndex(
    { id: 1 }, 
    { unique: true }
  )

  db.collection("lists").createIndex(
    { id: 1 }, 
    { unique: true }
  )

  // add data
  console.log("inserting tasks", await db.collection("tasks").insertMany(tasks as any))
  console.log("inserting lists", await db.collection("lists").insertMany(lists as any))
  console.log("inserting users", await db.collection("users").insertMany(users as any))
  console.log("inserting admins", await db.collection("admins").insertMany(admins as any))

  process.exit(0)
}

main()
