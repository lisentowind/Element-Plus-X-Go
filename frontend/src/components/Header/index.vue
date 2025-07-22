<script lang="ts" setup>
  import { useDark, useToggle } from '@vueuse/core'
  import { CloseTray } from '../../../wailsjs/go/main/App'
  import {
    WindowHide,
    WindowMaximise,
    WindowIsMaximised,
    WindowUnmaximise,
    WindowSetAlwaysOnTop,
    WindowReloadApp
  } from '../../../wailsjs/runtime/runtime'

  const centerDialogVisible = ref(false)
  const isMax = ref(false)
  const isTop = ref(false)
  const loading = ref(true)

  const openTheme = ref(false)
  const isDark = useDark()
  const toggleDark = useToggle(isDark)

  const changeTheme = () => {
    if (!openTheme.value) {
      ElMessage.info('暂未开放')
      return
    }
    toggleDark()
  }

  const quitApp = () => {
    centerDialogVisible.value = true
  }

  const getNowIsMaximised = async () => {
    const res = await WindowIsMaximised()
    isMax.value = res
  }

  const changeWindowSize = async () => {
    const res = await WindowIsMaximised()
    if (res) {
      WindowUnmaximise()
    } else {
      WindowMaximise()
    }

    // 等待窗口动画完成后再获取状态
    setTimeout(() => {
      getNowIsMaximised()
    }, 100)
  }

  const handelClose = () => {
    centerDialogVisible.value = false
    setTimeout(() => {
      CloseTray()
    }, 300)
  }

  const changeWindowFixed = () => {
    isTop.value = !isTop.value
    WindowSetAlwaysOnTop(isTop.value)
    ElMessage.success({
      message: isTop.value ? '窗口已置顶' : '窗口已取消置顶'
    })
  }

  defineOptions({
    name: 'AppHeader'
  })

  onMounted(() => {
    // 获取窗口状态
    getNowIsMaximised()
    isTop.value = false
    setTimeout(() => {
      loading.value = false
    }, 500)
  })
</script>

<template>
  <!-- 替代原生软件的边框 实现拖拽 -->
  <div class="header" @dblclick="changeWindowSize">
    <div class="left-control">
      <el-space>
        <div class="header-control-btn fixedWindow" @click="changeWindowFixed">
          <SvgIcon v-if="!isTop" name="TablerPinned" />
          <SvgIcon v-if="isTop" name="TablerPinnedOff" />
        </div>
        <div class="header-control-btn refresh" @click="WindowReloadApp">
          <SvgIcon name="TablerRefresh" />
        </div>
        <div class="header-control-btn theme" @click="changeTheme">
          <SvgIcon v-if="!isDark" name="UilSun" />
          <SvgIcon v-else name="UilMoon" />
        </div>
      </el-space>
    </div>
    <div class="right-contorl">
      <el-space>
        <div class="header-control-btn hide" @click="WindowHide">
          <SvgIcon name="TypcnMinus" />
        </div>
        <div class="header-control-btn window" @click="changeWindowSize">
          <SvgIcon v-if="!isMax" name="windowMax" />
          <SvgIcon v-if="isMax" name="windowMini" />
        </div>
        <div class="header-control-btn close" @click="quitApp">
          <SvgIcon name="EpCloseBold" />
        </div>
      </el-space>
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
  </div>
</template>

<style lang="less" scoped>
  .header {
    box-sizing: border-box;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    --my-drag-region: drag;
    -webkit-user-select: none;
    user-select: none;
    transition: all 0.3s;

    .left-control,
    .right-contorl {
      .header-control-btn {
        cursor: pointer;
        transition: all 0.3s;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid transparent;
        color: rgb(255, 255, 255);
        transition: all 0.3s;
        &:hover {
          border: 2px solid var(--header-control-btn-border-color);
        }
      }

      .fixedWindow,
      .refresh,
      .theme,
      .hide {
        background-color: rgb(24, 191, 59);
      }
      .window {
        background-color: rgb(255, 201, 5);
      }
      .close {
        background-color: rgb(251, 108, 100);
      }

      .fixedWindow,
      .refresh,
      .theme {
        font-weight: bold;
      }
    }
  }

  @keyframes rainbow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
