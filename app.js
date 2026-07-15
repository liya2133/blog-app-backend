const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");
const Bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const userModel = require("./model/users");

const app = Express();

app.use(Express.json());
app.use(Cors());

// MongoDB Connection
Mongoose.connect(
    "mongodb://liyasebastian2108_db_user:liya2133@ac-darivsu-shard-00-00.o79rfyx.mongodb.net:27017,ac-darivsu-shard-00-01.o79rfyx.mongodb.net:27017,ac-darivsu-shard-00-02.o79rfyx.mongodb.net:27017/blogappDb?ssl=true&replicaSet=atlas-zp9w17-shard-0&authSource=admin&appName=Cluster0"
).then(() => {
    console.log("MongoDB Connected");
});

// Signup API
app.post("/signup", async (req, res) => {

    let input = req.body;

    let hashedPassword = Bcrypt.hashSync(input.password, 10);
    input.password = hashedPassword;

    userModel.find({ email: input.email }).then((items) => {

        if (items.length > 0) {
            res.json({ status: "Email already exists" });
        } else {
            let result = new userModel(input);

            result.save();
            res.json({ status: "Success" });
        }

    });

});

app.listen(3030, () => {
    console.log("Server Started on Port 3030");
});