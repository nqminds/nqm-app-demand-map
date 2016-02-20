Components = function(){};

Components.prototype.gauge = function(container, configuration) {

    var self = this;


    var that = {};
    var config = {
        size						: 200,
        clipWidth					: 200,
        clipHeight					: 110,
        ringInset					: 20,
        ringWidth					: 20,

        pointerWidth				: 10,
        pointerTailLength			: 4,
        pointerHeadLengthPercent	: 0.9,

        minValue					: 0,
        maxValue					: 10,

        minAngle					: -90,
        maxAngle					: 90,

        transitionMs				: 750,

        majorTicks					: 4,
        labelFormat					: d3.format(''),
        labelInset					: 20,

        arcColorFn					: d3.interpolateHsl(d3.rgb(configuration.color1), d3.rgb(configuration.color2))
    };
    var range = undefined;
    var r = undefined;
    var pointerHeadLength = undefined;
    var value = 0;

    var svg = undefined;
    var arc = undefined;
    var scale = undefined;
    var ticks = undefined;
    var tickData = undefined;
    var pointer = undefined;

    var donut = d3.layout.pie();

    function addLabels(configuration, container){

        container.append("text")
            .attr("x", configuration.lowLabelx)
            .attr("y", configuration.yTranslate + 40)
            .attr("text-anchor", "left")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[0])
            .call(self.wrap, 30, "England Low");

        container.append("text")
            .attr("x", configuration.highLabelx)
            .attr("y", configuration.yTranslate + 40)
            .attr("text-anchor", "right")
            .style("font-size", "1em")
            .style("fill", controller.config.colorScheme.quartile_dark_color_array[3])
            .call(self.wrap, 30, "England High");
    }

    function deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    function newAngle(d) {
        var ratio = scale(d);
        var newAngle = config.minAngle + (ratio * range);
        return newAngle;
    }

    function configure(configuration) {
        var prop = undefined;
        for ( prop in configuration ) {
            config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scale.linear()
            .range([0,1])
            .domain([config.minValue, config.maxValue]);

        //console.log(scale.ticks(config.majorTicks))

        tickString = ["Eng. Low", "", "", "", "Eng. High"];
        ticks = scale.ticks(config.majorTicks)
        tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

        arc = d3.svg.arc()
            .innerRadius(r - config.ringWidth - config.ringInset)
            .outerRadius(r - config.ringInset)
            .startAngle(function(d, i) {
                var ratio = d * i;
                return deg2rad(config.minAngle + (ratio * range));
            })
            .endAngle(function(d, i) {
                var ratio = d * (i+1);
                return deg2rad(config.minAngle + (ratio * range));
            });
    }
    that.configure = configure;

    function centerTranslation() {
        return 'translate('+r +','+ r +')';
    }

    function isRendered() {
        return (svg !== undefined);
    }
    that.isRendered = isRendered;

    function render(newValue) {
        svg = container
            .append("g")
            .attr("class", "gaugeSVG")
            .attr("transform", "translate(" + configuration.xTranslate + "," + configuration.yTranslate + ")")
            .append('svg')
            .attr('class', 'gauge') //should go in config!!
            .attr("id", "gauge") //should go in config!!
            .attr('width', config.clipWidth)
            .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function(d, i) {
                return controller.config.colorScheme.quartile_color_array[i]
                //return config.arcColorFn(d * i);
            })
            .attr('d', arc);


        var lineData = [ [config.pointerWidth / 2, 0],
            [0, -pointerHeadLength],
            [-(config.pointerWidth / 2), 0],
            [0, config.pointerTailLength],
            [config.pointerWidth / 2, 0] ];
        var pointerLine = d3.svg.line().interpolate('monotone');
        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx)
            .style("fill", controller.config.colorScheme.highlight_color)
            .style("stroke", controller.config.colorScheme.dark_text_color);

        pointer = pg.append('path')
            .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
            .attr('transform', 'rotate(' +config.minAngle +')');

        update(newValue === undefined ? 0 : newValue);
    }
    that.render = render;

    function update(newValue, newConfiguration) {
        if ( newConfiguration  !== undefined) {
            configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
            .duration(config.transitionMs)
            .ease('elastic')
            .attr('transform', 'rotate(' +newAngle +')');
    }
    that.update = update;

    configure(configuration);
    addLabels(configuration, container)



    return that;
};
