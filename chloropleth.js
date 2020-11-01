chart = {
    const svg = d3.create("svg")
        .style("display", "block")
        .attr("viewBox", [0, 0, width, height]);
  
    const defs = svg.append("defs");
  
    defs.append("path")
        .attr("id", "outline")
        .attr("d", path(outline));
  
    defs.append("clipPath")
        .attr("id", "clip")
      .append("use")
        .attr("xlink:href", new URL("#outline", location));
  
    const g = svg.append("g")
        .attr("clip-path", `url(${new URL("#clip", location)})`);
  
    g.append("use")
        .attr("xlink:href", new URL("#outline", location))
        .attr("fill", "white");
  
    g.append("g")
      .selectAll("path")
      .data(countries.features)
      .join("path")
        .attr("fill", d => color(data.get(d.properties.name)))
        .attr("d", path)
      .append("title")
        .text(d => `${d.properties.name}
  ${data.has(d.properties.name) ? data.get(d.properties.name) : "N/A"}`);
  
    g.append("path")
        .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-linejoin", "round")
        .attr("d", path);
  
    svg.append("use")
        .attr("xlink:href", new URL("#outline", location))
        .attr("fill", "none")
        .attr("stroke", "black");
  
    return svg.node();
  }

  data = Map(194) {
    "Afghanistan" => 53
    "Albania" => 68.1
    "Algeria" => 65.5
    "Andorra" => NaN
    "Angola" => 55.8
    "Antigua and Barb." => 67
    "Argentina" => 68.4
    "Armenia" => 66.3
    "Australia" => 73
    "Austria" => 72.4
    "Azerbaijan" => 64.9
    "Bahamas" => 66.8
    "Bahrain" => 68.1
    "Bangladesh" => 63.3
    "Barbados" => 67
    "Belarus" => 65.5
    "Belgium" => 71.6
    "Belize" => 62.5
    "Benin" => 53.5
    "Bhutan" => 60.7
    "Bolivia" => 63
    "Bosnia and Herz." => 67.2
    "Botswana" => 57.5
    "Brazil" => 66
    "Brunei" => 67.9
    "Bulgaria" => 66.4
    "Burkina Faso" => 52.9
    "Burundi" => 52.6
    "Cabo Verde" => 64.5
    "Cambodia" => 60.8
    "Cameroon" => 51.1
    "Canada" => 73.2
    "Central African Rep." => 44.9
    "Chad" => 47.2
    "Chile" => 69.7
    "China" => 68.7
    "Colombia" => 67.1
    "Comoros" => 56.6
    "Congo" => 56.7
    "Cook Is." => NaN
    "Costa Rica" => 70.9
    "Côte d'Ivoire" => 48.3
    "Croatia" => 69
    "Cuba" => 69.9
    "Cyprus" => 73.3
    "Czechia" => 69.3
    "North Korea" => 64.6
    "Dem. Rep. Congo" => 52.5
    "Denmark" => 71.8
    "Djibouti" => 56.6
    "Dominica" => NaN
    "Dominican Rep." => 65.2
    "Ecuador" => 67.9
    "Egypt" => 61.1
    "El Salvador" => 65.5
    "Eq. Guinea" => 53.8
    "Eritrea" => 57.4
    "Estonia" => 68.2
    "Ethiopia" => 57.5
    "Fiji" => 61.3
    "Finland" => 71.7
    "France" => 73.4
    "Gabon" => 58.7
    "Gambia" => 54.4
    "Georgia" => 64.9
    "Germany" => 71.6
    "Ghana" => 56.4
    "Greece" => 72
    "Grenada" => 64.7
    "Guatemala" => 64.2
    "Guinea" => 52.2
    "Guinea-Bissau" => 51.7
    "Guyana" => 58.3
    "Haiti" => 55.3
    "Honduras" => 66.8
    "Hungary" => 66.8
    "Iceland" => 73
    "India" => 59.3
    "Indonesia" => 61.7
    "Iran" => 65.4
    "Iraq" => 59
    "Ireland" => 72.1
    "Israel" => 72.9
    "Italy" => 73.2
    "Jamaica" => 66.9
    "Japan" => 74.8
    "Jordan" => 66.4
    "Kazakhstan" => 63.4
    "Kenya" => 58.9
    "Kiribati" => 57.8
    "Kuwait" => 66.3
    "Kyrgyzstan" => 63.5
    "Laos" => 57.9
    "Latvia" => 66.2
    "Lebanon" => 66.1
    "Lesotho" => 46.6
    "Liberia" => 54.5
    "Libya" => 62.3
    "Lithuania" => 66.1
    "Luxembourg" => 72.6
    "Madagascar" => 58.3
    "Malawi" => 56.2
    "Malaysia" => 66.6
    "Maldives" => 69.8
    "Mali" => 50.7
    "Malta" => 72.2
    "Marshall Is." => NaN
    "Mauritania" => 56.4
    "Mauritius" => 65.8
    "Mexico" => 67.7
    "Micronesia" => 61.1
    "Monaco" => NaN
    "Mongolia" => 61.9
    "Montenegro" => 68.1
    "Morocco" => 65.3
    "Mozambique" => 52.2
    "Myanmar" => 58.4
    "Namibia" => 55.9
    "Nauru" => NaN
    "Nepal" => 61.3
    "Netherlands" => 72.1
    "New Zealand" => 72.8
    "Nicaragua" => 66.9
    "Niger" => 52.5
    "Nigeria" => 48.9
    "Niue" => NaN
    "Norway" => 73
    "Oman" => 65.6
    "Pakistan" => 57.7
    "Palau" => NaN
    "Panama" => 69.4
    "Papua New Guinea" => 58
    "Paraguay" => 65.3
    "Peru" => 67.5
    "Philippines" => 61.7
    "Poland" => 68.5
    "Portugal" => 72
    "Qatar" => 68.6
    "South Korea" => 73
    "Moldova" => 63.6
    "Romania" => 66.6
    "Russia" => 63.5
    "Rwanda" => 59.9
    "St. Kitts and Nevis" => NaN
    "Saint Lucia" => 66.4
    "St. Vin. and Gren." => 63.4
    "Samoa" => 66
    "San Marino" => NaN
    "São Tomé and Principe" => 60.7
    "Saudi Arabia" => 65.7
    "Senegal" => 58.8
    "Serbia" => 67.4
    "Seychelles" => 65.7
    "Sierra Leone" => 47.6
    "Singapore" => 76.2
    "Slovakia" => 68.3
    "Slovenia" => 70.5
    "Solomon Is." => 61.9
    "Somalia" => 50
    "South Africa" => 55.7
    "S. Sudan" => 50.6
    "Spain" => 73.8
    "Sri Lanka" => 66.8
    "Sudan" => 55.7
    "Suriname" => 63.2
    "eSwatini" => 50.2
    "Sweden" => 72.4
    "Switzerland" => 73.5
    "Syria" => 55.8
    "Tajikistan" => 63.5
    "Thailand" => 66.8
    "Macedonia" => 67.1
    "Timor-Leste" => 59.2
    "Togo" => 53.9
    "Tonga" => 64.3
    "Trinidad and Tobago" => 63.3
    "Tunisia" => 66.3
    "Turkey" => 66
    "Turkmenistan" => 61.4
    "Tuvalu" => NaN
    "Uganda" => 54.9
    "Ukraine" => 64
    "United Arab Emirates" => 66.7
    "United Kingdom" => 71.9
    "Tanzania" => 56.5
    "United States of America" => 68.5
    "Uruguay" => 68.8
    "Uzbekistan" => 64.5
    "Vanuatu" => 62.7
    "Venezuela" => 66.1
    "Vietnam" => 67.5
    "Yemen" => 55.1
    "Zambia" => 54.3
    "Zimbabwe" => 54.4
    title: "Healthy life expectancy (years)"
    <prototype>: Map {
    constructor: ƒ()
    get: ƒ()
    set: ƒ()
    has: ƒ()
    delete: ƒ()
    clear: ƒ()
    entries: ƒ()
    forEach: ƒ()
    keys: ƒ()
    size: [forbidden]
    values: ƒ()
    Symbol(Symbol.toStringTag): "Map"
    Symbol(Symbol.iterator): ƒ()
  }
  }

  data = Object.assign(new Map(d3.csvParse(await FileAttachment("hale.csv").text(), ({country, hale}) => [rename.get(country) || country, +hale])), {title: "Healthy life expectancy (years)"})

  rename = new Map([
  ["Antigua and Barbuda", "Antigua and Barb."],
  ["Bolivia (Plurinational State of)", "Bolivia"],
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Brunei Darussalam", "Brunei"],
  ["Central African Republic", "Central African Rep."],
  ["Cook Islands", "Cook Is."],
  ["Democratic People's Republic of Korea", "North Korea"],
  ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
  ["Dominican Republic", "Dominican Rep."],
  ["Equatorial Guinea", "Eq. Guinea"],
  ["Iran (Islamic Republic of)", "Iran"],
  ["Lao People's Democratic Republic", "Laos"],
  ["Marshall Islands", "Marshall Is."],
  ["Micronesia (Federated States of)", "Micronesia"],
  ["Republic of Korea", "South Korea"],
  ["Republic of Moldova", "Moldova"],
  ["Russian Federation", "Russia"],
  ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
  ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
  ["Sao Tome and Principe", "São Tomé and Principe"],
  ["Solomon Islands", "Solomon Is."],
  ["South Sudan", "S. Sudan"],
  ["Swaziland", "eSwatini"],
  ["Syrian Arab Republic", "Syria"],
  ["The former Yugoslav Republic of Macedonia", "Macedonia"],
  // ["Tuvalu", ?],
  ["United Republic of Tanzania", "Tanzania"],
  ["Venezuela (Bolivarian Republic of)", "Venezuela"],
  ["Viet Nam", "Vietnam"]
])



  
color = ƒ(n)

color = d3.scaleSequential()
    .domain(d3.extent(Array.from(data.values())))
    .interpolator(d3.interpolateYlGnBu)
    .unknown("#ccc")
    
    projection = ƒ(t)
    projection = d3.geoEqualEarth()