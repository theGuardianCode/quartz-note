package main

import (
	"encoding/json"
)

type Settings struct {
	DefaultDir string
}

func (s *Settings) Serialise() []byte {
	data, err := json.Marshal(s)
	if err != nil {
		panic(err)
	}

	return data
}
