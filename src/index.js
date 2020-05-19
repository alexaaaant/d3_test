import { select, selectAll, csv, ascending, sum, mean, extent } from 'd3'

const buttons = selectAll("button").nodes()
const container = select("#container")

let clients = [{
    name: "client0"
}]
let count = 1;

buttons[0].addEventListener('click', add);
buttons[1].addEventListener('click', remove);

function add() {
    clients.push({ name: `client ${count}` });
    count++;
    showData(clients)
}

function remove() {
    clients = clients.slice(0, -1);
    count--;
    showData(clients);
}

function showData(clients) {
    let join = container
        .selectAll("div")
        .data(clients)
    join.enter()
        .append("div")
        .text(c => c.name + " New")
    join.text(c => c.name + " Updated")
    join.exit().remove()
    console.log(join)
}

showData(clients)