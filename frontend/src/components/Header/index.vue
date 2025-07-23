<script lang="ts" setup>
  import { CloseTray } from '../../../wailsjs/go/main/App'
  import {
    WindowHide,
    WindowMaximise,
    WindowIsMaximised,
    WindowUnmaximise,
    WindowSetAlwaysOnTop,
    WindowReloadApp
  } from '../../../wailsjs/runtime/runtime'
  import { useTheme } from '@/hooks/useTheme'

  const emit = defineEmits<{
    (e: 'pinned-change', isPinned: boolean): void
  }>()

  const centerDialogVisible = ref(false)
  const isMax = ref(false)
  const isTop = ref(false)
  const loading = ref(true)

  // 右键菜单相关状态
  const contextMenuVisible = ref(false)
  const contextMenuPosition = ref({ x: 0, y: 0 })

  const { toggleTheme, getThemeIcon, getThemeName, currentTheme } = useTheme()

  // 右键菜单项配置
  const contextMenuItems = computed(() => [
    {
      label: isTop.value ? '取消置顶' : '窗口置顶',
      icon: isTop.value ? 'TablerPinnedOff' : 'TablerPinned',
      action: changeWindowFixed,
      type: 'pin'
    },
    {
      label: '刷新应用',
      icon: 'TablerRefresh',
      action: () => WindowReloadApp(),
      type: 'refresh'
    },
    {
      label: `切换到${getThemeName.value}`,
      icon: getThemeIcon.value,
      action: changeTheme,
      type: 'theme'
    },
    { type: 'divider' },
    {
      label: '最小化',
      icon: 'TypcnMinus',
      action: () => WindowHide(),
      type: 'minimize'
    },
    {
      label: isMax.value ? '还原窗口' : '最大化',
      icon: isMax.value ? 'windowMini' : 'windowMax',
      action: changeWindowSize,
      type: 'maximize'
    },
    { type: 'divider' },
    {
      label: '关闭应用',
      icon: 'EpCloseBold',
      action: quitApp,
      type: 'close'
    }
  ])

  const changeTheme = () => {
    toggleTheme()
    ElMessage.success(`已切换到${getThemeName.value}`)
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
    emit('pinned-change', isTop.value)
    ElMessage.success({
      message: isTop.value ? '窗口已置顶' : '窗口已取消置顶'
    })
  }

  // 右键菜单事件处理
  const showContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    contextMenuPosition.value = { x: event.clientX, y: event.clientY }
    contextMenuVisible.value = true
  }

  const hideContextMenu = () => {
    contextMenuVisible.value = false
  }

  const handleMenuItemClick = (item: any) => {
    if (item.action) {
      item.action()
    }
    hideContextMenu()
  }

  // 点击其他地方隐藏菜单
  const handleClickOutside = () => {
    hideContextMenu()
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

    // 添加全局点击事件监听
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    // 清理事件监听器
    document.removeEventListener('click', handleClickOutside)
  })
</script>

