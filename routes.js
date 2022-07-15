// routes.js
import fs from "fs";
import { request } from "http";

export const routes = {
  "/pets": (req, res) => {
    fs.readFile("pets.json", "utf-8", (err, data) => {
      res.end(data);
    });
  },

  "/pets/0": (req, res) => {
    fs.readFile("pets.json", "utf-8", (err, data) => {
      var pets = JSON.parse(data);
      var petsJSON = JSON.stringify(pets[0]);
      res.end(petsJSON);
    });
  },

  "/pets/1": (req, res) => {
    fs.readFile("pets.json", "utf-8", (err, data) => {
      var pets = JSON.parse(data);
      var petsJSON = JSON.stringify(pets[1]);
      res.end(petsJSON);
    });
  },
};
