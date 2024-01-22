const User = require("./models/UserModel")


require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = 3000;




app.use(express.static('public'))
app.get("/", (req, res) => {
})

app.get("/api/:id/:username",async (req, res) => {
    const usr_id = +req.params.id;
    const name = req.params.username
    const usr = await User.findOne({'id': usr_id}, 'record')
    if (usr == null) {
        console.log("creation")
        User.create({"id": usr_id, "name": name,"record": 0})
        res.json(0)
        return;
    }
    res.json(usr.record)
    // let record = 0;
    // fs.readFile("./db.json", (err, jsonString) => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //     let data = JSON.parse(jsonString)
    //     find: {
    //         for (user of data.users) {
    //             if (user.id == usr_id) {
    //                 res.json(user.record)
    //                 break find;
    //             }
    //         }
    //         res.json(0)
    //         data.users.push({"id": usr_id, "record": 0});
    //         fs.writeFile("db.json", JSON.stringify(data), (error) => {
    //             if (error) {
    //                 console.log(error)
    //                 throw error;
    //             }
    //             console.log("data written correctly")
    //         })
    //     }
    // });


});

app.get("/api/set_record/:id/:record", async (req, res) => {
    const usr_id = +req.params.id;
    const usr_record =  +req.params.record;
    await User.findOneAndUpdate({'id': usr_id}, {'record': usr_record});

    // console.log(usr_record)
    //
    // fs.readFile("./db.json", (err, jsonString) => {
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //
    //     let data = JSON.parse(jsonString)
    //     find: {
    //         for (let i = 0; i < data.users.length; i++) {
    //             if (data.users[i].id == usr_id) {
    //                 data.users[i].record = usr_record;
    //                 fs.writeFile("db.json", JSON.stringify(data), (error) => {
    //                     if (error) {
    //                         console.log(error)
    //                         throw error;
    //                     }
    //                     console.log("data written correctly")
    //                 })
    //                 break find
    //             }
    //         }
    //
    //     }
});

app.get("/api/get_liders", async (req, res) => {
    res.json(await User.find({}, "record name").sort([['record', -1]]))
});

mongoose.connect("mongodb+srv://dmytrosablin:dmytro2006@liltendo.rtlj85v.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
        app.listen(PORT, () => {
            console.log("SERVER IS ONLINE")
        })
    })
    .catch((error) => {
        console.log(error)
    })