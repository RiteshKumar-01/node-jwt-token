const express = require("express");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";

const app = express();

app.get("/", (req, resp) => {
  resp.json({
    message: "welcome to express!!",
  });
});

app.post("/login", (req, resp) => {
  const user = {
    id: 1,
    name: "ritesh",
    email: "ritesh@test.com",
  };

  //using jwt to generate token
  jwt.sign({ user }, secretKey, { expiresIn: "300s" }, (err, token) => {
    resp.json({
      token,
    });
  });
});

app.post("/profile", verifyToken, (req, resp) => {
  jwt.verify(req.token, secretKey, (err, authdata) => {
    if (err) {
      resp.send({ result: "invalid token" });
    } else {
      resp.json({
        message: "profile accesssed :)",
        authdata,
      });
    }
  });
});

function verifyToken(req, resp, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    resp.send({
      message: "Token Mismatch!!!",
    });
  }
}

app.listen(5001, () => {
  console.log("app is running on 5001");
});
