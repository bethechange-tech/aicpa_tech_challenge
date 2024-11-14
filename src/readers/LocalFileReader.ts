import * as fs from 'fs/promises';
import { ILogFileReader } from '../interfaces/ILogFileReader';

export class LocalFileReader implements ILogFileReader {
    constructor(private filePath: string) { }

    async readLogFile(): Promise<string> {
        return await fs.readFile(this.filePath, 'utf-8');
    }
}
