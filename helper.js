function plotHorizontalBar(data2) {
    var data = [{ "salesperson": "Bob", "sales": 33 }, { "salesperson": "Robin", "sales": 12 }, { "salesperson": "Anne", "sales": 41 }, { "salesperson": "Mark", "sales": 16 }, { "salesperson": "Joe", "sales": 59 }, { "salesperson": "Eve", "sales": 38 }, { "salesperson": "Karen", "sales": 21 }, { "salesperson": "Kirsty", "sales": 25 }, { "salesperson": "Chris", "sales": 30 }, { "salesperson": "Lisa", "sales": 47 }, { "salesperson": "Tom", "sales": 5 }, { "salesperson": "Stacy", "sales": 20 }, { "salesperson": "Charles", "sales": 13 }, { "salesperson": "Mary", "sales": 29 }];

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 30, left: 120 },
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
    data2.forEach(function(d) {
        d.freq = +d.freq;
    });

    // Scale the range of the data in the domains
    x.domain([0, d3.max(data2, function(d) { return d.freq; })])
    y.domain(data2.map(function(d) { return d.country; }));
    //y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data2)
        .enter().append("rect")
        .transition()
        .duration(800)
        .attr("class", "bar")
        //.attr("x", function(d) { return x(d.sales); })
        .attr("width", function(d) { return x(d.freq); })
        .attr("y", function(d) { return y(d.country); })
        .attr("height", y.bandwidth())
        .delay(function(d, i) { return (i * 100) });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));



};


function getPersonFromGraphQL(data2) {


    var svg = d3.select("#chloroSVG").append("svg")
        .attr("width", $("#chloroSVG").width())
        .attr("height", $("#chloroSVG").height())

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
    var colorScheme = ["#fedfe7", "#f278b5", "#ef73be", "#fa8788", "#d13012", "#e50a90", "#fa0b4e"];
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
        .labels(function(d) { return labels[d.i]; })
        .shapePadding(4)
        .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend);

    d3.queue()
        .defer(d3.json, "geojson.geojson")
        // .defer(d3.csv, "mooc-countries.csv", function (d) {
        //     data.set(d.code, +d.total);
        // })
        .await(ready);
    for (x in data2) {
        data.set(data2[x][0], data2[x][1]);

    }

    function ready(error, topo) {
        if (error) throw error;

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topo.features)
            .enter().append("path")
            .attr("fill", function(d) {
                // Pull data for this country
                d.total = data.get(d.id) || 0;
                // Set the color
                return colorScale(d.total);
            }) // console.log(levels);
            .transition()
            .duration(100)
            .attr("d", path)
            .delay(function(d, i) { return (i * 10) });
    }
}



