import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { ILogFileReader } from '../interfaces/ILogFileReader';

export class S3FileReader implements ILogFileReader {
    constructor(
        private s3Client: S3Client,
        private bucketName: string,
        private objectKey: string
    ) { }

    async readLogFile(): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: this.objectKey,
        });

        const response = await this.s3Client.send(command);
        const stream = response.Body as Readable;

        return await this.streamToString(stream);
    }

    private streamToString(stream: Readable): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const chunks: any[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
        });
    }
}
