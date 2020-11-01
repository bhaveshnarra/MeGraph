function plotHorizontalBar() {
    var data = [{ "salesperson": "Bob", "sales": 33 }, { "salesperson": "Robin", "sales": 12 }, { "salesperson": "Anne", "sales": 41 }, { "salesperson": "Mark", "sales": 16 }, { "salesperson": "Joe", "sales": 59 }, { "salesperson": "Eve", "sales": 38 }, { "salesperson": "Karen", "sales": 21 }, { "salesperson": "Kirsty", "sales": 25 }, { "salesperson": "Chris", "sales": 30 }, { "salesperson": "Lisa", "sales": 47 }, { "salesperson": "Tom", "sales": 5 }, { "salesperson": "Stacy", "sales": 20 }, { "salesperson": "Charles", "sales": 13 }, { "salesperson": "Mary", "sales": 29 }];

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = $("#horizontalBarSVG").width() - margin.left - margin.right,
        height = $("#horizontalBarSVG").height() - margin.top - margin.bottom;

    // set the ranges
    var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x = d3.scaleLinear()
        .range([0, width]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#horizontalBarSVG").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // format the data
    data.forEach(function (d) {
        d.sales = +d.sales;
    });

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data, function (d) { return d.sales; })])
    y.domain(data.map(function (d) { return d.salesperson; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function (d) { return x(d.sales); })
        .attr("y", function (d) { return y(d.salesperson); })
        .attr("height", y.bandwidth());

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

};


function getPersonFromGraphQL(){
      // var svg = $("#chloroSVG");
            // svg.setAttribute('width', $("#chloro").width());
            // svg.setAttribute('height', $("#chloro").height());

            var svg = d3.select("#chloroSVG").append("svg")
                .attr("width", $("#chloroSVG").width())
                .attr("height", $("#chloroSVG").height())

            // var svg = d3.select("#chloroSVG"),
            width = +$("#chloroSVG").width(),
                height = +$("#chloroSVG").height();

            // Map and projection
            var path = d3.geoPath();
            var projection = d3.geoNaturalEarth()
                .scale(width / 2 / Math.PI)
                .translate([width / 2, height / 2])
            var path = d3.geoPath()
                .projection(projection);

            // Data and color scale
            var data = d3.map();
            // var colorScheme = d3.schemeReds[6];
            var colorScheme = ["#ff6e1a", "#d13012", "#d60f66", "#8c0f45", "#4a1773", "#a10f7d", "#75125e"];
            // colorScheme.unshift("#eee")
            var colorScale = d3.scaleThreshold()
                .domain([1, 6, 11, 26, 101, 1001])
                .range(colorScheme);
            // console.log(colorScheme);
            // Legend
            var g = svg.append("g")
                .attr("class", "legendThreshold")
                .attr("transform", "translate(20,20)");
            g.append("text")
                .attr("class", "caption")
                .attr("x", 0)
                .attr("y", -6)
                .text("Ancestry");
            var labels = ['0', '1-5', '6-10', '10-20', '20-50', '50-80', '> 90'];
            var legend = d3.legendColor()
                .labels(function (d) { return labels[d.i]; })
                .shapePadding(4)
                .scale(colorScale);
            svg.select(".legendThreshold")
                .call(legend);


            // Load external data and boot
            d3.queue()
                .defer(d3.json, "geojson.geojson")
                .defer(d3.csv, "mooc-countries.csv", function (d) {
                    data.set(d.code, +d.total);


                }).await(ready);

                function ready(error, topo) {
                        if (error) throw error;

                        // Draw the map
                        svg.append("g")
                            .attr("class", "countries")
                            .selectAll("path")
                            .data(topo.features)
                            .enter().append("path")
                            .attr("fill", function (d) {
                                // Pull data for this country
                                d.total = data.get(d.id) || 0;
                                // Set the color
                                return colorScale(d.total);
                            })
                            .attr("d", path);
                    }
}
