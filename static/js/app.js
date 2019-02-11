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
      console.log("inside for loop Key" + obj_keys[i]);
      console.log(obj_values[i]);
      var row = tble.append("tr")
        .attr("id", "rowData")
        .text(obj_keys[i] + ": "+ obj_values[i]);
        
        ;
    }
  });

    
   
    
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  url = `/samples/${sample}`;
  console.log(url);

  d3.json(url).then(function(sample)  {


    // @TODO: Build a Bubble Chart using the sample data

    // Bubble chart
    var trace2 = {
      x: sample.otu_id,
      y: sample.sample_values,
      mode: "markers",
      type: "scatter",
      text: sample.otu_labels,
      marker: {
        color: sample.otu_id,
        size: sample.sample_values
      }
    };

    var data1 = [trace2];

    Plotly.newPlot("bubble", data1);

    //console.log(sample);

    // var sorted_samples = sample.sample_values.sort((a,b) => b -a);
    // sorted_samples = sorted_samples.slice(0,9);
    // console.log(sorted_samples);

    var otu_id = sample.otu_ids;
    var otu_labels = sample.otu_labels;
    var sample_values = sample.sample_values;

    sorted_otu_id = otu_id.sort((a, b) => b - a);
    sorted_sample_values = sample_values.sort((a, b) => b - a);
    sorted_otu_labels = otu_labels.sort((a,b)=>b-1);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    
    //Pie chart
    var trace1 = {
      labels: sorted_otu_id.slice(0,9),
      values: sorted_sample_values.slice(0,9),
      hoverinfo: sorted_otu_labels.slice(0,9),
      type: 'pie'
     };
    // var trace1 = {
    //   labels: sorted_samples.otu_id,
    //   values: sorted_samples.sample_values,
    //   //text: sorted_otu_labels,
    //   type: 'pie'
    // };
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
