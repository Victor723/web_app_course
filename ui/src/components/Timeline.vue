<template>
  <div id="app">
    <div class="content">
      <VueDjGantt
        :from="from"
        :to="to"

        :list="list"
        :rows="rows"
        :items="items"

        locale="pl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Vue from 'vue';
import VueDjGantt from '@/components/VueDjGantt.vue';
import { defineComponent, computed } from 'vue';
import moment from "moment";
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

// computed 
const from = computed(() => moment().startOf('day').toDate());
const to = computed(() => moment().add(1, 'month').endOf('day').toDate());
const list = computed(() => [
        {
          id: "listName",
          width: 80,
          header: {
            content: "List"
          }
        },
        {
          id: "taskName",
          width: 160,
          header: {
            content: "Task"
          }
        },
      ]);

const rows = computed(() => {
  let rows = [];
  let uniIdx = 0;
  for (let i = 0; i < props.lists.length; i++) {
    for (let j = 0; j < props.lists[i].items.length; j++) {
      rows.push({
        id: uniIdx,
        listName: props.lists[i].name,
        taskName: props.lists[i].items[j].name,
      })
      uniIdx++;
    }
  }
  return rows;
});

const items = computed(() => {
  let items = [];
  let uniIdx = 0;
  for (let i = 0; i < props.lists.length; i++) {
    for (let j = 0; j < props.lists[i].items.length; j++) {
      if (props.lists[i].items[j].status == "In Progress") {
        items.push({
          rowId: uniIdx,
          label: props.lists[i].items[j].name,
          style: {background: '#24abf2'},
          time: {
            start: (props.lists[i].items[j].startDate == "") ? 
              moment(props.lists[i].items[j].dueDate).subtract(1, 'day').toDate() : 
              moment(props.lists[i].items[j].startDate).toDate(),
            end: moment(props.lists[i].items[j].dueDate).toDate(),
          },
        })
        uniIdx++;
      }
    }
  }
  return items;
})

</script>
