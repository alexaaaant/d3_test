import * as d3 from 'd3'

// let barchart = d3.select("#barchart")
// let timeline = d3.select("#timeline")

// let width = 300;
// let height = 200;

// barchart.attr("height", height)
// barchart.attr("width", width)

// timeline.attr("height", height)
// timeline.attr("width", width)

// let selectedCountry = undefined;

// d3.csv("data.csv")
//     .then((data) => {
//         data = prepareData(data)
//         drawBarChart(data)
//     })

// function prepareData(data) {
//     return data.map(d => {
//         const years = Object.keys(d)
//             .filter(k => !isNaN(+k))
//         const history = years.map(y => ({
//             year: y,
//             value: d[y]
//         }))
//         d.history = history;
//         d[2016] = +d[2016]
//         return d;
//     })
// }

// function showTooltip(text, coords) {
//     let x = coords[0];
//     let y = coords[1];

//     d3.select("#tooltip")
//         .style("display", "block")
//         .style("top", `${y}px`)
//         .style("left", `${x}px`)
//         .text(text)
// }

// function drawLineChart(data) {
//     data = data.history;
//     let margin = { left: 40, bottom: 20, right: 20, top: 20 }

//     let bodyWidth = width - margin.left - margin.right;
//     let bodyHeight = height - margin.top - margin.bottom;

//     let xScale = d3.scaleLinear()
//         .range([0, bodyWidth])
//         .domain(d3.extent(data, d => d.year))

//     let yScale = d3.scaleLinear()
//         .range([bodyHeight, 0])
//         .domain([0, d3.max(data, d => d.value)])

//     let lineGenerator = d3.line()
//         .x(d => xScale(d.year))
//         .y(d => yScale(d.value))

//     timeline.select(".body")
//         .attr("transform", `translate(${margin.left},${margin.top})`)
//         .select("path").datum(data)
//         .attr("d", lineGenerator)

//     timeline.select(".xAxis")
//         .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
//         .call(d3.axisBottom(xScale).ticks(5))

//     timeline.select(".yAxis")
//         .attr("transform", `translate(${margin.left},${margin.top})`)
//         .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => (d / 1e12) + "T"))

// }

// function drawBarChart(data) {
//     let margin = { left: 20, bottom: 20, right: 20, top: 20 }

//     let bodyWidth = width - margin.left - margin.right;
//     let bodyHeight = height - margin.top - margin.bottom;

//     let xScale = d3.scaleBand()
//         .range([0, bodyWidth])
//         .domain(data.map(d => d.Country))
//         .padding(0.2)

//     let yScale = d3.scaleLinear()
//         .range([bodyHeight, 0])
//         .domain([0, d3.max(data, d => d[2016])])

//     const barChartBody = barchart.select(".body")
//         .attr("transform", `translate(${margin.left},${margin.bottom})`)
//         .selectAll("rect")
//         .data(data)

//     barChartBody.enter()
//         .append("rect")
//         .attr("fill", "#556677")
//         .attr("width", xScale.bandwidth())
//         .attr("height", d => bodyHeight - yScale(d[2016]))
//         .attr("y", d => yScale(d[2016]))
//         .attr("x", d => xScale(d.Country))
//         .on("mouseenter", (d) => {
//             showTooltip(d.Country, [d3.event.clientX, d3.event.clientY])
//         })
//         .on("mousemove", (d) => {
//             showTooltip(d.Country, [d3.event.clientX, d3.event.clientY + 30])
//         })
//         .on("mouseleave", (d) => {
//             d3.select("#tooltip").style("display", "none")
//         })
//         .on("click", d => {
//             selectedCountry = d.Country;
//             drawBarChart(data);
//             drawLineChart(d);
//         }).merge(barChartBody)
//         .attr("fill", d => selectedCountry === d.Country ? "red" : "#556677")


// }
const store = {};

async function loadData() {
    return Promise.all([d3.csv("routes.csv"), d3.json("countries.geo.json")])
        .then((datasets) => {
            store.routes = datasets[0];
            store.geoJSON = datasets[1];
            return store;
        })
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
    let airlines = groupByAirline(store.routes);
    drawAirlinesChart(airlines);
    drawMap(store.geoJSON);

    const airports = groupByAirport(store.routes);
    drawAirports(airports);
}

function getAirlinesChartConfig() {
    let width = 350;
    let height = 400;
    let margin = {
        top: 10,
        bottom: 50,
        left: 130,
        right: 10
    }

    let bodyHeight = height - margin.top - margin.bottom
    let bodyWidth = width - margin.left - margin.right

    let container = d3.select("#AirlinesChart");
    container
        .attr("width", width)
        .attr("height", height)

    return { width, height, margin, bodyHeight, bodyWidth, container }
}

function drawAirlinesChart(airlines) {
    let config = getAirlinesChartConfig();
    let scales = getAirlinesChartScales(airlines, config);
    drawBarsAirlinesChart(airlines, scales, config)
    drawAxesAirlinesChart(scales, config);
}

