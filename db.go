package main

import (
	"slices"

	"github.com/google/uuid"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Page struct {
	ID           string `json:"id"`
	CreatedAt    int64  `gorm:"autoCreateTime" json:"created_at"`
	Name         string `json:"name"`
	ChatMessages string `json:"chatMessages"`
	Type         string `json:"type"`
}

type Block struct {
	ID        string  `json:"id" gorm:"primarykey"`
	PageID    string  `json:"pageId" gorm:"primarykey"`
	CreatedAt int64   `gorm:"autoCreateTime" json:"created_at"`
	Type      string  `json:"type"`
	Data      *string `json:"data"`
}

type Canvas struct {
	PageID    string  `json:"pageId" gorm:"primaryKey"`
	CreatedAt int64   `json:"created_at" gorm:"autoCreateTime"`
	Document  *string `json:"document"`
}

type Database struct {
	Connection *gorm.DB
}

func InitDB(filename string) *Database {
	conn, err := gorm.Open(sqlite.Open(filename), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database")
	}

	conn.AutoMigrate(&Page{}, &Block{}, &Canvas{})

	return &Database{conn}
}

func (db *Database) CreatePage(title string, pageType string) {
	pageId, err := uuid.NewRandom()
	if err != nil {
		panic("Failed to generate uuid")
	}

	page := &Page{ID: pageId.String(), Name: title, ChatMessages: "[]", Type: pageType}
	db.Connection.Create(page)
}

func (db *Database) ListPages() []Page {
	var pages []Page
	db.Connection.Find(&pages)

	return pages
}

func (db *Database) ListBlocks(pageId string) []Block {
	var blocks []Block
	db.Connection.Where("page_id = ?", pageId).Order("created_at asc").Find(&blocks)

	return blocks
}

func (db *Database) ProcessTransaction(blocks []Block, pageId string) {
	var transactionBlockIds []string
	for _, block := range blocks {
		transactionBlockIds = append(transactionBlockIds, block.ID)
	}

	var storedBlocks []Block
	db.Connection.Where("page_id = ?", pageId).Find(&storedBlocks)

	var storedBlockIds []string
	for _, block := range storedBlocks {
		storedBlockIds = append(storedBlockIds, block.ID)
	}

	// Test for any ids in db but not in transaction (deleted)
	for _, block := range storedBlocks {
		if !slices.Contains(transactionBlockIds, block.ID) {
			// Delete because block not in updated state
			db.Connection.Delete(&block)
		}
	}

	for _, block := range blocks {
		if slices.Contains(storedBlockIds, block.ID) {
			// Block already exists, therefore its values should be updated
			db.Connection.Save(&block)
		} else {
			// Block doesn't exist, therefore it should be inserted
			db.Connection.Create(&block)
		}
	}
}

func (db *Database) InitialiseCanvas(pageId string) *string {
	// Test if a record in tables Canvases exists for current page id
	var canvases []Canvas
	db.Connection.Where("page_id = ?", pageId).Find(&canvases)

	// If no record exists, create one, otherwise return data
	if len(canvases) == 0 {
		canvas := Canvas{}
		canvas.PageID = pageId

		db.Connection.Create(&canvas)
		return nil
	} else {
		return canvases[0].Document
	}
}

func (db *Database) SaveCanvas(pageId string, document string) {
	canvas := Canvas{}
	canvas.PageID = pageId
	canvas.Document = &document
	db.Connection.Save(&canvas)
}

func (db *Database) SaveMessages(pageId string, messages string) {
	db.Connection.Model(&Page{}).Where("id = ?", pageId).Update("chat_messages", messages)
}

func (db *Database) LoadMessages(pageId string) string {
	var page Page
	db.Connection.Select("chat_messages").Where("id = ?", pageId).First(&page)
	return page.ChatMessages
}
