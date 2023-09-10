/* eslint-disable camelcase */
import moment from "moment";
import dbQuery from "../db/dev/dbQuery";
import { errorMessage, successMessage, status } from "../helpers/status";


const kitchenInsert = async (req, res) => {
    const { name } = req.body;

    const insertKitchenQuery = `INSERT INTO "concierge"."kitchens" ( name ) VALUES ($1) returning *`;
    const values = [name]

    try {
        const { rows } = await dbQuery.query(insertKitchenQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const kitchenList = async (req, res) => {
    const listKitchenQuery = `SELECT * FROM "concierge"."kitchens" ORDER BY id DESC`;
    try {
        const { rows } = await dbQuery.query(listKitchenQuery)
        const dbResponse = rows;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error);
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const kitchenById = async (req, res) => {
    const { id } = req.params;

    const byIdKitchenQuery = `SELECT * FROM "concierge"."kitchens" WHERE id = $1`;
    const values = [id]

    try {
        const { rows } = await dbQuery.query(byIdKitchenQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const kitchenDelete = async (req, res) => {
    const { id } = req.params;

    const deleteKitchenQuery = `DELETE FROM "concierge"."kitchens" WHERE id = $1`;
    const values = [id]

    try {
        await dbQuery.query(deleteKitchenQuery, values)
        successMessage.data = {};
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }
};

const kitchenUpdate = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const updateKitchenQuery = `UPDATE "concierge"."kitchens" SET name = $1, updated_at = $2 WHERE id = $3 returning *`;
    const values = [name, new Date(), id]
    try {
        const { rows } = await dbQuery.query(updateKitchenQuery, values);
        const dbResponse = rows
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

}

export {
    kitchenInsert,
    kitchenList,
    kitchenById,
    kitchenDelete,
    kitchenUpdate
};
