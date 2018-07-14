define([
    "editor",
    "info-panel",
    "memgraph-service",
], (
    Editor,
    InfoPanel,
    service
) => {
   
    const 
        app = document.body.find("#app"),
        editor = new Editor(app.find("#editor")),
        panel = new InfoPanel(app.find("#panel")),
        chart = app.find("#chart");

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
                } else {
                    panel.setError(`ERROR: ${response.details}`)
                }
            })
        );

        document.body.find("#loading-screen").remove();
        app.show();
    };
});
