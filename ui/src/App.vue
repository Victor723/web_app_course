<template>
  <div>
    
    <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('admin') ? 'info' : 'primary'" >
      <b-navbar-brand href="#">Get It Done</b-navbar-brand>   
      <b-navbar-brand href="#">
        <span v-if="user?.name">Welcome, {{ user.name }}</span>
        <span v-else>Please sign up or log in.</span>
        <b-badge v-if="user?.roles?.includes('admin')" pill variant="primary">admin</b-badge>
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item v-if="user?.roles?.includes('admin')" href="/admin">Admin Page</b-nav-item>
        <b-nav-item v-if="user?.name == null" href="/api/login">Login/Signup</b-nav-item>
        <b-nav-item v-if="user?.name" @click="logout">Logout</b-nav-item>
        <form method="POST" action="/api/logout" id="logoutForm" />
      </b-navbar-nav>
    </b-navbar>
    
    <b-container fluid class="my-4">
      <router-view />
    </b-container>

  </div>
</template>



<script setup lang = "ts">

import { onMounted, ref, provide} from 'vue'

// variables
const user = ref({} as any)

provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {(window.document.getElementById('logoutForm') as HTMLFormElement).submit()}

</script>
