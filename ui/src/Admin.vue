<template>

    <div>
        <b-navbar toggleable="lg" type="dark" :variant="user?.roles?.includes('admin') ? 'info' : 'primary'">
            <b-navbar-brand href="#">Get It Done</b-navbar-brand>   
            <b-navbar-brand href="#">
                <span v-if="user?.name">
                    Welcome, {{ user.name }}
                    <b-badge pill variant="primary">admin</b-badge>
                </span>
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
    </div>

    <div>
        <b-table striped hover :items="items"></b-table>
    </div>

</template>



<script setup lang = "ts">
import { computed, watch, onMounted, ref, Ref, provide} from 'vue'
import {TodoItem, TodoList, Id, getLists, addItemToList, addList, getList, deleteList, blankItemForm, 
        functionalListName, data, cloneTemplateForm, updateItemOnList} from './data'





const user = ref({} as any)
provide("user", user)

onMounted(async () => {
  user.value = await (await fetch("/api/user")).json()
})

function logout() {
  ;(window.document.getElementById('logoutForm') as HTMLFormElement).submit()  
}



</script>