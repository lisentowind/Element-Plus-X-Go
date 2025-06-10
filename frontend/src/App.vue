<script lang="ts" setup>
  import { CloseTray } from 'wailsjs/go/main/App'
  import { WindowHide, WindowMaximise, WindowIsMaximised, WindowUnmaximise } from 'wailsjs/runtime/runtime'

  const centerDialogVisible = ref(false)
  const quitApp = () => {
    centerDialogVisible.value = true
  }

  const isMax = ref(false)
  const getNowIsMaximised = async () => {
    const res = await WindowIsMaximised()
    isMax.value = res
  }

  const changeWindowSize = async () => {
    const res = await WindowIsMaximised()
    if (res) {
      WindowUnmaximise()
      getNowIsMaximised()
    } else {
      WindowMaximise()
      getNowIsMaximised()
    }
  }

  const handelClose = () => {
    centerDialogVisible.value = false
    setTimeout(() => {
      CloseTray()
    }, 300)
  }

  onMounted(() => {
    // 获取窗口状态
    getNowIsMaximised()
  })
</script>

<template>
  <div class="element-box">
    <!-- 替代原生软件的边框 实现拖拽 -->
    <div class="header">
      <el-space>
        <el-button type="success" circle plain @click="WindowHide"
          ><el-icon><Minus /></el-icon>
        </el-button>
        <el-button type="success" circle plain @click="changeWindowSize">
          <el-icon v-if="isMax"><FullScreen /></el-icon>
          <el-icon v-if="!isMax"><ZoomOut /></el-icon>
        </el-button>
        <el-button type="danger" circle plain @click="quitApp">
          <el-icon><Close /></el-icon>
        </el-button>
      </el-space>
    </div>
    <div class="body">
      <RouterView />
    </div>
  </div>
  <el-dialog v-model="centerDialogVisible" width="500" align-center>
    <span>确定要退出吗？</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handelClose"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
  .element-box {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding: 5px 0 10px 0;
    background-color: #ffffff;
    box-sizing: border-box;
    overflow: hidden;

    .body {
      width: 100%;
    }

    .header {
      display: flex;
      padding: 0 10px 5px 10px;
      justify-content: flex-start;
      align-items: center;
      --my-drag-region: drag;
      -webkit-user-select: none;
      user-select: none;
      cursor: grab;
    }
  }
</style>
