import { Config } from './models';

export { Core } from './core';

// let configString = `
// {
//     "cloudConfig": {
//         "connectionString":{
//             "appInsights":"abc",
//             "blobStorage":"def",
//             "serviceBus":"serviceBus"
//         }
//     }
// }
// `;
// let config = Config.from({
//     cloudConfig:{
//         connectionString:{
//             appInsights: 'abc',
//             blobStorage: 'def'
//         }
//     }
// });

// console.log('Configuration ',config);
// console.log(config.cloudConfig.connectionString);
// console.log(config.provider);
// console.log('Completed');