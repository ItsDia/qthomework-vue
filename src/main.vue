<template>
  <div class="main-container">
    <header class="header">
      <h1>QT 养老院监控系统</h1>
      <div class="status">
        <span class="status-badge">系统运行中</span>
        <span class="alarm-text" v-if="isActive">{{warnMessage}}</span>
      </div>
      <select class="monitor-select"  @change="handleMonitorChange">
        <option value="1">监控ID 1</option>
        <option value="2">监控ID 2</option>
      </select>
      <div class="system-time">
        <span>{{ systemTime.date }}</span>
        <span>{{ systemTime.time }}</span>
      </div>
    </header>
    <div class="content">
      <div class="left-panel">
        <h2>YOLOV8-Pose Falldown Detection</h2>
        <div class="image-container">
          <p v-if="!imageSrc">正在等待图像数据...</p>
          <img v-if="imageSrc" :src="imageSrc" alt="图像数据" style="width: 100%;height: auto" />
        </div>
      </div>
      <div class="right-panel">
        <div class="systemInfo">
          <h1>系统状态</h1>
          <div class="systeminfo-text">
            <p style="font-size: 15px;padding: 0 10px">日志统计:</p>
            <div class="falldownlog">
              <p v-for="log in falldownLogs">{{log}}</p>
            </div>
          </div>
          <div id="echarts" style="width: 100%; height: 300px; border:1px solid #ffffff"></div>
        </div>
        <div class="controlpanel">
          <h1>控制面板</h1>
          <div class="controlitem">
            <p>当前噪声: {{curNoi}}</p>
            <p>当前温度: {{curTem}}</p>
            <input type="text" placeholder="输入要设置的温度" />
            <p>当前湿度: {{curWoa}}</p>
            <input type="text" placeholder="输入要设置的湿度" />
            <p>当前光照: {{curLig}}</p>
            <input type="text" placeholder="输入要设置的光照" />
            <button class="control-button" @click="handleButtonClick">设置</button>
            <button style="background: red;margin-top: 10px" @click="handleEmergencyCall">紧急喊话</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--<script setup lang="ts">-->
<!--import { ref, onMounted, onBeforeUnmount } from 'vue';-->
<!--import * as echarts from 'echarts';-->

<!--const isActive = ref(false);-->
<!--const warnMessage = ref('');-->
<!--const imageSrc = ref<string | null>(null);-->
<!--const falldownLogs = ref<string[]>([]);-->
<!--let websocket: WebSocket | null = null;-->

<!--const curID = ref(1);-->
<!--const curNoi = ref(0);-->
<!--const curTem = ref(0);-->
<!--const curWoa = ref(0);-->
<!--const curLig = ref(0);-->

<!--const systemTime = ref<{ date: string, time: string }>({ date: '', time: '' });-->

<!--const updateSystemTime = () => {-->
<!--  const date = new Date();-->
<!--  const year = date.getFullYear();-->
<!--  const month = String(date.getMonth() + 1).padStart(2, '0');-->
<!--  const day = String(date.getDate()).padStart(2, '0');-->
<!--  const hours = String(date.getHours()).padStart(2, '0');-->
<!--  const minutes = String(date.getMinutes()).padStart(2, '0');-->
<!--  const seconds = String(date.getSeconds()).padStart(2, '0');-->
<!--  systemTime.value = {-->
<!--    date: `${year}-${month}-${day}`,-->
<!--    time: `${hours}:${minutes}:${seconds}`-->
<!--  };-->
<!--};-->

<!--let intervalId: number;-->
<!--const latestData = ref<any>(null);-->

<!--const generateRandomData = () => {-->
<!--  const data = [];-->
<!--  for (let i = 0; i < 7; i++) {-->
<!--    data.push(Math.floor(Math.random() * 100));-->
<!--  }-->
<!--  return data;-->
<!--};-->

