#!/usr/bin/env node

const http = require('http')
const httpProxy = require('http-proxy')

const target = process.argv[2]
const PORT = process.argv[3] || 80

//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer()

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
const server = http.createServer(function (req, res) {
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  console.log('Request!')
  proxy.web(req, res, { target })
})

server.listen(PORT, _ => {
  const { port } = server.address()
  console.log(`listening on port ${port}`)

  if (typeof process.send === 'function') {
    process.send(port)
  }
})
