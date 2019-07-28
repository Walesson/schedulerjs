/**
 * Scheduler
 * @date 28/07/2019
 * @author Walesson Silva
 */

class Scheduler extends Date {
    constructor(params){
        super();
        this.target     = params.target;
        this.stripMin   = params.stripMin;
        this.stripMax   = params.stripMax;
    }
    
    setSchedule(params) {
        let currentday = this.getDay();
        let disableDay = JSON.parse(params.enableDay);
        disableDay = (disableDay == 1) ? true : false;
        
        if(currentday == params.day && disableDay) {
            this.checkTimes(params);
        }
    }
    
    checkTimes(params) {
        let currentTime = String(this.getHours()).padStart(2, '0')+':'+String(this.getMinutes()).padStart(2, '0');
        let sender = {
            target   : this.target,
            stripMin : this.stripMin,
            stripMax : this.stripMax,
            on       : null
        };
        
        params.timeSwitchedOn.forEach((item, index) => {
            if(item == currentTime){
                sender.on = 1;
                this.sendPayload(sender);
            }
        });
        
        params.timeSwitchedOff.forEach((item, index) => {
            if(item == currentTime){
                sender.on = 0;
                this.sendPayload(sender);
            }
        });
    }
    
    sendPayload(data) {
        node.send({
            payload: data
        })
    }
    
};

msg.payload = msg.payload.replace(/\\/g , "");

if(!(msg.payload).length) {
    msg.payload = null;
    return false;
}

msg.payload = JSON.parse(msg.payload);

if(!msg.payload.hasOwnProperty('params')) {
    msg.payload = null;
    return false;
}

let param = {
    target       : msg.payload.target,
    stripMin     : msg.payload.stripMin,
    stripMax     : msg.payload.stripMax
};

global.set("target", msg.payload.target);
global.set("stripMin", msg.payload.stripMin || 1);
global.set("stripMax", msg.payload.stripMax || 1);

let sc = new Scheduler(param);

for(let item of msg.payload.params) {
    sc.setSchedule(item);
};


