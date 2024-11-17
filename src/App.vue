<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
router.push({ name: 'Login' }); // 跳转到Main页面
</script>
<template>
<router-view></router-view>
</template>
<style scoped>
</style>