import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7843dc7d3f1f39",
        pass: "95ccb927e08387",
    },
});

const contatoSite = async (user) => {
    const content = fs.readFileSync("./app/template/contato_site.html", "utf8");
    let email = content.replace("{{nome}}", user.nome);
    email = email.replace("{{email}}", user.email);
    email = email.replace("{{telefone}}", user.telefone);
    email = email.replace("{{mensagem}}", user.mensagem);
    let txt = `Temos uma nova mensagem,

Segue abaixo o contato feito pelo site:

Nome: ${user.nome} 
Email: ${user.email} 
Telefone: ${user.telefone}
Mensagem: ${user.mensagem}`;
    send(
        { email: "contato@agilityweb.com.br" },
        "Novo Contato Rifa App ✔",
        email,
        txt
    );
};

const resetPassword = async (user, password) => {
    const content = fs.readFileSync("./app/template/reset_password.html", "utf8");
    let email = content.replace("{{name}}", user.nome);
    email = email.replace("{{password}}", password);

    let txt = `Olá ${user.nome}, 
	Segue abaixo sua nova senha: 
	
	Senha: ${password}`;

    send(user, "Nova Senha ✔", email, txt);
};

const send = async (mail, title, content, txt) => {
    let info = await transporter.sendMail({
        from: '"Rifa App" <rifa@app.com>',
        to: mail.email,
        subject: title,
        text: txt,
        html: content,
    });
};

export { resetPassword, contatoSite };
