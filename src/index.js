import { select, max, scaleLinear, csv, scaleBand, axisBottom, axisLeft } from 'd3'

const store = {};


async function loadData() {
    let promise = csv("routes.csv")
    const routes = await promise;
    store.routes = routes;
    return store;
}

function groupByAirline(data) {
    let result = data.reduce((result, d) => {
        let currentData = result[d.AirlineID] || {
            "AirlineID": d.AirlineID,
            "AirlineName": d.AirlineName,
            "Count": 0
        }

        currentData.Count++

        result[d.AirlineID] = currentData;

        return result;
    }, {})

    result = Object.keys(result).map(key => result[key])
    result = result.sort((a, b) => b.Count - a.Count)
    return result
}

function showData() {
    let routes = store.routes
    let airlines = groupByAirline(store.routes);
    console.log(airlines)
}

loadData().then(showData);

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
