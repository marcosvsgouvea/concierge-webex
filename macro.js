import xapi from 'xapi';
const room_id = 3;
const urlPOST = `http://172.31.253.191:3000`;
let tentativas = 5;
let timer;
let ask = false;

function Main() {
    let pedido = [];
    waiting();
    xapi.event.on("UserInterface Extensions Widget Action", (event) => {

        if (event.WidgetId == 'concierge_pedir' && event.Type == 'clicked') {
            fazerPedido(pedido)
        } else if (event.WidgetId.indexOf("concierge_") >= 0) {
            tentativas = 4;
            pedido = atualizarPedido(event, pedido);
        }
    })

}

function waiting(){
    setTimeout(() => {
            if(ask == true){
                let now = new Date();
                let diff = timer - now;
                let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000)
                if(diffMin < 0){
                    xapi.command("UserInterface Message Alert Display", {
                        Title: "Are you there?",
                        Text: "You haven't completed your order.",
                        Duration: 10,
                    }).then(res => {
                        ask = false;
                        timer = new Date();
                        console.log(res)
                    }).catch();
                }
            }
            
            
        waiting();
    }, 60000);
}
function fazerPedido(pedido) {
    try {
        xapi
            .command(
                "HttpClient Post",
                {
                    Url: `${urlPOST}/api/v1/order/room`,
                    Header: 'Content-Type: application/json'
                },
                JSON.stringify({ room_id: room_id, products: pedido })
            )
            .then((result) => {
                ask = false;
                zerarVar(pedido);
                xapi.command("UserInterface Message Alert Display", {
                    Title: "Order sended",
                    Text: "",
                    Duration: 10,
                }).then(res => {
                    xapi.command("UserInterface Extensions Panel Close", {}).then(res => {
                        console.log(res)
                    }).catch();
                    console.log(res)
                }).catch();
            }).catch((err) => {
                console.log(err);
                console.log('eroooooo !')
                console.log("failed: " + JSON.stringify(err));

            });
    } catch (e) {
        console.log(e);
    }
}


function atualizarPedido(event, pedido) {
    let item = pedido.find((element) => element.tipo == event.WidgetId);
    ask = true;
    timer = new Date();
    if (!item) {
        item = { tipo: event.WidgetId, quantidade: 0 };
    }
    if (
        event.Value == "increment" &&
        event.Type == "clicked"
    ) {

        item.quantidade++;

    } else if (
        event.Value == "decrement" &&
        event.Type == "clicked"
    ) {
        if (item.quantidade > 0) {
            item.quantidade--;
        } else {
            item.quantidade = 0;
        }
    }

    xapi
        .command("UserInterface Extensions Widget SetValue", {
            WidgetId: event.WidgetId,
            Value: item.quantidade,
        })
        .catch(handleError);
    const index = pedido.findIndex((element) => element.tipo == event.WidgetId);
    if (index < 0) {
        pedido.push(item);
    } else {
        pedido[index] = item;
    }
    return pedido;
}


function zerarVar(pedido) {

    for (let i = 0; i < pedido.length; i++) {
        pedido[i].quantidade = 0;
        xapi
            .command("UserInterface Extensions Widget SetValue", {
                WidgetId: pedido[i].tipo,
                Value: pedido[i].quantidade
            })
            .catch(handleError);
    }
    return pedido;
}

function handleError(error) {
    console.log("Error", error);
}


Main();
