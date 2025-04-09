package main

import (
	"os"
)

type FileSystem struct {
	workingDir string
}

func (fs *FileSystem) OpenFile(filePath string) string {
	fullPath := fs.workingDir + "/" + filePath
	contents, err := os.ReadFile(fullPath)
	if err != nil {
		panic(err)
	}

	return string(contents)
}
