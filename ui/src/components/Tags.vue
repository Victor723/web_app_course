<template>
    <div>
        <b-dropdown :text="selectedTagName" block variant="secondary" class="m-2" menu-class="w-100">
          <b-dropdown-item v-for="(tag, k) in tags" :key="k"  @click="handleClickTag(tag)" >
              {{tag}}
          </b-dropdown-item>
        </b-dropdown>
              
        <div v-for="(list, i) in lists" :key="i" v-if="(list.items.length > 0)">
            <div v-for="(item, j) in list.items" :key="j" v-if="(item.status != 'Done' && item.tags.length > 0)">
                <b-list-group-item
                    v-for="tag, k in item.tags" 
                    :key="k" 
                    v-if="(tag === selectedTagName)"
                    class="d-flex align-items-center"
                >
                    <b-form-checkbox @click="handleClickCheckItem(item, i)"/> 

                    <span @click="loadItem(item, false)" title="item.name">{{ item.name }}</span> 

                </b-list-group-item>
            </div>
        </div>
    </div>

</template>



<script setup lang="ts">
import {TodoList, TodoItem} from '../data'
import { computed } from 'vue'

// props
interface Props {
  lists?: TodoList[]
  selectedTagName?: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  lists: () => [],
  selectedTagName: 'Select a tag'
})

// computed for tags
const tags = computed(() => {
    let tags: string[] = []
    props.lists.forEach(list => {
        list.items.forEach(item => {
            item.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag)
                }
            })
        })
    })
    return tags
})

// events
const emit = defineEmits<{
  (e: 'load', item: TodoItem, save: boolean): void
  (e: 'select', tag: string): void
  (e: 'check', checked: TodoItem, idx: number): void
}>()

function loadItem(item: TodoItem, add: boolean) {
  emit("load", item, add)
}

function handleClickTag(tag: string) {
    emit('select', tag)
}

function handleClickCheckItem(checked: TodoItem, idx: number) {
  emit('check', checked, idx)
}


</script>