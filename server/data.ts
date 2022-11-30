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
  owner_id: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
}
