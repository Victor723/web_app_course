<template>
    <div>
        <div v-for="list, i in lists">
            <h2>{{list.name}}</h2>
            <b-list-group >
                <b-list-group-item
                    v-for="item, i in list.items" v-if="item.status != 'Done'"
                    :key="i"
                    class="d-flex align-items-center">
                    <b-form-checkbox @click="handleClickCheckItem(item, i)"/>
                    <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 
                </b-list-group-item>
            </b-list-group>
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