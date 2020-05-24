d3.json("data/samples.json").then((data) => {

   // Add IDs to dropdown menu
  var idList = data.names;
  for (var i = 0; i < idList.length; i++) {
    selectBox = d3.select("#selDataset");
    selectBox.append("option").text(idList[i]);
  }

  // Set up default plot
  updatePlots(0)

  // Function for updating plots   
  function updatePlots(index) {

   // Samples data
   var samples = data.samples[index];
   var sample_values = samples.sample_values;
   var otu_ids = samples.otu_ids;
   var otu_labels = samples.otu_labels;

   // Slice and reserve data for horizontal bar chart
   var topTenOtuIDs = otu_ids.slice(0, 10).reverse();
   var topTenValues = sample_values.slice(0, 10).reverse();
   var topTenToolTips = otu_labels.slice(0, 10).reverse();
   var topTenLabels = topTenOtuIDs.map((otu => "OTU " + otu)).reverse();


   // Set up trace
   // -Horizontal bar chart:
   var trace_bar={
      y:topTenLabels,
      x:topTenValues,
      text: topTenToolTips,
      type:"bar",
      orientation: 'h',
      marker: {
         color: 'rgb(153, 76, 0)'
       }
   }
   // -Bubble Chart:
   var trace_bubble = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
        opacity: [1, 0.8, 0.6, 0.4],
        colorscale: [[0, 'rgb(153, 76, 0)'], [1, 'rgb(0, 100, 0)']]
      }
    }; 

   // Set up data
   // -Horizontal bar chart:
   var data_bar=[trace_bar];
   // -Bubble Chart:
   var data_bubble = [trace_bubble];

   // Set up layout
   // -Horizontal bar chart:
   var layout_bar = {
        title: "Top 10 OTUs",
        xaxis: {title: "Sample Values"}
      };
   // -Bubble Chart:
   var layout_bubble = {
      title: 'OTU Frequency',
      showlegend: false,
      height: 600,
      width: 1200
      };
   

   // Plot
   // -Horizontal bar chart:
   Plotly.newPlot("bar", data_bar, layout_bar);
   // -Bubble Chart
   Plotly.newPlot('bubble', data_bubble, layout_bubble);


   // -------------------------------------------------
   // Gauge
   var washFrequency = data.metadata[index].wfreq;
   var data_gauge = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: washFrequency,
        title: { text: "Belly Button Washes Per Week"},
        gauge: {
          axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "#669999" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "transparent",
          steps: [
            { range: [0, 1], color: "#DFBF9F" },
            { range: [1, 2], color: "#B4814E" },
            { range: [2, 3], color: "#B4B44E" },
            { range: [3, 4], color: "#81B44E" },
            { range: [4, 5], color: "#4EB44E" },
            { range: [5, 6], color: "#4EB481" },
            { range: [6, 7], color: "#4EB4B4" },
            { range: [7, 8], color: "#5998E8" },
            { range: [8, 9], color: "#6259E8" }
          ],
        }
      }
    ];
    
    var layout_gauge = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
    };
    
    Plotly.newPlot('gauge', data_gauge, layout_gauge);

    // ---------------------------------------------------


   // Demographics Info
   var metaKeys = Object.keys(data.metadata[index]);
   var metaValues = Object.values(data.metadata[index])
   var sample_metadata = d3.select("#sample-metadata");

   // clear demographic data
  sample_metadata.html(""); 

   for (var i = 0; i < metaKeys.length; i++) {
      sample_metadata.append("p").text(`${metaKeys[i]}: ${metaValues[i]}`);
    };

  // On button click, call refreshData()
  d3.selectAll("#selDataset").on("change", refreshData);

  function refreshData() {
    var dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    var personsID = dropdownMenu.property("value");
    // Initialize an empty array for the person's data

    for (var i = 0; i < data.names.length; i++) {
      if (personsID === data.names[i]) {
        updatePlots(i);
        return
      }
    }
  }

  }
   });