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
	systray.SetTooltip("单击显示窗口")

	// 创建菜单项 - 第一个菜单项通常会在左键点击时触发
	mShow := systray.AddMenuItem("显示窗口", "显示主窗口")
	mQuit := systray.AddMenuItem("退出", "退出程序")

	go func() {
		for {
			select {
			case <-mShow.ClickedCh:
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
