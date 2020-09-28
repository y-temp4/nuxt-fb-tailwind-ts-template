<template>
  <div class="wrapper">
    <form @submit.prevent="handleAddTodo">
      <input
        v-model="todoItem"
        type="text"
        placeholder="Todoの内容"
        class="input"
      />
      <button class="button">追加</button>
    </form>
    <ul class="list">
      <li v-for="todo in todos" :key="todo.id">
        <span :class="{ done: todo.done }">
          {{ todo.body }}
        </span>
        <input
          :checked="todo.done"
          type="checkbox"
          @change="handleChangeTodo($event, todo.id)"
        />
        <button class="button -alert" @click="handleDeleteTodo(todo.id)">
          削除
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { firebase } from '~/plugins/firebase'

type Todo = {
  id: string
  body: string
  done: boolean
}

export default Vue.extend({
  data() {
    return {
      todoItem: '',
      todos: [] as Todo[],
      unsubscribeTodos: () => {},
    }
  },
  async mounted() {
    this.unsubscribeTodos = await firebase
      .firestore()
      .collection('todos')
      .onSnapshot((snapshot) => {
        this.todos = snapshot.docs.map((doc) => {
          const id = doc.id
          const data = doc.data()
          return { id, ...data } as Todo
        })
      })
  },
  destroyed() {
    this.unsubscribeTodos()
  },
  methods: {
    async handleAddTodo() {
      await firebase.firestore().collection('todos').add({
        body: this.todoItem,
        done: false,
      })
      this.todoItem = ''
    },
    async handleChangeTodo(event: Event, id: string) {
      const done = (event.target as HTMLInputElement).checked
      await firebase.firestore().collection('todos').doc(id).update({ done })
    },
    async handleDeleteTodo(id: string) {
      const isOk = confirm('本当に削除してもよろしいですか？')
      if (isOk) {
        await firebase.firestore().collection('todos').doc(id).delete()
      }
    },
  },
})
</script>

<style lang="postcss" scoped>
.wrapper {
  @apply bg-gray-200 p-10 m-10;
}

.input {
  @apply border p-1;
}

.button {
  @apply bg-blue-600 rounded-sm text-white px-2 font-bold text-sm;

  &.-alert {
    @apply bg-red-600;
  }
}

.list {
  @apply list-disc mt-4 ml-5;
}

.done {
  @apply line-through;
}
</style>
