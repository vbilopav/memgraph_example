define(["vs/editor/editor.main"], () => class {

    constructor(element) {
        this.editor = monaco.editor.create(element, {
            value: "MATCH (n)-[r]->(m) RETURN n, r, m", // default value
            language: "pgsql", // closest syntax match
            theme: "vs-dark", 
            renderWhitespace: "all",
            automaticLayout: true
        });
    }

    getQuery() {
        return this.editor.model.getValue();
    }

    focus() {
        if (!this.editor.isFocused()) {
            this.editor.focus();
        }
    }

});
