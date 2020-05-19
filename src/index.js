import { select, selectAll, max, scaleLinear } from 'd3'

const buttons = selectAll("button").nodes()
const container = select("#container")

let clients = [
    { name: "client0", weigth: 102 },
    { name: `client 1`, weigth: 100 },
    { name: `client 2`, weigth: 76 },
    { name: `client 3`, weigth: 60 },
    { name: `client 4`, weigth: 80 },
    { name: `client 5`, weigth: 110 },
]
let count = 1;

buttons[0].addEventListener('click', add);
buttons[1].addEventListener('click', remove);

function add() {
    clients.push(
        { name: `client ${count}`, weigth: 100 },
    );
    count++;
    showData(clients)
}

function remove() {
    clients = clients.slice(0, -1);
    count--;
    showData(clients);
}

function showData(clients) {
    const maxValue = max(clients, d => d.weigth);
    const scale = scaleLinear()
        .range([0, 300])
        .domain([0, maxValue])

    let join = container
        .selectAll("div")
        .data(clients)
    join.enter()
        .append("div")
        .text(d => `${d.name}: ${scale(d.weigth)}`)
        .style("background-color", "blue")
        .style("margin", "5px")
        .style("color", "white")
        .style("width", c => `${scale(c.weigth)}px`)
}

showData(clients)