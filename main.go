package main

import (
	"embed"
	"os"
	gr "runtime"
	"strconv"

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
	fs := &FileSystem{}
	app := NewApp(fs)

	AppMenu := menu.NewMenu()
	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu())
	}

	FileMenu := AppMenu.AddSubmenu("File")

	FileMenu.AddText("New Note", keys.CmdOrCtrl("n"), func(_ *menu.CallbackData) {
		// Tell frontend to ask for filename
		runtime.EventsEmit(app.ctx, "prompt-filename")
	})

	// Open folder menu item
	FileMenu.AddText("Open Folder", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		directory, err := runtime.OpenDirectoryDialog(app.ctx, runtime.OpenDialogOptions{})
		if err == nil {
			files, err := os.ReadDir(directory)
			if err == nil {
				var fileMap []map[string]string
				for _, file := range files {
					entry := make(map[string]string)
					entry["name"] = file.Name()
					entry["isDir"] = strconv.FormatBool(file.Type().IsDir())
					fileMap = append(fileMap, entry)
				}

				app.fileSystem.workingDir = directory
				runtime.EventsEmit(app.ctx, "open-directory", directory, fileMap)
			}
		}
	})

	// Save file menu item
	FileMenu.AddText("Save", keys.CmdOrCtrl("s"), func(_ *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "save-file")
	})

	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.EditMenu())
	}

	ViewMenu := AppMenu.AddSubmenu("View")
	ViewMenu.AddText("Toggle Explorer", keys.CmdOrCtrl("h"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "toggle-explorer")
	})

	// Toggle view menu item
	ViewMenu.AddText("Toggle", keys.CmdOrCtrl("t"), func(_ *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "toggle-edit")
	})
	// Navigate back menu item
	ViewMenu.AddText("Navigate Back", keys.CmdOrCtrl("backspace"), func(cd *menu.CallbackData) {
		runtime.EventsEmit(app.ctx, "navigate-back")
	})

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Quartz Note",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 255, G: 255, B: 255, A: 1},
		OnDomReady:       app.startup,
		OnShutdown:       app.shutdown,
		Menu:             AppMenu,
		Bind: []interface{}{
			app,
			fs,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
