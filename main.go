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
	app := NewApp()
	fs := &FileSystem{}

	AppMenu := menu.NewMenu()
	if gr.GOOS == "darwin" {
		AppMenu.Append(menu.AppMenu())
	}

	FileMenu := AppMenu.AddSubmenu("File")
	FileMenu.AddText("Open Folder", keys.CmdOrCtrl("o"), func(_ *menu.CallbackData) {
		directory, err := runtime.OpenDirectoryDialog(app.ctx, runtime.OpenDialogOptions{})
		if err != nil {
			panic(err)
		}

		files, err := os.ReadDir(directory)
		if err != nil {
			panic(err)
		}

		var fileMap []map[string]string
		for _, file := range files {
			entry := make(map[string]string)
			entry["name"] = file.Name()
			entry["isDir"] = strconv.FormatBool(file.Type().IsDir())
			fileMap = append(fileMap, entry)
		}

		fs.workingDir = directory
		runtime.EventsEmit(app.ctx, "open-directory", fileMap)
	})

	EditMenu := AppMenu.AddSubmenu("Edit")
	EditMenu.AddText("Toggle", keys.CmdOrCtrl("t"), func(_ *menu.CallbackData) {
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
			fs,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
