datasetTotal = [
    { label: 'Category 1', value: 19 },
    { label: 'Category 2', value: 5 },
    { label: 'Category 3', value: 13 },
    { label: 'Category 4', value: 17 },
    { label: 'Category 5', value: 19 },
    { label: 'Category 6', value: 27 }
];

datasetOption1 = [
    { label: "Category 11", value: 22 },
    { label: "Category 12", value: 33 },
    { label: "Category 13", value: 4 },
    { label: "Category 14", value: 15 },
    { label: "Category 15", value: 36 },
    { label: "Category 16", value: 0 }
];

datasetOption2 = [
    { label: "Category 21", value: 10 },
    { label: "Category 22", value: 20 },
    { label: "Category 23", value: 30 },
    { label: "Category 24", value: 5 },
    { label: "Category 25", value: 12 },
    { label: "Category 18", value: 23 }
];


d3.selectAll("input").on("change", selectDataset);

function selectDataset() {
    var value = this.value;
    if (value == "total") {
        drawBubbles(datasetTotal);
    } else if (value == "option1") {
        drawBubbles(datasetOption1);
    } else if (value == "option2") {
        drawBubbles(datasetOption2);
    }
}

var diameter = 600,
    bubblePadding = -7, //Give negative value in order to overlop the bubbles
    duration = 750,
    delay = 0;

var svg = d3.select('#bubbleChart').append('svg')
    .attr('width', diameter)
    .attr('height', diameter);


var bubbleNode = d3.layout.pack()
    .size([diameter, diameter])
    .padding(bubblePadding)
    .value(function(d) {
        return d.size = (d.size == '0.0' || d.size == '0') ? '0.1000' : d.size; //0.1000 is considered as a special size for size with value '0' to give some radius for the bubble charts to be drawn
    })

function processData(data) {

    var newDataSet = [];

    for (var i = 0; i < data.length; i++) {
        var name = data[i].label,
            size = data[i].value

        newDataSet.push({ name: name, className: 'bubble-' + (i + 1), size: size });
    }

    return { children: newDataSet.reverse() };
    console.log(newDataSet);
}

function drawBubbles(data) {

    var nodes = bubbleNode.nodes(processData(data))
        .filter(function(d) {
            return !d.children;
        }); // filter out the outer bubble

    var bubble = svg.selectAll('.bubble')
        .data(nodes, function(d) {
            return d.name;
        });

    // exit
    var bubbleExit = bubble.exit()
        .transition()
        .duration(duration + delay)
        .style('opacity', 0)
        .remove();

    var bubbleEnter = bubble.enter()
        .append('g')
        .attr('class', 'bubble')
        // Position the g element like the circle element used to be.
        .attr('transform', function(d) {
            return 'translate(' + d.x + ',' + d.y + ')';
        })



    var bubbleCircle = bubbleEnter.append('circle')
        .attr('r', function(d) {
            return d.r;
        })
        .attr('class', function(d) {
            return d.className;
        })
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .style('opacity', 1);


    var bubbleLabel = bubbleEnter.append('text')
        .attr('class', 'bubble-label')
        .attr('dy', '.3em')
        .attr('text-anchor', 'middle')
        .attr('font-size', function(d) {
            //return (d.r > 85) ? (d.r / 5)+'px' : (d.r / 3)+'px';
            var len = d.name.substring(0, d.r / 5).length;
            var size = d.r / 5;
            size *= 10 / len;
            size += 1;
            size = (size < 18) ? size : 18;
            return Math.round(size) + 'px';
        })
        .text(function(d) {
            //return d.title; 
            var text = d.name.substring(0, d.r / 5);
            return text;
        })
        .style('opacity', 0.2)
        .transition()
        .duration(duration)
        .style('opacity', 1);;

    // update - This only applies to updating nodes
    var bubbleCircleUpdate = bubble.select('circle').transition()
        .duration(duration)
        .delay(function(d, i) {
            delay = i * 7;
            return delay;
        })
        .attr('r', function(d) {
            return d.r;
        })
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .style('opacity', 1);


    var bubbleLableUpdate = bubble.select('text').transition()
        .duration(duration)
        .delay(function(d, i) {
            delay = i * 7;
            return delay;
        })
        .attr('dy', '.3em')
        .attr('text-anchor', 'middle')
        .attr('font-size', function(d) {
            //return (d.r > 85) ? (d.r / 5)+'px' : (d.r / 3)+'px';
            var len = d.name.substring(0, d.r / 5).length;
            var size = d.r / 3;
            size *= 10 / len;
            size += 1;
            size = (size < 18) ? size : 18;
            return Math.round(size) + 'px';
        })
        .text(function(d) {
            //return d.title; 
            var text = d.name.substring(0, d.r / 5);
            return text;
        })
        .style('opacity', 0)
        .transition()
        .duration(duration)
        .style('opacity', 1);



}

drawBubbles(datasetTotal);