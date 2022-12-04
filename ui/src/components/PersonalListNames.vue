<template>

        <draggable>
            <b-list-group-item v-for="list, i in lists" :key="i"
            class="d-flex justify-content-between align-items-center border-0" 
            :class="{ 'font-weight-bold': list.name === selectedList}"
            >
              <span @click="selectList(list.name)" :id="list.name"> <icons :list-name="list.name"/> {{ list.name }}</span>

              <!-- personal list delete buttons -->
              <svg v-if="(list.name != showDeleteButtonFor)" :id="list.name + '_d'" @click="clickMinus(list.name)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
              </svg>
              <svg v-if="(list.name === showDeleteButtonFor)" :id="list.name + '_t'" @click="handleClickDeleteList(list.name)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash2" viewBox="0 0 16 16">
                <path d="M14 3a.702.702 0 0 1-.037.225l-1.684 10.104A2 2 0 0 1 10.305 15H5.694a2 2 0 0 1-1.973-1.671L2.037 3.225A.703.703 0 0 1 2 3c0-1.105 2.686-2 6-2s6 .895 6 2zM3.215 4.207l1.493 8.957a1 1 0 0 0 .986.836h4.612a1 1 0 0 0 .986-.836l1.493-8.957C11.69 4.689 9.954 5 8 5c-1.954 0-3.69-.311-4.785-.793z"/>
              </svg>

            </b-list-group-item>
        </draggable>
</template>



<script setup lang="ts">
import draggable from 'vuedraggable'
import {TodoList} from '../data'
import icons from './icons.vue';


// props
interface Props {
  lists?: TodoList[]
  selectedList?: string | null
  showDeleteButtonFor?: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  lists: () => [],

  // no factory function needed for primitive types
  selectedList: null,
  showDeleteButtonFor: '',
})

// events
const emit = defineEmits<{
  (e: 'delete', lstName: string): void
  (e: 'select', lstName: string): void
  (e: 'minus', name: string): void
}>()

function handleClickDeleteList(name: string) {
  emit("delete", name)
}

function selectList(name: string) {
  emit("select", name)
}

function clickMinus(name: string) {
  emit('minus', name)
}



</script>