<template>
    <div class="mx-3 my-3">
      <b-button @click="refresh" class="mb-2">Refresh</b-button>
      <h1>GETs</h1>
      <div>{{helloResponse}}</div>
      <div>{{tasksResponse}}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, provide } from 'vue'

  const user = ref({} as any)
  provide("user", user)
  
  const helloResponse = ref('')
  const tasksResponse = ref('')
  const listsResponse = ref('')
  
  async function refresh() {
    user.value = await (await fetch("/api/user")).json()
    helloResponse.value = await (await fetch('/api/hello')).json()
    console.log('helloResponse.value', helloResponse.value)
    tasksResponse.value = await (await fetch('/api/tasks')).json()
    console.log('tasksResponse.value', tasksResponse.value)
    listsResponse.value = await (await fetch('/api/lists')).json()
    console.log('listsResponse.value', listsResponse.value)
    // check if logged in
    if (user.value.name == null) {
      console.log('not logged in')
    } else {
      console.log('logged in!')
      console.log("All user lists:", await (await fetch('/api/user_lists')).json())
    }
  }
  onMounted(refresh)
  </script>
  