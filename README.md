# Go-Element-Plus-X

## 使用 ruoyi-element-ai + Wails 框架

- 可打包为跨平台桌面程序（Windows、macOS、Linux）
- Wails 可为三大主流操作系统生成原生应用：
    - **Windows**：生成 `.exe` 可执行文件（如 `myapp.exe`）
    - **macOS**：生成 `.app` 应用程序包（如 `myapp.app`）
    - **Linux**：生成可直接运行的可执行文件（如 `./myapp`）

## 快速开始

### 环境准备
（前端 Node 环境略过，建议具备科学上网能力，否则环境安装可能失败）

1. 安装 Go 环境：[https://golang.google.cn/](https://golang.google.cn/)
2. 安装 Wails：[https://wails.io/zh-Hans/docs/gettingstarted/installation](https://wails.io/zh-Hans/docs/gettingstarted/installation)

### 安装完成后

- 运行 `wails doctor`，如显示以下内容，说明依赖安装成功
- 其中 `nsis` 可用于生成 Windows 安装包，若不需要可忽略

#### Dependencies

| Dependency | Package Name | Status    | Version       |
|------------|--------------|-----------|---------------|
| WebView2   | N/A          | Installed | 137.0.3296.68 |
| Nodejs     | N/A          | Installed | 20.18.0       |
| npm        | N/A          | Installed | 10.8.2        |
| *upx       | N/A          | Installed | upx 5.0.0     |
| *nsis      | N/A          | Installed | v3.11         |

> `*` 为可选依赖（Optional Dependency）


### frontend 前端项目

- 按照正常前端开发流程操作即可（支持在浏览器中调试页面样式）

### Wails 常用命令

- `wails dev` 启动本地开发服务
- `wails build` 打包为可执行程序
- `wails build -nsis` 打包为 NSIS 安装包（适用于 Windows）
- `wails build -nsis -debug` 打包为带调试信息的 NSIS 安装包