<!--onMounted(() => {-->
<!--  try {-->
<!--    websocket = new WebSocket('ws://127.0.0.1:48978');-->
<!--    websocket.binaryType = 'blob';-->

<!--    websocket.onopen = () => {-->
<!--      console.log('WebSocket连接已打开');-->
<!--    };-->

<!--    websocket.onmessage = (event: MessageEvent) => {-->
<!--      if (event.data instanceof Blob) {-->
<!--        const url = URL.createObjectURL(event.data);-->
<!--        imageSrc.value = url;-->
<!--      } else {-->
<!--        try {-->
<!--          const data = JSON.parse(event.data);-->
<!--          if (data.status === 'success') {-->
<!--            curID.value = data.ID;-->
<!--            curLig.value = data.Light;-->
<!--            curNoi.value = data.Noise;-->
<!--            curTem.value = data.Temperature;-->
<!--            curWoa.value = data.Water;-->
<!--          }-->

<!--          if (data.message) {-->
<!--            intervalId = setInterval(() => {-->
<!--              falldownLogs.value = [data.message, ...falldownLogs.value];-->
<!--              warnMessage.value = "警告！";-->
<!--              isActive.value = true;-->
<!--            }, 5000);-->
<!--          }-->
<!--        }catch (error) {-->
<!--            console.error('JSON解析错误:', error);-->
<!--        }-->
<!--      }-->

<!--    };-->

<!--    websocket.onclose = () => {-->
<!--      console.log('WebSocket连接已关闭');-->
<!--    };-->

<!--    websocket.onerror = (error) => {-->
<!--      console.error('WebSocket错误:', error);-->
<!--    };-->
<!--  } catch (error) {-->
<!--    console.error('WebSocket初始化失败:', error);-->
<!--  }-->

<!--  setInterval(updateSystemTime, 1000);-->
<!--  const chartDom = document.getElementById('echarts');-->
<!--  if (chartDom) {-->
<!--    const myChart = echarts.init(chartDom);-->
<!--    const option: echarts.EChartsOption = {-->
<!--      xAxis: {-->
<!--        type: 'category',-->
<!--        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']-->
<!--      },-->
<!--      yAxis: {-->
<!--        type: 'value'-->
<!--      },-->
<!--      series: [-->
<!--        {-->
<!--          data: generateRandomData(),-->
<!--          type: 'line',-->
<!--          smooth: true-->
<!--        }-->
<!--      ]-->
<!--    };-->
<!--    myChart.setOption(option);-->
<!--  } else {-->
<!--    console.error('ECharts DOM element not found');-->
<!--  }-->
<!--});-->

<!--const handleMonitorChange = (event: Event) => {-->
<!--  console.log('切换摄像头');-->
<!--  const target = event.target as HTMLSelectElement;-->
<!--  if (websocket && websocket.readyState === WebSocket.OPEN) {-->
<!--    const data = JSON.stringify({-->
<!--      type: 'query',-->
<!--      id: target.value-->
<!--    });-->
<!--    console.log(target.value);-->
<!--    websocket.send(data);-->
<!--  }-->
<!--};-->

<!--const handleButtonClick = () => {-->
<!--  console.log('设置参数');-->
<!--  if (websocket && websocket.readyState === WebSocket.OPEN) {-->
<!--    const data = JSON.stringify({-->
<!--      type: 'update',-->
<!--      id: curID.value,-->
<!--      light: curLig.value,-->
<!--      noise: curNoi.value,-->
<!--      temperature: curTem.value,-->
<!--      water: curWoa.value-->
<!--    });-->
<!--    websocket.send(data);-->
<!--  }-->
<!--};-->

<!--onBeforeUnmount(() => {-->
<!--  if (websocket) {-->
<!--    websocket.close();-->
<!--  }-->
<!--  clearInterval(intervalId);-->
<!--});-->
<!--</script>-->

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as echarts from 'echarts';

const isActive = ref(false);
const warnMessage = ref('');
const imageSrc = ref<string | null>(null);
const falldownLogs = ref<string[]>([]);
let websocket: WebSocket | null = null;

const curID = ref(1);
const curNoi = ref(0);
const curTem = ref(0);
const curWoa = ref(0);
const curLig = ref(0);

const systemTime = ref<{ date: string, time: string }>({ date: '', time: '' });

const updateSystemTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  systemTime.value = {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`
  };
};

let intervalId: number;
const latestMessage = ref<string | null>(null);

const generateRandomData = () => {
  const data = [];
  for (let i = 0; i < 7; i++) {
    data.push(Math.floor(Math.random() * 100));
  }
  return data;
};

onMounted(() => {
  try {
    websocket = new WebSocket('ws://127.0.0.1:48978');
    websocket.binaryType = 'blob';

    websocket.onopen = () => {
      console.log('WebSocket连接已打开');
    };

    websocket.onmessage = (event: MessageEvent) => {
      if (event.data instanceof Blob) {
        const url = URL.createObjectURL(event.data);
        imageSrc.value = url;
      } else {
        try {
          const data = JSON.parse(event.data);
          if (data.status === 'success') {
            curID.value = data.ID;
            curLig.value = data.Light;
            curNoi.value = data.Noise;
            curTem.value = data.Temperature;
            curWoa.value = data.Water;
          }

          if (data.message) {
            latestMessage.value = data.message;
          }
        } catch (error) {
          console.error('JSON解析错误:', error);
        }
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };
  } catch (error) {
    console.error('WebSocket初始化失败:', error);
  }

  // 每隔5秒更新一次日志
  intervalId = setInterval(() => {
    if (latestMessage.value) {
      falldownLogs.value = [latestMessage.value, ...falldownLogs.value];
      warnMessage.value = "警告！";
      isActive.value = true;
    }
  }, 5000);

  setInterval(updateSystemTime, 1000);
  const chartDom = document.getElementById('echarts');
  if (chartDom) {
    const myChart = echarts.init(chartDom);
    const option: echarts.EChartsOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: generateRandomData(),
          type: 'line',
          smooth: true
        }
      ]
    };
    myChart.setOption(option);
  } else {
    console.error('ECharts DOM element not found');
  }
});

const handleMonitorChange = (event: Event) => {
  console.log('切换摄像头');
  const target = event.target as HTMLSelectElement;
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    const data = JSON.stringify({
      type: 'query',
      id: target.value
    });
    console.log(target.value);
    websocket.send(data);
  }
};

const handleButtonClick = () => {
  console.log('设置参数');
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    const data = JSON.stringify({
      type: 'update',
      id: curID.value,
      light: curLig.value,
      noise: curNoi.value,
      temperature: curTem.value,
      water: curWoa.value
    });
    websocket.send(data);
  }
};

const handleEmergencyCall = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    console.log('Microphone access granted and audio stream is being processed.');
  } catch (error) {
    console.error('Error accessing the microphone:', error);
  }
};

onBeforeUnmount(() => {
  if (websocket) {
    websocket.close();
  }
  clearInterval(intervalId);
});
</script>

<style>
.main-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  color: #fff;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 50px;
  background: linear-gradient(45deg, #00414a, #00a896);
  border-bottom: 1px solid #444;
}

.status {
  display: flex;
  gap: 10px;
  margin-right: auto;
}

.status-badge {
  background-color: #00ff00;
  box-shadow: 0 0 10px #00ff00;
  padding: 5px 8px;
  border-radius: 10px;
  color: #000;
  margin-left: 20px;
}

.monitor-select {
  display: flex;
  font-size: 15px;
  font-weight: 300;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background-color: #00a896;
  color: #fff;
  border: 1px solid #444;
  padding: 10px 10px;
  position: absolute;
}

.system-time {
  margin-left: auto;
  font-size: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.content {
  display: flex;
  flex: 1;
}

.left-panel {
  flex: 1.5;
  border-radius: 10px;
  border: 1px solid #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.left-panel h2 {
  font-size: 25px;
  margin-bottom: 15px;
  position: absolute;
  top: 30px;
}

.image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 5px;
  margin-top: 15px;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  border: 1px solid #ffffff;
  border-radius: 10px;
}

.systemInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  width: 550px;
}
.systeminfo-text{
  display: flex;
  flex-direction: column;
  border: 1px solid #ffffff;
  width: 100%;
  margin-bottom: 10px;
}
.falldownlog{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  font-size: 10px;
  overflow: auto;
  max-height: 100px;
  padding: 0 10px;
  border: 1px solid #ffffff;
}
.controlpanel{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid #ffffff;
  border-radius: 5px;
  width: 550px;
  height: 300px;
  margin-top: 20px;
  overflow: auto;
}
.controlitem{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 200px;
  overflow: auto;
}
.alarm-text {
  background-color: red;
  transition: all 0.5s ease-in-out;
  padding: 5px 8px;
  border-radius: 3px;
  box-shadow: 0 0 50px red;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 800px;
  height: 600px;
  border-radius: 5px;
  border: 1px solid #ffffff;
  transition: all 0.5s ease-in-out;
}
</style>