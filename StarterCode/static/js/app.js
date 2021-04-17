// create variables
var idSelect = d3.select('#selDataset');
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

//----------------------------------------------
// Populate dropdown
//----------------------------------------------
//create function to populate dropdown menu
function init() {

    // red in data
    d3.json("data/samples.json").then((data => {

        // run through names to populate the options
        data.names.forEach((name => {
            var option = idSelect.append('option');
            option.text(name);
        }));

        // get first ID to use as default
        var thisID = idSelect.property('value')

        plotCharts(thisID);

        }));
}


//----------------------------------------------
// Read JSON based on ID selected and build charts
//----------------------------------------------

function plotCharts(id) {

    //read in JSON
    d3.json("data/samples.json").then((data => {

        //filter to sample data for ID
        var idSample = data.samples.filter(sample => sample.id == id)[0];

        //make arrays to hold data 
        var otuIDs = [];
        var otuLabels = [];
        var idValues = [];

        Object.entries(idSample).forEach(([key, value]) => {

            //I decided to use a switch statement for this because it's cleaner
            //than doing another filter or loop
            switch(key) {
                case "otu_ids":
                    otuIDs.push(value);
                    break;
                case "otu_labels":
                     otuLabels.push(value);
                    break;
                case "sample_values" :
                    idValues.push(value);
                    break;
                default:
                    break;
            }
        });

        //Now we need to get just the top 10 values, instead of all of them
        //slice function will work here 
        var tenotuIDs = otuIDs[0].slice(0,10).reverse();
        var tenotuLabels = otuLabels[0].slice(0,10).reverse();
        var tenidValues = idValues[0].slice(0,10).reverse();


        //Plotting chart here 
        var traceBar = {
            x: tenidValues,
            y: tenotuIDs,
            text: tenotuLabels,
            type: 'bar',
            orientation: 'h',
        };

        //array for plotting
        var dataBar = [traceBar];

        //layout
        var layoutBar = {
            height: 500,
            width: 600,
            title: {
                text: `Top 10 OTU's for Sample ID`
            }
        }

        //plot bar chart
        Plotly.newPlot("bar", dataBar, layoutBar);

        //plot bubble chart
        var traceBubble = {
            x: otuIDs[0],
            y: idValues[0],
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: idValues[0],
                color: otuIDs[0],
            }
        };

        var dataBubble = [traceBubble];

        Plotly.newPlot('bubble', dataBubble)
    }))

}


// populate data initially
init();

//change function
function optionChanged(id) {
    plotCharts(id)
}

