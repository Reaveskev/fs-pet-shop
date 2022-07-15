import http from "http";
import fs from "fs/promises";
// import { routes } from "./routes.js";
const pets = fs.readFile("pets.json", "utf-8").then((str) => {
  return JSON.parse(str);
});

const server = http.createServer((req, res) => {
  const petRegExp = /^\/pets\/(.*)$/;
  const match = req.url.match(petRegExp);

  if (req.url === "/pets" && req.method === "GET") {
    pets.then((str) => {
      console.log(str);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(str));
    });
  } else if (match && req.method === "GET") {
    const id = match[1];
    pets.then((str) => {
      if (str[id]) {
        res.end(JSON.stringify(str[id]));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  } else if (req.url === "/pets" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const newPet = JSON.parse(body);
      fs.readFile("pets.json", "utf-8").then((str) => {
        const exsistingPets = JSON.parse(str);
        exsistingPets.push(newPet);
        return fs
          .writeFile("pets.json", JSON.stringify(exsistingPets))
          .then(() => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(newPet));
          });
      });
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

// if (routes[req.url] !== undefined) {
//   res.writeHead(200, { "Content-Type": "application/json" });
//   routes[req.url](req, res);
// } else {
//   res.writeHead(404, { "Content-Type": "text/plain" });
//   res.end("404, no such route");
// }
// });

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
