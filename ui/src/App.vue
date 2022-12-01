<template>
  <div>
    
    <!-- <b-navbar toggleable="lg" type="dark" variant="primary">
         
    </b-navbar> -->
    
    <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('admin') ? 'info' : 'primary'">
      <b-navbar-brand href="http://localhost:8080/">Get It Done</b-navbar-brand>   
      <b-navbar-brand href="#">
        <span v-if="user?.name">Welcome, {{ user.name }}</span>
        <span v-else>API TESTING PAGE. NOT logged in.</span>
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item href="/">All Orders</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('customer')" href="/customer">My Orders</b-nav-item>
        <b-nav-item v-if="user?.roles?.includes('operator')" href="/operator">My Work Screen</b-nav-item>
        <b-nav-item v-if="user?.name == null" href="/api/login">Login</b-nav-item>
        <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" />
      </b-navbar-nav>
    </b-navbar>
    
    <b-container fluid class="my-4">
      <b-row>

        <!-- left side !!!!!! -->
        <b-col xs="12" sm="4">
          <b-card no-body class="mb-3" bg-variant="light">
            <b-list-group flush>

              <b-list-group-item
                v-for="listName, i in functionalListName"
                :key="i"
                class="border-0"
                :class="{ 'font-weight-bold': selectedList === listName }"
              >
              <span @click="selectList(listName)" title="listName">{{ listName }}</span>
              </b-list-group-item>

              <b-list-group-item class="border-0" ></b-list-group-item>
              <b-list-group-item class="d-flex justify-content-between align-items-center border-0" >My Lists</b-list-group-item>

              <b-list-group-item 
                v-for="list, i in lists"
                :key="i"
                class="d-flex justify-content-between align-items-center border-0"
                :class="{ 'font-weight-bold': selectedList === list.name }"
                :draggable="true"
                :fields="list.name"
                >
                <b-button @click="handleClickDeleteList(list.name)">delete</b-button> 
                <span @click="selectList(list.name)" title="list.name">{{ list.name }}</span>
                <!-- <b-badge variant="dark" pill>{{ list.itemCount }}</b-badge> -->
              </b-list-group-item>


              <b-list-group-item>
                <b-input-group>

                  <b-form-input v-model="nameOfListToCreate" placeholder="List name" />

                  <b-input-group-append>
                    <b-button @click="handleClickAddList"><b-icon-plus-circle /></b-button>
                  </b-input-group-append>

                </b-input-group>
              </b-list-group-item>

              

            </b-list-group>
          </b-card>
        </b-col>


          <!-- right side of the screen !!! -->
        <b-col>
                    <!-- header -->
              <!-- <div>
            <template #header> -->
            <div v-if="(selectedList != null)" class="d-flex justify-content-between align-items-center ">
              <p>{{ selectedList }}</p>
            </div>
            <div v-else-if="lists.length != 0" class="d-flex justify-content-between align-items-center ">
              <p>No list selected!</p>
            </div>
            <div v-else>
              <p>Create a list to start!</p>
            </div>
          <!-- </template>
          </div> -->

          <b-card>





          <!-- show things, depending on what is clicked on the left, or if a specific task in a list is clicked -->
          <div v-if="(selectedList != null)">

            <!-- <detail :lists="lists" :selected-list="selectedList" @saveItem="handleClickSaveItem"/> -->
            
            <!-- all tasks -->
            <div v-if="selectedList === 'All Tasks'">
              <p v-for="list, i in lists">
                {{list.name}}
                <b-list-group >
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="item.status != 'Done'"
                      :key="i"
                      class="d-flex align-items-center border-0">
                      <b-form-checkbox 
                          v-model="item.status"
                          value="Done">
                      </b-form-checkbox>  
                      <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 
                  </b-list-group-item>
                </b-list-group>
              </p>
            </div>

            <!-- all deadlines -->
            <div v-if="selectedList === 'All Deadlines'">

                <b-list-group v-for="list, i in lists">
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="(item.status != 'Done' && item.dueDate != '')"
                      :key="i"
                      class="d-flex align-items-center border-0">
                      <b-form-checkbox 
                          v-model="item.status"
                          value="Done">
                      </b-form-checkbox>  
                      <span @click="loadItem(item, false)" title="item.name">
                        {{ item.name }}
                        <b-badge pill variant="primary">{{item.dueDate}}</b-badge>
                      </span> 
                      
                  </b-list-group-item>
                  
                </b-list-group>

            </div>

            <!-- upcoming tasks -->
            <div v-if="selectedList === 'Upcoming Tasks'">
              <b-list-group v-for="list, i in lists">
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="(item.status != 'Done' )"
                      :key="i"
                      class="d-flex align-items-center border-0">
                      <b-form-checkbox 
                          v-model="item.status"
                          value="Done">
                      </b-form-checkbox>  
                      <span @click="loadItem(item, false)" title="item.name">
                        {{ item.name }}
                        <b-badge pill variant="primary">{{item.dueDate}}</b-badge>
                      </span> 
                      
                  </b-list-group-item>
                  
                </b-list-group>
            </div>


            <!-- Timeline -->
            <!--  -->
            <!--  -->


            <!-- Tags -->
            <div v-if="selectedList === 'Tags'">
              <b-dropdown
                :text="selectedTagName"
                block
                variant="secondary"
                class="m-2"
                menu-class="w-100"
              >
              <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
                <div v-for="(item, j) in list.items" :key="j" v-if="(item.tags.length > 0)">
                  <b-dropdown-item v-for="(tag, k) in item.tags" :key="k"  @click="()=>{selectedTagName=tag}" >
                    {{tag}}
                  </b-dropdown-item>
                </div>
              </div>
              </b-dropdown>
              
              <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
                <div v-for="(item, j) in list.items" :key="j" v-if="(item.status != 'Done' && item.tags.length > 0)">
                  <b-list-group-item
                      v-for="tag, k in item.tags" 
                      :key="k" 
                      v-if="(tag === selectedTagName)"
                      class="d-flex align-items-center border-0"
                  >
                      <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                      <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 

                  </b-list-group-item>
                </div>
              </div>
            </div>


            <!-- completed -->
            <!--  -->
            <div v-if="selectedList === 'Completed'">
              <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
                <div v-for="(item, j) in list.items" :key="j" v-if="(item.status === 'Done')">
                  <b-list-group-item class="d-flex align-items-center border-0">
                      <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                      <span @click="loadItem(item, false)" title="item.name">
                        <strike>{{ item.name }}</strike>
                      </span> 

                  </b-list-group-item>
                </div>
              </div>
            </div>


            <!-- show items in a list -->
            <div flush v-if="( personalListSelected && !showItemForm)"> 
              <b-list-group >

                <b-list-group-item
                    v-for="item, i in selectedListItems" v-if="item.status != 'Done'"
                    :key="i"
                    class="d-flex align-items-center border-0"
                >
                    <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                    <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 

                </b-list-group-item>

                <b-input-group-append>
                    <b-button @click="loadItem(cloneTemplateForm(blankItemForm), true)"><b-icon-plus-circle /></b-button>
                </b-input-group-append>

              </b-list-group>
            </div>

            <!-- the task form -->
              <b-form v-if="personalListSelected && showItemForm">
                <b-form-group id="input-group-1" label="Task item name:" label-for="input-1">
                    <b-form-input 
                    id="input-1" 
                    v-model="itemDetails.name" 
                    type="name" 
                    required>
                    </b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Description:" label-for="input-2">
                    <b-form-textarea 
                    id="textarea" 
                    v-model="itemDetails.description" 
                    rows="1" 
                    cols="40"
                    max-rows="5"
                    >
                    </b-form-textarea>
                </b-form-group>

                <b-form-group id="input-group-3" label="Tags:" label-for="input-3">
                    <b-form-tags 
                    input-id="tags-basic" 
                    placeholder="" 
                    v-model="itemDetails.tags">
                    </b-form-tags>
                </b-form-group>

                <!-- <b-form-group id="input-group-4" label="Status:" label-for="input-4">
                    <b-form-select
                    id="input-4"
                    v-model="itemDetails.status"
                    :options="['in progress','done']" 
                    required
                    ></b-form-select>
                </b-form-group> -->

                <b-form-group id="input-group-5" label="Priority:" label-for="input-5">
                    <b-form-select
                    id="input-5"
                    v-model="itemDetails.priority"
                    :options="['high','medium','low']" 
                    ></b-form-select>
                </b-form-group>

                <label for="start-datepicker">Start date</label>
                <b-form-datepicker 
                    id="start-datepicker" 
                    v-model="itemDetails.startDate" 
                    placeholder="" 
                    class="mb-2">
                </b-form-datepicker>

                <label for="end-datepicker">End date</label>
                <b-form-datepicker 
                    id="end-datepicker" 
                    v-model="itemDetails.dueDate" 
                    placeholder="" 
                    class="mb-2">
                </b-form-datepicker>

                <b-form-group id="input-group-6" label="Pinned:" label-for="input-6">
                    <b-form-select
                    id="input-6"
                    v-model="itemDetails.pinned"
                    :options="['yes','no']" 
                    ></b-form-select>
                </b-form-group>

                <b-button @click="handleClickSaveItem()" type="submit" variant="primary">Save</b-button>
              </b-form>

          </div>

          
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>






