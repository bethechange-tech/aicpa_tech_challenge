import { ILogFileReader } from '../interfaces/ILogFileReader';
import { BlobServiceClient } from '@azure/storage-blob';

export class AzureBlobFileReader implements ILogFileReader {
    constructor(
        private connectionString: string,
        private containerName: string,
        private blobName: string
    ) { }

    async readLogFile(): Promise<string> {
        const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
        const containerClient = blobServiceClient.getContainerClient(this.containerName);
        const blobClient = containerClient.getBlobClient(this.blobName);
        const downloadBlockBlobResponse = await blobClient.download();

        return await this.streamToString(downloadBlockBlobResponse.readableStreamBody!);
    }

    private streamToString(stream: NodeJS.ReadableStream): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const chunks: any[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        });
    }
}
