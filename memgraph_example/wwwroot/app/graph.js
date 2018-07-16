define(["http://d3js.org/d3.v3.min.js"], () => {
    
    const 
        boxHeight = 50,
        boxWidth = 85,
        fontSize = 8,
        lineSpace = 2;

    return class {

        constructor(element) {
            this.element = element
        }

        _addNode(data) {

            var node = this.canvas
                .append("g")
                .attr("x", 10).attr("y", 0)
                .attr('class', 'node');

            var rect = node.append("rect")
                .attr('class', 'memgraphNode')
                .attr("width", boxWidth)
                .attr("height", boxHeight);

            node.append("text")
                .attr("class", "nodeTitle")
                .attr("x", 0).attr("y", 0)
                //.attr("y", -boxHeight / 2 + fontSize + 2 * lineSpace)
                .attr("text-anchor", "middle")
                .text("some text");

            /*
            const 
                node = this.canvas.append("g")
                    .attr("x", 10).attr("y", 0)
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    })
                    .call(d3.behavior.drag().origin(Object).on("drag", () => {
                        const 
                            translate = (x, y) => Object({x: x, y: y}),
                            r = eval(rect.attr("transform"));
                        rect.attr("transform", "translate(" + (r.x + d3.event.dx) + "," + (r.y + d3.event.dy) + ")");
                    }));

                rect = node.append("rect")
                    .attr('class', 'memgraphNode')
                    .attr("width", boxWidth).attr("height", boxHeight)
                    .on({
                        "mouseover": () => rect.style("cursor", "move"),
                        "mouseout": () => rect.style("cursor", "default"),
                    });
            
            node.append("text")
                .attr("class", "nodeTitle")
                .attr("y", -boxHeight / 2 + fontSize + 2 * lineSpace)
                .attr("text-anchor", "middle")
                .text("some text");
            //.text(function(d){ return "some text";});
            */
        }


        draw(data) {
            const
                r = this.element.getClientRects(),
                width = r[0].width,
                height = r[0].height;

            const 
                canvas = d3.select(this.element).append("svg")
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .append("g");

            let i = 0, j = 0;
            const 
                node = canvas.selectAll("g")
                .data(data)
                .enter()
                .append("g")
                .attr("transform", d => {
                    let x = 10 + ((boxWidth - 10) * i++);
                    let y = (x % 2) ? boxHeight + 50 : 20;
                    return "translate(" + x + ", " + y + ")";
                });

            const 
                rect = node.append("rect")
                    .attr('class', 'memgraphNode')
                    .attr("width", boxWidth)
                    .attr("height", boxHeight);
        }
    }

});