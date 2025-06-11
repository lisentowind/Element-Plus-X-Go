<script lang="ts" setup>
  import { CloseTray } from 'wailsjs/go/main/App'
  import {
    WindowHide,
    WindowMaximise,
    WindowIsMaximised,
    WindowUnmaximise,
    WindowSetAlwaysOnTop,
    WindowReloadApp
  } from 'wailsjs/runtime/runtime'

  const centerDialogVisible = ref(false)
  const isMax = ref(false)
  const isTop = ref(false)

  const messageConfig = reactive({
    offset: 65
  })
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
    ElMessage.info({
      message: isTop.value ? '窗口已置顶' : '窗口已取消置顶'
    })
  }

  onMounted(() => {
    // 获取窗口状态
    getNowIsMaximised()
    isTop.value = false
  })
</script>

<template>
  <el-config-provider :message="messageConfig">
    <div class="element-box">
      <!-- 替代原生软件的边框 实现拖拽 -->
      <div class="header">
        <div class="left-control">
          <el-space>
            <el-tooltip :content="isTop ? '取消固定' : '固定窗口'">
              <div class="header-control-btn fixedWindow" @click="changeWindowFixed">
                <SvgIcon v-if="!isTop" name="TablerPinned" />
                <SvgIcon v-if="isTop" name="TablerPinnedOff" />
              </div>
            </el-tooltip>
            <el-tooltip :content="'刷新'">
              <div class="header-control-btn refresh" @click="WindowReloadApp">
                <SvgIcon name="TablerRefresh" />
              </div>
            </el-tooltip>
          </el-space>
        </div>
        <div class="right-contorl">
          <el-space>
            <el-tooltip :content="'最小化'">
              <div class="header-control-btn hide" @click="WindowHide">
                <SvgIcon name="TypcnMinus" />
              </div>
            </el-tooltip>
            <el-tooltip :content="isMax ? '最小化' : '最大化'">
              <div class="header-control-btn window" @click="changeWindowSize">
                <SvgIcon v-if="!isMax" name="windowMax" />
                <SvgIcon v-if="isMax" name="windowMini" />
              </div>
            </el-tooltip>
            <el-tooltip :content="'关闭'">
              <div class="header-control-btn close" @click="quitApp">
                <SvgIcon name="EpCloseBold" />
              </div>
            </el-tooltip>
          </el-space>
        </div>
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
  </el-config-provider>
</template>

<style lang="less" scoped>
  .element-box {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    padding: 10px;
    background-color: var(--custom-window-back-color);
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid var(--custom-border-color);
    border-radius: var(--custom-border-radius-mini);

    .body {
      width: 100%;
      height: 100%;
    }

    .header {
      box-sizing: border-box;
      padding: 5px 10px;
      margin-bottom: 5px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      --my-drag-region: drag;
      -webkit-user-select: none;
      user-select: none;
      transition: all 0.3s;
      box-shadow: var(--custom-box-shadow-min);
      border-radius: var(--custom-border-radius-big);
      background-color: black;
      // background-color: transparent;
      // background: linear-gradient(270deg, #00e6778c, #00bfa678, #00e5ffa7, #2195f3b0, #661fff81, #00e6778c);
      // background-size: 600% 600%;
      // animation: rainbow 20s linear infinite;

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
            border: 2px solid white;
          }
        }

        .fixedWindow,
        .refresh,
        .hide {
          background-color: rgb(24, 191, 59);
        }
        .window {
          background-color: rgb(255, 201, 5);
        }
        .close {
          background-color: rgb(251, 108, 100);
        }
      }

      // .left-control {
      //   width: 300px;
      //   display: flex;
      //   justify-content: flex-start;
      //   align-items: center;
      //   .header-control-btn {
      //     margin: 0 8px 0 0;
      //   }
      // }
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