function getAllPeople(Q) {
    // console.log(Q);
    fetch('https://megraph.ap-south-1.aws.cloud.dgraph.io/graphql', {
            method: 'post',
            headers: {
                'Content-Type': 'application/GraphQL; charset=UTF-8',
            },
            body: Q
        })
        .then(response => response.json())
        .then(commits => {
            // console.log(commits["data"]["queryelement"]);
            let data = commits["data"]["queryelement"];
            let Nodes = [];
            let Edges = [];
            let levels = [];
            let BaseElements = [];
            let cur = 1;
            let level = [];
            // let E = $("#cyto");
            $("#homebutton").show();
            document.getElementById("cyto").scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            });
            data.forEach(element => {
                // console.log(element["people"].length);
                if (element["people"].length > 0) {
                    let x = parseInt(element["absolutePosition"].slice(1));
                    let ele = {
                        data: {},
                    }
                    ele["data"]["id"] = element["absolutePosition"];
                    ele["data"]["name"] = element["letter"];
                    ele["data"]["count"] = element["people"].length;
                    if (element["isBase"]) {
                        ele["data"]["color"] = "#000000";
                        BaseElements.push(element);
                    } else {
                        ele["data"]["color"] = "#ff009b";
                    }
                    Nodes.push(ele);
                    if (x === cur) {
                        level.push(element);
                    } else {
                        levels.push(level);
                        cur = x;
                        level = [];
                        level.push(element);
                    }
                }

            });
            levels.push(level);
            // console.log(Nodes);
            // console.log(levels);
            // console.log(BaseElements);
            for (let i = 0; i < BaseElements.length; i++) {
                let j = i + 1;
                if (j < levels.length) {
                    levels[j].forEach(element => {
                        let ele = {
                            data: {},
                        }
                        ele["data"]["id"] = element["absolutePosition"] + BaseElements[i]["absolutePosition"];
                        ele["data"]["source"] = BaseElements[i]["absolutePosition"];
                        ele["data"]["target"] = element["absolutePosition"];
                        if (BaseElements[i]["isBase"] && element["isBase"]) {
                            ele["data"]["color"] = "#000000";
                        } else {
                            ele["data"]["color"] = "#ff009b";
                        }
                        last = element;
                        Edges.push(ele);
                    });

                }
            }

            for (let i = BaseElements.length - 1; i > 0; i--) {
                let j = i - 1;
                if (j >= 0) {
                    // console.log(j);
                    levels[j].forEach(element => {
                        if (element["isBase"]) {

                        } else {
                            let ele = {
                                data: {},
                            }
                            ele["data"]["id"] = element["absolutePosition"] + BaseElements[i]["absolutePosition"];
                            ele["data"]["source"] = element["absolutePosition"];
                            ele["data"]["target"] = BaseElements[i]["absolutePosition"];
                            if (BaseElements[i]["isBase"] && element["isBase"]) {
                                ele["data"]["color"] = "#000000";
                            } else {
                                ele["data"]["color"] = "#ff009b";
                            }
                            last = element;
                            Edges.push(ele);
                        }

                    });
                }

            }

            // console.log(Edges);

            var cy = window.cy = cytoscape({
                container: document.getElementById('cyto'),

                elements: {
                    nodes: Nodes,
                    edges: Edges
                },

                layout: {
                    name: 'dagre',
                    rankDir: 'LR'
                },

                style: [{
                        selector: 'node',
                        style: {
                            'label': 'data(id)',
                            'color': 'data(color)',
                            'background-color': 'data(color)'
                        }
                    },
                    {
                        selector: 'edge',
                        css: {
                            'curve-style': 'bezier',
                            'target-arrow-shape': 'triangle',
                            'line-color': 'data(color)',
                            // 'line-style': 'data(linestyle)'
                        }
                    }
                ]
            });



            cy.ready(function() {
                cy.nodes().forEach(function(ele) {
                    makePopper(ele);
                });
            });
            cy.nodes().on('cxttap', function(evt) {
                console.log("Hello");
                $("#traitList a")[3].click();
                $("#homebutton").show();
                document.getElementById("yellow").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });
            });
            cy.nodes().unbind('mouseover');
            cy.nodes().bind('mouseover', (event) => event.target.tippy.show());

            cy.nodes().unbind('mouseout');
            cy.nodes().bind('mouseout', (event) => event.target.tippy.hide());

            cy.nodes().unbind('drag');
            cy.nodes().bind('drag', (event) => event.target.tippy.popperInstance.update());
        });
}

function makePopper(ele) {
    let ref = ele.popperRef();
    ele.tippy = tippy(document.createElement('div'), {
        // popperInstance will be available onCreate
        lazy: false,
        followCursor: 'true',
        hideOnClick: false,
        flipOnUpdate: true,
        onShow(instance) {
            instance.popperInstance.reference = ref
        },
    });
    ele.tippy.setContent('Count ' + ele.data()["count"] + ' <br>Right Click to go to Trait');
}

