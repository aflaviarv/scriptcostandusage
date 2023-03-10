const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
AWS.config.update({
    accessKeyId: 'SEU ID',
    secretAccessKey: 'SUA CHAVE',
    sessionToken: 'SEU TOKEN',
    region: 'REGIÃO ESCOLHIDA'
});

const today = new Date();
const endMonth = today.getMonth() + 1;
const endYear = today.getFullYear();
const startMonth = endMonth - 2;
const startYear = endMonth === 1 ? endYear - 1 : endYear;
const startDate = `${startYear}-${startMonth < 10 ? "0" + startMonth : startMonth}-01`;
const endDate = `${endYear}-${endMonth < 10 ? "0" + endMonth : endMonth}-${new Date(endYear, endMonth, 0).getDate()}`;

const params = {
    TimePeriod: {
        Start: startDate,
        End: endDate
    },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost']
};

const fs = require('fs');
const util = require('util');

const logFile = fs.createWriteStream('./log.txt', { flags: 'a' });
const logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
};

console.error = console.log; 

const ce = new AWS.CostExplorer();
ce.getCostAndUsage(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else {
        data.ResultsByTime.forEach(result => {
            const period = result.TimePeriod.Start.substring(0, 7);
            const costValue = result.Total.UnblendedCost.Amount;
            console.log(`Cost for ${period}: ${costValue}`);
        });
    }
});




