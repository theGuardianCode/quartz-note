package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx        context.Context
	fileSystem *FileSystem
	settings   Settings
}

// NewApp creates a new App application struct
func NewApp(fs *FileSystem) *App {
	return &App{fileSystem: fs}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	runtime.EventsOn(a.ctx, "writeFile", func(optionalData ...interface{}) {
		filename := optionalData[0].(string)
		contents := optionalData[1].(string)

		if filename != "" {
			a.fileSystem.SaveFile(filename, contents)
		}
	})

	runtime.LogSetLogLevel(a.ctx, logger.DEBUG)

	// Load user cache
	cacheDir, _ := os.UserCacheDir()
	datFile := cacheDir + "/quartz-note.json"
	contents, err := os.ReadFile(datFile)

	if err != nil {
		// Load default data
		a.settings = Settings{DefaultDir: ""}
	} else {
		var dat Settings
		json.Unmarshal(contents, &dat)

		a.settings = dat
	}

	a.fileSystem.workingDir = a.settings.DefaultDir
	fmt.Println(a.fileSystem.workingDir)
}

func (a *App) shutdown(ctx context.Context) {
	a.settings.DefaultDir = a.fileSystem.workingDir

	cacheDir, _ := os.UserCacheDir()
	datFile := cacheDir + "/quartz-note.json"

	cache := a.settings.Serialise()
	fmt.Println(string(cache))
	os.WriteFile(datFile, cache, 0644)
}
