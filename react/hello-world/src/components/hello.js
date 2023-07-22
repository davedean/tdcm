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


function componentDidMount() {
    fetch("http://localhost:8089/v1/cameras")
        .then((response) => response.json())
    console.log("ffs")
    alert('You clicked me!');
    return (
            <div>
                <h2>pinged</h2>
                <h2> {Response} </h2>
            </div>
    )
  }
  