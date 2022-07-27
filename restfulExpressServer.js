import express from "express";
import fs from "fs/promises";
import bodyparser from "body-parser";
import morgan from "morgan";

const app = express();
const PORT = 3000;
//localhost:3000/pets

// const readPetsFile = () =>
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     return JSON.parse(str);
//   });

app.use(express.json());

app.get("/pets", (req, res) => {
  fs.readFile("pets.json", "utf-8").then((str) => {
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
    if (typeof body.age === "number" && body.kind && body.name) {
      exsistingPets.push(body);
      fs.writeFile("pets.json", JSON.stringify(exsistingPets));
      res.status(200);
      res.send(exsistingPets);
      console.log("New pet added!");
    } else {
      res.status(400);
      res.set("Content-Type", "text/plain");
      res.send("Bad Request");
      console.log("Bad Request");
    }
  });
});

app.patch("/pets/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  fs.readFile("pets.json", "utf-8").then((str) => {
    const pets = JSON.parse(str);

    if (pets[id]) {
      if (body.age) {
        if (typeof body.age !== "number") {
          res.status(400);
          res.send("Input integer");
          console.log("Input integer");
        }
        pets[id].age = body.age;
      }
      if (body.kind) {
        pets[id].kind = body.kind;
      }
      if (body.name) {
        pets[id].name = body.name;
      }
      fs.writeFile("pets.json", JSON.stringify(pets));
      res.status(200);
      res.send(pets[id]);
      console.log("Updated pet!");
    } else {
      res.status(400);
      res.send("Bad Request");
      console.log("Bad Request");
    }
  });
});

app.delete("/pets/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("pets.json", "utf-8").then((str) => {
    const pets = JSON.parse(str);
    if (!pets[id]) {
      res.status(400);
      console.error("Not Found");
      res.send("Not Found");
    } else {
      res.send(pets[id]);
      pets.splice(id, 1);
      fs.writeFile("pets.json", JSON.stringify(pets));
      res.status(200);
      console.log("Deleted pet!");
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
