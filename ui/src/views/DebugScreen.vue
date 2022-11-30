<template>
    <div class="mx-3 my-3">
      <b-button @click="refresh" class="mb-2">Refresh</b-button>
      <h1>GETs</h1>
      <div>{{helloResponse}}</div>
      <div>{{tasksResponse}}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue'
  
  const helloResponse = ref('')
  const tasksResponse = ref('')
  const listsResponse = ref('')
  
  async function refresh() {
    helloResponse.value = await (await fetch('/api/hello')).json()
    console.log('helloResponse.value', helloResponse.value)
    tasksResponse.value = await (await fetch('/api/tasks')).json()
    console.log('tasksResponse.value', tasksResponse.value)
    listsResponse.value = await (await fetch('/api/lists')).json()
    console.log('listsResponse.value', listsResponse.value)
  }
  onMounted(refresh)
  </script>
  