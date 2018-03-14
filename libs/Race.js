const config = require('../config');
const account = config.zwiftAccount;
const zwiftEvents = account.getEvent();

function transformRace(race) {
    const id = race.id;
    const name = race.name;
    let r = [];
    const group1 = {
        zwiftRaceId: id,
        zwiftRaceName: name,
        subgroupIds: [race.eventSubgroups[0].id],
        subgroupNames: [race.eventSubgroups[0].name],
        startTime: race.eventSubgroups[0].eventSubgroupStart
    };
    r.push(group1);
    for (let i = 1; i < race.eventSubgroups.length; i++) {
        let same = r.filter(g => g.startTime === race.eventSubgroups[i].eventSubgroupStart)
        if (same.length !== 0) {
            same[0].subgroupIds.push(race.eventSubgroups[i].id);
            same[0].subgroupNames.push(race.eventSubgroups[i].name);
        }
        else {
            const newGroup = {
                zwiftRaceId: id,
                zwiftRaceName: name,
                subgroupIds: [race.eventSubgroups[i].id],
                subgroupNames: [race.eventSubgroups[i].name],
                starttime: race.eventSubgroups[i].eventSubgroupStart
            }
            r.push(newGroup);
        }
    }

    return r;
}

function getSubResults(subResultId) {
    return zwiftEvents.segmentResults(subResultId);
}

function getRaces(options) {
    return zwiftEvents.search(options).then(events => {
      let races = events.filter(e => e.eventType === 'RACE');
      let r = [];
      for (let i = 0; i < races.length; i++) {
          const newRace = transformRace(races[i]);
          r = r.concat(newRace);         }
      return r;
    });
}

function getResults(subgroups) {
    let segResults = [];
    let raceResults = [];

    for (let i = 0; i < subgroups.length; i++) {
        segResults.push(getSubResults(subgroups[i]));
    }

    return Promise.all(segResults).then(subGroupResults => {
        for (let i = 0; i < subGroupResults.length; i++) {
            for (let j = 0; j < subGroupResults[i].length; j++) {
                if (subGroupResults[i][j].powermeter) {
                    raceResults.push(subGroupResults[i][j]);
                }
            }
        }
        
        raceResults.sort((a, b) => {
            if (a.elapsedMs > b.elapsedMs) {
                return 1;
            }
            else if (a.elapsedMs === b.elapsedMs) {
                return 0;
            }
            return -1;
        });
        
        return raceResults;
    });
}

module.exports = {
    getRaces: getRaces,
    getResults: getResults
}