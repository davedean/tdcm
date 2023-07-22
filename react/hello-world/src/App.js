import logo from './logo.svg';
import './App.css';

/*
const Ping = () => { useEffect(() => {
  const [posts, setPosts] = useState([]);

  fetch('http://localhost:8089/ping=10')
     .then((response) => response.json())
     .then((data) => {
        console.log(data);
        setPosts(data);
     })
     .catch((err) => {
        console.log(err.message);
     });
}, []);
}
*/

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
          <h3>hello</h3>
          { MyButton.call() }
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

export default App;
