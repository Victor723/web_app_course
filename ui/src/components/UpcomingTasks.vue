<template>
    <div>
          <b-list-group>
            <b-list-group-item
                v-for="(item, _id) in items" v-if="(item.status != 'Done' )"
                :key="_id"
                class="d-flex align-items-center">
                <input type="checkbox" @click="handleClickCheckItem(item, _id)"/> 
                <span @click="loadItem(item, false)" title="item.name">
                {{ item.name }}
                <b-badge pill variant="primary">{{item.readableDueDate}}</b-badge>
                </span> 
                
            </b-list-group-item>
          </b-list-group>
    </div>
</template>



<script setup lang="ts">
import {TodoList, TodoItem} from '../data'
import { computed } from 'vue'

// props
interface Props {
  items?: TodoItem[]
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  items: () => [],
})

// computed that filters dueDate within 14 days and sorts by dueDate


// events
const emit = defineEmits<{
  (e: 'load', lstName: TodoItem, save: boolean): void
  (e: 'check', checked: TodoItem, idx: number): void
}>()

function loadItem(item: TodoItem, save: boolean) {
  emit("load", item, save)
}

function handleClickCheckItem(checked: TodoItem, idx: number) {
  emit('check', checked, idx)
}

</script>