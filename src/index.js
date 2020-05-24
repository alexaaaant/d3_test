import * as d3 from 'd3'

const body = d3.select("#body")
d3.json("countries.geo.json").then(showData)

function showData(mapInfo) {
    const bodyH = 400
    const bodyW = 400

    let projection = d3.geoNaturalEarth1()
        .scale(100)
        .translate([bodyW / 2, bodyH / 2])

    let path = d3.geoPath()
        .projection(projection)

    body.selectAll("path")
        .data(mapInfo.features)
        .enter()
        .append("path")
        .attr("d", d => path(d))
        .attr("stroke", "black")
        .attr("fill", "none")
}


// const store = {};

// async function loadData() {
//     let promise = csv("routes.csv")
//     const routes = await promise;
//     store.routes = routes;
//     return store;
// }

// function groupByAirline(data) {
//     let result = data.reduce((result, d) => {
//         let currentData = result[d.AirlineID] || {
//             "AirlineID": d.AirlineID,
//             "AirlineName": d.AirlineName,
//             "Count": 0
//         }

//         currentData.Count++

//         result[d.AirlineID] = currentData;

//         return result;
//     }, {})

//     result = Object.keys(result).map(key => result[key])
//     result = result.sort((a, b) => b.Count - a.Count)
//     return result
// }

// function showData() {
//     let airlines = groupByAirline(store.routes);
//     drawAirlinesChart(airlines)
// }

// function getAirlinesChartConfig() {
//     let width = 350;
//     let height = 400;
//     let margin = {
//         top: 10,
//         bottom: 50,
//         left: 130,
//         right: 10
//     }

//     let bodyHeight = height - margin.top - margin.bottom
//     let bodyWidth = width - margin.left - margin.right

//     let container = select("#AirlinesChart");
//     container
//         .attr("width", width)
//         .attr("height", height)

//     return { width, height, margin, bodyHeight, bodyWidth, container }
// }

// function drawAirlinesChart(airlines) {
//     let config = getAirlinesChartConfig();
//     let scales = getAirlinesChartScales(airlines, config);
//     drawBarsAirlinesChart(airlines, scales, config)
//     drawAxesAirlinesChart(scales, config);
// }

// function getAirlinesChartScales(airlines, config) {
//     let { bodyWidth, bodyHeight } = config;
//     let maximunCount = max(airlines, v => v.Count)

//     let xScale = scaleLinear()
//         .range([0, bodyWidth])
//         .domain([0, maximunCount])

//     let yScale = scaleBand()
//         .range([0, bodyHeight])
//         .domain(airlines.map(a => a.AirlineName))
//         .padding(0.2)

//     return { xScale, yScale }
// }

// function drawBarsAirlinesChart(airlines, scales, config) {
//     let { margin, container } = config
//     let { xScale, yScale } = scales
//     let body = container.append("g")
//         .style("transform",
//             `translate(${margin.left}px,${margin.top}px)`
//         )

//     let bars = body.selectAll(".bar")
//         .data(airlines)

//     bars.enter().append("rect")
//         .attr("height", yScale.bandwidth())
//         .attr("y", (d) => yScale(d.AirlineName))
//         .attr("width", v => xScale(v.Count))
//         .attr("fill", "#2a5599")
// }

// function drawAxesAirlinesChart(scales, config) {
//     let { xScale, yScale } = scales
//     let { container, margin, height } = config;
//     let axisX = axisBottom(xScale)
//         .ticks(5)

//     container.append("g")
//         .style("transform",
//             `translate(${margin.left}px,${height - margin.bottom}px)`
//         )
//         .call(axisX)

//     let axisY = axisLeft(yScale)

//     container.append("g")
//         .style("transform",
//             `translate(${margin.left}px,${margin.top}px)`
//         )
//         .call(axisY)
// }

// loadData().then(showData);
