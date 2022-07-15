import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = 3000;

const readPetsFile = () =>
  readFile("pets.json", "utf-8").then((str) => {
    return JSON.parse(str);
  });

// const myLogger = function (req, res, next) {
//   if (req.method === "POST") {
//     next();
//   }
//   console.log(req.ip);
//   next();
// };

// app.use(myLogger);
app.use(express.json());

app.get("/pets", (req, res) => {
  readFile("pets.json", "utf-8").then((str) => {
    const pets = JSON.parse(str);
    res.send(pets);
  });
});

app.get("/pets/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("pets.json", "utf-8").then((str) => {
    const pets = JSON.parse(str);
    if (pets[id]) {
      res.send(pets[id]);
    } else {
      res.set("Content-Type", "text/plain");
      res.status(404);
      res.send("Not Found");
    }
  });
});

app.post("/pets", (req, res) => {
  const body = req.body;
  fs.readFile("pets.json", "utf-8").then((str) => {
    const exsistingPets = JSON.parse(str);
    if (typeof body.age === "Number" && body.kind && body.name) {
      exsistingPets.push(body);
      fs.writeFile("pets.json", JSON.stringify(exsistingPets));
      res.status(200);
      res.send(exsistingPets);
      console.log("New pet added!");
    } else {
      res.status(400);
      res.send("Bad Request");
      console.log("Bad Request");
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
