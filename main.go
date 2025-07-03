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
	app.db = InitDB("quartz.db")

	AppMenu := menu.NewMenu()
	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu())
	}

	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("New Page", keys.CmdOrCtrl("n"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "new-page")
	})
	FileMenu.AddText("Save", keys.CmdOrCtrl("s"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "save")
	})

	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu())
	}

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Quartz Note",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		OnStartup: app.startup,
		Menu:      AppMenu,
		Bind: []interface{}{
			app,
			app.db,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
