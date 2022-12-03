<template>
    <div>
            <b-list-group-item
                v-for="item, i in upcomingTasks" v-if="(item.status != 'Done' )"
                :key="i"
                class="d-flex align-items-center">
                <b-form-checkbox @click="handleClickCheckItem(item, i)"/> 
                <span @click="loadItem(item, false)" title="item.name">
                {{ item.name }}
                <b-badge pill variant="primary">{{item.readableDueDate}}</b-badge>
                </span> 
                
            </b-list-group-item>

    </div>
</template>



<script setup lang="ts">
import {TodoList, TodoItem} from '../data'
import { computed } from 'vue'

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

// computed that filters dueDate within 14 days and sorts by dueDate
const upcomingTasks = computed(() => {
    console.log("lists", props.lists)
    let upcomingTasks: TodoItem[] = []
    props.lists.forEach(list => {
        list.items.forEach(item => {
            if (item.status != 'Done' && item.dueDate != null) {
                let today = new Date()
                let dueDate = new Date(item.dueDate)
                let diffTime = Math.abs(dueDate.getTime() - today.getTime())
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                if (diffDays <= 14) {
                    // also change dueDate to be in the format of 'in x days'
                    if (diffDays == 0) {
                        item.readableDueDate = 'Today'
                    } else if (diffDays == 1) {
                        item.readableDueDate = 'Tomorrow'
                    } else {
                        item.readableDueDate = 'in ' + diffDays + ' days'
                    }
                    upcomingTasks.push(item)
                }
            }
        })
    })
    upcomingTasks.sort((a, b) => (a.dueDate > b.dueDate) ? 1 : -1)
    console.log()
    return upcomingTasks
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