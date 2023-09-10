/* eslint-disable camelcase */
import moment from "moment";
import dbQuery from "../db/dev/dbQuery";
import { errorMessage, successMessage, status } from "../helpers/status";
const jsxapi = require('jsxapi');

const updateDevices = async (req, res) => {
    console.log('cai aqui ')
    const listRoomQuery = `SELECT * FROM "concierge"."rooms" ORDER BY id DESC`;
    const listProductsQuery = `SELECT * FROM "concierge"."products" WHERE status = 1 AND deleted_at is null ORDER BY id DESC`;

    try {
        var { rows } = await dbQuery.query(listRoomQuery)
        const rooms = rows;
        var { rows } = await dbQuery.query(listProductsQuery)
        const produtos = rows;

        for (const room of rooms) {

            jsxapi.connect(`wss://${room.ip}`, {
                username: room.username,
                password: room.password
            }).on('error', async (error) => {
                console.log(error)
            }).on('ready', async (xapi) => {

                xapi.command('UserInterface Extensions Panel Save', { PanelId: 'concierge' },
                    `<Extensions>
                <Version>1.1</Version>
                <Name>Concierge</Name>
                <Panel>
                    <Order>1</Order>
                    <Icon>Concierge</Icon>
                    <Color>#FF3D67</Color>
                    <Name>Concierge</Name>
                    <Type>Statusbar</Type>
                    <Page>
                        <Name>Concierge</Name>
                        ${produtos.map(el => {
                        return `<Row>
                                    <Name>${el.name}</Name>
                                    <Widget>
                                    <WidgetId>${el.code}</WidgetId>
                                    <Type>Spinner</Type>
                                    <Options>style=plusminus</Options>
                                    </Widget>
                                </Row>`}).join('')}
                        <Row>
                        <Name/>
                        <Widget>
                          <WidgetId>concierge_pedir</WidgetId>
                          <Name>Pedir</Name>
                          <Type>Button</Type>
                          <Options>size=2</Options>
                        </Widget>
                        <Widget>
                          <WidgetId>widget_2</WidgetId>
                          <Type>Spacer</Type>
                          <Options>size=2</Options>
                        </Widget>
                        </Row>
                    </Page>
                </Panel>
            </Extensions>`).then(result => {
                    console.log('result => ', result)
                    xapi.close()
                    res.json(result)
                }).catch(error => {
                    console.log('erro => ', error)
                });

            });
        }
    } catch (error) {
        console.log(error)
    }
}

const roomInsert = async (req, res) => {
    const { name, kitchen_id, ip, description, username, password } = req.body;

    const insertRoomQuery = `INSERT INTO "concierge"."rooms" ( name, kitchen_id, ip, description, username, password ) VALUES ($1, $2, $3, $4, $5, $6) returning *`;
    const values = [name, kitchen_id, ip, description, username, password]

    try {
        const { rows } = await dbQuery.query(insertRoomQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const roomList = async (req, res) => {

    const listRoomQuery = `SELECT * FROM "concierge"."rooms" ORDER BY id DESC`;

    try {
        const { rows } = await dbQuery.query(listRoomQuery)
        const dbResponse = rows;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const roomById = async (req, res) => {
    const { id } = req.params;

    const byIdRoomQuery = `SELECT * FROM "concierge"."rooms" WHERE id = $1`;
    const values = [id]

    try {
        const { rows } = await dbQuery.query(byIdRoomQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const roomDelete = async (req, res) => {
    const { id } = req.params;

    const deleteRoomQuery = `DELETE FROM "concierge"."rooms" WHERE id = $1`;
    const values = [id]

    try {
        await dbQuery.query(deleteRoomQuery, values)
        successMessage.data = {};
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const roomUpdate = async (req, res) => {
    const { id } = req.params;
    const { name, kitchen_id, ip, description, user, pass } = req.body;

    const updateRoomQuery = `UPDATE "concierge"."rooms" SET name = $1, 
    kitchen_id = $2, ip = $3, description = $4, username = $5, password = $6, updated_at = $7 
    WHERE id = $8 returning *`;
    const values = [name, kitchen_id, ip, description, user, pass, new Date(), id]

    try {
        const { rows } = await dbQuery.query(updateRoomQuery, values);
        const dbResponse = rows
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

}

export {
    roomInsert,
    roomList,
    roomById,
    roomDelete,
    roomUpdate,
    updateDevices
};