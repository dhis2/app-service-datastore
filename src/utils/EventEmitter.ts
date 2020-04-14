/* Based on https://gist.github.com/mudge/5830382 */

type Listener = Function

/* Polyfill EventEmitter. */
export class EventEmitter {
    events: Record<string, Array<Listener>> = {}

    on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
    
        this.events[event].push(listener);
    }

    off(event: string, listener: Function) {
        var idx;
    
        if (this.events[event]) {
            idx = this.events[event].indexOf(listener);
    
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }

    emit(event: string, ...args: any[]) {
        var i, listeners, length;

        if (this.events[event]) {
            listeners = this.events[event].slice();
            length = listeners.length;

            for (i = 0; i < length; i++) {
                listeners[i](...args);
            }
        }
    }

    once(event: string, listener: Function) {
        const callback = () => {
            this.off(event, callback);
            listener.apply(this, arguments);
        }
        this.on(event, callback);
    };
};