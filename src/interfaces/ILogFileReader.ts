export interface ILogFileReader {
    readLogFile(): Promise<string>;
}
