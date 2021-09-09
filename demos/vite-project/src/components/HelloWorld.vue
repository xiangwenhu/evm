<script setup>
import { ref, onMounted } from "vue";

defineProps({
  msg: String,
});

const btn1 = ref(null);

const count = ref(0);



function log2() {
  console.log("log2 btn1 clicked");
}

function log3() {
  console.log("log3 btn1 clicked");
}


function log() {
  console.log("log btn1 clicked");
}
onMounted(() => {
  const el = btn1.value;
  console.log("onMounted:",el);
  el.addEventListener("click", log);
  el.addEventListener("click", log);
  el.addEventListener("click", log);
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VSCode</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>
  <button ref="btn1" id="btn1" type="button" @click="count++">
    count is: {{ count }}
  </button>
  <button id="btn1" type="button" @click="count++">
    count is: {{ count }}
  </button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
