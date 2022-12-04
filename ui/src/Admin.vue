<template>
    <div>
        <b-table striped hover :items="items"></b-table>
    </div>
</template>

<script setup lang = "ts">
import { computed, watch, onMounted, ref, Ref, provide} from 'vue'
import {TodoItem, TodoList, Id, getLists, addItemToList, addList, getList, deleteList, blankItemForm, 
        functionalListName, data, cloneTemplateForm, updateItemOnList} from './data'

const user = ref({} as any)
const items = ref([] as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
  items.value = await (await fetch("/api/tasks")).json()
  console.log(items.value)
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}



</script>