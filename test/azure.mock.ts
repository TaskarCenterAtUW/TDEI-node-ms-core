import { BlobItem } from '@azure/storage-blob';

export class MockedIterator {
    private items: BlobItem[];

    constructor(items: BlobItem[]) {
        this.items = items;
    }

    async next(): Promise<IteratorResult<BlobItem, any>> {
        const value = this.items.shift();
        if (value !== undefined) {
            return { value, done: false };
        } else {
            return { value: undefined, done: true };
        }
    }
}

export function getMockFiles(): BlobItem[] {
    return [
        getMockFile('sample1'),
        getMockFile('sample2'),
    ]
}

export function getMockFile(name: string): BlobItem {
    return {
        name: name,
        deleted: false,
        snapshot: 's',
        versionId: '',
        isCurrentVersion: true,
        properties: {
            etag: '',
            lastModified: new Date()
        }
    }
}