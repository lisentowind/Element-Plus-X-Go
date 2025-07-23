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
  <div class="app-header" @dblclick="changeWindowSize" @contextmenu="showContextMenu">
    <div class="left-control">
      <div class="control-group">
        <div
          class="control-btn pin-btn"
          @click.prevent="changeWindowFixed"
          :class="{ active: isTop }"
          :title="isTop ? '取消置顶' : '窗口置顶'"
        >
          <div class="btn-content">
            <SvgIcon v-if="!isTop" name="TablerPinned" />
            <SvgIcon v-if="isTop" name="TablerPinnedOff" />
          </div>
          <div class="btn-ripple"></div>
        </div>
        <div class="control-btn refresh-btn" @click.prevent="WindowReloadApp" title="刷新应用">
          <div class="btn-content">
            <SvgIcon name="TablerRefresh" />
          </div>
          <div class="btn-ripple"></div>
        </div>
        <div class="control-btn theme-btn" @click.prevent="changeTheme" title="切换主题">
          <div class="btn-content">
            <SvgIcon :name="getThemeIcon" />
          </div>
          <div class="btn-ripple"></div>
        </div>
      </div>
    </div>

    <div class="app-title">
      <div class="title-container">
        <div class="title-icon">
          <div class="icon-dot"></div>
        </div>
        <span class="title-text">Element AI Studio</span>
        <div class="title-badge">Pro</div>
      </div>
    </div>

    <div class="right-control">
      <div class="control-group">
        <div class="control-btn minimize-btn" @click.prevent="WindowHide" title="最小化">
          <div class="btn-content">
            <SvgIcon name="TypcnMinus" />
          </div>
          <div class="btn-ripple"></div>
        </div>
        <div class="control-btn maximize-btn" @click.prevent="changeWindowSize" :title="isMax ? '还原窗口' : '最大化'">
          <div class="btn-content">
            <SvgIcon v-if="!isMax" name="windowMax" />
            <SvgIcon v-if="isMax" name="windowMini" />
          </div>
          <div class="btn-ripple"></div>
        </div>
        <div class="control-btn close-btn" @click.prevent="quitApp" title="关闭应用">
          <div class="btn-content">
            <SvgIcon name="EpCloseBold" />
          </div>
          <div class="btn-ripple"></div>
        </div>
      </div>
    </div>
    <el-dialog v-model="centerDialogVisible" width="500" align-center append-to-body>
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

<style lang="less" scoped src="./index.less"></style>
