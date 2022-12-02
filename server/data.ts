export interface Task {
  name: string
  description: string
  tags: string[]
  status: string
  startDate: string
  dueDate: string
  priority: string
  pinned: boolean
  list_id: number
}

export interface List {
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
