<template>
    <div>
        <b-list-group>
            <b-list-group-item v-for="item, i in tasks" v-if="(item.status != 'Done' && item.dueDate != '')"
                :key="i"
                class="d-flex align-items-center">
                <input type="checkbox" @click="handleClickCheckItem(item, i)"/>
                <span @click="loadItem(item, false)" title="item.name">
                {{ item.name }}
                <b-badge pill variant="primary">{{item.dueDate}}</b-badge>
                </span> 
                
            </b-list-group-item>
        </b-list-group>
    </div>
</template>



<script setup lang="ts">
import {TodoList, TodoItem} from '../data'

// props
interface Props {
  tasks?: TodoItem[]
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  tasks: () => [],
})

// events
const emit = defineEmits<{
  (e: 'load', loaded: TodoItem, save: boolean): void
  (e: 'check', checked: TodoItem, idx: number): void
}>()

function loadItem(loaded: TodoItem, save: boolean) {
  emit("load", loaded, save)
}

function handleClickCheckItem(checked: TodoItem, idx: number) {
  emit('check', checked, idx)
}

</script>