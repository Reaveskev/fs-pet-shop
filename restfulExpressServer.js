import express from "express";
import fs from "fs/promises";
import pg from "pg";
import bodyparser from "body-parser";
import morgan from "morgan";
import basicAuth from "express-basic-auth";

const app = express();
const PORT = 3000;
//localhost:3000/pets

// const readPetsFile = () =>
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     return JSON.parse(str);
//   });

app.use(express.json());

app.use(
  basicAuth({
    users: { admin: "meowmix" },
  })
);

// app.get("/pets", (req, res) => {
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     const pets = JSON.parse(str);
//     res.send(pets);
//   });
// });

// app.get("/pets/:id", (req, res) => {
//   const id = req.params.id;
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     const pets = JSON.parse(str);
//     if (pets[id]) {
//       res.send(pets[id]);
//     } else {
//       res.set("Content-Type", "text/plain");
//       res.status(404);
//       res.send("Not Found");
//     }
//   });
// });

// app.post("/pets", (req, res) => {
//   const body = req.body;
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     const exsistingPets = JSON.parse(str);
//     if (typeof body.age === "number" && body.kind && body.name) {
//       exsistingPets.push(body);
//       fs.writeFile("pets.json", JSON.stringify(exsistingPets));
//       res.status(200);
//       res.send(exsistingPets);
//       console.log("New pet added!");
//     } else {
//       res.status(400);

//       res.set("Content-Type", "text/plain");
//       res.send("Bad Request");
//       console.log("Bad Request");
//     }
//   });
// });

// app.patch("/pets/:id", (req, res) => {
//   const id = req.params.id;
//   const body = req.body;
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     const pets = JSON.parse(str);

//     if (pets[id]) {
//       if (body.age) {
//         if (typeof body.age !== "number") {
//           res.status(400);
//           res.send("Input integer");
//           console.log("Input integer");
//         }
//         pets[id].age = body.age;
//       }
//       if (body.kind) {
//         pets[id].kind = body.kind;
//       }
//       if (body.name) {
//         pets[id].name = body.name;
//       }
//       fs.writeFile("pets.json", JSON.stringify(pets));
//       res.status(200);
//       res.send(pets[id]);
//       console.log("Updated pet!");
//     } else {
//       res.status(400);
//       res.send("Bad Request");
//       console.log("Bad Request");
//     }
//   });
// });

// app.delete("/pets/:id", (req, res) => {
//   const id = req.params.id;
//   fs.readFile("pets.json", "utf-8").then((str) => {
//     const pets = JSON.parse(str);
//     if (!pets[id]) {
//       res.status(400);
//       console.error("Not Found");
//       res.send("Not Found");
//     } else {
//       res.send(pets[id]);
//       pets.splice(id, 1);
//       fs.writeFile("pets.json", JSON.stringify(pets));
//       res.status(200);
//       console.log("Deleted pet!");
//     }
//   });
// });

// app.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });
///////////////////////////////////
///////////////////////////////////
const pool = new pg.Pool({
  database: "petshop",
});
app.get("/pets", (req, res) => {
  pool.query("SELECT * FROM pets").then((data) => {
    res.send(data.rows);
  });
});

app.get("/pets/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM pets WHERE id = $1;", [id]).then((data) => {
    const pet = data.rows[0];
    if (pet) {
      res.send(pet);
    } else {
      res.sendStatus(404);
    }
  });
});

app.post("/pets", (req, res) => {
  const body = req.body;
  if (typeof body.age === "number" && body.kind && body.name) {
    pool
      .query(
        "INSERT INTO pets(name, kind, age) VALUES($1, $2, $3) RETURNING *;",
        [body.name, body.kind, body.age]
      )
      .then((data) => {
        res.status(200);
        res.send(data.rows[0]);
        console.log("New pet added!");
      });
  } else {
    res.status(400);
    res.set("Content-Type", "text/plain");
    res.send("Bad Request");
    console.log("Bad Request");
  }
});

app.delete("/pets/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query(`DELETE FROM pets WHERE id = $1 RETURNING *`, [id])
    .then((data) => {
      if (data.rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(data.rows[0]);
      }
    });
});

app.patch("/pets/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, age, kind } = req.body;
  if (Number.isNaN(id)) {
    res.status(400).send(`Invalid id given :"${req.params.id}"`);
  }
  if (age) {
    if (typeof age !== "number") {
      res.sendStatus(400);
      res.send("Bad Request");
    }
  }
  if (kind) {
    if (typeof kind !== "string") {
      res.sendStatus(400);
      res.send("Bad Request");
    }
  }
  if (name) {
    if (typeof name !== "string") {
      res.sendStatus(400);
      res.send("Bad Request");
    }
  }
  pool
    .query(
      `UPDATE pets SET name = COALESCE($1, name), age = COALESCE($2, age), kind = COALESCE($3, kind) WHERE id = $4 RETURNING *`,
      [name, age, kind, id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        res.sendStatus(404);
      } else {
        res.send(result.rows[0]);
      }
    });
});

// app.use((err, req, res, next) => {
//   if (err) {
//     res.status(500).send("Something broke!");
//   }
// });

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
