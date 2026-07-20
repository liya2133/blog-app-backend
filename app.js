const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");
const Bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
const userModel = require("./model/users");
const postModel = require("./model/post");
const app = Express();

app.use(Express.json());
app.use(Cors());

// MongoDB Connection
Mongoose.connect(
    "mongodb://liyasebastian2108_db_user:liya2133@ac-darivsu-shard-00-00.o79rfyx.mongodb.net:27017,ac-darivsu-shard-00-01.o79rfyx.mongodb.net:27017,ac-darivsu-shard-00-02.o79rfyx.mongodb.net:27017/blogappDb?ssl=true&replicaSet=atlas-zp9w17-shard-0&authSource=admin&appName=Cluster0"
).then(() => {
    console.log("MongoDB Connected");
});

// create a post
app.post("/create", async (req, res) => {
    let input = req.body;
    let token = req.headers.token;

    Jwt.verify(token, "blogApp", async (error, decoded) => {
        if (decoded && decoded.email) {
            let result = new postModel(input);
            await result.save();
            res.json({ "status": "success" });   // Added response
        }
        else {
            res.json({ "status": "invalid authentication" });
        }
    });
});

// view all posts
app.post("/viewall", (req, res) => {

    let token = req.headers.token;   // Corrected

    Jwt.verify(token, "blogApp", (error, decoded) => {

        if (decoded && decoded.email) {

            postModel.find().then(
                (items) => {
                    res.json(items);
                }
            ).catch(
                (error) => {
                    res.json({ "status": "error" });
                }
            );

        } else {
            res.json({ "status": "Invalid Authentication" });
        }

    });

});

// Signin API
app.post("/signin", async (req, res) => {

    let input = req.body;

    userModel.find({ email: input.email }).then(
        (items) => {

            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(
                    input.password,
                    items[0].password
                );

                if (passwordValidator) {

                    Jwt.sign(
                        { email: input.email },
                        "blogApp",
                        { expiresIn: "1d" },
                        (error, token) => {

                            if (error) {
                                res.json({
                                    status: "error",
                                    errorMessage: error
                                });
                            } else {
                                res.json({
                                    status: "success",
                                    token: token,
                                    userId: items[0]._id
                                });
                            }

                        }
                    );

                } else {
                    res.json({ status: "incorrect password" });
                }

            } else {
                res.json({ status: "Invalid Email ID" });
            }

        }
    );

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