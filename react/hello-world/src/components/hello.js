var React = require('react')

function Hello() {
    return (
      <div>
        <h1>Hello, World!</h1>
        { componentDidMount() } 
      </div>
    )
  }

export default Hello;

async function componentDidMount() {

  let response = await fetch("http://localhost:8089/ping")
  let movies = await response.json();
  console.log(movies);

  if (response.ok) { // if HTTP-status is 200-299
    // get the response body (the method explained below)
    let json = await response.json();
    console.log("lol"+json);
  } else {
    alert("HTTP-Error: " + response.status);
  }
  
  return (
    <div>
    <h2>pinged</h2>
    <h2> {response} </h2>
    </div>
  )
}
  