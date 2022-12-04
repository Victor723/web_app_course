export type Id = string

export interface TodoItem {
	// id: Id
	name: string
	description: string
	tags: string[]
	status: 'In Progress' | 'Done'
	priority: 'High' | 'Medium' | 'Low' | null
	startDate: string
	dueDate: string
	pinned: boolean
	readableDueDate?: string
}

export interface TodoList {
	owner: string
	id: Id
	name: string
	items: TodoItem[]
}


export const functionalListName: string[] = ['All Tasks', 'All Deadlines', 'Upcoming Tasks', 'Timeline', 'Tags', 'Completed']

export const blankItemForm: TodoItem = {name:'', description:'', tags:[], status:'In Progress', priority:null, startDate:'', dueDate:'',pinned:false}

export async function getLists(): Promise<TodoList[]> {
	// return data
	const response = await (await fetch("/api/user_lists")).json()
	return response
}

export async function getList(listId: Id): Promise<TodoList | null> {
	const encoded = encodeURIComponent(listId)
	return await (await fetch(`/api/list/${encoded}/items`)).json()
}

export async function addList(name: string): Promise<Id> {

	return await (await fetch(`/api/create_list`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name }) // body data type must match "Content-Type" header
	})).json()
}

export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
	const itemWithListId = { ...item, listId }
	const response = await fetch(`/api/create_task`, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( itemWithListId ) // body data type must match "Content-Type" header
	})
	return response.json()
}

export async function updateItemOnList(listId: Id, item: Partial<TodoItem>): Promise<number> {
	const itemWithListId = { ...item, listId }

	const response = await fetch(`/api/update_task`, {
		method: 'PUT', // *GET, POST, PUT, DELETE, etc.
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( itemWithListId ) // body data type must match "Content-Type" header
	})
	return response.json()
}

export async function deleteList(listId: string){
	const encodedListId = encodeURIComponent(listId)
	const response = await fetch(`/api/delete_list/${encodedListId}`, {
		method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( {} ) // body data type must match "Content-Type" header
	})
	return response.json()
	// data.pop()
}

export async function deleteItemInList(listId: Id, itemId: Id){
	const encodedListId = encodeURIComponent(listId)
	const encodedItemId = encodeURIComponent(itemId)
	const response = await fetch(`/api/list/${encodedListId}/item/${encodedItemId}`, {
		method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( {} ) // body data type must match "Content-Type" header
	})
	return response.json()
}

export function cloneTemplateForm(x: TodoItem) {
	// only works because ContactCard fields are only one level deep (i.e., no embedded objects or arrays)
	// in general, a common way to do a deep clone is JSON.parse(JSON.stringify(x))
	return JSON.parse(JSON.stringify(x))
  }















