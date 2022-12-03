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
}

// export interface TodoListBasicInfo {
// 	id: Id
// 	name: string
// 	items: string[]
// }

export interface TodoList {
	owner: string
	id: Id
	name: string
	items: TodoItem[]
}


export const functionalListName: string[] = ['All Tasks', 'All Deadlines', 'Upcoming Tasks', 'Timeline', 'Tags', 'Completed']

export const blankItemForm: TodoItem = {name:'', description:'', tags:[], status:'In Progress', priority:null, startDate:'', dueDate:'',pinned:false}


export const data: TodoList[] = [
    {
		'owner':'o1',
        "id":'x1',
		'name':'School',
		"items":[
			{
			"name": "My Project",
			"description": "My Project Description",
			"tags": [
				"with tom",
				"play"
			],
			"status": "In Progress",
			"startDate": "2025-01-01",
			"dueDate": "2026-01-30",
			"priority": "High",
			"pinned": false},
			{
				"name": "final exam",
				"description": "bio exam",
				"tags": [
					"urgent",
					"play"
				],
				"status": "In Progress",
				"startDate": "2025-01-01",
				"dueDate": "2023-01-30",
				"priority": "High",
				"pinned": true}
		]
    },
    {
		'owner':'o2',
        "id":'x3',
		'name':'Life',
		"items":[
			{
			"name": "to Europe",
			"description": "go travel during break",
			"tags": [
				"with tom",
				"fun"
			],
			"status": "In Progress",
			"startDate": "2018-12-01",
			"dueDate": "2023-11-03",
			"priority": "Low",
			"pinned": false}
		]
    },
	{
		'owner':'o3',
        "id":'x5',
		'name':'Work',
		"items":[
			{
			"name": "hand in ppt",
			"description": "",
			"tags": [
				"personal",
				"fun"
			],
			"status": "In Progress",
			"startDate": "2015-01-01",
			"dueDate": "2030-01-31",
			"priority": "Low",
			"pinned": false}
		]
    }
]










// const today = new Date()
// const currDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()


// export function countDays(dueDate: string): number { // 2022-11-30 - 2025-01-01
// 	// const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
// 	// const year = dueDate[0:5]
// 	// const firstDate = new Date(2008, 1, 12);


// 	// const diffDays = Math.round(Math.abs((firstDate - today) / oneDay));
//   }




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
// export function addList(name: string) {
// 	data.push({
//         "id":'x5',
// 		'name':name,
// 		"items":[]
//     })
// }



// export function addItemToList(listName: string, item: TodoItem, len:number) {
// 	for (let i = 0; i < len; i++) {
// 		data[i]["items"].push(item)
// 	}
// }
export async function addItemToList(listId: Id, item: Omit<TodoItem, "id">): Promise<Id | null> {
	const itemWithListId = { ...item, listId }
	const response = await fetch(`/api/create_task`, {
		method: 'POST', // *GET, POST, PUT, DELETE, etc.
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify( itemWithListId ) // body data type must match "Content-Type" header
	})
	return response.json()
}


// export function updateItemOnList(listId: string, update: Partial<TodoItem>) {
// 	return
// }
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


function resolve(response: Response) {
	throw new Error("Function not implemented.")
}


export function cloneTemplateForm(x: TodoItem) {
	// only works because ContactCard fields are only one level deep (i.e., no embedded objects or arrays)
	// in general, a common way to do a deep clone is JSON.parse(JSON.stringify(x))
	return JSON.parse(JSON.stringify(x))
  }