<script setup lang = "ts">

import { computed, watch, onMounted, ref, Ref, provide} from 'vue'
import {TodoItem, TodoList, Id, getLists, addItemToList, addList, getList, deleteList, blankItemForm, 
        functionalListName, data, cloneTemplateForm, updateItemOnList} from './data'
// import detail from './components/detail.vue' // for showing necessary details on the right part of the screen

// 1. not allow list/item of same name be created; so that can search by name
// 


// variables
const lists: Ref<TodoList[]> = ref(data) // holds all the lists and items and item details

const nameOfListToCreate: Ref<string> = ref('')

const selectedList: Ref<string | null> = ref(null)

const showItemForm: Ref<boolean> = ref(false)

const itemDetails: Ref<TodoItem> = ref(cloneTemplateForm(blankItemForm))

const isAddItem: Ref<boolean> = ref(false) // whether to add item to list when 'save' is clicked

const selectedTagName: Ref<string> = ref('Select a tag')



const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})


// computed ref
const selectedListItems = computed(() => { // return a list of items in a personal list
  if (personalListSelected){
    return lists.value.filter(l => l.name === selectedList.value)[0]['items']
  }
  return []
})

const personalListSelected = computed(() => { // return if a selected list is personal list
  if (selectedList != null){
    if (functionalListName.indexOf(selectedList.value!) == -1) {
      return true
    }
  }
  return false
})