function getAirlinesChartScales(airlines, config) {
    let { bodyWidth, bodyHeight } = config;
    let maximunCount = d3.max(airlines, v => v.Count)

    let xScale = d3.scaleLinear()
        .range([0, bodyWidth])
        .domain([0, maximunCount])

    let yScale = d3.scaleBand()
        .range([0, bodyHeight])
        .domain(airlines.map(a => a.AirlineName))
        .padding(0.2)

    return { xScale, yScale }
}

function drawBarsAirlinesChart(airlines, scales, config) {
    let { margin, container } = config
    let { xScale, yScale } = scales
    let body = container.append("g")
        .style("transform",
            `translate(${margin.left}px,${margin.top}px)`
        )

    let bars = body.selectAll(".bar")
        .data(airlines)

    bars.enter().append("rect")
        .attr("height", yScale.bandwidth())
        .attr("y", (d) => yScale(d.AirlineName))
        .attr("width", v => xScale(v.Count))
        .attr("fill", "#2a5599")
        .on("mouseenter", function (d) {
            drawRoutes(d.AirlineID);
            d3.select(this)
                .style("fill", "#992a5b")
        })
        .on("mouseleave", function (d) {
            drawRoutes(null);
            d3.select(this)
                .style("fill", "#2a5599")
        })
}

function drawAxesAirlinesChart(scales, config) {
    let { xScale, yScale } = scales
    let { container, margin, height } = config;
    let axisX = d3.axisBottom(xScale)
        .ticks(5)

    container.append("g")
        .style("transform",
            `translate(${margin.left}px,${height - margin.bottom}px)`
        )
        .call(axisX)

    let axisY = d3.axisLeft(yScale)

    container.append("g")
        .style("transform",
            `translate(${margin.left}px,${margin.top}px)`
        )
        .call(axisY)
}

function getMapConfig() {
    const width = 600;
    const height = 400;
    const container = d3.select("#Map");
    container
        .style("height", height)
        .style("width", width);
    return { width, height, container }
}

function getMapProjection(config) {
    const { height, width } = config;
    const projection = d3.geoMercator();
    projection.scale(97)
        .translate([width / 2, height / 2 + 20])
    store.mapProjection = projection;
    return store.mapProjection;
}

function drawBaseMap(container, countries, projection) {
    const path = d3.geoPath().projection(projection);
    container.selectAll("path").data(countries)
        .enter()
        .append("path")
        .attr("d", d => path(d))
        .attr("stroke", "#ccc")
        .attr("fill", "#eee")
}

function drawMap(geoJson) {
    const config = getMapConfig();
    const projection = getMapProjection(config);
    drawBaseMap(config.container, geoJson.features, projection);
}

function groupByAirport(data) {
    let result = data.reduce((result, d) => {
        const currentDest = result[d.DestAirportID] || {
            "AirportID": d.DestAirportID,
            "Airport": d.DestAirport,
            "Latitude": +d.DestLatitude,
            "Longitude": +d.DestLongitude,
            "City": d.DestCity,
            "Country": d.DestCountry,
            "Count": 0,
        }
        currentDest.Count += 1;
        result[d.DestAirportID] = currentDest;

        const currentSource = result[d.SourceAirportID] || {
            "AirportID": d.SourceAirportID,
            "Airport": d.SourceAirport,
            "Latitude": +d.SourceLatitude,
            "Longitude": +d.SourceLongitude,
            "City": d.SourceCity,
            "Country": d.SourceCountry,
            "Count": 0,
        }
        currentSource.Count += 1;
        result[d.SourceAirportID] = currentSource;
        return result;
    }, {});

    result = Object.keys(result).map(key => result[key]);
    return result;
}

function drawAirports(airports) {
    const config = getMapConfig();
    const projection = getMapProjection(config);
    const container = config.container;

    const circles = container.selectAll("circle")
        .data(airports)
        .enter()
        .append("circle")
        .attr("r", 1)
        .attr("fill", "#2a5599")
        .attr("cx", d => projection([+d.Longitude, +d.Latitude])[0])
        .attr("cy", d => projection([+d.Longitude, +d.Latitude])[1])
}

loadData().then(showData);

function drawRoutes(airlineID) {
    let routes = store.routes;
    let projection = store.mapProjection;
    let container = d3.select("#Map");
    let selectedRoutes = routes.filter((router) => router.AirlineID === airlineID);

    let bindedData = container.selectAll("line")
        .data(selectedRoutes, d => d.ID)
    let newelements = bindedData.enter()
        .append("line")
        .attr("x1", d => projection([+d.SourceLongitude, +d.SourceLatitude])[0])
        .attr("y1", d => projection([+d.SourceLongitude, +d.SourceLatitude])[1])
        .attr("x2", d => projection([+d.DestLongitude, +d.DestLatitude])[0])
        .attr("y2", d => projection([+d.DestLongitude, +d.DestLatitude])[1])
        .attr("stroke", "#992a2a")
        .style("opacity", "0.1")

    bindedData.merge(newelements).transition()

    bindedData.exit().transition().remove()
}