function getAllTraits(Q) {
    fetch('https://megraph.ap-south-1.aws.cloud.dgraph.io/graphql', {
            method: 'post',
            headers: {
                'Content-Type': 'application/GraphQL; charset=UTF-8',
            },
            body: Q
        })
        .then(response => response.json())
        .then(commits => {
            // console.log(commits["data"]["queryTrait"]);
            let traits = [];
            var countryFreq = {};
            commits["data"]["queryTrait"].forEach(element => {
                var trait = new createTrait(element["name"], element["description"], element["phenotype"], element["base"]);
                traits.push(trait);
                // console.log(trait);
                element["base"].forEach(e => {
                    e["people"].forEach(z => {
                        // console.log(z["country"]);
                        if (z["country"] in countryFreq) {
                            countryFreq[z["country"]] += 1;
                        } else {
                            countryFreq[z["country"]] = 1;
                        }
                    });
                });
                $("#homebutton").show();
                document.getElementById("red").scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest"
                });
                // console.log(Object.keys(countryFreq).length);
                // console.log(countries);

                var pleth = [];
                var bar = [];

                for (x in countryFreq) {
                    bar.push({
                        "country": x,
                        "freq": countryFreq[x]
                    });
                    var k = countries[x];
                    pleth.push([k, countryFreq[x]]);
                }


                plotHorizontalBar(bar);
                getPersonFromGraphQL(pleth);

            });
            $("#traitList").html("");
            $("#traitCard").html("");
            traits.forEach(element => {

                $("#traitList").append("<a class=\"button button--primary mb-2\" style=\"margin: 10px;\"><span>" + element["name"] + " </span></a>");

            });

            $("#traitList a").click(function(e) {
                // console.log($('#traitList a').index(this));
                let idx = $('#traitList a').index(this);
                $("#traitCard").html("<div class=\"card text-center\" style=\"background: transparent;border: none;\">      <div class=\"card-body\" style=\"background: transparent;border: none;\"> <h2 style=\"font-size: 3rem;  font-weight: 900;\"> " + traits[idx]["name"] + "</h2>  <h3 class=\"card-title\">" + traits[idx]["phenotype"] + "</h3>    <p class=\"card-text\">" + traits[idx]["description"] + "</p>  </div>  </div>");
            });
        });

}


function getAllTraitswithoutRedirect(Q) {
    fetch('https://megraph.ap-south-1.aws.cloud.dgraph.io/graphql', {
            method: 'post',
            headers: {
                'Content-Type': 'application/GraphQL; charset=UTF-8',
            },
            body: Q
        })
        .then(response => response.json())
        .then(commits => {
            // console.log(commits["data"]["queryTrait"]);
            let traits = [];
            var countryFreq = {};
            commits["data"]["queryTrait"].forEach(element => {
                var trait = new createTrait(element["name"], element["description"], element["phenotype"], element["base"]);
                traits.push(trait);
                // console.log(trait);
                element["base"].forEach(e => {
                    e["people"].forEach(z => {
                        // console.log(z["country"]);
                        if (z["country"] in countryFreq) {
                            countryFreq[z["country"]] += 1;
                        } else {
                            countryFreq[z["country"]] = 1;
                        }
                    });
                });

                var pleth = [];
                var bar = [];

                for (x in countryFreq) {
                    bar.push({
                        "country": x,
                        "freq": countryFreq[x]
                    });
                    var k = countries[x];
                    pleth.push([k, countryFreq[x]]);
                }

                plotHorizontalBar(bar);
                getPersonFromGraphQL(pleth);

            });
            $("#traitList").html("");
            $("#traitCard").html("");
            traits.forEach(element => {

                $("#traitList").append("<a class=\"button button--primary mb-2\" style=\"margin: 10px;\"><span>" + element["name"] + " </span></a>");

            });

            $("#traitList a").click(function(e) {
                let idx = $('#traitList a').index(this);
                $("#traitCard").html("<div class=\"card text-center\" style=\"background: transparent;border: none;\">      <div class=\"card-body\" style=\"background: transparent;border: none;\"> <h2 style=\"font-size: 3rem;  font-weight: 900;\"> " + traits[idx]["name"] + "</h2>  <h3 class=\"card-title\">" + traits[idx]["phenotype"] + "</h3>    <p class=\"card-text\">" + traits[idx]["description"] + "</p>  </div>  </div>");
            });
        });

}

function createTrait(name, description, phenotype, base) {
    this.name = name;
    this.description = description;
    this.phenotype = phenotype;
    this.base = base;
}


