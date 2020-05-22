import { select, max, scaleLinear, csv, scaleBand, axisBottom, axisLeft } from 'd3'

const container = select("#container")

csv("data.csv").then(showData)

let body = select("#body");

function showData(clients) {
    const maxValue = max(clients, d => d.weight);

    const widthScale = scaleLinear()
        .range([0, 300])
        .domain([0, maxValue])

    const positionScale = scaleBand()
        .range([0, 200])
        .domain(clients.map(c => c.name))
        .padding(0.1)

    const join = body
        .selectAll("rect")
        .data(clients)

    join.enter()
        .append("rect")
        .attr("fill", "blue")
        .attr("width", c => widthScale(c.weight))
        .attr("height", positionScale.bandwidth())
        .attr("y", c => positionScale(c.name))

    let xAxis = axisBottom(widthScale)
        .ticks(5)
        .tickFormat(d => d + " kg")

    select("#xAxis")
        .attr("transform", "translate(50, 200)")
        .call(xAxis)
    let yAxis = axisLeft(positionScale)
    select("#yAxis")
        .attr("transform", "translate(50, 0)")
        .call(yAxis)
}
