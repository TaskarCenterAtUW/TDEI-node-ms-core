/**
 * Unit tests for Azure analytic `azure_analytic.ts`.
 * This depends on Queue object and has two methods 
 * - add
 * - send
 */

import { Core } from "../src/core";
import { AzureAnalytic } from "../src/core/logger/providers/azure_analytic";
import { QueueMessage } from "../src/core/queue";

const mockSend = jest.fn();
const mockAdd = jest.fn();
const mockGetQueue = jest.fn().mockImplementation(() => {
    return {
        add: (message: QueueMessage) => { mockAdd(); },
        send: () => { mockSend(); }
    }
});

describe('Azure analytic', () => {
    beforeAll(() => {
        Core.getQueue = mockGetQueue;
    })

    it('Should initialize with queue name', () => {
        // Arrange
        const analytic = new AzureAnalytic('sample');
        // Assert
        expect(analytic).toBeTruthy();
    })

    it('Should be able to send message', () => {
        // Arrange
        const analytic = new AzureAnalytic('sample');
        const messageToDeliver = { type: 'sample' };

        // Act
        analytic.record(messageToDeliver);
        // Assert
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(mockAdd).toHaveBeenCalledTimes(1);
    })
})