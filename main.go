package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

type ContainerData struct {
	ID     string
	Names    []string
	Image   string
	State  string
	Status string
}

type PageData struct {
	PageTitle  string
	Containers []ContainerData
}

func main() {

	// Handlers
	http.HandleFunc("/", tmplServer)
	http.HandleFunc("/stop", actionHandler)
	http.HandleFunc("/start", actionHandler)
	http.HandleFunc("/rm", actionHandler)
	http.Handle("/tmpfiles/",
    http.StripPrefix("/tmpfiles/", http.FileServer(http.Dir("/opt/app"))))

	// start up
	log.Println("Starting on :8089")
	http.ListenAndServe(":8089", nil)
}

func actionHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("URL: %s", r.URL)

	id := strings.Split(r.URL.String(), "=")[1]
	action := strings.Split(r.URL.String(), "?")[0]

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}

	switch action {
	case "/stop":
		_ = cli.ContainerStop(context.Background(), id, container.StopOptions{})
	case "/start":
		_ = cli.ContainerStart(context.Background(), id, types.ContainerStartOptions{})
	case "/rm":
		_ = cli.ContainerRemove(context.Background(), id, types.ContainerRemoveOptions{})
	}

	// TODO, this doesn't display what it's stopping
	tmpl := template.Must(template.New("tpl").Parse("<html><head><meta http-equiv='refresh' content='1 url=/'></head><body>Applying.. {{.id}}</body>"))
	tmpl.Execute(w, "")
}

func tmplServer(w http.ResponseWriter, r *http.Request) {

	pageData := PageData{
		PageTitle: "Tiny Docker Container Manager",
	}

	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}

	containers, err := cli.ContainerList(context.Background(), types.ContainerListOptions{All: true})
	if err != nil {
		panic(err)
	}

	var runningContainers, stoppedContainers []ContainerData

	for _, container := range containers {
		fmt.Printf("%s %s %s %s\n", container.ID[:10], container.Names[0], container.Image, container.Status)
		if len(container.Image) > 33 {
			container.Image = container.Image[:32]
		}
		name := container.Names[0]
		container.Names[0] = name[1:]
		newContainerData := ContainerData{container.ID[:10], container.Names, container.Image, container.State, container.Status}

		switch container.State {
		case "running":
			runningContainers = append(runningContainers, newContainerData)
		default:
			stoppedContainers = append(stoppedContainers, newContainerData)
		}
	}
	pageData.Containers = append(pageData.Containers, runningContainers...)
	pageData.Containers = append(pageData.Containers, stoppedContainers...)

	// template is in own file
	tmpl, newerr := template.ParseFiles("layout.html")
	if newerr != nil {
		log.Println("template no bueno", newerr)
	}

	tmpl.Execute(w, pageData)
}
