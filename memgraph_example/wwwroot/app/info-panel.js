define([], () => class {

    constructor(element) {
        this._run = element.find("#run");
        this._stop = element.find("#stop");
        this._msg = element.find("#msg");
        this._stop.setAttribute("disabled", null);
        this.setMessage("Ready...");
    }

    setMessage(message) {
        this._msg.removeClass("error").html(message);
    }

    setError(message) {
        this._msg.addClass("error").html(message);
    }

    enableRun(state=true) {
        this._run.enable(state);
    }

    enableStop(state=true) {
        this._stop.enable(state);
    }

    runCallback(callback) {
        this._run.on("click", () => {
            this.setMessage("Running...");
            this.enableRun(false);
            this.enableStop();

            callback(this);
        })
    }

    triggerRun() {
        this._run.trigger("click");
    }

});
