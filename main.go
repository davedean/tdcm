package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

const (
	version = "0.002"
	port    = ":8089"
)

// Auth creds
var authUser string = os.Getenv("USER")
var authPass string = os.Getenv("PASS")

type Container struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	Image  string `json:"image"`
	State  string `json:"state"`
	Status string `json:"status"`
}

type PageData struct {
	PageTitle  string
	Containers []Container
}

func (c Container) Action(action string) string {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Println("no new client")
		panic(err)
	}

	log.Println("action is ", action)
	switch action {
	case "stop":
		_ = cli.ContainerStop(context.Background(), c.ID, container.StopOptions{})
	case "start":
		_ = cli.ContainerStart(context.Background(), c.ID, types.ContainerStartOptions{})
	case "remove":
		_ = cli.ContainerRemove(context.Background(), c.ID, types.ContainerRemoveOptions{})
	}
	return ""
}

func basicAuth(c *gin.Context) {
	// Get the Basic Authentication credentials
	user, password, hasAuth := c.Request.BasicAuth()
	if hasAuth && user == authUser && password == authPass {
		log.Println("Authenticated user:", user)
	} else {
		c.AbortWithStatus(http.StatusForbidden)
		c.Writer.Header().Set("WWW-Authenticate", "Basic realm=Restricted")
		return
	}
}

func main() {

	router := gin.Default()
	router.SetTrustedProxies(nil) // stop gin complaining

	// Ping test
	router.GET("/ping", func(c *gin.Context) {
		c.String(http.StatusOK, `{ "message": "pong" }`)
	})

	router.Use(static.Serve("/", static.LocalFile("./assets", true))) // static files, no auth

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/", basicAuth) // basicAuth for api calls
	}
	api.GET("/containers", basicAuth, ContainerHandler)
	api.POST("/containers/:action/:containerID", basicAuth, ActionContainer)

	// Start and run the server
	log.Printf("Starting version v%s on port %s", version, port)
	router.Run(port)

}

func getContainers() (containers []Container) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}
	containerList, err := cli.ContainerList(context.Background(), types.ContainerListOptions{All: true})
	if err != nil {
		panic(err)
	}

	var runningContainers, otherContainers []Container
	for index := range containerList {
		var newContainer Container = Container{
			ID:     containerList[index].ID,
			Name:   containerList[index].Names[0][1:],
			Image:  containerList[index].Image,
			State:  containerList[index].State,
			Status: containerList[index].Status,
		}
		if len(containerList[index].Names[0]) > 30 {
			newContainer.Name = containerList[index].Names[0][1:26] + "..."
		}
		if len(containerList[index].Image) > 30 {
			newContainer.Image = containerList[index].Image[0:24] + "..."
		}

		if newContainer.State == "running" {
			runningContainers = append(runningContainers, newContainer)
		} else {
			otherContainers = append(otherContainers, newContainer)
		}
		containers = append(runningContainers, otherContainers...)
	}

	log.Println(containers)
	return containers
}

func ContainerHandler(c *gin.Context) {
	containers := getContainers()

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, containers)
}

func ActionContainer(c *gin.Context) {
	containerid := c.Param("containerID")
	containeridLength := len(containerid)
	action := c.Param("action")

	containers := getContainers()

	match := false
	for i := 0; i < len(containers); i++ {
		if containers[i].ID[:containeridLength] == containerid {
			containers[i].Action(action)
			match = true
		}
	}

	if match {
		// update the container list, maybe pointless
		containers = getContainers()
		c.JSON(http.StatusOK, &containers)
	} else {
		// this only happens if theres no match
		c.AbortWithStatus(http.StatusNotFound)
	}
}
