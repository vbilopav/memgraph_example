define(["http://d3js.org/d3.v3.min.js"], () => {
    
    const 
        boxHeight = 50,
        boxWidth = 85

    return class {

        constructor(element) {
            const
                rect = element.getClientRects(),
                width = rect[0].width,
                height = rect[0].height;

            this.svg = d3.select(element).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .attr("viewBox", "0 0 " + Math.min(width, height) + " " + Math.min(width, height))
                .attr("preserveAspectRatio", "xMinYMin")
                .attr("transform", "translate(80,0)");

        }

        _addNode(data) {
            let rectangle = 
                this.svg.append("rect")
                    .attr('class', 'mm_nodebox')
                    .attr("transform", function (d) {
                        return "translate(" + this.y.baseVal.value + "," + this.x.baseVal.value + ")";
                    })
                    .attr("x", 10).attr("y", 0)
                    .attr("width", boxWidth).attr("height", boxHeight);
            
            rectangle.call(d3.behavior.drag().origin(Object).on("drag", function () {
                const 
                    translate = (x, y) => Object({x: x, y: y}),
                    coord = eval(d3.select(this).attr("transform"));
                d3.select(this).attr("transform", "translate(" + (coord.x + d3.event.dx) + "," + (coord.y + d3.event.dy) + ")");
            }));

        }
        draw(data) {
            this._addNode(data[0].values.m);
        }
    }

});