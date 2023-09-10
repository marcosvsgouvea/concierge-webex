const express = require("express");
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const cors = require("cors");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/alerta", (req, res) => {
	console.log("get alerta ####");

	res.json({ ok: true });
});

app.get("/post", (req, res) => {
	console.log("post alerta ####");
	console.log(req.body);

	res.json({ ok: true });
});

app.get("/teste/:agua/:cafe/:cha", (req, res) => {
	console.log(req.params);
	console.log(req.param);

	let msg = [
		{
			produtos: [
				{
					qtd: 1,
					img: "cafe",
					nome: "Café",
				},
				{
					qtd: 2,
					img: "cha",
					nome: "Chá",
				},
				{
					qtd: 3,
					img: "agua",
					nome: "Água",
				},
			],
			status: "PENDENTE",
			class: "info",
			sala: "teentitans",
			nome: "Teen Titans Torre",
			localizacao: "7º Andar",
		},
	];

	console.log(msg);

	io.emit("pedidos", msg);

	res.send("foi");
});

app.get("/", (req, res) => {
	let pedidos = {
		sala_1: [
			{
				item: "Café",
				qtd: 2,
				status: "completo",
				class: "success",
				img: "cafe",
				sala: "listaSala1",
			},
			{
				item: "Água",
				qtd: 5,
				status: "pendente",
				class: "warning",
				img: "agua",
				sala: "listaSala1",
			},
			{
				item: "Chá",
				qtd: 3,
				status: "pendente",
				class: "warning",
				img: "cha",
				sala: "listaSala1",
			},
		],
		sala_2: [
			{
				item: "Chá",
				qtd: 5,
				status: "completo",
				class: "success",
				img: "cha",
				sala: "listaSala2",
			},
			{
				item: "Café",
				qtd: 2,
				status: "completo",
				class: "success",
				img: "cafe",
				sala: "listaSala2",
			},
			{
				item: "Água",
				qtd: 3,
				status: "pendente",
				class: "warning",
				img: "agua",
				sala: "listaSala2",
			},
		],
	};

	res.render("pages/pedidos", { pedidos });
});

app.post("/", (req, res) => {
	console.log("novo request => ", req.body);
	let { msg } = req.body;
	console.log(msg);
	io.emit("pedidos", msg);

	res.send("foi");
});

io.on("connection", (socket) => {
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

http.listen(3000, () => {
	console.log("listening on *:3000");
});
