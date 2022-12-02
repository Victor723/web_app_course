<template>
    <div>
        <draggable>
            <b-list-group-item v-for="list, i in lists" :key="i"
            class="d-flex justify-content-between align-items-center border-0" 
            :class="{ 'font-weight-bold': list.name === selectedList}"
            >
                <b-button @click="handleClickDeleteList(list.name)">delete</b-button> 
                <span @click="selectList(list.name)" title="list.name">{{ list.name }}</span>
            </b-list-group-item>
        </draggable>

        <b-list-group-item>
            <b-input-group>

                <b-form-input v-model="nameOfListToCreate" placeholder="List name" />

                <b-input-group-append>
                <b-button @click="handleClickAddList(nameOfListToCreate)"><b-icon-plus-circle /></b-button>
                </b-input-group-append>

            </b-input-group>
        </b-list-group-item>
    </div>  
</template>



<script setup lang="ts">
import draggable from 'vuedraggable'
import {TodoList} from '../data'
import {Ref, ref} from 'vue'

const nameOfListToCreate: Ref<string> = ref('')

// props
interface Props {
  lists?: TodoList[]
  selectedList?: string | null
//   nameOfListToCreate?: string
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  lists: () => [],

  // no factory function needed for primitive types
  selectedList: null,
//   nameOfListToCreate: '',
})

// events
const emit = defineEmits<{
  (e: 'delete', lstName: string): void
  (e: 'select', lstName: string): void
  (e: 'add', nameToAdd: string): void
}>()

function handleClickDeleteList(name: string) {
  emit("delete", name)
}

function selectList(name: string) {
    emit("select", name)
}


function handleClickAddList(addName: string) {
    emit('add', addName)
}

</script>