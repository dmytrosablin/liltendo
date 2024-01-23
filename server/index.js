const User = require("./models/UserModel")


require("dotenv").config()
const mongoose = require("mongoose");
const express = require("express");

const app = express();
const PORT = 3000;



app.use(express.static('public'))


app.get("/api/set_record/:id/:record", async (req, res) => {
    const usr_id = +req.params.id;
    const usr_record =  +req.params.record;
    await User.findOneAndUpdate({'id': usr_id}, {'record': usr_record});

});

app.get("/api/:id/:name/:user_name/",async (req, res) => {
    const usr_id = +req.params.id;
    const name = req.params.name;
    const user_name = req.params.user_name;
    const usr = await User.findOne({'id': usr_id})
    if (usr == null) {
        console.log("creation");
        await User.create({"id": usr_id, "name": name, "record": 0, "user_name": user_name});
        res.json(0);
        return;
    } else if (!usr.user_name) {
        usr.user_name = user_name;
        await User.findOneAndReplace({'id': usr_id}, usr);
    }
    res.json(usr.record)
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