let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
var dataSet;

function init() {
    d3.json(url).then(function(data) {
        dataSet = data;
        hbar(940, data);
        bchart(940, data);
        metadataDisplay(940, data);
        // Populate the dropdown menu
        let dropdownMenu = d3.select("#selDataset");
        data.names.forEach(function(name) {
            dropdownMenu.append("option").text(name).property("value", name);
        });
    });
}

function hbar(id, data) {
    // Need to specify which ID is being using and pull data only for that ID.
    var bardata = data.samples.filter(sample => sample.id == id);
    console.log(bardata);

    var sample_values = bardata.map(x => x.sample_values);
    var otu_ids = bardata.map(x => x.otu_ids);
    var otu_labels = bardata.map(x => x.otu_labels);

    console.log(sample_values);

    var y = [];
    for (let i = 0; i < otu_ids[0].length; i++) {
        y.push(`OTU ${otu_ids[0][i]}`);
        console.log(y);
    }
    console.log(y.slice(0, 10));

    var trace = {
        x: sample_values[0].slice(0, 10),
        y: y.slice(0, 10),
        text: otu_labels[0].slice(0, 10),
        type: "bar",
        orientation: "h",
    };

    var hdata = [trace];
    var layout = {
        yaxis: {
            autorange: "reversed"
        }
    };
    Plotly.newPlot("bar", hdata, layout);
}

function bchart(id, data) {
    //var otu_labels = data.samples.map(x => x.otu_labels); 
    var bubbledata = data.samples.filter(sample => sample.id == id);

    var otu_ids = bubbledata.map(x => x.otu_ids);
    var sample_values = bubbledata.map(x => x.sample_values);
    var otu_labels = bubbledata.map(x => x.otu_labels);
    
    var marker_size = bubbledata.map(x => x.sample_values);
    var marker_colors = bubbledata.map(x => x.otu_ids);

    console.log(marker_size[0])
    var trace2 = {
        x: otu_ids[0],
        y: sample_values[0],
        text: otu_labels[0],
        mode: 'markers',
        marker : {
            size: marker_size[0],
            color: marker_colors[0]
        }
    };
    var bdata = [trace2]

    var layout = {
        xaxis:  { 
            title: "OTU ID",
        },
        title: 'Bubble Chart with Markers'
    }
    Plotly.newPlot("bubble", bdata);
}


function metadataDisplay(id, data){
    var metadata = d3.select("#sample-metadata")//.selectAll('h3')

    var mdata = data.metadata.filter(index => index.id == id);

    var demoinfo = metadata.selectAll('h3').data(d3.entries(mdata));
     
    demoinfo.enter()
        .append('h3')
        //.merge(sampleMetadata)
        .text(x => `${x.key}:${x.value}`)
        
    demoinfo.exit().remove()

    var ids = mdata[0].id;
    var ethnicity = mdata[0].ethnicity;
    var gender = mdata[0].gender;
    var age = mdata[0].age;
    var location = mdata[0].location;
    var bbtype = mdata[0].bbtype;
    var wfreq = mdata[0].wfreq;
    console.log(ids, bbtype);
}

d3.select("#selDataset").on("change", optionChanged);

function optionChanged() {
    let dropdownMenu = d3.select("#selDataset");
    let id = dropdownMenu.property("value");
    //console.log(id);
    hbar(id, dataSet);
    bchart(id, dataSet);
}

init();