/* eslint-disable camelcase */
import moment from "moment";
import dbQuery from "../db/dev/dbQuery";
var _ = require('lodash');
const jsxapi = require('jsxapi');
import { errorMessage, successMessage, status } from "../helpers/status";

const checkSameRoom = async (room_id, products) => {

   
    const insertOrderQuery = `select * from "concierge"."orders" o  WHERE o.created_at > current_timestamp - interval '1 minutes' order by id desc limit 1`
    try {
        const { rows } = await dbQuery.query(insertOrderQuery)
        const dbResponse = rows[0];
        console.log(dbResponse)
        if (dbResponse != null && dbResponse.room_id == room_id && dbResponse.status == `pending`)  {
            for (const product of products) {
                await orderProductInsertByCode(dbResponse.id, product.tipo, product.quantidade);
            }
            orderListSocket();
            global.io.emit('alerts', dbResponse)
            return true;
        } else {
            return false;
        }



    } catch (error) {
        
        return false;
    }
}

const orderInsertRoom = async (req, res) => {

    const { room_id, products } = req.body;
    if (products.length > 0) {
        if (await checkSameRoom(room_id, products) == false) {
            const insertOrderQuery = `INSERT INTO "concierge"."orders" (name, room_id, status) VALUES ('', $1, 'pending') returning *`
            const values = [room_id]
            try {
                const { rows } = await dbQuery.query(insertOrderQuery, values)
                const dbResponse = rows[0];
                for (const product of products) {
                    await orderProductInsertByCode(dbResponse.id, product.tipo, product.quantidade);
                }

                successMessage.data = dbResponse
                orderListSocket();
                global.io.emit('alerts', dbResponse)
                return res.status(status.success).send(successMessage);
            } catch (error) {
                
                errorMessage.error = "Operação não realizada";
                return res.status(status.error).send(error);
            }
        }else{
            return res.status(status.success).send("");
        }
    } else {
        sendAlerta(room_id, "Your order has a problem", "We didn't found any products on your order!")

        return res.status(status.error).send("Operação não realizada");
    }
};

const orderInsert = async (req, res) => {
    const { name, room_id, kitchen_id, products } = req.body;

    const insertOrderQuery = `INSERT INTO "concierge"."orders" (name, room_id, kitchen_id, status) VALUES ($1, $2, $3, 'pending') returning *`
    const values = [name, room_id, kitchen_id]
    try {
        const { rows } = await dbQuery.query(insertOrderQuery, values)
        const dbResponse = rows[0];
        for (const product of products) {
            orderProductInsert(dbResponse.id, product.product_code, product.quantity);
        }

        successMessage.data = dbResponse
        orderListSocket();
        global.io.emit('alerts', dbResponse)
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log('erro => ', error)
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(error);
    }
};

const orderListSocket = async () => {
    const allQuery = `SELECT o.id, o.status, op.quantity, p."name" as product, o.created_at, r."name" as room, k."name"  as kitchen, r.description FROM concierge.orders o 
    INNER JOIN concierge.order_products op 
        ON o.id = op.order_id 
    INNER JOIN concierge.products p 
        ON op.product_id = p.id
    INNER JOIN concierge.rooms r 
        ON r.id = o.room_id
    INNER join concierge.kitchens k 
        on k.id = COALESCE(o.kitchen_id ,r.kitchen_id)
    WHERE o.created_at > current_timestamp - interval '30 minutes'
    ORDER BY o.id desc`

    try {

        var { rows } = await dbQuery.query(allQuery)

        let grouped = groupBy(rows, row => row.id);
        let orders = []
        let arr = _.uniqBy(rows, 'id');

        arr.forEach(el => {
            orders.push(grouped.get(el.id))
        })
        global.io.emit('orders', orders)
    } catch (error) {
        console.log(error)
    }
}


function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const orderProductInsertByCode = async (order_id, product_code, quantity) => {
    if (quantity > 0) {
        const insertOrderProductQuery = `INSERT INTO "concierges"."order_products" (order_id, product_id , quantity) VALUES ($1, (SELECT id FROM "concierges"."products" WHERE code = $2 LIMIT 1), $3)
         returning *`
        const values = [order_id, product_code, quantity]
        try {
            const { rows } = await dbQuery.query(insertOrderProductQuery, values)
            const dbResponse = rows[0];
            successMessage.data = dbResponse
        } catch (error) {
            console.log(error)
            errorMessage.error = "Operação não realizada";
        }
    }
};

const orderProductInsert = async (order_id, product_id, quantity) => {

    const insertOrderProductQuery = `INSERT INTO "concierge"."order_products" (order_id, product_id, quantity) VALUES ($1, $2, $3) returning *`
    const values = [order_id, product_id, quantity]
    try {
        const { rows } = await dbQuery.query(insertOrderProductQuery, values)
        const dbResponse = rows[0];
        successMessage.data = dbResponse
        //return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        //return res.status(status.error).send(errorMessage);
    }
};

