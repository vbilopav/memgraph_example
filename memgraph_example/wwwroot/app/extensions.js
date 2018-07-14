define([], () => {
        
    const 
        test = (object, extensions) => {
            extensions.forEach(e => {
                if (object.prototype[e] !== undefined) {
                    throw new Error(`Error: Name collision - object ${object} already have defined "${e}" !`);
                }
            });
        };

    test(HTMLElement, ["find", "show", "hide", "css", "_styles", "html", "enable", "on", "addClass", "removeClass"]);

    HTMLElement.prototype.find = function(search) {
        let e = this.querySelector(search);
        if (!e) {
            e = document.createElement("dummy");
            e.length = 0;
            return e;
        }
        e.length = 1;
        return e;
    }

    HTMLElement.prototype.show = function(state) {
        if (state !== undefined) {
            if (!state) {
                return this.hide();
            }
        }
        this.css("display", "");
        return this;
    }

    HTMLElement.prototype.hide = function() {
        this.css("display", "none");
        return this;
    }

    const 
        _toCamelCase = s => s.replace(/-([a-z])/g, g => g[1].toUpperCase());

    HTMLElement.prototype.css = function(property, value) {
        if (!this._styles) {
            this._styles = {};
            const styles = window.getComputedStyle(this);
            for(let style in styles) {
                if (styles.hasOwnProperty(style)) {
                    if (!isNaN(style)) {
                        continue;
                    }
                    this._styles[style] = styles[style];
                }
            }
        }
        if (value !== undefined) {
            this._styles[property] = value;
            this.style[property] = value;
            return this;
        }
        const result = this._styles[property];
        if (result === undefined) {
            return this._styles[_toCamelCase(property)];
        }
        return result;
    }

    HTMLElement.prototype.html = function(content) {
        if (content === undefined) {
            return this.innerHTML;
        }
        this.innerHTML = content;
        return this;
    }
    
    HTMLElement.prototype.enable = function(state=true) {
        if (state) {
            this.removeAttribute("disabled");
        } else {
            this.setAttribute("disabled", null);
        }
        return this;
    }

    HTMLElement.prototype.on = function(eventName, eventHandler) {
        for(let e of eventName.split(" ")) {
            this.addEventListener(e, eventHandler);
        }
        return this;
    }

    HTMLElement.prototype.addClass = function(className) {
        if (this.classList) {
            this.classList.add(className);
        } else {
            this.className += ` ${className}`;
        }
        return this;
    }

    HTMLElement.prototype.removeClass = function(className) {
        if (this.classList) {
            this.classList.remove(className);
        } else {
            this.className = this.className.replace(
                new RegExp(`(^|\\b)${className.split(" ").join("|")}(\\b|$)`, "gi"), " "
            );
        }
        return this;
    }

});