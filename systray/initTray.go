package InitTray

import (
	"context"
	_ "embed"
	"fmt"
	"os"

	"github.com/getlantern/systray"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed assets/ico/logo.ico
var iconData []byte

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
	systray.SetTitle("element-ai")
	systray.SetTooltip("element-ai-app")

	// 创建一个菜单项
	mShow := systray.AddMenuItem("显示窗口", "显示主窗口")
	mQuit := systray.AddMenuItem("退出", "退出程序")

	// 添加隐藏的默认菜单项（必须作为第一个菜单项）
	mDefault := systray.AddMenuItem("", "") // 空标题
	mDefault.Hide()                         // 隐藏但保持存在

	go func() {
		for {
			select {
			case <-mDefault.ClickedCh: // 单击托盘图标触发
				// 显示主窗口
				showWindow()
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

func InitTray(ctx context.Context) {
	appCtx = ctx
	systray.Run(onReady, onExit)
}
