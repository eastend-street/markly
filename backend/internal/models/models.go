package models

import (
	"time"
	"gorm.io/gorm"
)

type User struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Email       string    `json:"email" gorm:"unique;not null"`
	Username    string    `json:"username" gorm:"unique;not null"`
	Password    string    `json:"-" gorm:"not null"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	Collections []Collection `json:"collections" gorm:"foreignKey:UserID"`
	Bookmarks   []Bookmark   `json:"bookmarks" gorm:"foreignKey:UserID"`
}

type Collection struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	Name        string    `json:"name" gorm:"not null"`
	Description *string   `json:"description"`
	Color       *string   `json:"color"`
	UserID      uint      `json:"userId" gorm:"not null"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
	Bookmarks   []Bookmark `json:"bookmarks" gorm:"foreignKey:CollectionID"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

type Bookmark struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Title        string     `json:"title" gorm:"not null"`
	URL          string     `json:"url" gorm:"not null"`
	Description  *string    `json:"description"`
	Notes        *string    `json:"notes"`
	Favicon      *string    `json:"favicon"`
	Screenshot   *string    `json:"screenshot"`
	Tags         []string   `json:"tags" gorm:"type:json"`
	CollectionID uint       `json:"collectionId" gorm:"not null"`
	Collection   Collection `json:"collection" gorm:"foreignKey:CollectionID"`
	UserID       uint       `json:"userId" gorm:"not null"`
	User         User       `json:"user" gorm:"foreignKey:UserID"`
	CreatedAt    time.Time  `json:"createdAt"`
	UpdatedAt    time.Time  `json:"updatedAt"`
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	return nil
}

func (c *Collection) BeforeCreate(tx *gorm.DB) error {
	return nil
}

func (b *Bookmark) BeforeCreate(tx *gorm.DB) error {
	return nil
}