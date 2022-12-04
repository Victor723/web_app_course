<template>
  <div>
    
    <b-container fluid class="my-4">
      <b-row>

        <!-- left side !!!!!! -->
        <b-col xs="12" sm="3">
          <b-card no-body class="mb-3" bg-variant="light">
            <b-list-group flush>

              <!-- functional lists area -->
              <draggable>
                <b-list-group-item v-for="listName, i in functionalListName" :key="i"
                  class="border-0"
                  :class="{ 'font-weight-bold': selectedList === listName }"
                >
                <div @click="selectList(listName)" title="listName"><icons :list-name="listName"/> {{ listName }} </div>
                </b-list-group-item>
              </draggable>
              <b-list-group-item class="border-0" />

              <!-- personal lists area -->
              <b-list-group-item class="d-flex justify-content-between align-items-center border-0" > 
                My Lists 
                <icons 
                  list-name="add list" 
                  :name-of-list-to-create="nameOfListToCreate" 
                  :show-list-name-input="showListNameInput" 
                  @clickPlus="clickAddList" 
                  @onEnter="onEnterAddList"/>
              </b-list-group-item>
              <PersonalListNames 
                :lists="lists" 
                :selectedList="selectedList" 
                :show-delete-button-for="showDeleteButtonFor"
                @delete="handleClickDeleteList" 
                @select="selectList" 
                @minus="clickMinusList"/>
            </b-list-group>
          </b-card>
        </b-col>


        <!-- right side of the screen !!! -->
        <b-col xs="12" sm="9">
          <!-- header -->
          <div v-if="(selectedList != null)" class="d-flex justify-content-between align-items-center ">
            <h1><p>{{ selectedList }}</p></h1>
            <b-list-group-item v-if="(selectedList==='All Tasks' || personalListSelected)" class="d-flex justify-content-between align-items-center border-0">
              <b-form-tags v-if="showShareInputBox" 
                v-on:keyup.enter="onEnterUser2share2" 
                input-id="tags-basic" 
                placeholder="Add user..." 
                v-model="people2Share2"/>
              <svg v-else @click="handleClickShare" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </b-list-group-item>
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
              <AllDeadlines v-if="(selectedList==='All Deadlines')" :tasks="allDeadlines" @load="loadItem" @check="handleClickCheckItem"/>
              <UpcomingTasks v-if="(selectedList==='Upcoming Tasks')" :items="upcomingTasks" @load="loadItem" @check="handleClickCheckItem"/>
              <Timeline v-if="(selectedList==='Timeline')" :lists="filteredLists" @load="loadItem" @check="handleClickCheckItem"/>
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
import Timeline from './components/Timeline.vue'
import ItemForm from './components/ItemForm.vue'
import PersonalListItems from './components/PersonalListItems.vue'
import Completed from './components/Completed.vue'
import Tags from './components/Tags.vue'
import icons from './components/icons.vue'


// not allow list/item of same name be created; so that can search by name/string ?
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
const nameOfListToCreate: Ref<string> = ref('')
const showDeleteButtonFor: Ref<string> = ref('')
const showShareInputBox: Ref<boolean> = ref(false)


provide("user", user)

onMounted(async () => {
  refreshLists()
  user.value = await (await fetch("/api/user")).json()
  lists.value = await getLists()
  console.log("TEST: user_list:", await (await fetch('/api/user_lists')).json())
})


// computed ref
const selectedListItems = computed(() => { // return all items in a personal list
  if (personalListSelected){
    return lists.value.filter(l => l.name === selectedList.value)[0]['items']
  }
})

const personalListSelected = computed(() => { // return if a selected list is personal list
  if (selectedList != null){
    return functionalListName.indexOf(selectedList.value!) == -1
  }
})


watch(selectedList, () => { // reset after selecting another list
  selectedTagName.value = 'Select a tag'
  showListNameInput.value = false
  nameOfListToCreate.value = ''
  showDeleteButtonFor.value = ''
  people2Share2.value = []
  showShareInputBox.value = false
})

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

// filter all items with a due date, then sort by due date
const allDeadlines = computed(() => {
  let allDeadlines: TodoItem[] = []
  lists.value.forEach(list => {
    list.items.forEach(item => {
      if (item.dueDate != "") {
        allDeadlines.push(item)
      }
    })
  })
  allDeadlines.sort((a, b) => {
    return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
  })
  return allDeadlines
})

// filter allDeadline items within 14 days, and add a readableDueDate field
const upcomingTasks = computed(() => {
  let upcomingTasks: TodoItem[] = []
  allDeadlines.value.forEach(item => {
    let today = new Date()
    let dueDate = new Date(item.dueDate!)
    let diffTime = Math.abs(dueDate.getTime() - today.getTime())
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays <= 14) {
      // also change dueDate to be in the format of 'in x days'
      if (diffDays == 0) {
        item.readableDueDate = 'Today'
      } else if (diffDays == 1) {
        item.readableDueDate = 'Tomorrow'
      } else {
        item.readableDueDate = 'in ' + diffDays + ' days'
      }
      upcomingTasks.push(item)
    }
  })
  return upcomingTasks
})


////// functions:
function clickAddList() {showListNameInput.value = true} // show input area for adding a list
function clickMinusList(listName: string){showDeleteButtonFor.value = listName} // show trash bin sign when minus sign clicked
function handleClickShare() {showShareInputBox.value = true} // show share tag input area when share sign clicked
function handleClickTag(tag: string) {selectedTagName.value = tag} // for changing the name of the dropdown menu in Tags section


function logout() {(window.document.getElementById('logoutForm') as HTMLFormElement).submit()}


function onEnterUser2share2() {// make changes in database to share corresponding lists to desinated users
  // do something ...
  people2Share2.value = []
  showShareInputBox.value = false
} 


async function onEnterAddList(name: string) { // when enter key is hit for adding a list
  if (name != '') {
    await addList(name)
    await refreshLists()
    selectList(name)
    refreshLists()
    showListNameInput.value = false
  }
} 

function selectList(listName: string) { // called when a list is clicked
  selectedList.value = listName
  showItemForm.value = false
}

async function refreshLists() {
  lists.value = await getLists()
  // if (personalListSelected && !lists.value.find(l => l.name == selectedList.value)) { // if a list is selected but the list name isn't in lists
  //   selectedList.value = null
  // }

  if (selectedList.value && (!lists.value.find(l => l.name == selectedList.value) && !functionalListName.find(l => l == selectedList.value)))  { 
    selectedList.value = null
  }
  console.log("filteredLists:", filteredLists.value)
}

async function handleClickDeleteList(listId: string){  // do: when the trash bin is clicked, and a list is actually deleted
  await deleteList(listId)
  await refreshLists()
}


async function handleClickSaveItem(itemDetails: TodoItem){ // when save button is clicked in the item form
    if (isAddItem.value){ //if add, not update
      await addItemToList(selectedList.value!, itemDetails) 
    } else { // if only to update, not adding anything
      await updateItemOnList(selectedList.value!, itemDetails)
    }
    showItemForm.value = false
    await refreshLists()
}

function loadItem(item: TodoItem, toAdd: boolean) { // when an item is clicked or the addItem button is clicked
  showItemForm.value = true
  itemDetails.value = item
  isAddItem.value = toAdd
}


async function handleClickCheckItem(item: TodoItem) { // make change in data to update item status
  await updateItemOnList(selectedList.value!, { ...item, status: (item.status == "Done") ? "In Progress" : "Done" })
  await refreshLists()
}


async function setPin(item: TodoItem) { // make change in data to update item.pin
// do something
  await refreshLists()
}
  


</script>