const fs = require("fs")

const express = require("express");
const app = express();
const PORT = 3000;


app.use(express.static('public'))
app.get("/", (req, res) => {
    res.send("Hello");
})

app.get("/api/:id", (req, res) => {
    const usr_id = +req.params.id;
    let record = 0;
    fs.readFile("./db.json", (err, jsonString) => {
        if (err) {
            console.log(err);
            return;
        }
        let data = JSON.parse(jsonString)
        find: {
            for (user of data.users) {
                if (user.id == usr_id) {
                    res.json(user.record)
                    break find;
                }
            }
            res.json(0)
            data.users.push({"id": usr_id, "record": 0});
            fs.writeFile("db.json", JSON.stringify(data), (error) => {
                if (error) {
                    console.log(error)
                    throw error;
                }
                console.log("data written correctly")
            })
        }
    });
});

app.get("/chill", (req, res) => {
    console.log("TEDSST")
})
app.get("/api/set_record/:id/:record", (req, res) => {
    const usr_id = +req.params.id;
    const usr_record =  +req.params.record;
    console.log(usr_record)

    fs.readFile("./db.json", (err, jsonString) => {
        if (err) {
            console.log(err);
            return;
        }

        let data = JSON.parse(jsonString)
        find: {
            for (let i = 0; i < data.users.length; i++) {
                if (data.users[i].id == usr_id) {
                    data.users[i].record = usr_record;
                    fs.writeFile("db.json", JSON.stringify(data), (error) => {
                        if (error) {
                            console.log(error)
                            throw error;
                        }
                        console.log("data written correctly")
                    })
                    break find
                }
            }

        }

    });
});

app.listen(PORT, () => {
    console.log("SERVER IS ONLINE")
})