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
  return items;
})

// // computed for lists
// const myData = computed(() => {
//   const lists = props.lists
//   const list = lists.map((list) => {
//     return {
//       id: list.id,
//       name: list.name,
//       color: list.color,
//     }
//   })
//   const rows = lists.map((list) => {
//     return {
//       id: list.id,
//       name: list.name,
//       color: list.color,
//     }
//   })
//   const items = lists.map((list) => {
//     return list.items.map((item) => {
//       return {
//         id: item.id,
//         name: item.name,
//         start: moment(item.startDate).format("YYYY-MM-DD"),
//         end: moment(item.dueDate).format("YYYY-MM-DD"),
//         row: item.listId,
//         color: list.color,
//       }
//     })
//   })
//   const from = moment().format("YYYY-MM-DD");
//   const to = moment().add(1, "month").format("YYYY-MM-DD");
//   return {list, rows, items, from, to}
// })

// function populateRows(lists: TodoList[]) {
  // let rows = []
  // console.log("TEST: lists:", lists)
  // for (let i = 0; i < lists.length; i++) {
  //   console.log("TEST: list:", lists[i])
  //   for (let j = 0; j < lists[i].items.length; j++) {
  //     rows.push({
  //       id: i,
  //       interalId: i,
  //       name: lists[i].name,
  //     })
  //   }
  // }
  // console.log("rows: " + rows)
  // return rows

//   return [
//         {
//           id: 1,
//           internalId: 1,
//           name: 'First',
//         },
//         {
//           id: 2,
//           internalId: 2,
//           name: 'Second',
//         },
//       ]
// }

// const Timeline = defineComponent({
//   components: {
//     VueDjGantt
//   },

//   setup() {
//     const myData = {
//       list: [
//         {
//           id: "internalId",
//           width: 80,
//           header: {
//             content: "List"
//           }
//         },
//       ],

//       from: (+ +new Date()) - (2 * 24 * 60 * 60 * 1000),
//       to: moment().startOf('day').add(1, 'months'),

//       rows: populateRows(this.lists),

//       items: [
//         {
//           rowId: 1,
//           label: `Some task`,
//           style: {background: '#24abf2'},
//           time: {
//             start: (+ +new Date("2022-12-07")),
//             end: (+ +new Date("2022-12-15")),
//           },
//         },
//         {
//           rowId: 2,
//           label: `Other task`,
//           style: {background: '#abf224'},
//           time: {
//             start: moment().add(12, 'hours'),
//             end: moment().add(2, 'days').add(4, 'hours'),
//           },
//         },
//       ],
//     };

//     return {
//       myData
//     };
//   }
// });
</script>