<template>
  <!-- 替代原生软件的边框 实现拖拽 -->
  <div class="header" @dblclick="changeWindowSize" @contextmenu="showContextMenu">
    <div class="left-control">
      <el-space :size="8">
        <div
          class="header-control-btn fixedWindow"
          @click.prevent="changeWindowFixed"
          :class="{ active: isTop }"
          :title="isTop ? '取消置顶' : '窗口置顶'"
        >
          <SvgIcon v-if="!isTop" name="TablerPinned" />
          <SvgIcon v-if="isTop" name="TablerPinnedOff" />
        </div>
        <div class="header-control-btn refresh" @click.prevent="WindowReloadApp" title="刷新应用">
          <SvgIcon name="TablerRefresh" />
        </div>
        <div class="header-control-btn theme" @click.prevent="changeTheme" title="切换主题">
          <SvgIcon :name="getThemeIcon" />
        </div>
      </el-space>
    </div>

    <div class="app-title">
      <span>Elmeent-Plus-X</span>
    </div>

    <div class="right-contorl">
      <el-space :size="8">
        <div class="header-control-btn hide" @click.prevent="WindowHide" title="最小化">
          <SvgIcon name="TypcnMinus" />
        </div>
        <div class="header-control-btn window" @click.prevent="changeWindowSize" :title="isMax ? '还原窗口' : '最大化'">
          <SvgIcon v-if="!isMax" name="windowMax" />
          <SvgIcon v-if="isMax" name="windowMini" />
        </div>
        <div class="header-control-btn close" @click.prevent="quitApp" title="关闭应用">
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

    <!-- 右键菜单 -->
    <teleport to="body">
      <div
        v-if="contextMenuVisible"
        class="context-menu"
        :style="{
          left: contextMenuPosition.x + 'px',
          top: contextMenuPosition.y + 'px'
        }"
        @click.stop
      >
        <div
          v-for="(item, index) in contextMenuItems"
          :key="index"
          class="context-menu-item"
          :class="{
            light: currentTheme === 'light',
            dark: currentTheme === 'dark',
            divider: item.type === 'divider',
            [`menu-${item.type}`]: item.type !== 'divider'
          }"
          @click="item.type !== 'divider' ? handleMenuItemClick(item) : null"
        >
          <template v-if="item.type !== 'divider'">
            <SvgIcon :name="item.icon ?? ''" class="menu-icon" />
            <span class="menu-label">{{ item.label }}</span>
          </template>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="less" scoped>
  .header {
    box-sizing: border-box;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    --my-drag-region: drag;
    -webkit-user-select: none;
    user-select: none;
    transition: all 0.3s ease;

    .app-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      opacity: 0.8;
      pointer-events: none;
    }

    .left-control,
    .right-contorl {
      display: flex;
      align-items: center;
      z-index: 1;

      /* 确保按钮区域不会被拖拽区域影响 */
      --my-drag-region: no-drag;

      .header-control-btn {
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.9);
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        backdrop-filter: blur(8px);
        border: 1px solid transparent;
        user-select: none;
        -webkit-user-select: none;

        /* 增大点击区域 */
        &::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
          opacity: 0;
          transition: all 0.2s ease;
          z-index: -1;
        }

        &:hover {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.3);

          &::before {
            opacity: 1;
            inset: -2px;
          }
        }

        &:active {
          transform: translateY(1px) scale(0.98);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transition: all 0.1s ease;
        }

        .svg-icon {
          width: 16px;
          height: 16px;
          transition: all 0.2s ease;
          pointer-events: none;
        }
      }

      .fixedWindow {
        background: linear-gradient(135deg, #22c55e, #16a34a);

        &.active {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);

          &:hover {
            box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
          }
        }

        &:hover {
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);
        }
      }

      .refresh {
        background: linear-gradient(135deg, #22c55e, #16a34a);

        &:hover {
          box-shadow: 0 4px 16px rgba(34, 197, 94, 0.4);

          .svg-icon {
            transform: rotate(90deg);
          }
        }
      }

      .theme {
        background: linear-gradient(135deg, #8b5cf6, #7c3aed);

        &:hover {
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
      }

      .hide {
        background: linear-gradient(135deg, #6b7280, #4b5563);

        &:hover {
          box-shadow: 0 4px 16px rgba(107, 114, 128, 0.4);
        }
      }

      .window {
        background: linear-gradient(135deg, #f59e0b, #d97706);

        &:hover {
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
        }
      }

      .close {
        background: linear-gradient(135deg, #ef4444, #dc2626);

        &:hover {
          box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);

          .svg-icon {
            transform: rotate(90deg);
          }
        }
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

  // 右键菜单样式
  .context-menu {
    position: fixed;
    background: transparent;
    backdrop-filter: blur(12px);
    border-radius: 12px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    padding: 8px;
    min-width: 180px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 9999;
    animation: contextMenuFadeIn 0.15s ease-out;
    user-select: none;
    -webkit-user-select: none;

    .context-menu-item {
      width: 100%;
      display: flex;
      align-items: center;

      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);

      &:not(.divider):hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateX(2px);
      }

      &.divider {
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
        margin: 6px 0;
        padding: 0;
        cursor: default;
      }

      .menu-icon {
        width: 16px;
        height: 16px;
        margin-right: 12px;
        transition: all 0.2s ease;
      }

      .menu-label {
        flex: 1;
        font-weight: 500;
      }

      // 不同功能的颜色主题
      &.menu-pin {
        .menu-icon {
          color: #22c55e;
        }
        &:hover .menu-icon {
          color: #16a34a;
        }
      }

      &.menu-refresh {
        .menu-icon {
          color: #22c55e;
        }
        &:hover {
          .menu-icon {
            color: #16a34a;
            transform: rotate(90deg);
          }
        }
      }

      &.menu-theme {
        .menu-icon {
          color: #8b5cf6;
        }
        &:hover .menu-icon {
          color: #7c3aed;
        }
      }

      &.menu-minimize {
        .menu-icon {
          color: #6b7280;
        }
        &:hover .menu-icon {
          color: #4b5563;
        }
      }

      &.menu-maximize {
        .menu-icon {
          color: #f59e0b;
        }
        &:hover .menu-icon {
          color: #d97706;
        }
      }

      &.menu-close {
        .menu-icon {
          color: #ef4444;
        }
        &:hover {
          background: rgba(239, 68, 68, 0.1);
          .menu-icon {
            color: #dc2626;
            transform: rotate(90deg);
          }
        }
      }
    }

    .light {
      color: black;
    }
    .dark {
      color: white;
    }
  }

  @keyframes contextMenuFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-5px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
