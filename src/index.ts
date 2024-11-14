import { LogParser } from './logParser';
import { S3FileReader } from './readers/S3FileReader';
import { LocalFileReader } from './readers/LocalFileReader';
import { CloudinaryFileReader } from './readers/CloudinaryFileReader';
import { AzureBlobFileReader } from './readers/AzureBlobFileReader';
import { S3Client } from '@aws-sdk/client-s3';
import { v2 as cloudinary } from 'cloudinary';

const storageProvider: 'local' | 's3' | 'cloudinary' | 'azure' = 'local'; // Options: 'local', 's3', 'cloudinary', 'azure'

async function main() {
    let logFileReader: LocalFileReader | S3FileReader | CloudinaryFileReader | AzureBlobFileReader;

    switch (storageProvider) {
        case 'local':
            logFileReader = new LocalFileReader('web.log');
            break;

        case 's3':
            const s3Client = new S3Client({ region: 'your-region' });
            logFileReader = new S3FileReader(s3Client, 'your-bucket-name', 'web.log');
            break;

        case 'cloudinary':
            // Configure Cloudinary
            cloudinary.config({
                cloud_name: 'your-cloud-name',
                api_key: 'your-api-key',
                api_secret: 'your-api-secret',
            });
            logFileReader = new CloudinaryFileReader('your-public-id');
            break;

        case 'azure':
            const connectionString = 'your-connection-string';
            logFileReader = new AzureBlobFileReader(
                connectionString,
                'your-container-name',
                'web.log'
            );
            break;

        default:
            throw new Error('Invalid storage provider specified');
    }

    const parser = new LogParser(logFileReader);

    try {
        await parser.parseLogFile();

        const pageViews = parser.getPageViews();
        console.log('Page Views (Most to Least):');
        console.log(parser.formatPageViews(pageViews, 'desc').join('\n'));

        console.log('\nUnique Page Views (Most to Least):');
        const uniquePageViews = parser.getUniquePageViews();
        console.log(parser.formatPageViews(uniquePageViews, 'desc').join('\n'));
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();
