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

<script lang="ts">
import Vue from 'vue';
import VueDjGantt from '@/components/VueDjGantt.vue';
import moment from "moment";

export default Vue.extend({
  components: {
    VueDjGantt
  },

  data() {
    return {
      list: [
        {
          id: "internalId",
          width: 80,
          header: {
            content: "List"
          }
        },
        {
          id: "name",
          width: 200,
          header: {
            content: "Task"
          }
        },
      ],

      from: (+ +new Date()) - (2 * 24 * 60 * 60 * 1000),
      to: moment().startOf('day').add(1, 'months'),

      rows: [
        {
          id: 1,
          internalId: '#1',
          name: 'First',
        },
        {
          id: 2,
          internalId: '#2',
          name: 'Second',
        },
      ],

      items: [
        {
          rowId: 1,
          label: `Some task`,
          style: {background: '#24abf2'},
          time: {
            start: (+ +new Date("2022-12-07")),
            end: (+ +new Date("2022-12-15")),
          },
        },
        {
          rowId: 2,
          label: `Other task`,
          style: {background: '#abf224'},
          time: {
            start: moment().add(12, 'hours'),
            end: moment().add(2, 'days').add(4, 'hours'),
          },
        },
      ],
    }
  },
});
</script>
