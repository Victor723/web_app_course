export type Id = string

export interface TodoItem {
	// id: Id
	name: string
	description: string
	tags: string[]
	status: 'In Progress' | 'Done'
	priority: 'High' | 'Low' | null
	startDate: string
	dueDate: string
	pinned: boolean
}

// export interface TodoListBasicInfo {
// 	id: Id
// 	name: string
// 	items: string[]
// }

export interface TodoList {
	id: Id
	name: string
	items: TodoItem[]
}


export const functionalListName: string[] = ['All Tasks', 'All Deadlines', 'Upcoming Tasks', 'Timeline', 'Tags', 'Completed']

export const blankItemForm: TodoItem = {name:'', description:'', tags:[], status:'In Progress', priority:null,
										startDate:'', dueDate:'',pinned:false}


export const data: TodoList[] = [
    {
        "id":'x1',
		'name':'school',
		"items":[
			{
			"name": "My Project",
			"description": "My Project Description",
			"tags": [
				"tag1",
				"tag2"
			],
			"status": "In Progress",
			"startDate": "2018-01-01",
			"dueDate": "2018-01-30",
			"priority": "High",
			"pinned": true}
		]
    },
    {
        "id":'x3',
		'name':'life',
		"items":[
			{
			"name": "to Europe",
			"description": "go travel during break",
			"tags": [
				"tag33",
				"tag44"
			],
			"status": "In Progress",
			"startDate": "2018-12-01",
			"dueDate": "2018-11-03",
			"priority": "High",
			"pinned": false}
		]
    },
	{
        "id":'x5',
		'name':'work',
		"items":[
			{
			"name": "hand in ppt",
			"description": "",
			"tags": [
				"tag31",
				"tag2"
			],
			"status": "In Progress",
			"startDate": "2015-01-01",
			"dueDate": "2017-01-31",
			"priority": "Low",
			"pinned": false}
		]
    }
]


export async function getLists(): Promise<TodoList[]> {
	return data
	// return await (await fetch("/api/lists")).json()
}

export async function getList(listId: Id): Promise<TodoList | null> {
	const encoded = encodeURIComponent(listId)
	return await (await fetch(`/api/list/${encoded}/items`)).json()
}

// export async function addList(name: string): Promise<Id> {

// 	return await (await fetch(`/api/add-list`, {
// 		method: 'POST',
// 		headers: { 'Content-Type': 'application/json' },
// 		body: JSON.stringify({ name }) // body data type must match "Content-Type" header
// 	})).json()
// }
export function addList(name: string) {
	data.push({
        "id":'x5',
		'name':name,
		"items":[]
    })
}



export function addItemToList(listName: string, item: TodoItem, len:number) {
	for (let i = 0; i < len; i++) {
		data[i]["items"].push(item)
	}
}
// export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
// 	const encodedListId = encodeURIComponent(listId)
// 	const response = await fetch(`/api/list/${encodedListId}/add-item`, {
// 		method: 'POST', // *GET, POST, PUT, DELETE, etc.
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify( item ) // body data type must match "Content-Type" header
// 	})
// 	return response.json()
// }


export function updateItemOnList(listId: string, update: Partial<TodoItem>) {
	return
}
// export async function updateItemOnList(listId: Id, itemId: Id, update: Partial<TodoItem>): Promise<number> {
// 	const encodedListId = encodeURIComponent(listId)
// 	const encodedItemId = encodeURIComponent(itemId)

// 	const response = await fetch(`/api/list/${encodedListId}/item/${encodedItemId}`, {
// 		method: 'PUT', // *GET, POST, PUT, DELETE, etc.
// 		headers: {'Content-Type': 'application/json'},
// 		body: JSON.stringify( update ) // body data type must match "Content-Type" header
// 	})
// 	return response.json()
// }




export async function deleteList(listName: string){
	// const encodedListId = encodeURIComponent(listId)
	// const response = await fetch(`/api/list/${encodedListId}`, {
	// 	method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
	// 	headers: {'Content-Type': 'application/json'},
	// 	body: JSON.stringify( {} ) // body data type must match "Content-Type" header
	// })
	// return response.json()
	data.pop()
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


function resolve(response: Response) {
	throw new Error("Function not implemented.")
}


export function cloneTemplateForm(x: TodoItem) {
	// only works because ContactCard fields are only one level deep (i.e., no embedded objects or arrays)
	// in general, a common way to do a deep clone is JSON.parse(JSON.stringify(x))
	return JSON.parse(JSON.stringify(x))
  }















