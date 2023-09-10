import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../env";
/**
 * Hash Senha
 * @param {string} password
 * @returns {string} returns hashed password
 */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password) => bcrypt.hashSync(password, salt);

/**
 * Compara Senha
 * @param {string} hashPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

/**
 * Valida Email
 * @param {string} email
 * @returns {Boolean} True or False
 */
const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

/**
 * Valida Senha
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
    if (password.length <= 5 || password === "") {
        return false;
    }
    return true;
};
/**
 * Valida se Esta Vazio e Remove Espaços
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
    if (input === undefined || input === "") {
        return true;
    }
    if (input.replace(/\s/g, "").length) {
        return false;
    }
    return true;
};

/**
 * Valida se Esta vazio
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
    if (input === undefined || input === "") {
        return true;
    }
};

/**
 * Gera Token
 * @param {string} id
 * @returns {string} token
 */
const generateUserToken = (id, email, nome, perfil, telefone, cpf) => {
    const token = jwt.sign(
        {
            id,
            email,
            nome,
            perfil,
            telefone,
            cpf,
        },
        env.secret,
        { expiresIn: "3d" }
    );
    return token;
};

export {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    empty,
    generateUserToken,
};
