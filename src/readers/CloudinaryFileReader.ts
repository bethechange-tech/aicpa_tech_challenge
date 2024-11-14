import { ILogFileReader } from '../interfaces/ILogFileReader';
import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryFileReader implements ILogFileReader {
    constructor(private publicId: string) { }

    async readLogFile(): Promise<string> {
        const result = await cloudinary.api.resource(this.publicId, {
            resource_type: 'raw',
        });

        const url = result.secure_url;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch log file from Cloudinary: ${response.statusText}`);
        }

        return await response.text();
    }
}
