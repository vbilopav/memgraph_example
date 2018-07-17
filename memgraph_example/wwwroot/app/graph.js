define(["http://d3js.org/d3.v3.min.js"], () => class {

    constructor(element) {
        this.element = element
    }

    _parseData(data) {
        // this should be on backend
        const
            nodes = [],
            relationships = [],
            ids = {};
        for (let item of data) {
            for (let key of item.keys) {
                let value = item.values[key];
                if (value.startNodeId && value.endNodeId) {
                    relationships.push({
                        startNodeId: value.startNodeId,
                        endNodeId: value.endNodeId,
                        label: value.type
                    })
                } else {
                    if (ids[value.id]) {
                        continue;
                    }
                    nodes.push(Object.assign(value.properties, { nodeId: value.id, label: value.labels.join(", ") }));
                    ids[value.id] = true;
                }
            }
        }
        return [nodes, relationships];
    }

    draw(data) {

        const
            [nodes, relationships] = this._parseData(data),
            boxHeight = 50, boxWidth = 90;

        d3.select("svg").remove();

        const
            canvas = d3.select(this.element).append("svg")
                .attr("width", "100%")
                .attr("height", "100%")
                .append("g");

        let i = 0;
        const
            node = canvas.selectAll("g")
                .data(nodes)
                .enter()
                .append("g")
                .attr("id", d => "node-" + d.nodeId)
                .attr("transform", d => {
                    let x = 10 + ((boxWidth - 30) * i++);
                    let y = 50 + ((boxHeight + 30) * (i % 3));
                    return "translate(" + x + ", " + y + ")";
                })
                .on({
                    "mouseover": () => node.style("cursor", "move"),
                    "mouseout": () => node.style("cursor", "default"),
                })
                .call(d3.behavior.drag().origin(Object).on("drag", function () {
                    const
                        translate = (x, y) => Object({ x: x, y: y }),
                        n = d3.select(this),
                        r = eval(n.attr("transform"));
                    n.attr("transform", "translate(" + (r.x + d3.event.dx) + "," + (r.y + d3.event.dy) + ")");
                }));

        node.append("rect")
            .attr('class', 'memgraphNode')
            .attr("width", boxWidth)
            .attr("height", boxHeight);

        node.append("text")
            .attr("class", "memgraphTitle")
            .attr("x", 44).attr("y", 17).attr("text-anchor", "middle")
            .text(d => d.name);

        node.append("text")
            .attr("class", "memgraphLabel")
            .attr("x", 44).attr("y", 30)
            .attr("text-anchor", "middle")
            .text(d => d.label);
    }

});