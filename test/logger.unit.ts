/**
 * Unit tests for `logger.ts`
 * Depends on Core.getQueue implementation
 * 
 */

import { Core } from "../src/core";
import { Logger } from "../src/core/logger";
import { AzureLoggerConfig } from "../src/core/logger/providers/azure_logger_config";
import { QueueMessage } from "../src/core/queue";

const mockAutoSend = jest.fn();
const mockAdd = jest.fn();
const mockSend = jest.fn();
const mockGetQueue = jest.fn().mockImplementation(()=>{
    return {
        add:(message:QueueMessage)=>{mockAdd(message);},
        enableAutoSend:()=>{mockAutoSend();},
        send:()=>{mockSend();}
    }
});
const mockAuditor = jest.mock('../src/core/logger/providers/azure_auditor');
jest.mock('../src/core/logger/providers/azure_analytic')
describe('Logger', ()=>{

    beforeAll(()=>{
        Core.getQueue = mockGetQueue;
    })
    beforeEach(()=>{
        mockAdd.mockClear();
        mockSend.mockClear();
    })
    it('Should initialize with default configuration', ()=>{
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        expect(mockGetQueue).toHaveBeenCalled();
    })
    it('Should send info', ()=>{
        const info = 'info message';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        logger.info(info);
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should send debug', ()=>{
        const message = 'debug message';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        logger.debug(message);
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should send metric', ()=>{
        const name = 'metric-name';
        const value = 123;
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        logger.recordMetric(name,value);
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should record HTTP call', ()=>{
        const req  = 'httprequest';
        const resp = 'httpresponse';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        logger.recordRequest(req,resp);
        expect(mockAdd).toHaveBeenCalledTimes(1);

    })
    it('Should get auditor', ()=>{
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        const auditor = logger.getAuditor()
        // expect(auditor).toBe(mockAuditor);
        expect(auditor).toBeTruthy();

    })
    it('Should get analytic', ()=>{
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        
        const analytic = logger.getAnalytic();
        expect(analytic).toBeTruthy();
    })
    it('Should call send when sendAll called', ()=>{
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);

        logger.sendAll();

        expect(mockSend).toHaveBeenCalled();

    })
})