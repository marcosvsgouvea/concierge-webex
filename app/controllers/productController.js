/* eslint-disable camelcase */
import moment from "moment";
import dbQuery from "../db/dev/dbQuery";

import { errorMessage, successMessage, status } from "../helpers/status";

const productInsert = async (req, res) => {
    const { name } = req.body;

    const code = `concierge_${encodeURI(name.toLowerCase())}`

    const insertProductQuery = `INSERT INTO "concierge"."products" ( name, code ) VALUES ($1, $2) returning *`;
    const values = [name, code]

    try {
        const { rows } = await dbQuery.query(insertProductQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        productListSocket()
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const productListSocket = async () => {
    const listProductQuery = `SELECT * FROM "concierge"."products" WHERE deleted_at IS NULL ORDER BY id DESC`;

    try {
        const { rows } = await dbQuery.query(listProductQuery)
        const dbResponse = rows;
        global.io.emit('products', dbResponse)
    } catch (error) {
        console.log(error)
    }
}

const productList = async (req, res) => {
    const listProductQuery = `SELECT * FROM "concierge"."products" WHERE deleted_at IS NULL  ORDER BY id DESC`;
    try {
        const { rows } = await dbQuery.query(listProductQuery)
        const dbResponse = rows;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }
};

const productById = async (req, res) => {
    const { id } = req.params;

    const byIdProductQuery = `SELECT * FROM "concierge"."products" WHERE id = $1`;
    const values = [id]

    try {
        const { rows } = await dbQuery.query(byIdProductQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const productDelete = async (req, res) => {
    const { id } = req.params;

    const deleteProductQuery = `UPDATE  "concierge"."products"  SET deleted_at = NOW() WHERE id = $1`;
    const values = [id]

    try {
        await dbQuery.query(deleteProductQuery, values)
        successMessage.data = {};
        productListSocket()
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error)
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const productUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, stats } = req.body;

    const updateProductQuery = `UPDATE "concierge"."products" SET name = $1, status = $2, updated_at = $3 WHERE id = $4 returning *`;
    const values = [name, stats, new Date(), parseInt(id)]
    try {
        const { rows } = await dbQuery.query(updateProductQuery, values);
        const dbResponse = rows
        successMessage.data = dbResponse;
        productListSocket()
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

}

const productUpdateStatus = async (req, res) => {
    const { id } = req.params;
    let { stats } = req.body;

    stats == 0 ? stats = 1 : stats = 0
    const updateStatusProductQuery = `UPDATE "concierge"."products" SET status = $1 WHERE id = $2 returning *`;
    const values = [stats, id]
    try {
        const { rows } = await dbQuery.query(updateStatusProductQuery, values);
        const dbResponse = rows;
        successMessage.data = dbResponse;
        productListSocket()
        return res.status(status.success).send(successMessage);
    } catch (error) {

    }
}

export {
    productInsert,
    productList,
    productById,
    productDelete,
    productUpdate,
    productUpdateStatus
};