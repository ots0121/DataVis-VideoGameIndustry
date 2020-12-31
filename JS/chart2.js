d3.csv("./data/Video_Games.csv").then(function(data){
    //console.log(data);

    /*
    DEFINE DIMENSIONS + CREATE CANVAS
    */

    const width = document.querySelector("#chart2").clientWidth;
    const height = document.querySelector("#chart2").clientHeight;
    const margin = {top:50, left:80, right:140, bottom:175};
    const r = 6;
    let region = "JP";
    let regionNames = "Japan";

    const svg = d3.select("#chart2")
        .append("svg")
        .attr("id","lifeExpChart")
        .attr("width", width)
        .attr("height", height);

    /*
    FILTER DATA
    */

    let filtered_data = data.filter(function(d){
        return d.Global_Sales >= 15;
    });

    const platforms = [];
    filtered_data.forEach(function(d){
        if (!platforms.includes(d.Platform)){
            platforms.push(d.Platform);
        }
    });

    const names = [];
    filtered_data.forEach(function(d){
        names.push(d.Name);
    });

    let globalSales = {
        min: d3.min(filtered_data, function(d){ return +d.Global_Sales}),
        max: d3.max(filtered_data, function(d){ return +d.Global_Sales})
    };

    // console.log(filtered_data);
    // console.log(platforms);
    // console.log(names);

    /*
    CREATE SCALES
    */

    const xScale = d3.scaleBand()
        .domain(names)
        .rangeRound([margin.left, width-margin.right])
        .padding(1);

    const yScale = d3.scaleLinear()
        .domain([0, globalSales.max])
        .range([height-margin.bottom, margin.top])

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    console.log(globalSales);



    /*
    APPEND CIRCLES AND LINES
    */

    const circles1 = svg.selectAll("g")
        .data(filtered_data)
        .enter()
        .append("circle")
        .attr("class","circles1")
        .attr("cx", function(d){ return xScale(d.Name);})
        .attr("cy", function(d){ return yScale(d.JP_Sales);})
        .attr("r", r)
        .attr("fill", function(d){ return colorScale(d.Platform);});

    const circles2 = svg.selectAll("g")
        .data(filtered_data)
        .enter()
        .append("circle")
        .attr("class","circles2")
        .attr("cx", function(d){ return xScale(d.Name);})
        .attr("cy", function(d){ return yScale(d.Global_Sales);})
        .attr("r", r)
        .attr("stroke",function(d){ return colorScale(d.Platform);})
        .attr("fill", "white")
        .attr("stroke-width",3);




    let line = svg.selectAll("line")
        .data(filtered_data)
        .enter()
        .append("line")
        .attr("class", "dashedLines")
        .attr("x1", function(d){ return xScale(d.Name);})
        .attr("y1", function(d){ return yScale(d.JP_Sales) - r;})
        .attr("x2", function(d){ return xScale(d.Name);})
        .attr("y2", function(d){ return yScale(d.Global_Sales) + r;})
        .attr("stroke",function(d){ return colorScale(d.Platform);})
        .attr("stroke-width", 1.5);
    
    /*
        DRAW AXES
    */

    let xAxis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(0, ${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale))
        .selectAll("text")
        .attr("x", 6)
        .attr("y", 5)
        .attr("transform","rotate(45)")
        .style("font-size",11)
        .style("letter-spacing", "-0.9px")
        .style("font-family","Verdana, Geneva, Tahoma, sans-serif")
        .style("text-anchor","start");

    let yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform",`translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale))
        .selectAll("text")
        .style("font-size",12);


    /*
    APPEND CHART LABELS
    */
    
    svg.append("text")
        .attr("class", "titleLabel")
        .attr("x", width/2)
        .attr("y", margin.top*2/3)
        .attr("text-anchor", "middle")
        .attr("fill", "#23335f")
        .text("SALES OF BESTSELLING VIDEO GAMES (1980 - 2017)")

    svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#23335f")
        .text("Games");

    svg.append("text")
        .attr("class", "axisLabel")
        .attr("x", -height/2 + margin.top)
        .attr("y", 40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .attr("fill", "#23335f")
        .text("Sales (million dollors)")


    /*
    DRAW LEGENDS
    */

    let legX = width - 100;
    let legTextX = legX + r*2;
    let legY = 220;
    let legYStep = 20;
    let legTextY = legY+4;

    for(let i = 0; i< platforms.length + 1; i++){

        if(i == 0){
            addSamples();
        }else{
        svg.append("circle")
            .attr("cx", legX)
            .attr("cy", legY + (i+2)*legYStep)
            .attr("r", r)
            .attr("fill", colorScale(platforms[i - 1]));
            
        svg.append("text")
            .attr("class", "legendText")
            .attr("x", legTextX)
            .attr("y", legTextY + (i+2)*legYStep)
            .attr("fill", "#23335f")
            .text(platforms[i - 1]);
        }
    }

    const rectPadding = 15; //This is the padding of the legend box

    svg.append("rect")
        .attr("x", legX - rectPadding)
        .attr("y", legY - rectPadding)
        .attr("width", width - legX + rectPadding)
        .attr("height", legYStep * (platforms.length +3) + rectPadding)
        .attr("stroke", "#23335f")
        .attr("stroke-width", 1)
        .attr("opacity", 0.4)
        .attr("fill", "none");

    function addSamples(){
        svg.append("circle")
            .attr("cx", legX)
            .attr("cy", legY)
            .attr("r", r)
            .attr("fill", "white")
            .attr("stroke", "#23335f")
            .attr("stroke-width",3);
        
        svg.append("text")
            .attr("class", "legendText")
            .attr("x", legTextX)
            .attr("y", legTextY)
            .attr("fill", "#23335f")
            .text("Global Sales");

        svg.append("circle")
            .attr("cx", legX)
            .attr("cy", legY + legYStep)
            .attr("r", r)
            .attr("fill", "#23335f");

        svg.append("text")
            .attr("class", "legendText")
            .attr("x", legTextX)
            .attr("y", legTextY + legYStep)
            .attr("fill", "#23335f")
            .text(`Regional Sales`);
    }


    /*
    INTERACTIVE
    */
    
    d3.selectAll(".region").on("click", function(){

        region = this.value;
        if (region == "JP") regionNames = "Japan";
        if (region == "NA") regionNames = "North America";
        if (region == "EU") regionNames = "Europe";
        if (region == "Other") regionNames = "The Rest of the World";

        //redraw circles
        let c = svg.selectAll(".circles1")
            .data(filtered_data);
        
        c.enter().append("circle")
            .attr("class","circles1")
            .attr("cx", function(d){ return xScale(d.Name);})
            .attr("cy", function(d){ 
                if (region == "JP") return yScale(d.JP_Sales);
                else if (region == "NA") return yScale(d.NA_Sales);
                else return yScale(d.Other_Sales);
            })
            .attr("r", r)
            .attr("fill", function(d){ return colorScale(d.Platform);})
        .merge(c)
            .transition()
            .duration(1000)
            .attr("cx", function(d){ return xScale(d.Name);})
            .attr("cy", function(d){ 
                if (region == "JP") return yScale(d.JP_Sales);
                else if (region == "NA") return yScale(d.NA_Sales);
                else if (region == "EU") return yScale(d.EU_Sales)-r;
                else return yScale(d.Other_Sales);
            })
            .attr("class","circles1")
            .attr("r", r)
            .attr("fill", function(d){ return colorScale(d.Platform);});

        //redraw lines
        let newLine = svg.selectAll(".dashedLines")
            .data(filtered_data);
        
        newLine.enter().append("line")
            .attr("class","dashedLines")
            .attr("x1", function(d){ return xScale(d.Name);})
            .attr("y1", function(d){ 
                if (region == "JP") return yScale(d.JP_Sales)-r;
                else if (region == "NA") return yScale(d.NA_Sales)-r;
                else if (region == "EU") return yScale(d.EU_Sales)-r;
                else return yScale(d.Other_Sales)-r;
                })
            .attr("x2", function(d){ return xScale(d.Name);})
            .attr("y2", function(d){ return yScale(d.Global_Sales) + r;})
            .attr("stroke",function(d){ return colorScale(d.Platform);})
            .attr("stroke-width", 1.5)
        .merge(newLine)
            .transition()
            .duration(1000)
            .attr("class","dashedLines")
            .attr("x1", function(d){ return xScale(d.Name);})
            .attr("y1", function(d){ 
                if (region == "JP") return yScale(d.JP_Sales)-r;
                else if (region == "NA") return yScale(d.NA_Sales)-r;
                else if (region == "EU") return yScale(d.EU_Sales)-r;
                else return yScale(d.Other_Sales)-r;
                })
            .attr("x2", function(d){ return xScale(d.Name);})
            .attr("y2", function(d){ return yScale(d.Global_Sales) + r;})
            .attr("stroke",function(d){ return colorScale(d.Platform);})
            .attr("stroke-width", 1.5);
        
    });


    /*
    TOOLTIP
    */


    const tooltip = d3.select("#chart2")
        .append("div")
        .attr("class", "tooltip");

    //tooltip for global sales circle
    circles2.on("mouseover", function(e,d){

    let cx = +d3.select(this).attr("cx")+10;
    let cy = +d3.select(this).attr("cy");
    let radius = +d3.select(this).attr("r");
    let sw = +d3.select(this).attr("stroke-width");

    tooltip.style("visibility", "visible")
        .style("left",`${cx}px`)
        .style("top",`${cy}px`)
        .html(`<b>Name:</b> ${d.Name}<br><b>Platform:</b> ${d.Platform}<br><b>Genre:</b> ${d.Genre}<br><b>Year of Release:</b> ${d.Year_of_Release}<br><b>Global Sales: </b>$ ${d.Global_Sales} million dollars`);

    d3.select(this)
        .attr("r", radius * 1.5)
        .attr("stroke-width",sw*1.5);

    }).on("mouseout", function(d){
    tooltip.style("visibility","hidden");

    d3.select(this)
        .attr("r", r)
        .attr("stroke-width",3);
    });

    //tooltip for regional sales circle
    circles1.on("mouseover", function(e,d){

    let cx = +d3.select(this).attr("cx")+10;
    let cy = +d3.select(this).attr("cy");
    let radius = +d3.select(this).attr("r");
    let sw = +d3.select(this).attr("stroke-width");
    
    let sales = d.JP_Sales;
    if (region == "JP") sales = d.JP_Sales;
    if (region == "NA") sales = d.NA_Sales;
    if (region == "EU") sales = d.EU_Sales;
    if (region == "Other") sales = d.Other_Sales;

    tooltip.style("visibility", "visible")
        .style("left",`${cx}px`)
        .style("top",`${cy}px`)
        .html(`<b>Name:</b> ${d.Name}<br><b>Platform:</b> ${d.Platform}<br><b>Genre:</b> ${d.Genre}<br><b>Year of Release:</b> ${d.Year_of_Release}<br><b>${regionNames} Sales: </b> $ ${sales} million dollars`);

    d3.select(this).attr("r", radius * 1.5)

    }).on("mouseout", function(d){
    tooltip.style("visibility","hidden");

    d3.select(this).attr("r", r)
    });

});