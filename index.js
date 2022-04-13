//fetch data
console.log("Index js running 2")


const dataUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json" 

fetchData = async () => {
  
  const response = await fetch(dataUrl)
  const arr = await response.json()
  const data = arr.data
  
  // get the bounds of the data
  const maxY = data.reduce((prev, curr) => prev[1] > curr[1] ? prev : curr)[1]
  const minY = data.reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[1]
  const minX = new Date(data[0][0])
  const maxX = new Date(data[data.length-1][0])
 
  // main chart
  const w = 1200
  const h = 600
  const padding = 60
  
  const svg = d3.select(".chart")
              .append("svg")
              .attr("height", h)
              .attr("width",w)
              .style("background-color", "pink")             
  
  // axis scaling
  var xScale = d3
  .scaleTime()
  .domain([minX, maxX])
  .range([padding, w-padding]);

  var yScale = d3.scaleLinear()  
  .domain([0, maxY])
  .range([h-padding, 0]);       
  
  // plot axes
  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
  .attr("transform", "translate(" + 0 + "," + (h-padding) + ")")
  .attr('id', 'x-axis')
  .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
  .attr("transform", "translate(" + padding + "," + 0 + ")")
  .attr('id', 'y-axis')
  .call(yAxis);
  
  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background", "#000")
    .style("color","green")
    .text("d[0]")
    .attr("id", "tooltip")
    


  // plot databars
  svg.selectAll("bar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", d => xScale(new Date(d[0])))
    .attr("y", d => yScale(d[1]))
    .attr("width", 1)
    .attr("height", d =>  h-padding-yScale(d[1]))
    .attr("fill", "blue")
    .attr("class", "bar")
    .attr("data-date", d=> d[0])
    .attr("data-gdp",d => d[1])
    .on("mouseover", (e,d) => {return tooltip.style("visibility", "visible");})
    .on("mousemove", (e,d) => {
      return tooltip
              .style("top", (e.pageY-10)+"px")
              .style("left",(e.pageX+10)+"px")
              .attr("data-date", d[0])
              .text(d[0] +" , "+ d[1])
    
    })
    .on("mouseout", (e,d) => {return tooltip.style("visibility", "hidden");});

  svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("x", d => xScale(new Date(d[0])))
  .attr("y", d => yScale(d[1]))
  .attr("text", d => d[1])
  .style("font-size", "50px")
  
  svg.selectAll("dots")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", d => xScale(new Date(d[0])))
      .attr("cy", d => yScale(d[1]))
      .attr("r", 2)
      .attr("fill", "black")

    

    
   
}


fetchData()


