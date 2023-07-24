package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

const (
	version = "0.002"
	port    = ":8089"
)

//func isSet(s string) (b bool) {
//	return s != ""
//}

// Auth creds
var authUser string = os.Getenv("USER")
var authPass string = os.Getenv("PASS")
var authEnabled bool = authUser != ""
var secretKey string = "tempsecertstring"

type Container struct {
	ID     string   `json:"id"`
	Name   string   `json:"name"`
	Image  string   `json:"image"`
	Ports  []uint16 `json:"ports"`
	State  string   `json:"state"`
	Status string   `json:"status"`
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
	//log.Println("authEnabled:", authEnabled)
	if authEnabled {
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
}

func jwtLogin(c *gin.Context) {
	// Attempt to bind JSON from the request to a struct
	var loginInfo struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&loginInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if the username and password match
	if loginInfo.Username != authUser || loginInfo.Password != authPass {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	// The username and password match, so generate and return a JWT
	token := jwt.New(jwt.SigningMethodHS256)

	// Create a map to store your claims
	claims := token.Claims.(jwt.MapClaims)

	// Set token claims
	claims["username"] = authUser
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix() // Token expires after 24 hours

	// Sign the token with our secret
	tokenString, _ := token.SignedString(secretKey)

	// Finally, write the token to the browser window
	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

func main() {

	router := gin.Default()
	router.SetTrustedProxies(nil) // stop gin complaining

	// BEGIN
	router.POST("/login", jwtLogin)

	// END

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
	api.GET("/containers/detail/:containerID", basicAuth, DetailHandler)
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

	for index := range containerList {
		var newContainer Container = Container{
			ID:     containerList[index].ID,
			Name:   containerList[index].Names[0][1:],
			Image:  containerList[index].Image,
			State:  containerList[index].State,
			Status: containerList[index].Status,
		}
		if len(containerList[index].Ports) > 0 {
			for i := 0; i < len(containerList[index].Ports); i++ {
				newContainer.Ports = append(newContainer.Ports, containerList[index].Ports[i].PublicPort)
				//containerList[index].Ports[i].PublicPort
			}
			newContainer.Ports = removeDuplicate((newContainer.Ports))
		}
		if len(containerList[index].Names[0]) > 30 {
			newContainer.Name = containerList[index].Names[0][1:26] + "..."
		}

    containers = append(containers, newContainer)
	}

	log.Println(containers)
	return containers
}

func removeDuplicate(strSlice []uint16) []uint16 {
	allKeys := make(map[uint16]bool)
	list := []uint16{}
	for _, item := range strSlice {
		if _, value := allKeys[item]; !value {
			allKeys[item] = true
			list = append(list, item)
		}
	}
	return list
}

func ContainerHandler(c *gin.Context) {
	containers := getContainers()

	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, containers)
}

func DetailHandler(c *gin.Context) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}

	containerid := c.Param("containerID")
	containeridLength := len(containerid)
	//action := c.Param("action")

	containers := getContainers()

	match := false
	var result types.ContainerJSON
	for i := 0; i < len(containers); i++ {
		if containers[i].ID[:containeridLength] == containerid {
			result, err = cli.ContainerInspect(context.Background(), containerid)
			if err != nil {
				panic(err)
			}
			match = true
		}
	}

	if match {
		c.Header("Content-Type", "application/json")
		c.JSON(http.StatusOK, result)
	} else {
		// this only happens if theres no match
		c.AbortWithStatus(http.StatusNotFound)
	}
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
