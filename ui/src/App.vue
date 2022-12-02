<template>
  <div>
    
    <!-- <b-navbar toggleable="lg" type="dark" variant="primary">
         
    </b-navbar> -->
    
    <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('admin') ? 'info' : 'primary'" >
      <b-navbar-brand href="#">Get It Done</b-navbar-brand>   
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
              <draggable>
                <b-list-group-item
                  v-for="listName, i in functionalListName"
                  :key="i"
                  class="border-0"
                  :class="{ 'font-weight-bold': selectedList === listName }"
                >
                <span @click="selectList(listName)" title="listName">{{ listName }}</span>
                </b-list-group-item>
              </draggable>

              <b-list-group-item class="border-0" ></b-list-group-item>
              <b-list-group-item class="d-flex justify-content-between align-items-center border-0" >My Lists</b-list-group-item>


              <PersonalListNames 
                :lists="lists" 
                :selectedList="selectedList" 
                @delete="handleClickDeleteList" 
                @select="selectList"
                @add="handleClickAddList">
              </PersonalListNames>



            <b-button @click="refreshLists">Refresh</b-button>

            </b-list-group>
            <Gantt></Gantt>
          </b-card>
        </b-col>


          <!-- right side of the screen !!! -->
        <b-col>
                    <!-- header -->
              <!-- <div>
            <template #header> -->
            <div v-if="(selectedList != null)" class="d-flex justify-content-between align-items-center ">
            <h1>  <p>{{ selectedList }}</p> </h1>
              <div v-if="(selectedList === 'All Tasks' || personalListSelected)">
                <b-form-tags input-id="tags-basic" placeholder="" v-model="people2Share2"></b-form-tags>
                <b-button @click="handleClickShare(lists)"> Share </b-button>
              </div>
            </div>
            <div v-else-if="lists.length != 0" class="d-flex justify-content-between align-items-center ">
              <p>No list selected!</p>
            </div>
            <div v-else>
              <p>Create a list to start!</p>
            </div>
          <!-- </template>
          </div> -->

          



          <!-- show things, depending on what is clicked on the left, or if a specific task in a list is clicked -->
          <div v-if="(selectedList != null)">
            

            <!-- all tasks -->
            <div v-if="(selectedList === 'All Tasks' && !showItemForm)">
              <div v-for="list, i in lists">
                <h2>{{list.name}}</h2>
                <b-list-group >
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="item.status != 'Done'"
                      :key="i"
                      class="d-flex align-items-center">
                      <b-form-checkbox 
                          v-model="item.status"
                          value="Done">
                      </b-form-checkbox>  
                      <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 
                  </b-list-group-item>
                </b-list-group>
              </div>
            </div>



            
            <!-- all deadlines -->
            <div v-if="(selectedList === 'All Deadlines' && !showItemForm)">

                <b-list-group v-for="list, i in lists">
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="(item.status != 'Done' && item.dueDate != '')"
                      :key="i"
                      class="d-flex align-items-center">
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
            <div v-if="(selectedList === 'Upcoming Tasks' && !showItemForm)">
              <b-list-group v-for="list, i in lists">
                  <b-list-group-item
                      v-for="item, i in list.items" v-if="(item.status != 'Done' )"
                      :key="i"
                      class="d-flex align-items-center">
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
            <div v-if="(selectedList === 'Tags' && !showItemForm)">

              <b-dropdown :text="selectedTagName" block variant="secondary" class="m-2" menu-class="w-100">
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
                      class="d-flex align-items-center"
                  >
                      <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                      <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 

                  </b-list-group-item>
                </div>
              </div>
            </div>


            <!-- completed -->
            <!--  -->
            <div v-if="(selectedList === 'Completed' && !showItemForm)">
              <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
                <div v-for="(item, j) in list.items" :key="j" v-if="(item.status === 'Done')">
                  <b-list-group-item class="d-flex align-items-center">
                      <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                      <span @click="loadItem(item, false)" title="item.name">
                        <strike>{{ item.name }}</strike>
                      </span> 

                  </b-list-group-item>
                </div>
              </div>
            </div>


            <!-- show items in a personal list -->
            <div flush v-if="( personalListSelected && !showItemForm)"> 
              
              <b-list-group >

                <b-list-group-item
                    v-for="item, i in selectedListItems" v-if="item.status != 'Done'"
                    :key="i"
                    class="d-flex align-items-center"
                >
                    <b-form-checkbox v-model="item.status" value="Done"></b-form-checkbox>  

                    <div v-if="!item.pinned" @click="setPin(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">
                        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
                      </svg>
                    </div>

                    <div v-if="item.pinned" @click="setPin(item)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle-fill" viewBox="0 0 16 16">
                        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
                      </svg>
                    </div>

                    <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 
                    
                </b-list-group-item>

                <b-input-group-append>
                    <b-button @click="loadItem(cloneTemplateForm(blankItemForm), true)"> Add a task <b-icon-plus-circle /></b-button>
                </b-input-group-append>

              </b-list-group>
            </div>

            <!-- the task form -->
              <b-form v-if="showItemForm">
                <b-form-group id="input-group-1" label="Name:" label-for="input-1">
                    <b-form-input 
                    id="input-1" 
                    v-model="itemDetails.name" 
                    placeholder="Christmas dinner menu"
                    type="name" 
                    required>
                    </b-form-input>
                </b-form-group>

                <b-form-group id="input-group-2" label="Description:" label-for="input-2">
                    <b-form-textarea 
                    id="textarea" 
                    v-model="itemDetails.description" 
                    placeholder="Mashed Sweet Potatoes..."
                    rows="1" 
                    cols="40"
                    max-rows="5"
                    >
                    </b-form-textarea>
                </b-form-group>

                <b-form-group id="input-group-3" label="Tags:" label-for="input-3">
                    <b-form-tags 
                    input-id="tags-basic" 
                    placeholder="Enter a tag..." 
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
                    :options="['High','Medium','Low']" 
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
                    :options="[true,false]" 
                    ></b-form-select>
                </b-form-group>

                <b-button @click="handleClickSaveItem()" type="submit" variant="primary">Save</b-button>
              </b-form>

          </div>

          
          
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>






