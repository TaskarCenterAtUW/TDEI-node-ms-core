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
        const localLogger = new LocalLogger();
        expect(localLogger).toBeTruthy();
    })

    it('Should send add request', () => {
        const request = AuditRequest.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        const message = localLogger.addRequest(request);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should be able to  update request', () => {
        const request = AuditRequest.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        const message = localLogger.updateRequest(request);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should be able to  add event', () => {
        const request = AuditEvent.from({ requestId: 'abc' });
        const localLogger = new LocalLogger();
        const message = localLogger.addEvent(request);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })

    it('Should be able to record metric', () => {
        const localLogger = new LocalLogger();
        localLogger.recordMetric('sample-metric', 1);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should record HTTP call', () => {
        const req = 'httprequest';
        const resp = 'httpresponse';
        const localLogger = new LocalLogger();
        localLogger.recordRequest(req, resp);
        expect(mockPost).toHaveBeenCalledTimes(1);

    })

    it('Should send info', () => {
        const info = 'info message';

        const localLogger = new LocalLogger();
        localLogger.info(info);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should send debug', () => {
        const message = 'debug message';
        const localLogger = new LocalLogger();
        localLogger.debug(message);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should record message', () => {
        const queueMessage = QueueMessage.from({ messageType: 'testtype' });
        const localLogger = new LocalLogger();
        localLogger.recordMessage(queueMessage);
        expect(mockPost).toHaveBeenCalledTimes(1);
    })
    it('Should get Auditor', () => {
        const localLogger = new LocalLogger();
        const auditor = localLogger.getAuditor();
        expect(auditor).toBe(localLogger);
    })
})