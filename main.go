package main

import (
	"embed"
	gr "runtime"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()

	AppMenu := menu.NewMenu()
	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu())
	}

	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("Toggle", keys.CmdOrCtrl("t"), func(_ *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "toggle-edit")
	})

	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu())
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "quartz-note",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnStartup:        app.startup,
		Menu:             AppMenu,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
