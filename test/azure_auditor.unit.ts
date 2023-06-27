import { Core } from "../src/core";
import { AuditEvent } from "../src/core/logger/model/audit_event";
import { AuditRequest } from "../src/core/logger/model/audit_request";
import { AzureAuditor } from "../src/core/logger/providers/azure_auditor";
import { QueueMessage } from "../src/core/queue";

const mockAutoSend = jest.fn();
const mockAdd = jest.fn();
const mockGetQueue = jest.fn().mockImplementation(() => {
    return {
        add: (message: QueueMessage) => { mockAdd(message); },
        enableAutoSend: () => { mockAutoSend(); }
    }
});

describe('Azure auditor', () => {
    beforeAll(() => {
        Core.getQueue = mockGetQueue;
    })

    beforeEach(() => {
        mockAdd.mockClear();
    })

    it('Should initialize with queue name', () => {
        // Arrange
        const auditor = new AzureAuditor('auditor');
        // Assert
        expect(auditor).toBeTruthy();
        expect(mockAutoSend).toHaveBeenCalledTimes(1);
    })

    it('Should add event appropriately', () => {
        // Arrange
        const auditor = new AzureAuditor('auditor');
        const event = AuditEvent.from({
            requestId: 'abc',
        });
        // Act
        const message = auditor.addEvent(event);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);
    })

    it('Should add request ', () => {
        // Arrange
        const auditor = new AzureAuditor('auditor');
        const request = AuditRequest.from({ requestId: 'abc' });
        // Act
        const message = auditor.addRequest(request);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);
    })

    it('Should update request ', () => {
        // Arrange
        const auditor = new AzureAuditor('auditor');
        const request = AuditRequest.from({ requestId: 'abc' });
        // Act
        const message = auditor.updateRequest(request);
        // Assert
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);

    })

    it('Should return object with empty queue also', () => {
        // Arrange
        const auditor = new AzureAuditor('');
        // Assert
        expect(auditor).toBeTruthy();
    })
})