const orderList = async (req, res) => {

    const allQuery = `SELECT o.id, o.status, op.quantity, p."name" as product, o.created_at, r."name" as room, k."name"  as kitchen, r.description FROM concierge.orders o 
    INNER JOIN concierge.order_products op  
        ON o.id = op.order_id 
    INNER JOIN concierge.products p 
        ON op.product_id = p.id
    INNER JOIN concierge.rooms r 
        ON r.id = o.room_id
    INNER join concierge.kitchens k 
        on k.id = COALESCE(o.kitchen_id ,r.kitchen_id)
    WHERE o.created_at > NOW() - interval '30 minutes'
    ORDER BY o.id desc`

    try {

        const { rows } = await dbQuery.query(allQuery)
        let grouped = groupBy(rows, row => row.id);
        let orders = []
        let arr = _.uniqBy(rows, 'id');

        arr.forEach(el => {
            orders.push(grouped.get(el.id))
        })

        successMessage.data = orders
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error)
    }
};

const orderById = async (req, res) => {
    const { id } = req.params;

    const byIdOrderQuery = `SELECT * FROM "concierge"."orders" WHERE id = $1`;
    const listRoomQuery = `SELECT * FROM "concierge"."rooms" WHERE id = $1 ORDER BY id DESC`;
    const listKitchenQuery = `SELECT * FROM "concierge"."kitchens" WHERE id = $1 ORDER BY id DESC`;
    const listProductsQuery = `select name, quantity from "concierge"."order_products" op inner join "concierge"."products" p on p.id = op.product_id where op.order_id = $1 ORDER BY name ASC`;

    try {
        var { rows } = await dbQuery.query(byIdOrderQuery, [id])
        const dbResponse = rows[0];
        var { rows } = await dbQuery.query(listKitchenQuery, [dbResponse.kitchen_id]);
        dbResponse.kitchen = rows[0];
        var { rows } = await dbQuery.query(listRoomQuery, [dbResponse.room_id]);
        dbResponse.room = rows[0];
        var { rows } = await dbQuery.query(listProductsQuery, [dbResponse.id]);
        dbResponse.products = rows;
        successMessage.data = dbResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(error)
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};


const orderDelete = async (req, res) => {
    const { id } = req.params;

    const deleteOrderQuery = `DELETE FROM "concierge"."orders" WHERE id = $1`;
    const values = [id]

    try {
        await dbQuery.query(deleteOrderQuery, values)
        successMessage.data = {};
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

};

const orderUpdate = async (req, res) => {
    const { id } = req.params;
    const { stats, kitchen_id } = req.body;

    const updateOrderQuery = `UPDATE "concierge"."orders" SET status = $1, updated_at = NOW(), kitchen_id = $2 WHERE id = $3 returning *`;
    const values = [stats, kitchen_id, id]

    try {
        const { rows } = await dbQuery.query(updateOrderQuery, values);
        const dbResponse = rows
        let msg = ''
        if (dbResponse[0].status == 'processing') {
            msg = 'your order is being prepared'
        } else if (dbResponse[0].status == 'done') {
            msg = 'your order is on its way'
        } else if (dbResponse[0].status == 'canceled') {
            msg = 'your orders has been canceled'
        }
        console.log('dbresponse => ', dbResponse[0])
        sendAlerta(dbResponse[0].room_id, "Your order has been updated", msg)
        successMessage.data = dbResponse;
        orderListSocket()
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = "Operação não realizada";
        return res.status(status.error).send(errorMessage);
    }

}

const sendAlerta = async (room_id, title, msg) => {

    const byIdRoomQuery = `SELECT * FROM "concierge"."rooms" WHERE id = $1`;
    const values = [room_id]

    try {
        const { rows } = await dbQuery.query(byIdRoomQuery, values)
        const room = rows[0];

        console.log('room => ', room)
        jsxapi.connect(`wss://${room.ip}`, {
            username: room.username,
            password: room.password
        }).on('error', async (error) => {
            console.log('erro jsxapi => ', error)
        }).on('ready', async (xapi) => {

            xapi.command("UserInterface Message Alert Display", {
                Title: title,
                Text: msg,
                Duration: 10,
            }).then(res => {
                console.log('result alerta => ', res)
                xapi.close();
            }).catch((err)=>{
                xapi.close();
                console.log('erro xapi => ', err)
            });
        })

    } catch (error) {
        console.log('erro trycatch => ', error)
    }

}


export {
    orderInsert,
    orderList,
    orderById,
    orderDelete,
    orderUpdate,
    orderInsertRoom,
    orderListSocket
};
