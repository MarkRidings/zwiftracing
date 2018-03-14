const race = require('../libs/Race');

function msToTime(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

const options = {
    eventStartsAfter: new Date(2017, 11, 2, 10, 03, 0).getTime(),
    eventStartsBefore: new Date(2017, 11, 2, 10, 5, 0).getTime()
};

race.getRaces(options).then(r => {
    return r;
}).then(r => {
    console.log(r);
    for (let i = 0; i < r.length; i++) {
        console.log('result for ' + r[i].zwiftRaceName + ' ------------');
        race.getResults(r[i].subgroupIds).then(results => {
            //console.log(results);
            let j = 1;
            for (let k = 0; k < results.length; k++) {
                console.log(`${j}. ${results[k].firstName} ${results[k].lastName} - ${msToTime(results[k].elapsedMs)}`);
                j++;
            }
        });
    }
}).catch(function (err) {
    console.log("ERROR: ", err);
});

