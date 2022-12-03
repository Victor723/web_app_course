<template>
    <div>
        <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
            <div v-for="(item, j) in list.items" :key="j" v-if="(item.status === 'Done')">
                <b-list-group-item class="d-flex align-items-center">
                  <input type="checkbox" checked @click="handleClickCheckItem(item, i)"/>
                    <span @click="loadItem(item, false)" title="item.name"><strike>{{ item.name }}</strike></span> 
                </b-list-group-item>
            </div>
        </div>
    </div>

</template>



<script setup lang="ts">
import {TodoList, TodoItem} from '../data'

// props
interface Props {
  lists?: TodoList[]
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  lists: () => [],
})

// events
const emit = defineEmits<{
  (e: 'load', item: TodoItem, save: boolean): void
  (e: 'check', checked: TodoItem, idx: number): void
}>()

function loadItem(item: TodoItem, add: boolean) {
  emit("load", item, add)
}

function handleClickCheckItem(checked: TodoItem, idx: number) {
  emit('check', checked, idx)
}

</script>