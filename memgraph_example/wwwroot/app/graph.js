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
                    nodes.push(Object.assign(value.properties, {
                        nodeId: value.id, 
                        label: value.labels.join(", ")
                    }));
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
            svg = d3.select(this.element).append("svg")
                .attr("width", "100%")
                .attr("height", "100%"),
            canvas = svg.append("g");
/*
        svg.append("svg:defs").selectAll("marker")
              .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
              .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
*/
        let i = 0;
        const node = canvas.selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("id", d => "node-" + d.nodeId)
            .attr("transform", d => {
                let x = 100 + ((boxWidth - 10) * i++);
                let y = 100 + ((boxHeight + 100) * (i % 3));
                return "translate(" + x + ", " + y + ")";
            })
            .on({
                "mouseover": () => node.style("cursor", "move"),
                "mouseout": () => node.style("cursor", "default"),
            })
            .call(d3.behavior.drag().origin(Object).on("drag", function () {
                const 
                    n = d3.select(this), 
                    [tx, ty] = d3.transform(n.attr("transform")).translate,
                    x = tx + d3.event.dx,
                    y = ty + d3.event.dy;
                n.attr("transform", "translate(" + x + "," + y + ")");

                const data = n.data()[0];
                for(let l of d3.selectAll(".path-" + data.nodeId)[0]) {
                    let line = d3.select(l), lineData = line.data()[0];
                    if (lineData.startNodeId === data.nodeId) {
                        line.attr("x1", x);
                        line.attr("y1", y);
                    } else if (lineData.endNodeId === data.nodeId) {
                        line.attr("x2", x);
                        line.attr("y2", y);
                    }
                }
            }));

        node
            //.append("rect")
            .append("circle").attr('r', 40) 
            .attr('class', 'memgraphNode')
            .attr("width", boxWidth)
            .attr("height", boxHeight);

        node.append("text")
            .attr("class", "memgraphTitle")
            //.attr("x", 44).attr("y", 17)
            .attr("x", 0).attr("y", -10)
            .attr("text-anchor", "middle")
            .text(d => d.name);

        node.append("text")
            .attr("class", "memgraphLabel")
            //.attr("x", 44).attr("y", 30)
            .attr("x", 0).attr("y", 10)
            .attr("text-anchor", "middle")
            .text(d => d.label);

        canvas
            .selectAll("line")
            .data(relationships)
            .enter()
            .insert("line", ".node")
            .attr("interpolate", "cardinal")
            .style("stroke", "black")
            .attr("id", d => "path-" + d.startNodeId + "-" + d.endNodeId)
            .attr("class", d => "path-" + d.startNodeId + " " + "path-" + d.endNodeId)
            .attr("data", d => {
                let [x1, y1] = d3.transform(d3.select("#node-" + d.startNodeId).attr("transform")).translate;
                let [x2, y2] = d3.transform(d3.select("#node-" + d.endNodeId).attr("transform")).translate;
                d.x1 = x1;// + (boxWidth / 2);
                d.y1 = y1;// + (boxHeight / 2);
                d.x2 = x2;// + (boxWidth / 2);
                d.y2 = y2;// + (boxHeight / 2);
            })
            .attr("x1", d => d.x1)
            .attr("y1", d => d.y1)
            .attr("x2", d => d.x2)
            .attr("y2", d => d.y2);

        canvas
            .selectAll("#textPath")
            .data(relationships)
            .enter()
            .insert("text", ".node")
            .attr("id", "textPath")
            .append("textPath")
            .attr("xlink:href",  d => "#path-" + d.startNodeId + "-" + d.endNodeId)
            .text("letters");
    }

});