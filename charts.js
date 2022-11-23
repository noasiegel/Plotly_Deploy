function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 

    var samples = data.samples;
    console.log(samples);

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter(sampleObj => sampleObj.id === sample);

    //  5. Create a variable that holds the first sample in the array.
    var sampleResult = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = sampleResult.otu_ids;
    var otuLabels = sampleResult.otu_labels;
    var sampleValues = sampleResult.sample_values;

    console.log(sampleValues);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var otuIds = sampleResult.otu_ids;
    var otuLabels = sampleResult.otu_labels;
    var sampleValues = sampleResult.sample_values;


    let yticks = otuIds.map(id => "OTU " + id ).slice(0,10).reverse();
    let xticks = sampleValues.slice(0,10).reverse();
    let xlabels = otuLabels.slice(0,10).reverse();
   
    // 8. Create the trace for the bar chart. 

    let trace = {
      x: xticks,
      y: yticks,
      type: "bar",
      hovertext: "none",
      orientation: 'h',
      marker: {
        line: {
          width: .25
        }
      }}

    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      x: {title: "SampleValues"},
      y: {title: "OTU " + yticks},
      bargap: .25,
      barmode: "group",}
    
    // 10. Use Plotly to plot the data with the layout. 
  Plotly.newPlot('bar', barData, barLayout);

// 1. Create the trace for the bubble chart.

let bubbleId = otuIds
let xaxisticks = sampleValues.slice(0,10).reverse();
let bubbleValues = sampleValues
let xaxislabels = otuLabels.map(label => "Type: " + label).slice(0,10).reverse();
let bubbleLabels = otuLabels


var bubbleData = [{
  x: bubbleId,
  y: bubbleValues,
  text: bubbleLabels,
  mode: "markers",
  marker: {
    color: bubbleValues,
    size: bubbleValues,
    colorscale: "Jet"
  },
  type: "scatter",
 }
];

// 2. Create the layout for the bubble chart.
var bubbleLayout = {
  xaxis: {title: "OTUs"},
  yaxis: {title: "Sample Values"},
  title: "Bacteria Cultures per Sample",
  hovermode: bubbleLabels
  };

// 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", bubbleData, bubbleLayout)


    // 3. Create a variable that holds the washing frequency.

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var washFreq = parseFloat(result.wfreq);
 
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: {x: [0,1], y: [0,1]},
                 value: washFreq,
                 title: {text: "Belly Button Washing Frequency/ Scrubs per week"},
                 type: "indicator",
                 mode: "gauge+number" ,
                 gauge: {
                  axis: {
                    range: [null, 10],
                    tickwidth: 1,
                    tickcolor: "gray"},
                 bar: {color: "black"},
                 steps: [
                  {range: [0,2], color: "red"},
                  {range: [2,4], color: "orange"},
                  {range: [4,6], color: "yellow"},
                  {range: [6,8], color: "green"},
                  {range: [8,10], color: "blue"}
                 ]
                 }
      }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {width: 600, height: 500, margin: {t:0, b:0}};
    
    

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}



