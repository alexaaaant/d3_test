import * as d3 from 'd3'

d3.json("nodes.json").then(showData)

const body = d3.select("#body")

function createElements(data) {
    const nodes = body.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", "black")

    const links = body.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke", "black")
}

function updateElements() {
    d3.select(".nodes")
        .selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)

    d3.select(".links")
        .selectAll("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

}

function showData(data) {
    const bodyHeight = 400;
    const bodyWidth = 400;
    createElements(data);
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id((d) => d.id))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(bodyWidth / 2, bodyHeight / 2))

    simulation
        .nodes(data.nodes)
        .on("tick", updateElements)

    simulation.force("link")
        .links(data.links)
}
// const store = {};

// async function loadData() {
//     return Promise.all([d3.csv("routes.csv"), d3.json("countries.geo.json")])
//         .then((datasets) => {
//             store.routes = datasets[0];
//             store.geoJSON = datasets[1];
//             return store;
//         })
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
//     drawAirlinesChart(airlines);
//     drawMap(store.geoJSON);

//     const airports = groupByAirport(store.routes);
//     drawAirports(airports);
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

//     let container = d3.select("#AirlinesChart");
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
//     let maximunCount = d3.max(airlines, v => v.Count)

//     let xScale = d3.scaleLinear()
//         .range([0, bodyWidth])
//         .domain([0, maximunCount])

//     let yScale = d3.scaleBand()
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
//     let axisX = d3.axisBottom(xScale)
//         .ticks(5)

//     container.append("g")
//         .style("transform",
//             `translate(${margin.left}px,${height - margin.bottom}px)`
//         )
//         .call(axisX)

//     let axisY = d3.axisLeft(yScale)

//     container.append("g")
//         .style("transform",
//             `translate(${margin.left}px,${margin.top}px)`
//         )
//         .call(axisY)
// }

// function getMapConfig() {
//     const width = 600;
//     const height = 400;
//     const container = d3.select("#Map");
//     container
//         .style("height", height)
//         .style("width", width);
//     return { width, height, container }
// }

// function getMapProjection(config) {
//     const { height, width } = config;
//     const projection = d3.geoMercator();
//     projection.scale(97)
//         .translate([width / 2, height / 2 + 20])
//     store.mapProjection = projection;
//     return store.mapProjection;
// }

// function drawBaseMap(container, countries, projection) {
//     const path = d3.geoPath().projection(projection);
//     container.selectAll("path").data(countries)
//         .enter()
//         .append("path")
//         .attr("d", d => path(d))
//         .attr("stroke", "#ccc")
//         .attr("fill", "#eee")
// }

// function drawMap(geoJson) {
//     const config = getMapConfig();
//     const projection = getMapProjection(config);
//     drawBaseMap(config.container, geoJson.features, projection);
// }

// function groupByAirport(data) {
//     let result = data.reduce((result, d) => {
//         const currentDest = result[d.DestAirportID] || {
//             "AirportID": d.DestAirportID,
//             "Airport": d.DestAirport,
//             "Latitude": +d.DestLatitude,
//             "Longitude": +d.DestLongitude,
//             "City": d.DestCity,
//             "Country": d.DestCountry,
//             "Count": 0,
//         }
//         currentDest.Count += 1;
//         result[d.DestAirportID] = currentDest;

//         const currentSource = result[d.SourceAirportID] || {
//             "AirportID": d.SourceAirportID,
//             "Airport": d.SourceAirport,
//             "Latitude": +d.SourceLatitude,
//             "Longitude": +d.SourceLongitude,
//             "City": d.SourceCity,
//             "Country": d.SourceCountry,
//             "Count": 0,
//         }
//         currentSource.Count += 1;
//         result[d.SourceAirportID] = currentSource;
//         return result;
//     }, {});

//     result = Object.keys(result).map(key => result[key]);
//     return result;
// }

// function drawAirports(airports) {
//     const config = getMapConfig();
//     const projection = getMapProjection(config);
//     const container = config.container;

//     const circles = container.selectAll("circle")
//         .data(airports)
//         .enter()
//         .append("circle")
//         .attr("r", 1)
//         .attr("fill", "#2a5599")
//         .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
//         .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
// }

// loadData().then(showData);
