d3.csv("./data/Video_Games.csv").then(function(data){

     const width = document.querySelector("#chart1").clientWidth;
     const height = document.querySelector("#chart1").clientHeight;

     const margin = {top:50, left:120, right:140, bottom:10};
     let yearRange = {start:1980, end:1990};

     const yText = ["Global","North America","Japan","Europe","Others"];

     const yStep = (height/6)/2;

     const svg = d3.select("#chart1")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

     const genreList = [];

     data.forEach(function(d){
          if (!genreList.includes(d.Genre) && d.Genre != "") genreList.push(d.Genre);
     })

     console.log(genreList);

     /*
     PROCESSING DATA
     */

     let filtered_data = data.filter(function(d){
          return +d.Year_of_Release >= yearRange.start && +d.Year_of_Release < yearRange.end; 
     });

     let salesRange = {
          min: d3.min(filtered_data,function(d){ return +d.Global_Sales}),
          max: d3.max(filtered_data,function(d){ return +d.Global_Sales})
     };
     

     //top 10 in global sales

     let sortedData = filtered_data.sort(function(a, b){

          if (+a.Global_Sales < +b.Global_Sales) return 1;
          else if (+a.Global_Sales > +b.Global_Sales) return -1;
          else return 0;

          })

     let globSales = sortedData.filter(function(d){
          return sortedData.indexOf(d) < 10;
     })

     let globGames = [];

     globSales.forEach(function(d){
          if (!globGames.includes(d.Name)) globGames.push(d.Name);
     })



     //top 10 japan sales

     sortedData = filtered_data.sort(function(a, b){

          if (+a.JP_Sales < +b.JP_Sales) return 1;
          else if (+a.JP_Sales > +b.JP_Sales) return -1;
          else return 0;

     })

     let jpSales = sortedData.filter(function(d){
          return sortedData.indexOf(d) < 10;
     })

     let jpGames = [];

     jpSales.forEach(function(d){
          if (!jpGames.includes(d.Name)) jpGames.push(d.Name);
     })

     //top 10 north america sales

     sortedData = filtered_data.sort(function(a, b){
          
          if (+a.NA_Sales < +b.NA_Sales) return 1;
          else if (+a.NA_Sales > +b.NA_Sales) return -1;
          else return 0;

     })

     let naSales = sortedData.filter(function(d){
          return sortedData.indexOf(d) < 10;
     })

     let naGames = [];

     naSales.forEach(function(d){
          if (!naGames.includes(d.Name)) naGames.push(d.Name);
     })



     //top 10 europe sales

     sortedData = filtered_data.sort(function(a, b){

          if (+a.EU_Sales < +b.EU_Sales) return 1;
          else if (+a.EU_Sales > +b.EU_Sales) return -1;
          else return 0;

     })

     let euSales = sortedData.filter(function(d){
          return sortedData.indexOf(d) < 10;
     })

     let euGames = [];

     euSales.forEach(function(d){
          if (!euGames.includes(d.Name)) euGames.push(d.Name);
     })
     


     //top 10 other sales
     sortedData = filtered_data.sort(function(a, b){
          
          if (+a.Other_Sales < +b.Other_Sales) return 1;
          else if (+a.Other_Sales > +b.Other_Sales) return -1;
          else return 0;

     })

     console.log(sortedData);

     let otherSales = sortedData.filter(function(d){
          return sortedData.indexOf(d) < 10;
     })

     let otherGames = [];

     otherSales.forEach(function(d){
          if (!otherGames.includes(d.Name)) otherGames.push(d.Name);
     })


     /*
     CREATING SCALES
     */
     let glScale = d3.scaleBand()
          .domain(globGames)
          .rangeRound([margin.left, width-margin.right])
          .padding(1);

     let jpScale = d3.scaleBand()
          .domain(jpGames)
          .rangeRound([margin.left, width-margin.right])
          .padding(1);
     
     let naScale = d3.scaleBand()
          .domain(naGames)
          .rangeRound([margin.left, width-margin.right])
          .padding(1);
     
     let euScale = d3.scaleBand()
          .domain(euGames)
          .rangeRound([margin.left, width-margin.right])
          .padding(1);
     
     let otherScale = d3.scaleBand()
          .domain(otherGames)
          .rangeRound([margin.left, width-margin.right])
          .padding(1);

     let rScale = d3.scaleSqrt()
          .domain([salesRange.min, salesRange.max])
          .range([4, 40]);
     
     const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
     

     /*
     DRAW AXES
     */
     for(let i = 0; i<yText.length; i++){
          svg.append("text")
               .attr("class", "axisLabel")
               .attr("x", 10)
               .attr("y", yStep * (2 * i + 2))
               .attr("fill", "#23335f")
               .text(yText[i]);
          
          svg.append("line")
               .attr("class","dashedLines")
               .attr("stroke","grey")
               .attr("stroke-width",0.8)
               .attr("x1", margin.left + 20)
               .attr("y1",yStep * (2 * i + 2))
               .attr("x2",width - margin.right - 40)
               .attr("y2",yStep * (2 * i + 2));
     }

          /*
     DRAW TITLE
     */
     let title = svg.append("text")
          .attr("class", "titleLabel")
          .attr("x", width/2)
          .attr("y", margin.top*2/3)
          .attr("text-anchor", "middle")
          .attr("fill", "#23335f")
          .text(`TOP 10 BESTSELLING VIDEO GAMES IN DIFFERENT MARKETS (${yearRange.start} - ${yearRange.end})`)

     /*
     DRAW CIRCLES
     */
     
     let glCircle = svg.selectAll("g")
          .data(globSales)
          .enter()
          .append("circle")
          .attr("class","globCircles")
          .attr("cx", function(d){ return glScale(d.Name)})
          .attr("cy", yStep*1 + margin.top)
          .attr("r", function(d){ return rScale(d.Global_Sales)})
          .attr("fill", function(d){ return colorScale(d.Genre)})
          .attr("opacity", 0.8);
     
     let naCircle = svg.selectAll("g")
          .data(naSales)
          .enter()
          .append("circle")
          .attr("class","naCircles")
          .attr("cx", function(d){ return naScale(d.Name)})
          .attr("cy", yStep*3 + margin.top)
          .attr("r", function(d){ return rScale(d.NA_Sales)})
          .attr("fill", function(d){ return colorScale(d.Genre)})
          .attr("opacity", 0.8);
     
     let jpCircle = svg.selectAll("g")
          .data(jpSales)
          .enter()
          .append("circle")
          .attr("class","jpCircles")
          .attr("cx", function(d){ return jpScale(d.Name)})
          .attr("cy", yStep*5 + margin.top)
          .attr("r", function(d){ return rScale(d.JP_Sales)})
          .attr("fill", function(d){ return colorScale(d.Genre)})
          .attr("opacity", 0.8);
     
     let euCircle = svg.selectAll("g")
          .data(euSales)
          .enter()
          .append("circle")
          .attr("class","euCircles")
          .attr("cx", function(d){ return euScale(d.Name)})
          .attr("cy", yStep*7 + margin.top)
          .attr("r", function(d){ return rScale(d.EU_Sales)})
          .attr("fill", function(d){ return colorScale(d.Genre)})
          .attr("opacity", 0.8);
     
     let otherCircle = svg.selectAll("g")
          .data(otherSales)
          .enter()
          .append("circle")
          .attr("class","otherCircles")
          .attr("cx", function(d){ return otherScale(d.Name)})
          .attr("cy", yStep*9 + margin.top)
          .attr("r", function(d){ return rScale(d.Other_Sales)})
          .attr("fill", function(d){ return colorScale(d.Genre)})
          .attr("opacity", 0.8);
     


     /*
     DRAW LABELS
     */
     let xAxis1 = svg.append("g")
          .attr("class","axis1")
          .attr("transform", `translate(0, ${yStep*2 + margin.top})`)
          .call(d3.axisBottom().scale(glScale).tickSize(0))
          .style("font-size",11)
          .style("letter-spacing", "-1px")
     .selectAll(".tick text")
          .call(wrap,80)
          .attr("opacity",0.6);


     let xAxis2 = svg.append("g")
          .attr("class","axis2")
          .attr("transform", `translate(0, ${yStep*4 + margin.top - 8})`)
          .call(d3.axisBottom().scale(naScale).tickSize(0))
          .style("font-size",11)
          .style("letter-spacing", "-1px")
     .selectAll(".tick text")
          .call(wrap,80)
          .attr("opacity",0.6);
     
     let xAxis3 = svg.append("g")
          .attr("class","axis3")
          .attr("transform", `translate(0, ${yStep*6 + margin.top - 10})`)
          .call(d3.axisBottom().scale(jpScale).tickSize(0))
          .style("font-size",11)
          .style("letter-spacing", "-1px")
     .selectAll(".tick text")
          .call(wrap,80)
          .attr("opacity",0.6);

     let xAxis4 = svg.append("g")
          .attr("class","axis4")
          .attr("transform", `translate(0, ${yStep*8 + margin.top - 10})`)
          .call(d3.axisBottom().scale(euScale).tickSize(0))
          .style("font-size",11)
          .style("letter-spacing", "-1px")
     .selectAll(".tick text")
          .call(wrap,80)
          .attr("opacity",0.6);

     let xAxis5 = svg.append("g")
          .attr("class","axis5")
          .attr("transform", `translate(0, ${yStep*10 + margin.top - 15})`)
          .call(d3.axisBottom().scale(otherScale).tickSize(0))
          .style("font-size",11)
          .style("letter-spacing", "-1px")
     .selectAll(".tick text")
          .call(wrap,80)
          .attr("opacity",0.6);


     /*
     INTERACTIVE
     */

     d3.selectAll(".period").on("click",function(){
          let state = this.value;
          if (state == "a") yearRange = {start:1980, end:1990};
          if (state == "b") yearRange = {start:1990, end:2000};
          if (state == "c") yearRange = {start:2000, end:2010};
          if (state == "d") yearRange = {start:2010, end:2018};

          filtered_data = data.filter(function(d){
               return +d.Year_of_Release >= yearRange.start && +d.Year_of_Release < yearRange.end; 
          });
     
          salesRange = {
               min: d3.min(filtered_data,function(d){ return +d.Global_Sales}),
               max: d3.max(filtered_data,function(d){ return +d.Global_Sales})
          };

          //append title

          title.text(`TOP 10 BESTSELLING VIDEO GAMES IN DIFFERENT MARKETS (${yearRange.start} - ${yearRange.end})`)

          //top 10 in global sales

          sortedData = filtered_data.sort(function(a, b){
               if (+a.Global_Sales < +b.Global_Sales) return 1;
               else if (+a.Global_Sales > +b.Global_Sales) return -1;
               else return 0;
          })

          globSales = sortedData.filter(function(d){
               return sortedData.indexOf(d) < 10;
          })

          globGames = [];

          globSales.forEach(function(d){
               if (!globGames.includes(d.Name)) globGames.push(d.Name);
          })

          //top 10 north america sales

          sortedData = filtered_data.sort(function(a, b){
               
               if (+a.NA_Sales < +b.NA_Sales) return 1;
               else if (+a.NA_Sales > +b.NA_Sales) return -1;
               else return 0;

          })

          naSales = sortedData.filter(function(d){
               return sortedData.indexOf(d) < 10;
          })

          let naGames = [];

          naSales.forEach(function(d){
               if (!naGames.includes(d.Name)) naGames.push(d.Name);
          })

          //top 10 japan sales

          sortedData = filtered_data.sort(function(a, b){

               if (+a.JP_Sales < +b.JP_Sales) return 1;
               else if (+a.JP_Sales > +b.JP_Sales) return -1;
               else return 0;
               })

          jpSales = sortedData.filter(function(d){
               return sortedData.indexOf(d) < 10;
          })

          jpGames = [];

          jpSales.forEach(function(d){
               if (!jpGames.includes(d.Name)) jpGames.push(d.Name);
          })

          //top 10 europe sales

          sortedData = filtered_data.sort(function(a, b){

               if (+a.EU_Sales < +b.EU_Sales) return 1;
               else if (+a.EU_Sales > +b.EU_Sales) return -1;
               else return 0;

          })

          euSales = sortedData.filter(function(d){
               return sortedData.indexOf(d) < 10;
          })

          euGames = [];

          euSales.forEach(function(d){
               if (!euGames.includes(d.Name)) euGames.push(d.Name);
          })

          //top 10 other sales

          sortedData = filtered_data.sort(function(a, b){
               
               if (+a.Other_Sales < +b.Other_Sales) return 1;
               else if (+a.Other_Sales > +b.Other_Sales) return -1;
               else return 0;

          })

          console.log(sortedData);

          otherSales = sortedData.filter(function(d){
               return sortedData.indexOf(d) < 10;
          })

          otherGames = [];

          otherSales.forEach(function(d){
               if (!otherGames.includes(d.Name)) otherGames.push(d.Name);
          })


          /*
          UPDATING SCALES
          */
          glScale = d3.scaleBand()
               .domain(globGames)
               .rangeRound([margin.left, width-margin.right])
               .padding(1);
          
          jpScale = d3.scaleBand()
               .domain(jpGames)
               .rangeRound([margin.left, width-margin.right])
               .padding(1);

          naScale = d3.scaleBand()
               .domain(naGames)
               .rangeRound([margin.left, width-margin.right])
               .padding(1);

          euScale = d3.scaleBand()
               .domain(euGames)
               .rangeRound([margin.left, width-margin.right])
               .padding(1);

          otherScale = d3.scaleBand()
               .domain(otherGames)
               .rangeRound([margin.left, width-margin.right])
               .padding(1);

          rScale = d3.scaleSqrt()
               .domain([salesRange.min, salesRange.max])
               .range([4, 40]);

          /*
          UPDATING CIRCLES
          */
          let glCircle_n = svg.selectAll(".globCircles")
               .data(globSales);

          glCircle_n.enter().append("circle")
               .attr("class","globCircles")
               .attr("cx", function(d){ return glScale(d.Name)})
               .attr("cy", yStep*1 + margin.top)
               .attr("r", function(d){ return rScale(d.Global_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)
          .merge(glCircle_n)
               .transition()
               .duration(1000)
               .attr("class","globCircles")
               .attr("cx", function(d){ return glScale(d.Name)})
               .attr("cy", yStep*1 + margin.top)
               .attr("r", function(d){ return rScale(d.Global_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8);
          

          let naCircle_n = svg.selectAll(".naCircles")
               .data(naSales);
          
          naCircle_n.enter().append("circle")
               .attr("class","naCircles")
               .attr("cx", function(d){ return naScale(d.Name)})
               .attr("cy", yStep*3 + margin.top)
               .attr("r", function(d){ return rScale(d.NA_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)
          .merge(naCircle_n)
               .transition()
               .duration(1000)
               .attr("class","naCircles")
               .attr("cx", function(d){ return naScale(d.Name)})
               .attr("cy", yStep*3 + margin.top)
               .attr("r", function(d){ return rScale(d.NA_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8);
          
          let jpCircle_n = svg.selectAll(".jpCircles")
               .data(jpSales);

          jpCircle_n.enter().append("circle")
               .attr("class","jpCircles")
               .attr("cx", function(d){ return jpScale(d.Name)})
               .attr("cy", yStep*5 + margin.top)
               .attr("r", function(d){ return rScale(d.JP_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)
          .merge(jpCircle_n)
               .transition()
               .duration(1000)
               .attr("class","jpCircles")
               .attr("cx", function(d){ return jpScale(d.Name)})
               .attr("cy", yStep*5 + margin.top)
               .attr("r", function(d){ return rScale(d.JP_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)

          let euCircle_n = svg.selectAll(".euCircles")
               .data(euSales);
          
          euCircle_n.enter().append("circle")
               .attr("class", "euCircles")
               .attr("cx", function(d){ return euScale(d.Name)})
               .attr("cy", yStep*7 + margin.top)
               .attr("r", function(d){ return rScale(d.EU_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)
          .merge(euCircle_n)
               .transition()
               .duration(1000)
               .attr("class", "euCircles")
               .attr("cx", function(d){ return euScale(d.Name)})
               .attr("cy", yStep*7 + margin.top)
               .attr("r", function(d){ return rScale(d.EU_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8);
          
          let otherCircle_n = svg.selectAll(".otherCircles")
               .data(otherSales);

          otherCircle_n.enter().append("circle")
               .append("circle")
               .attr("class","otherCircles")
               .attr("cx", function(d){ return otherScale(d.Name)})
               .attr("cy", yStep*9 + margin.top)
               .attr("r", function(d){ return rScale(d.Other_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8)
          .merge(otherCircle_n)
               .transition()
               .duration(1000)
               .attr("class","otherCircles")
               .attr("cx", function(d){ return otherScale(d.Name)})
               .attr("cy", yStep*9 + margin.top)
               .attr("r", function(d){ return rScale(d.Other_Sales)})
               .attr("fill", function(d){ return colorScale(d.Genre)})
               .attr("opacity", 0.8);

          /*
          UPDATING TAGS 
          */

          svg.selectAll(".axis1").remove();
          svg.selectAll(".axis2").remove();
          svg.selectAll(".axis3").remove();
          svg.selectAll(".axis4").remove();
          svg.selectAll(".axis5").remove();

          xAxis1 = svg.append("g")
               .attr("class","axis1")
               .attr("transform", `translate(0, ${yStep*2 + margin.top})`)
               .call(d3.axisBottom().scale(glScale).tickSize(0))
               .style("font-size",11)
               .style("letter-spacing", "-1px")
          .selectAll(".tick text")
               .call(wrap,90)
               .attr("opacity",0.6);
          
          xAxis2 = svg.append("g")
               .attr("class","axis2")
               .attr("transform", `translate(0, ${yStep*4 + margin.top - 8})`)
               .call(d3.axisBottom().scale(naScale).tickSize(0))
               .style("font-size",11)
               .style("letter-spacing", "-1px")
          .selectAll(".tick text")
               .call(wrap,90)
               .attr("opacity",0.6);

          xAxis3 = svg.append("g")
               .attr("class","axis3")
               .attr("transform", `translate(0, ${yStep*6 + margin.top - 10})`)
               .call(d3.axisBottom().scale(jpScale).tickSize(0))
               .style("font-size",11)
               .style("letter-spacing", "-1px")
          .selectAll(".tick text")
               .call(wrap,90)
               .attr("opacity",0.6);
          
          xAxis4 = svg.append("g")
               .attr("class","axis4")
               .attr("transform", `translate(0, ${yStep*8 + margin.top - 10})`)
               .call(d3.axisBottom().scale(euScale).tickSize(0))
               .style("font-size",11)
               .style("letter-spacing", "-1px")
          .selectAll(".tick text")
               .call(wrap,90)
               .attr("opacity",0.6);

          xAxis5 = svg.append("g")
               .attr("class","axis5")
               .attr("transform", `translate(0, ${yStep*10 + margin.top - 15})`)
               .call(d3.axisBottom().scale(otherScale).tickSize(0))
               .style("font-size",11)
               .style("letter-spacing", "-1px")
          .selectAll(".tick text")
               .call(wrap,90)
               .attr("opacity",0.6);
     });

     /*
     TOOLTIPS
     */

     const tooltip1 = d3.select("#chart1")
          .append("div")
          .attr("class", "tooltip1");

     svg.selectAll("circle").on("mouseover", function(e,d){

          let cx = +d3.select(this).attr("cx")+10;
          let cy = +d3.select(this).attr("cy");
          let color = d3.select(this).attr("fill");
     
          tooltip1.style("visibility", "visible")
               .style("left",`${cx}px`)
               .style("top",`${cy}px`)
               .html(`<b>Name:</b> ${d.Name}<br><b>Platform:</b> ${d.Platform}<br><b>Genre:</b> ${d.Genre}<br><b>Year of Release:</b> ${d.Year_of_Release}<br><b>Global Sales: </b> $ ${d.Global_Sales} million dollars<br><b>North America Sales: </b> $ ${d.NA_Sales} million dollars<br><b>Japan Sales: </b> $ ${d.JP_Sales} million dollars<br><b>Europe Sales: </b> $ ${d.EU_Sales} million dollars<br><b>Other Sales: </b> $ ${d.Other_Sales} million dollars`);
          
          d3.select(this)
               .attr("stroke-width", 5)
               .attr("stroke", color)
               .attr("fill",color)
               .attr("fill-opacity", 0.3);
     
          }).on("mouseout", function(d){
          tooltip1.style("visibility","hidden");
          let radius = +d3.select(this).attr("r");
          let color = d3.select(this).attr("stroke");

          d3.select(this)
               .attr("r", radius)
               .attr("stroke-width",0)
               .attr("fill",color)
               .attr("fill-opacity",1);
          });

     /*
     DRAW LEGENDS
     */

     const x = width - 100;
     const ySpace = 25;
     const yStart = 150;
     const r = 7;

     svg.append("text")
          .attr("class", "legendText")
          .attr("x", x + r*2)
          .attr("y", yStart)
          .attr("fill", "#23335f")
          .style("font-size",14)
          .style("font-weight","bold")
          .text("Genres");

     for(let i = 0; i<genreList.length; i++){
          svg.append("circle")
               .attr("cx",x)
               .attr("cy",yStart + ySpace*(i+1))
               .attr("r",r)
               .attr("fill",colorScale(genreList[i]));
          
          svg.append("text")
               .attr("class", "legendText")
               .attr("x", x + r*2)
               .attr("y", yStart + ySpace*(i+1)+r/2)
               .attr("fill", "#23335f")
               .text(genreList[i]);
     }



     //Axis text wrap, reference https://bl.ocks.org/mbostock/7555321//
     function wrap(text, width) {
          text.each(function() {
               let text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1, // ems
                    x = 0,
                    y = text.attr("y"),
                    dy = -0.3,
                    tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
               while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                         line.pop();
                         tspan.text(line.join(" "));
                         line = [word];
                     tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
               }
          });
     }


});