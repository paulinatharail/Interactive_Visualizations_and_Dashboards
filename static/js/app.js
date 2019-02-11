function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  url = `/metadata/${sample}`;
  d3.json(url).then(function(sample)  {

    // extract key value pairs of the object
    obj_keys = Object.keys(sample);
    obj_values = Object.values(sample);

   
    // Use d3 to select the panel with id of `#sample-metadata`
    var meta = d3.select("#sample-metadata");
    
    
    // Use `.html("") to clear any existing metadata
    meta.html("");
    var tble = meta.append("table");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.


    for (var i = 0; i< obj_keys.length; i++){
      var row = tble.append("tr")
        .attr("id", "rowData")
        .text(obj_keys[i] + ": "+ obj_values[i]);
      
    }
  });

    
   
    
    // BONUS: Build the Gauge Chart
    buildGauge(sample);




}

function buildGauge(sample){
  url = `/wfreq/${sample}`;
  d3.json(url).then(function(sample)  {


    var WFREQ = sample.WFREQ;
    var guageTitle = "Scrubs per week";


  // Trig to calc meter point
  var degrees = 180 - (WFREQ*15);
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'Scrubs per week',
      text: WFREQ,
      hoverinfo: 'text'},
    { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
    rotation: 90,
    text: ['8-9',  '7-8', '6-7', '5-6', '4-5',  '3-4','2-3', '1-2', '0-1', ''],
    textinfo: 'text+name',
    textposition:'inside',
    marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(80, 127, 0, .5)',
                      'rgba(110, 154, 22, .5)','rgba(140, 160, 22, .5)',
                          'rgba(170, 202, 42, .5)',  'rgba(190, 204, 42, .5)', 
                          'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(255, 255, 255, 0)']},
    labels: ['8-9',  '7-8', '6-7', '5-6', '4-5',  '3-4','2-3', '1-2', '0-1', ''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: guageTitle,
    height: 500,
    width: 500,
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };







  // var data = [trace1]; 
  Plotly.newPlot("gauge", data, layout);
  });
}


function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  url = `/samples/${sample}`;
  d3.json(url).then(function(sample)  {


    // @TODO: Build a Bubble Chart using the sample data
    var trace2 = {
      x: sample.otu_ids,
      y: sample.sample_values,
      mode: "markers",
      type: "scatter",
      text: sample.otu_labels,
      marker: {
        color: sample.otu_ids,
        size: sample.sample_values
      }
    };

    var data1 = [trace2];
    Plotly.newPlot("bubble", data1);


    //Sort the sample to get top 10 sample values

    //Create an array of objects for Sample_values.
    var UnsortedSamples = [];
    sample.sample_values.map(function(item, index){
      let origSampleValue = {};
      origSampleValue.sample_values = item;
      origSampleValue.index_Value = index;
      UnsortedSamples.push(origSampleValue);
    });
    
    //sort in descending order of sample_values
    var testSorted = UnsortedSamples.sort(function(obj1, obj2) {
      return obj2.sample_values - obj1.sample_values;
    });

    //Get the top 10 sample values 
    var sample_values = testSorted.map(pair => pair.sample_values).slice(0,9);
    var orig_index = testSorted.map(pair  => pair.index_Value).slice(0,9);
    
    //Get the otu_id, otu_labels corresponding to the top 10 sample values
    var otu_id = [];
    var otu_labels = [];
    for (var i = 0; i<orig_index.length; i++){
      otu_id.push(sample.otu_ids[orig_index[i]]);
      otu_labels.push(sample.otu_labels[orig_index[i]]);

    }


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    //Pie chart
  
    var trace1 = {
      labels: otu_id,
      values: sample_values,
      hoverinfo: otu_labels,
      type: 'pie'
    };
    var data = [trace1]; 
    Plotly.newPlot("pie", data);

    
  });

  


}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
