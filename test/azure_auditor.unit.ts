import { Core } from "../src/core";
import { AuditEvent } from "../src/core/logger/model/audit_event";
import { AuditRequest } from "../src/core/logger/model/audit_request";
import { AzureAuditor } from "../src/core/logger/providers/azure_auditor";
import { QueueMessage } from "../src/core/queue";

const mockAutoSend = jest.fn();
const mockAdd = jest.fn();
const mockGetQueue = jest.fn().mockImplementation(()=>{
    return {
        add:(message:QueueMessage)=>{mockAdd(message);},
        enableAutoSend:()=>{mockAutoSend();}
    }
});

describe('Azure auditor', ()=>{
    beforeAll(()=>{
        Core.getQueue = mockGetQueue;
    })
    beforeEach(()=>{
        mockAdd.mockClear();
    })
    it('Should initialize with queue name', ()=>{
        const auditor = new AzureAuditor('auditor');
        expect(auditor).toBeTruthy();
        expect(mockAutoSend).toHaveBeenCalledTimes(1);
    })
    it('Should add event appropriately', ()=>{
        const auditor = new AzureAuditor('auditor');
        const event = AuditEvent.from({
            requestId:'abc',
        });
       const message =  auditor.addEvent(event);
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);
    })
    it('Should add request appropriately', ()=>{
        const auditor = new AzureAuditor('auditor');
        const request = AuditRequest.from({requestId:'abc'});
        const message = auditor.addRequest(request);
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);
    })
    it('Should update request appropriately', ()=>{

        const auditor = new AzureAuditor('auditor');
        const request = AuditRequest.from({requestId:'abc'});
        const message = auditor.updateRequest(request);
        expect(mockAdd).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledWith(message);

    })
    it('Should return object with empty queue also', ()=>{
        const auditor = new AzureAuditor('');
        expect(auditor).toBeTruthy();
    })
})