// const isRequiredEmpty = computed(() => {
//   return itemDetails.value.name === ''
// })// {name:'', description:'', tags:[], status:null, priority:null,startDate:'', dueDate:'',pinned:false}




// watch
watch (
  selectedList,
  () => {

  }
)



////// functions:


async function handleClickAddList() {
  if (nameOfListToCreate.value != '') {
    addList(nameOfListToCreate.value)
    selectList(nameOfListToCreate.value)
    nameOfListToCreate.value = ""
    refreshLists()
  }
} 

function selectList(listName: string) {
  selectedList.value = listName
  showItemForm.value = false
  // selectedListItem.value = lists.value.filter(l => l.id === listId) || null
}

async function refreshLists() {
  lists.value = await getLists() 
  // if a list is selected but the list name isn't in lists
  if (selectedList.value && !lists.value.find(l => l.name == selectedList.value)) { 
    selectedList.value = ''
  }
}
onMounted(refreshLists)


function handleClickDeleteList(listName: string){
  deleteList(listName)
  refreshLists()
  refreshSelectedList()
}


async function refreshSelectedList() {
  if (selectedList.value === null) {return} // if no list is selected, then nothing to refresh
  // selectedList.value = await getList(selectedList.value)
}




async function handleClickSaveItem(){
  // if (!isRequiredEmpty){
    if (isAddItem.value){
      addItemToList(selectedList.value!, itemDetails.value, lists.value.length) 
    } else {
      updateItemOnList(selectedList.value!, itemDetails.value)
    }
    showItemForm.value = false
    // call function to show selected list
  // }
}


// function handleClickAddItem() {
//   showItemForm.value = true
//   itemDetails.value = cloneTemplateForm(blankItemForm)

// }

// function handleClickitem(item: TodoItem){
//   showItemForm.value = true
//   itemDetails.value = item
// }

function loadItem(item: TodoItem, toAdd: boolean) { // when an item is clicked or the addItem button is clicked
  showItemForm.value = true
  itemDetails.value = item
  isAddItem.value = toAdd
}


// function handleClickCheckItem(item: TodoItem) {
//   updateItemOnList(selectedList.value!.id, itemId, { completed })
//   refreshSelectedList()
// }


// function handleClickDeleteItem(itemId: Id){
//   if (selectedList.value){
//     deleteItemInList(selectedList.value.id, itemId)
//     refreshSelectedList()
//     // refreshLists()
//   }
// }

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}



</script>