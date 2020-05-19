import { select, max, scaleLinear, csv, scaleBand } from 'd3'

const container = select("#container")

csv("data.csv").then(showData)


function showData(clients) {
    const maxValue = max(clients, d => d.weight);

    const widthScale = scaleLinear()
        .range([0, 300])
        .domain([0, maxValue])

    const positionScale = scaleBand()
        .range([0, 200])
        .domain(clients.map(c => c.name))
        .padding(0.1)

    const join = container
        .selectAll("rect")
        .data(clients)

    join.enter()
        .append("rect")
        .attr("fill", "blue")
        .attr("width", c => widthScale(c.weight))
        .attr("height", positionScale.bandwidth())
        .attr("y", c => positionScale(c.name))
}
