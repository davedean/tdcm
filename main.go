package main

import (
	"context"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"golang.org/x/crypto/bcrypt"

	auth "github.com/abbot/go-http-auth"
)

const (
	version = "0.001"
	port    = ":8089"
)

// Auth creds
var authUser string = os.Getenv("USER")
var authPass string = os.Getenv("PASS")

type ContainerData struct {
	ID     string
	Names    []string
	Image   string
	State  string
	Ports []string
	Status string
}

type PageData struct {
	PageTitle  string
	Containers []ContainerData
}

func Secret(user, realm string) string {
	if user == authUser {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(authPass), bcrypt.DefaultCost)
		if err == nil {
			return string(hashedPassword)
		}
	}
	return ""
}

func handle(w http.ResponseWriter, r *auth.AuthenticatedRequest) {
	fmt.Fprintf(w, "<html><body><h1>Hello, %s!</h1></body></html>", r.Username)
}

func main() {

	authenticator := auth.NewBasicAuthenticator("example.com", Secret)

	// Handlers
	http.HandleFunc("/", authenticator.Wrap(tmplServer))
	http.HandleFunc("/stop", authenticator.Wrap(actionHandler))
	http.HandleFunc("/start", authenticator.Wrap(actionHandler))
	http.HandleFunc("/rm", authenticator.Wrap(actionHandler))
	http.Handle("/tmpfiles/",
    http.StripPrefix("/tmpfiles/", http.FileServer(http.Dir("/opt/app"))))

	// start up
	log.Printf("Starting version v%s on port %s", version, port)
	http.ListenAndServe(port, nil)
}

func actionHandler(w http.ResponseWriter, r *auth.AuthenticatedRequest) {
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

func tmplServer(w http.ResponseWriter, r *auth.AuthenticatedRequest) {

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
		fmt.Printf("%s %s %s %s %s\n", container.ID[:10], container.Names[0], container.Image, container.Status, container.Ports.PrivatePort)
		if len(container.Image) > 33 {
			container.Image = container.Image[:32]
		}
		name := container.Names[0]
		container.Names[0] = name[1:]

		for _, .port := range container.Ports {
			for _, binding := range port {
				privatePort := .PrivatePort
				publicPort := .PublicPort

				// If the public port is not mapped, use the private port as the public port
				if publicPort == "" {
				publicPort = privatePort
				}

		newContainerData := ContainerData{container.ID[:10], container.Names, container.Image, container.State, container.Port, container.Status}

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
