import { Logger, Queue } from './core';
import { Config } from './models/config';

export { Logger }
export { Queue }

export class TDEICore {


    initialize(config: Config) {
        switch (config.provider) {
            case 'Azure':
                
                break;        
            default:
                break;
        }
    }
}