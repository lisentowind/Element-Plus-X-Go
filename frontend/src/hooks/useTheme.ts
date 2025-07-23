import { computed } from 'vue'
import { useDesignStore } from '@/stores/modules/design'
import { headerTheme, menuTheme, asideTheme, optimumHeaderTheme } from '@/config/darkMode'

export const useTheme = () => {
  const designStore = useDesignStore()

  const currentTheme = computed(() => designStore.darkMode)

  // 应用主题样式到 DOM
  const applyThemeStyles = () => {
    const theme = designStore.darkMode
    const root = document.documentElement

    // 应用 HTML class 用于简单的暗/亮色切换
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // 应用详细的主题 CSS 变量
    const themes = {
      header: headerTheme[theme],
      menu: menuTheme[theme],
      aside: asideTheme[theme],
      optimumHeader: optimumHeaderTheme[theme]
    }

    // 设置 CSS 变量
    Object.values(themes).forEach((themeVars) => {
      if (themeVars) {
        Object.entries(themeVars).forEach(([key, value]) => {
          root.style.setProperty(key, value as string)
        })
      }
    })
  }

  // 切换主题
  const toggleTheme = () => {
    const themes: Array<'light' | 'dark'> = ['light', 'dark']
    const currentIndex = themes.indexOf(designStore.darkMode)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]

    designStore.setDarkMode(nextTheme)
    applyThemeStyles()
  }

  // 设置特定主题
  const setTheme = (theme: 'light' | 'dark') => {
    designStore.setDarkMode(theme)
    applyThemeStyles()
  }

  // 获取主题图标
  const getThemeIcon = computed(() => {
    switch (designStore.darkMode) {
      case 'light':
        return 'UilMoon'
      case 'dark':
        return 'UilSun'
      default:
        return 'UilSun'
    }
  })

  // 获取主题名称
  const getThemeName = computed(() => {
    switch (designStore.darkMode) {
      case 'light':
        return '暗色模式'
      case 'dark':
        return '亮色模式'
      default:
        return '亮色模式'
    }
  })

  // 初始化主题
  const initTheme = () => {
    applyThemeStyles()
  }

  return {
    currentTheme,
    toggleTheme,
    setTheme,
    getThemeIcon,
    getThemeName,
    initTheme,
    applyThemeStyles
  }
}
