(function () {
  // React
  const React = require('react')
  const ReactDOM = require('react-dom')

  const Hello = require('./components/hello')
  ReactDOM.render(<Hello />, document.getElementById('app'))
})()
