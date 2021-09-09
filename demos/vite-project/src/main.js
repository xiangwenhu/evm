import { createApp } from 'vue'
import App from './App.vue'

window.__evm_ready__ ? render() : setTimeout(render, 3000)

function render() {
    createApp(App).mount('#app')
}