package main

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
	db  *Database
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	runtime.EventsOn(a.ctx, "create-page", func(optionalData ...interface{}) {
		title := optionalData[0].(string)
		pageType := optionalData[1].(string)

		a.db.CreatePage(title, pageType)
	})
}
