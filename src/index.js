import * as d3 from 'd3'

let body = d3.select("#body")
let yAxisContainer = d3.select("#yAxis")
let data = []
d3.csv("data.csv").then((d) => {
    data = d;
    showData(data)
})

function select(datapoint) {

}

function showData(clients) {
    let max = d3.max(clients, d => +d.Weight)
    let scale = d3.scaleLinear().range([0, 60])
        .domain([0, max])

    let scalePosition = d3.scaleBand().rangeRound([0, 130]).domain(clients.map(d => d.Name))
    scalePosition.padding(0.3)
    let join = body.selectAll("rect")
        .data(clients)

    join.enter()
        .append("rect")
        .style("fill", "blue")
        .style("stroke", "white")
        .attr("width", d => scale(+d.Weight))
        .attr("height", scalePosition.bandwidth())
        .attr("transform", d => `translate(0,${scalePosition(d.Name)})`)
        .on("click", d => {
            d3.select("#details").text(d.Name)
        })
        .on("mouseover", function () {
            this.style.fill = "red";
        })
        .on("mouseout", function () {
            this.style.fill = "blue";
        })

    let line = d3.select("#container").append("g")
        .attr("transform", "translate(0,-10)")

    line = line.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", 200)
        .attr("stroke", "red")
        .attr("stroke-width", "3px")

    let yAxis = d3.axisLeft(scalePosition)
    yAxisContainer = d3.select("#yAxis")
        .style("transform", "translate(40px, 10px)")
        .transition()
        .call(yAxis)

    d3.select("#container").on("mousemove", function () {
        const x = d3.mouse(this)[0];
        line.attr("transform", `translate(${x},-10)`)
    })

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
