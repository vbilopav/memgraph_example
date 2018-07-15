define([
    "editor",
    "info-panel",
    "memgraph-service",
    "graph"
], (
    Editor,
    InfoPanel,
    service,
    Graph
) => {
   
    const 
        app = document.body.find("#app"),
        editor = new Editor(app.find("#editor")),
        panel = new InfoPanel(app.find("#panel"));
    
    let 
        graph;

    return () => {
        editor.focus();

        panel.runCallback(() =>
            service.execute(editor.getQuery()).then(response => {
                console.log(response);
                panel.enableRun();
                panel.enableStop(false);
                
                if (response.ok) {
                    panel.setMessage(
                        `Successfully run. Total query runtime: ${response.elapsed}. ${response.data.length} rows affected.`);
                    graph.draw(response.data);
                } else {
                    panel.setError(`ERROR: ${response.details}`)
                }
            })
        );

        document.body.find("#loading-screen").remove();
        app.show();

        // init component after it becomes visible so we can calc dimensions
        graph = new Graph(app.find("#chart"));
        // trigger run immidiatley
        panel.triggerRun();
    };
});
