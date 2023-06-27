/**
 * Unit test for `local_logger.ts`
 */

import { AuditEvent } from "../src/core/logger/model/audit_event";
import { AuditRequest } from "../src/core/logger/model/audit_request";
import { LocalLogger } from "../src/core/logger/providers/local/local_logger";
import { QueueMessage } from "../src/core/queue";

const mockPost = jest.fn();
jest.mock('axios', () => {
    return {
        post: jest.fn().mockImplementation(() => {
            mockPost();
            return Promise.resolve({})
        })
    }
})

describe('Local logger', () => {

    beforeEach(() => {
        mockPost.mockClear();
    })
    it('Should initialize without parameters', () => {
        // Act
        const localLogger = new LocalLogger();
        // Assert
        expect(localLogger).toBeTruthy();
    })

    it('Should send add request', () => {
        // Arrange
        const request = AuditRequest.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        // Act
        const message = localLogger.addRequest(request);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should be able to  update request', () => {
        // Arrange
        const request = AuditRequest.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        // Act
        const message = localLogger.updateRequest(request);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should be able to  add event', () => {
        // Arrange
        const request = AuditEvent.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        // Act
        const message = localLogger.addEvent(request);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })

    it('Should be able to record metric', () => {
        // Arrange
        const localLogger = new LocalLogger();
        // Act
        localLogger.recordMetric('sample-metric', 1);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should record HTTP call', () => {
        // Arrange
        const req = 'httprequest';
        const resp = 'httpresponse';
        const localLogger = new LocalLogger();
        // Act
        localLogger.recordRequest(req, resp);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);

    })

    it('Should send info', () => {
        // Arrange
        const info = 'info message';
        const localLogger = new LocalLogger();
        // Act
        localLogger.info(info);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should send debug', () => {
        // Arrange
        const message = 'debug message';
        const localLogger = new LocalLogger();
        // Act
        localLogger.debug(message);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should record message', () => {
        // Arrange
        const queueMessage = QueueMessage.from({ messageType: 'testtype' });
        const localLogger = new LocalLogger();
        // Act
        localLogger.recordMessage(queueMessage);
        // Assert
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should get Auditor', () => {
        // Arrange
        const localLogger = new LocalLogger();
        // Act
        const auditor = localLogger.getAuditor();
        // Assert
        expect(auditor).toBe(localLogger);
    })
})