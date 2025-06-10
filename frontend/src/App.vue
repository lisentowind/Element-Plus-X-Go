<script lang="ts" setup>
  import { CloseTray } from 'wailsjs/go/main/App'
  import { WindowHide } from 'wailsjs/runtime/runtime'

  const centerDialogVisible = ref(false)
  const quitApp = () => {
    centerDialogVisible.value = true
  }

  const handelClose = () => {
    centerDialogVisible.value = false
    setTimeout(() => {
      CloseTray()
    }, 300)
  }
</script>

<template>
  <div class="element-box">
    <!-- 替代原生软件的边框 实现拖拽 -->
    <div class="header">
      <el-space>
        <el-button type="success" :size="'small'" circle @click="WindowHide"
          ><el-icon><Minus /></el-icon>
        </el-button>
        <el-button type="danger" :size="'small'" circle @click="quitApp">
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
    // background-color: var(--custom-box-back-color);
    background-color: #ffffff;
    backdrop-filter: blur(15px);
    box-sizing: border-box;

    .body {
      width: 100%;
    }

    .header {
      display: flex;
      padding: 5px;
      justify-content: flex-start;
      align-items: center;
      --my-drag-region: drag;
      -webkit-user-select: none;
      user-select: none;
      cursor: grab;
    }
  }
</style>