const countries = {
    "Albania": "ALB",
    "Algeria": "DZA",
    "Antigua And Barbuda": "ATG",
    "Argentina": "ARG",
    "Armenia": "ARM",
    "Australia": "AUS",
    "Austria": "AUT",
    "Azerbaijan": "AZE",
    "Bangladesh": "BGD",
    "Belarus": "BLR",
    "Belgium": "BEL",
    "Belize": "BLZ",
    "Bermuda": "BMU",
    "Bosnia And Herzegovina": "BIH",
    "Botswana": "BWA",
    "Brazil": "BRA",
    "Bulgaria": "BGR",
    "Burundi": "BDI",
    "Cambodia": "KHM",
    "Cameroon": "CMR",
    "Canada": "CAN",
    "Chile": "CHL",
    "China": "CHN",
    "Colombia": "COL",
    "Costa Rica": "CRI",
    "Croatia": "HRV",
    "Cuba": "CUB",
    "Czechia": "CZE",
    "Denmark": "DNK",
    "Dominican Republic": "DOM",
    "Ecuador": "ECU",
    "Egypt": "EGY",
    "El Salvador": "SLV",
    "Ethiopia": "ETH",
    "Fiji": "FJI",
    "Finland": "FIN",
    "France": "FRA",
    "Georgia": "GEO",
    "Germany": "DEU",
    "Ghana": "GHA",
    "Greece": "GRC",
    "Guatemala": "GTM",
    "Guyana": "GUY",
    "Haiti": "HTI",
    "Honduras": "HND",
    "Hong Kong": "HKG",
    "Hungary": "HUN",
    "India": "IND",
    "Indonesia": "IDN",
    "Iraq": "IRQ",
    "Ireland": "IRL",
    "Israel": "ISR",
    "Italy": "ITA",
    "Jamaica": "JAM",
    "Japan": "JPN",
    "Jordan": "JOR",
    "Kazakhstan": "KAZ",
    "Kenya": "KEN",
    "Kyrgyzstan": "KGZ",
    "Latvia": "LVA",
    "Lebanon": "LBN",
    "Liberia": "LBR",
    "Libya": "LBY",
    "Malawi": "MWI",
    "Malaysia": "MYS",
    "Mexico": "MEX",
    "Mongolia": "MNG",
    "Morocco": "MAR",
    "Mozambique": "MOZ",
    "Myanmar": "MMR",
    "Nepal": "NPL",
    "Netherlands": "NLD",
    "New Zealand": "NZL",
    "Nicaragua": "NIC",
    "Nigeria": "NGA",
    "Norway": "NOR",
    "Pakistan": "PAK",
    "Panama": "PAN",
    "Paraguay": "PRY",
    "Peru": "PER",
    "Philippines": "PHL",
    "Poland": "POL",
    "Portugal": "PRT",
    "Puerto Rico": "PRI",
    "Romania": "ROU",
    "Russian Federation": "RUS",
    "Rwanda": "RWA",
    "Saudi Arabia": "SAU",
    "Senegal": "SEN",
    "Serbia": "SRB",
    "Sierra Leone": "SLE",
    "Singapore": "SGP",
    "Slovakia": "SVK",
    "Somalia": "SOM",
    "South Africa": "ZAF",
    "South Sudan": "SSD",
    "Spain": "ESP",
    "Sri Lanka": "LKA",
    "Sudan": "SDN",
    "Sweden": "SWE",
    "Switzerland": "CHE",
    "Taiwan": "TWN",
    "Thailand": "THA",
    "Timor-Leste": "TLS",
    "Togo": "TGO",
    "Trinidad And Tobago": "TTO",
    "Tunisia": "TUN",
    "Turkey": "TUR",
    "Uganda": "UGA",
    "Ukraine": "UKR",
    "United Arab Emirates": "ARE",
    "United Kingdom": "GBR",
    "United States": "USA",
    "Uruguay": "URY",
    "Viet Nam": "VNM",
    "Zimbabwe": "ZWE"
};