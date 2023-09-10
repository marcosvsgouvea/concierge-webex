import express from "express";
import "babel-polyfill";
import cors from "cors";
import env from "./env.js";
import bodyParser from "body-parser"

import kitchenRoute from "./app/routes/kitchenRoute";
import roomRoute from "./app/routes/roomRoute";
import orderRoute from "./app/routes/orderRoute";
import productRoute from "./app/routes/productRoute";
import { main } from './roomenv'

import expressLayouts from 'express-ejs-layouts';
const app = express();
const http = require('http').createServer(app)
const io = require("socket.io")(http);
const jsxapi = require('jsxapi');
const requestIp = require('request-ip');

global.io = io;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(expressLayouts);
app.use(cors());
app.use(express.json());

app.use(requestIp.mw())
app.use("/api/v1/kitchen", kitchenRoute);
app.use("/api/v1/room", roomRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/product", productRoute);

//main()

app.get("/", (req, res) => {
    let ip = 'http://localhost:3001';

    res.render("pages/pedidos", { ip });
});

app.post("/pedidos", (req, res) => {
    console.log("novo request => ", req.body);
    let { msg } = req.body;
    io.emit("pedidos", msg);

    res.json(req.body)
});

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

http.listen(env.port).on("listening", () => {
    console.log(`server live 🚀 on ${env.port}`);
});


export default app;
