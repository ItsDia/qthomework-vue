<template>
  <div v-if="isLogined">
    <router-view></router-view>
  </div>
  <div v-else class="container">
    <div class="left-panel">
      <h1>QT大作业展示登陆页面</h1>
      <img :src="currentGif" alt="GIF" class="gif" />
    </div>
    <div class="right-panel">
      <form @submit.prevent="login">
        <h2>登录</h2>
        <input type="text" v-model="user" placeholder="用户名" required />
        <input type="password" v-model="password" placeholder="密码" required />
        <button type="submit">登录</button>
        <div class="options">
          <a href="#">忘记密码？</a>
          <a href="#">注册</a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const gifs = ref<string[]>([
  './output1.gif',
  './output3.gif',
  './output5.gif'
]);

const isLogined = ref(false);
const currentGif = ref<string>(gifs.value[0]);
const user = ref<string>('');
const password = ref<string>('');
let socket: WebSocket | null = null;

let gifIndex = 0;
setInterval(() => {
  gifIndex = (gifIndex + 1) % gifs.value.length;
  currentGif.value = gifs.value[gifIndex];
}, 3000);

onMounted(() => {
  socket = new WebSocket('ws://127.0.0.1:48978');
  socket.onopen = () => {
    console.log('WebSocket连接已打开');
  };
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      // console.log('收到JSON消息: ', message);
      if (message.status === 'success') {
        isLogined.value = true;
        router.push({ name: 'Main' });
      } else if (message.status === 'error') {
        alert('登录失败');
      }
    } catch (error) {
      console.error('JSON解析错误: ', error);
    }
  };
  socket.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
  socket.onerror = (error) => {
    console.error('WebSocket错误: ', error);
  };
});

const login = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const data = JSON.stringify({
      type: 'login',
      user: user.value,
      password: password.value
    });
    socket.send(data);
  }
};
</script>

<style>
.container {
  display: flex;
  height: 100vh;
}

.left-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #00414a;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
}

.left-panel h1 {
  position: absolute;
  top: 30px;
  width: 100%;
  text-align: center;
  font-size: 50px;
  letter-spacing: 10px;
  font-weight: 1000;
  background: linear-gradient(45deg, #00414a, #00a896);
  -webkit-background-clip: text;
  color: transparent;
}

.gif {
  max-width: 80%;
  max-height: 60vh;
  border-radius: 10px;
  transition: transform 0.3s;
}

.right-panel {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #00414a;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  width: 350px;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #00a896;
}

input {
  margin-bottom: 15px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #00a896;
  outline: none;
}

button {
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  background-color: #028090;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #026c7c;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.options a {
  color: #028090;
  text-decoration: none;
  font-size: 14px;
}

.options a:hover {
  text-decoration: underline;
}
</style>