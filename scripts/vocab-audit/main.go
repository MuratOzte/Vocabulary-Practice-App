package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"
)

type (
	word struct {
		ID      string `json:"id"`
		English string `json:"english"`
		Turkish string `json:"turkish"`
	}
	catalog []word
)

// audit reports data issues in catalog order using one-based entry numbers.
func (words catalog) audit() []string {
	firstSeen := make(map[string]int, len(words))
	var issues []string
	for i, entry := range words {
		row := i + 1
		id := strings.TrimSpace(entry.ID)
		switch first, seen := firstSeen[id]; {
		case id == "":
			issues = append(issues, fmt.Sprintf("entry %d: missing id", row))
		case seen:
			issues = append(issues, fmt.Sprintf("entry %d: duplicate id %q (first at %d)", row, id, first))
		default:
			firstSeen[id] = row
		}
		if strings.TrimSpace(entry.English) == "" || strings.TrimSpace(entry.Turkish) == "" {
			issues = append(issues, fmt.Sprintf("entry %d: requires English and Turkish text", row))
		}
	}
	return issues
}

func run(input io.Reader, output io.Writer) (int, error) {
	data, err := io.ReadAll(input)
	if err != nil {
		return 2, err
	}
	var words catalog
	if err := json.Unmarshal(data, &words); err != nil {
		return 2, err
	}
	if words == nil {
		return 2, fmt.Errorf("expected a JSON array of vocabulary entries")
	}
	issues := words.audit()
	for _, issue := range issues {
		if _, err := fmt.Fprintln(output, issue); err != nil {
			return 2, err
		}
	}
	if len(issues) != 0 {
		return 1, nil
	}
	_, err = fmt.Fprintf(output, "%d vocabulary entries checked\n", len(words))
	if err != nil {
		return 2, err
	}
	return 0, nil
}

func main() {
	code, err := run(os.Stdin, os.Stdout)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
	os.Exit(code)
}
