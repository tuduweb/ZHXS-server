import schedule from 'node-schedule';
import moment from 'moment';

function getVirusData() {
    
    const created_at = moment()
    .startOf('hour')
    .valueOf();
    


}


export function run() {

    console.log("schedule..");

    schedule.scheduleJob('0 * * * * *', () => {
        getVirusData();
        console.log("schedule.. getVirusData");
    });

}