<template>
  <div class="wrapper">
    <form @submit.prevent="handleAddTodo">
      <input v-model="todoItem" type="text" placeholder="Todoの内容" />
      <button>追加</button>
    </form>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        {{ todo.body }}
        <input
          :checked="todo.done"
          type="checkbox"
          @change="handleChangeTodo($event, todo.id)"
        />
        <button @click="handleDeleteTodo(todo.id)">削除</button>
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

<style scoped>
.wrapper {
  padding: 100px;
}
</style>
