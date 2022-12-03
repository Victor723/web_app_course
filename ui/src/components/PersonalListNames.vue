<template>

        <draggable>
            <b-list-group-item v-for="list, i in lists" :key="i"
            class="d-flex justify-content-between align-items-center border-0" 
            :class="{ 'font-weight-bold': list.name === selectedList}"
            >
                <span @click="selectList(list.name)" title="list.name"> <icons :list-name="list.name"/> {{ list.name }}</span>
                <b-button @click="handleClickDeleteList(list.name)">delete</b-button> 
            </b-list-group-item>
        </draggable>
</template>



<script setup lang="ts">
import draggable from 'vuedraggable'
import {TodoList} from '../data'
import icons from './listIcons.vue';


// props
interface Props {
  lists?: TodoList[]
  selectedList?: string | null
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  lists: () => [],

  // no factory function needed for primitive types
  selectedList: null,
})

// events
const emit = defineEmits<{
  (e: 'delete', lstName: string): void
  (e: 'select', lstName: string): void
}>()

function handleClickDeleteList(name: string) {
  emit("delete", name)
}

function selectList(name: string) {
  emit("select", name)
}



</script>