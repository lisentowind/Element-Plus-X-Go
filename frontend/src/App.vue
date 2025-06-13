<script lang="ts" setup>
  import AppHeader from '@/components/Header/index.vue'
  const loading = ref(true)

  const messageConfig = reactive({
    offset: 65
  })

  onMounted(() => {
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
</script>

<template>
  <el-config-provider :message="messageConfig">
    <div class="element-box" v-loading="loading" element-loading-text="拼命加载中...">
      <AppHeader />
      <div class="body">
        <RouterView />
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="less" scoped>
  .element-box {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding: 5px 10px;
    background-color: var(--custom-window-back-color);
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid var(--custom-border-color);
    border-radius: var(--custom-border-radius-mini);

    .body {
      width: 100%;
      height: 100%;
    }
  }
</style>
