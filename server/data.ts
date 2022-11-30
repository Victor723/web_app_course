export interface Task {
  id: number
  name: string
  description: string
  tags: string[]
  status: string
  start_date: string
  due_date: string
  priority: string
  pinned: boolean
  list_id: number
}

export interface List {
  id: number
  name: string
  owner: string
}

export interface User {
  _id: string
  name: string
  sub: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
  email_verified: boolean
}
