import { MongoClient, ObjectId } from 'mongodb'
import { Task, List, User } from './data'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

const tasks: Task[] = [
  {
      "id": 1,
      "name": "Course project",
      "description": "Course project fall 22",
      "tags": [
          "course",
          "project",
          "fall22"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-12-31",
      "priority": "high",
      "pinned": true,
      "list_id": 1
  },
  {
      "id": 2,
      "name": "Assignment 1",
      "description": "Assignment 1 for fall 22",
      "tags": [
          "assignment",
          "fall22"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-10-31",
      "priority": "high",
      "pinned": true,
      "list_id": 1
  },
  {
      "id": 3,
      "name": "Buy groceries",
      "description": "Buy groceries for the week",
      "tags": [
          "groceries",
          "food"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-10-07",
      "priority": "medium",
      "pinned": false,
      "list_id": 2
  },
  {
      "id": 4,
      "name": "Buy a new phone",
      "description": "Buy a new phone",
      "tags": [
          "phone",
          "electronics"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-10-07",
      "priority": "high",
      "pinned": false,
      "list_id": 2
  },
  {
      "id": 5,
      "name": "Buy a new laptop",
      "description": "Buy a new laptop",
      "tags": [
          "laptop",
          "electronics"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-10-07",
      "priority": "high",
      "pinned": false,
      "list_id": 2
  },
  {
      "id": 6,
      "name": "Buy a new car",
      "description": "Buy a new car",
      "tags": [
          "car",
          "transportation"
      ],
      "status": "in progress",
      "start_date": "",
      "due_date": "",
      "priority": "high",
      "pinned": false,
      "list_id": 2
  },
  {
      "id": 7,
      "name": "Buy a new house",
      "description": "Buy a new house",
      "tags": [
          "house",
          "real estate"
      ],
      "status": "in progress",
      "start_date": "2021-10-01",
      "due_date": "2021-10-07",
      "priority": "high",
      "pinned": false,
      "list_id": 2
  }
]

const lists: List[] = [
  {
      "id": 1,
      "name": "School",
      "owner_id": "5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b"
  },
  {
      "id": 2,
      "name": "Work",
      "owner_id": "5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b"
  },
  {
      "id": 3,
      "name": "Home",
      "owner_id": "5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b"
  }
]

const users: User[] = [
  {
      "id": "5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "email": "johnd@duke.edu",
      "password": "password"
  },
  {
      "id": "5c9c5b5b-5c9c5b6b-5c9c5b5b-5c9c5b5b-5c9c5b5b",
      "first_name": "Jane",
      "last_name": "Doe",
      "username": "janedoe",
      "email": "janed@duke.edu",
      "password": "password"
  }
]

const admins: User[] = [
    {
        "id": "5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5b-5c9c5b5f",
        "first_name": "Admin",
        "last_name": "Admin",
        "username": "admin",
        "email": "admin@duke.edu",
        "password": "admin"
    }
]

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("getitdone")

  // set up unique index for upsert
  db.collection("tasks").createIndex(
    { id: 1 }, 
    { unique: true }
  )

  db.collection("lists").createIndex(
    { id: 1 }, 
    { unique: true }
  )

  db.collection("users").createIndex(
    { id: 1 }, 
    { unique: true }
  )

  db.collection("admins").createIndex(
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
