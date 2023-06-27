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
const mockGetQueue = jest.fn().mockImplementation(() => {
    return {
        add: (message: QueueMessage) => { mockAdd(message); },
        enableAutoSend: () => { mockAutoSend(); },
        send: () => { mockSend(); }
    }
});
const mockAuditor = jest.mock('../src/core/logger/providers/azure_auditor');
jest.mock('../src/core/logger/providers/azure_analytic')
describe('Logger', () => {

    beforeAll(() => {
        Core.getQueue = mockGetQueue;
    })
    beforeEach(() => {
        mockAdd.mockClear();
        mockSend.mockClear();
    })
    it('Should initialize with default configuration', () => {
        // Arrange
        const azureLoggerConfig = AzureLoggerConfig.default();
        // Act
        const logger = new Logger(azureLoggerConfig);
        // Assert
        expect(mockGetQueue).toHaveBeenCalled();
    })
    it('Should send info', () => {
        // Arrange
        const info = 'info message';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        logger.info(info);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should send debug', () => {
        // Arrange
        const message = 'debug message';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        logger.debug(message);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should send metric', () => {
        // Arrange
        const name = 'metric-name';
        const value = 123;
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        logger.recordMetric(name, value);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
    it('Should record HTTP call', () => {
        // Arrange
        const req = 'httprequest';
        const resp = 'httpresponse';
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        logger.recordRequest(req, resp);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);

    })
    it('Should get auditor', () => {
        // Arrange
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        const auditor = logger.getAuditor()
        // Assert
        expect(auditor).toBeTruthy();

    })
    it('Should get analytic', () => {
        // Arrange
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        const analytic = logger.getAnalytic();
        // Assert
        expect(analytic).toBeTruthy();
    })
    it('Should call send when sendAll called', () => {
        // Arrange
        const azureLoggerConfig = AzureLoggerConfig.default();
        const logger = new Logger(azureLoggerConfig);
        // Act
        logger.sendAll();
        // Assert
        expect(mockSend).toHaveBeenCalled();

    })
})