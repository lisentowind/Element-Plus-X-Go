package main

import (
	"context"
	"fmt"
	InitTray "go-element-plus-x/systray"
	"os"

	"github.com/getlantern/systray"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	InitTray.InitTray(ctx) // 初始化托盘并传递上下文
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// CloseTray 关闭窗口 前端调用
func (a *App) CloseTray() {
	systray.Quit()
	os.Exit(0)
}
