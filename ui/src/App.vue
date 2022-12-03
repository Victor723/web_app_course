<template>
  <div>
    
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
                <b-list-group-item v-for="listName, i in functionalListName" :key="i"
                  class="border-0"
                  :class="{ 'font-weight-bold': selectedList === listName }"
                >
                <div @click="selectList(listName)" title="listName"><listIcons :list-name="listName"/> {{ listName }} </div>
                </b-list-group-item>
              </draggable>
              <b-list-group-item class="border-0" />
              <b-list-group-item class="d-flex justify-content-between align-items-center border-0" > 
                My Lists 
                <listIcons list-name="add list"  @add-list="clickAddList" @add="handleClickAddList"/>
              </b-list-group-item>
              <PersonalListNames :lists="lists" :selectedList="selectedList" @delete="handleClickDeleteList" @select="selectList" @add="handleClickAddList"/>
            </b-list-group>
          </b-card>
        </b-col>


        <!-- right side of the screen !!! -->
        <b-col>
          <!-- header -->
          <div v-if="(selectedList != null)" class="d-flex justify-content-between align-items-center ">
            <h1><p>{{ selectedList }}</p></h1>
            <div v-if="(selectedList==='All Tasks' || personalListSelected)">
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

          <!-- show things, depending on what is clicked on the left, or if a specific task in a list is clicked -->
          <div v-if="(selectedList != null)">
            <div v-if="!showItemForm">
              <AllTasks v-if="(selectedList==='All Tasks')" :lists="lists" @load="loadItem" @check="handleClickCheckItem"/>
              <AllDeadlines v-if="(selectedList==='All Deadlines')" :lists="filteredLists" @load="loadItem" @check="handleClickCheckItem"/>
              <UpcomingTasks v-if="(selectedList==='Upcoming Tasks')" :lists="filteredLists" @load="loadItem" @check="handleClickCheckItem"/>
              <!-- Timeline -->
              <Tags v-if="(selectedList==='Tags')" :lists="lists" :selected-tag-name="selectedTagName" @load="loadItem" @select="handleClickTag" @check="handleClickCheckItem"/>
              <Completed v-if="(selectedList==='Completed')" :lists="lists" @load="loadItem" @check="handleClickCheckItem"/>

              <!-- show items in a personal list -->
              <PersonalListItems flush v-if="(personalListSelected)" :selected-list-items="selectedListItems" @load="loadItem" @set-pin="setPin" @check="handleClickCheckItem"/>
            </div>
            <div v-else>
              <ItemForm :item-details="itemDetails" @ClickSaveItem="handleClickSaveItem"/>
            </div>
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
import AllTasks from './components/AllTasks.vue'
import AllDeadlines from './components/AllDeadlines.vue'
import UpcomingTasks from'./components/UpcomingTasks.vue'
import ItemForm from './components/ItemForm.vue'
import PersonalListItems from './components/PersonalListItems.vue'
import Completed from './components/Completed.vue'
import Tags from './components/Tags.vue'
import listIcons from './components/listIcons.vue'


// 1. not allow list/item of same name be created; so that can search by name/string
// 


// variables
const lists: Ref<TodoList[]> = ref(data) // holds all the lists and items and item details
const selectedList: Ref<string | null> = ref(null)
const showItemForm: Ref<boolean> = ref(false)
const itemDetails: Ref<TodoItem> = ref(cloneTemplateForm(blankItemForm))
const isAddItem: Ref<boolean> = ref(false) // whether to add item to list when 'save' is clicked
const selectedTagName: Ref<string> = ref('Select a tag')
const people2Share2: Ref<string[]> = ref([])
const user = ref({} as any)
const showListNameInput: Ref<boolean> = ref(false)


provide("user", user)

onMounted(async () => {
  refreshLists()
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
      console.log("!!!!!!!!!!!, selectedList is ''" + selectedList.value + "''")
      return true
    }
  }
  return false
})

watch(selectedList, () => {selectedTagName.value = 'Select a tag'})

// filtered lists that only contains items with a due date
// also sort by due date
const filteredLists = computed(() => {
  return lists.value.filter(l => l.items.filter(i => i.dueDate != "").length > 0)
    .map(l => {
      l.items = l.items.filter(i => i.dueDate != "")
      l.items.sort((a, b) => {
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      })
      return l
    })
})


////// functions:

function clickAddList() {
  showListNameInput.value = true
}

function handleClickTag(tag: string) {
  selectedTagName.value = tag
}

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}


function handleClickShare(thing2share: TodoList[] | TodoList | TodoItem) {
  // actually just need to import this function, which calls api to add a list(s) to the desinated user
}

async function handleClickAddList(name: string) {
  if (name != '') {
    await addList(name)
    await refreshLists()
    selectList(name)
    name = ""
    refreshLists()
    showListNameInput.value = false
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
  if (selectedList.value && (!lists.value.find(l => l.name == selectedList.value) && !functionalListName.find(l => l == selectedList.value)))  { 
    selectedList.value = null
  }
  console.log("filteredLists:", filteredLists.value)
}

async function handleClickDeleteList(listId: string){
  await deleteList(listId)
  await refreshLists()
  refreshSelectedList()
}


async function refreshSelectedList() {
  if (selectedList.value === null) {return} // if no list is selected, then nothing to refresh
  // selectedList.value = await getList(selectedList.value)
}




async function handleClickSaveItem(itemDetails: TodoItem){
  // if (!isRequiredEmpty){
    if (isAddItem.value){
      await addItemToList(selectedList.value!, itemDetails, lists.value.length) 
    } else {
      await updateItemOnList(selectedList.value!, itemDetails)
    }
    showItemForm.value = false
    refreshLists()
}

function loadItem(item: TodoItem, toAdd: boolean) { // when an item is clicked or the addItem button is clicked
  showItemForm.value = true
  itemDetails.value = item
  isAddItem.value = toAdd
}


async function handleClickCheckItem(item: TodoItem) {
  await updateItemOnList(selectedList.value!, { ...item, status: (item.status == "Done") ? "In Progress" : "Done" })
  refreshLists()
}

function setPin(item: TodoItem) {

}
  


</script>