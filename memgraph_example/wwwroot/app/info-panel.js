define([], () => class {

    constructor(element) {
        this.run = element.find("#run");
        this.stop = element.find("#stop");
        this.msg = element.find("#msg");
        this.stop.setAttribute("disabled", null);
        this.setMessage("Ready...");
    }

    setMessage(message) {
        this.msg.removeClass("error").html(message);
    }

    setError(message) {
        this.msg.addClass("error").html(message);
    }

    enableRun(state=true) {
        this.run.enable(state);
    }

    enableStop(state=true) {
        this.stop.enable(state);
    }

    runCallback(callback) {
        this.run.on("click", () => {
            this.setMessage("Running...");
            this.enableRun(false);
            this.enableStop();

            callback(this);
        })
    }

});
