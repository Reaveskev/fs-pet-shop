import fs from "fs";
const subcommand = process.argv[2];

switch (subcommand) {
  case "read": {
    const index = process.argv[3];
    fs.readFile("pets.json", "utf-8", (err, str) => {
      const data = JSON.parse(str);

      if (!index) {
        console.log(data);
      } else if (data[index] === undefined) {
        console.error("Usage: node pets.js read INDEX");
      } else if (index) {
        console.log(data[index]);
      }
    });
    break;
  }
  case "create": {
    const age = Number(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];

    if (!age || !kind || !name) {
      console.error("Usage: node pets.js create AGE KIND NAME");
    } else {
      fs.readFile("pets.json", "utf-8", (err, str) => {
        const newPet = { age: age, kind: kind, name: name };
        const data = JSON.parse(str);
        data.push(newPet);
        fs.writeFile("pets.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log(error);
          } else {
            console.log("it worked!");
          }
        });
      });
    }
    break;
  }
  case "update": {
    const index = process.argv[3];
    const age = Number(process.argv[4]);
    const kind = process.argv[5];
    const name = process.argv[6];
    if (!index || !age || !kind || !name) {
      console.error("Usage: node pets.js update INDEX AGE KIND NAME");
    } else {
      fs.readFile("pets.json", "utf-8", (err, str) => {
        const updatePet = { age: age, kind: kind, name: name };
        const data = JSON.parse(str);
        data[index] = updatePet;
        fs.writeFile("pets.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log(error);
          } else {
            console.log("Updated!");
          }
        });
      });
    }
    break;
  }
  case "destroy": {
    const index = process.argv[3];
    if (!index) {
      console.error("Usage: node pets.js destroy INDEX");
    } else {
      fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        data.splice(index, 1);
        fs.writeFile("pets.json", JSON.stringify(data), (err) => {
          if (err) {
            console.log(error);
          } else {
            console.log("Deleted!");
          }
        });
      });
    }
    break;
  }
  default: {
    console.error("Usage: node pets.js [read | create | update | destroy]");
  }
}
