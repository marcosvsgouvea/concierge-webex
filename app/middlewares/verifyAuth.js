/* eslint-disable max-len */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorMessage, status } from "../helpers/status";

import env from "../../env";

dotenv.config();

/**
 * Verify Token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */

const verifyToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        errorMessage.error = "Token não informado";
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const decoded = jwt.verify(authorization.split(" ")[1], process.env.SECRET);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            nome: decoded.nome,
            perfil: decoded.perfil,
            telefone: decoded.telefone,
            cpf: decoded.cpf,
        };
        next();
    } catch (error) {
        console.log(error);
        errorMessage.error = "Autenticação Falhou";
        return res.status(status.unauthorized).send(errorMessage);
    }
};

export default verifyToken;
