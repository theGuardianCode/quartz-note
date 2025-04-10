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

func (fs *FileSystem) SaveFile(filePath string, contents string) {
	contentsBytes := []byte(contents)
	fullPath := fs.workingDir + "/" + filePath

	err := os.WriteFile(fullPath, contentsBytes, 0644)
	if err != nil {
		panic(err)
	}
}
