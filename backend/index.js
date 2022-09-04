const server = require("./server");

const port = process.env.PORT || 3001;

server.listen(port, () =>
  console.log(`Server is listening on http://localhost:${port}`)
);
