<template>
    <b-form>
        <b-form-group id="input-group-1" label="Name:" label-for="input-1">
            <b-form-input 
            id="task-name"
            v-model="itemDetails.name" 
            placeholder="Christmas dinner menu"
            required/>
        </b-form-group>

        <b-form-group id="input-group-2" label="Description:" label-for="input-2">
            <b-form-textarea 
            id="task-desc" 
            v-model="itemDetails.description" 
            placeholder="Mashed Sweet Potatoes..."
            rows="1" 
            cols="40"
            max-rows="5"/>
        </b-form-group>

        <b-form-group id="input-group-3" label="Tags:" label-for="input-3">
            <b-form-tags 
            id="tags-basic"
            input-id="tags-basic" 
            placeholder="Enter a tag..." 
            v-model="itemDetails.tags"/>
        </b-form-group>

        <b-form-group id="input-group-5" label="Priority:" label-for="input-5">
            <b-form-select
            id="task-pri"
            v-model="itemDetails.priority"
            :options="['High','Medium','Low']"/>
        </b-form-group>

        <label for="start-datepicker">Start date</label>
        <b-form-datepicker 
            id="task-start" 
            v-model="itemDetails.startDate" 
            placeholder="" 
            class="mb-2"/>

        <label for="end-datepicker">End date</label>
        <b-form-datepicker 
            id="task-end" 
            v-model="itemDetails.dueDate" 
            placeholder="" 
            class="mb-2"/>

        <b-form-group id="input-group-6" label="Pinned:" label-for="input-6">
            <b-form-select
            id="task-pin"
            v-model="itemDetails.pinned"
            :options="[true,false]"/>
        </b-form-group>

        <b-button id="task-save" @click="handleClickSaveItem(itemDetails)" variant="primary">Save</b-button>
    </b-form>
</template>



<script setup lang="ts">
import {TodoItem, cloneTemplateForm, blankItemForm} from '../data'


// props
interface Props {
    itemDetails?: TodoItem
}

// default values for props
const props = withDefaults(defineProps<Props>(), {
  // NOTE: must use a "factory function" for all Object/Array prop default values
  // the factory function's job is basically to create a clone each time, 
  // so as to prevent unexpected mutations of the default value 
  itemDetails: () => cloneTemplateForm(blankItemForm),

  // no factory function needed for primitive types

})

// events
const emit = defineEmits<{
  (e: 'ClickSaveItem', item: TodoItem): void
}>()

function handleClickSaveItem(itemDetails: TodoItem) {
  emit("ClickSaveItem", itemDetails)
}

</script>