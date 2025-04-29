package main

import (
	"fmt"
	"os"
	gr "runtime"
	"strconv"
	"strings"
)

type FileSystem struct {
	workingDir string
}

func (fs *FileSystem) GetWorkingDir() string {
	return fs.workingDir
}

func (fs *FileSystem) OpenFile(filePath string) string {
	fullPath := fs.workingDir + "/" + filePath
	contents, err := os.ReadFile(fullPath)
	if err != nil {
		panic(err)
	}

	return string(contents)
}

func (fs *FileSystem) CreateFile(filename string) bool {
	fullPath := fs.workingDir + "/" + filename
	_, err := os.Create(fullPath)

	if err != nil {
		panic(err)
	}

	return err != nil
}

func (fs *FileSystem) ReadDir(dir string, infer bool) []map[string]string {
	fullPath := dir

	if infer {
		fullPath = fs.workingDir + "/" + dir
	}

	files, err := os.ReadDir(fullPath)
	if err != nil {
		panic(err)
	}

	var fileMap []map[string]string
	for _, file := range files {
		entry := make(map[string]string)
		entry["name"] = file.Name()
		entry["isDir"] = strconv.FormatBool(file.Type().IsDir())
		entry["expanded"] = "false"
		fileMap = append(fileMap, entry)
	}

	return fileMap
}

func (fs *FileSystem) SaveFile(filePath string, contents string) {
	contentsBytes := []byte(contents)
	fullPath := fs.workingDir + "/" + filePath

	err := os.WriteFile(fullPath, contentsBytes, 0644)
	if err != nil {
		panic(err)
	}
}

func (fs *FileSystem) GetRelativePath(filePath string) string {
	fmt.Println("Getting relative filepath of: " + filePath)
	separator := "/"

	if gr.GOOS == "windows" {
		separator = "\\"
	}

	heirarchy := strings.Split(filePath, separator)

	return heirarchy[len(heirarchy)-1]
}
