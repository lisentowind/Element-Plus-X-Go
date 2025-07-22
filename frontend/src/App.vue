<script lang="ts" setup>
  import AppHeader from '@/components/Header/index.vue'
  import { useTheme } from '@/hooks/useTheme'

  const loading = ref(true)
  const isPinned = ref(false)
  const { initTheme } = useTheme()

  const messageConfig = reactive({
    offset: 65
  })

  const handlePinnedChange = (pinned: boolean) => {
    isPinned.value = pinned
  }

  onMounted(() => {
    // 初始化主题
    initTheme()

    setTimeout(() => {
      loading.value = false
    }, 500)
  })
</script>

<template>
  <el-config-provider :message="messageConfig">
    <div class="element-box" :class="{ pinned: isPinned }" v-loading="loading" element-loading-text="拼命加载中...">
      <AppHeader @pinned-change="handlePinnedChange" />
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
    transition: all 0.3s ease;
    position: relative;

    &.pinned {
      border: 2px solid #3b82f6;
      box-shadow:
        0 0 20px rgba(59, 130, 246, 0.3),
        0 0 40px rgba(59, 130, 246, 0.2),
        inset 0 0 20px rgba(59, 130, 246, 0.1);

      &::before {
        content: '';
        position: absolute;
        inset: -2px;
        border-radius: var(--custom-border-radius-mini);
        background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6);
        background-size: 400% 400%;
        animation: pinnedGlow 0.3s ease infinite;
        z-index: -1;
        opacity: 0.6;
      }

      &::after {
        content: '📌 置顶模式';
        position: absolute;
        bottom: 12px;
        right: 2%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
        animation: pinnedPulse 2s ease-in-out infinite;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }

    .body {
      width: 100%;
      height: 100%;
    }
  }

  @keyframes pinnedGlow {
    0% {
      background-position: 0% 50%;
      opacity: 0.4;
    }
    50% {
      background-position: 100% 50%;
      opacity: 0.8;
    }
    100% {
      background-position: 0% 50%;
      opacity: 0.4;
    }
  }

  @keyframes pinnedPulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.05);
      opacity: 1;
    }
  }
</style>
