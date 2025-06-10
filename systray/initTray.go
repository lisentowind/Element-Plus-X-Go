package InitTray

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed assets/ico/logo.ico
var iconData []byte

var (
	lastClick           time.Time                // 记录上次点击时间
	clickMutex          sync.Mutex               // 防止并发冲突
	doubleClickDuration = 300 * time.Millisecond // 双击间隔阈值
)

var appCtx context.Context

func getIcon() []byte {
	return iconData
}

func onExit() {
	fmt.Println("退出系统托盘")
}

func showWindow() {
	// 取消最小化并显示窗口
	runtime.WindowUnminimise(appCtx)
	runtime.Show(appCtx)
}

func onReady() {
	systray.SetIcon(getIcon())
	systray.SetTitle("Tingfeng-AI")
	systray.SetTooltip("Tingfeng-AI app")

	// 创建一个菜单项
	mShow := systray.AddMenuItem("显示", "显示主窗口")
	mQuit := systray.AddMenuItem("退出", "退出程序")

	// 添加隐藏的默认菜单项（必须作为第一个菜单项）
	mDefault := systray.AddMenuItem("", "") // 空标题
	mDefault.Hide()                         // 隐藏但保持存在

	go func() {
		for {
			select {
			case <-mDefault.ClickedCh: // 单击托盘图标触发
				handleTrayClick()
			case <-mShow.ClickedCh:
				// 显示主窗口
				showWindow()
			case <-mQuit.ClickedCh:
				systray.Quit()
				os.Exit(0)
			}
		}
	}()
}

// 处理托盘图标点击（支持双击检测）
func handleTrayClick() {
	now := time.Now()

	clickMutex.Lock()
	defer clickMutex.Unlock()

	// 判断是否为双击
	if now.Sub(lastClick) < doubleClickDuration {
		// 双击触发特殊操作（示例：最大化窗口）
		runtime.WindowMaximise(appCtx)
		lastClick = time.Time{} // 重置时间防止重复触发
	} else {
		// 单击触发默认操作：显示窗口
		runtime.WindowMaximise(appCtx)
		lastClick = time.Time{} // 重置时间防止重复触发
	}
}

func InitTray(ctx context.Context) {
	appCtx = ctx
	systray.Run(onReady, onExit)
}