<script setup lang = "ts">

import { computed, watch, onMounted, ref, Ref, provide} from 'vue'
import {TodoItem, TodoList, Id, getLists, addItemToList, addList, getList, deleteList, blankItemForm, 
        functionalListName, data, cloneTemplateForm, updateItemOnList} from './data'
import draggable from 'vuedraggable'
import PersonalListNames from './components/PersonalListNames.vue'
import Gantt from './Gantt.vue'

// import detail from './components/detail.vue' // for showing necessary details on the right part of the screen

// 1. not allow list/item of same name be created; so that can search by name/string
// 


// variables
const lists: Ref<TodoList[]> = ref(data) // holds all the lists and items and item details
// const nameOfListToCreate: Ref<string> = ref('')

const selectedList: Ref<string | null> = ref(null)

const showItemForm: Ref<boolean> = ref(false)

const itemDetails: Ref<TodoItem> = ref(cloneTemplateForm(blankItemForm))

const isAddItem: Ref<boolean> = ref(false) // whether to add item to list when 'save' is clicked

const selectedTagName: Ref<string> = ref('Select a tag')

const people2Share2: Ref<string[]> = ref([])


const listName2: Ref<string> = ref('')

const user = ref({} as any)



provide("user", user)

onMounted(async () => {
  refreshLists
  user.value = await (await fetch("/api/user")).json()
  lists.value = await getLists()
  console.log("TEST: user_list:", await (await fetch('/api/user_lists')).json())
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




////// functions:


function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}


function handleClickShare(thing2share: TodoList[] | TodoList | TodoItem) {
  // actually just need to import this function, which calls api to add a list(s) to the desinated user
}

async function handleClickAddList(name: string) {
  if (name != '') {
    addList(name)
    selectList(name)
    name = ""
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
  console.log("TEST: lists.value:", lists.value)
  // if a list is selected but the list name isn't in lists
  if (selectedList.value && !lists.value.find(l => l.name == selectedList.value)) { 
    selectedList.value = ''
  }
}

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

function setPin(item: TodoItem) {
  if (item.pinned) {item.pinned = false}
  else {item.pinned = true}
}




  





</script>