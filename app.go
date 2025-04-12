package main

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx        context.Context
	fileSystem *FileSystem
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
		a.fileSystem.SaveFile(filename, contents)
	})

	runtime.LogSetLogLevel(a.ctx, logger.DEBUG)
}

// Greet returns a greeting for the given name
// func (a *App) Greet(name string) string {
// 	return fmt.Sprintf("Hello %s, It's show time!", name)
// }a
