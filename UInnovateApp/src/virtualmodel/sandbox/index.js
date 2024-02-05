import http from "http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

const port = 3001;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
