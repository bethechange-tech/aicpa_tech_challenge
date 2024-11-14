import { describe, it, expect, beforeEach } from 'vitest';
import { LogParser } from '../logParser';
import { ILogFileReader } from '../interfaces/ILogFileReader';

class MockFileReader implements ILogFileReader {
    constructor(private data: string) { }

    async readLogFile(): Promise<string> {
        return this.data;
    }
}

describe('LogParser', () => {
    let parser: LogParser;

    describe('with standard data', () => {
        beforeEach(async () => {
            const mockData = `
        /home 126.318.035.038
        /home 184.123.665.067
        /index 444.701.448.104
        /about 929.398.951.889
        /home 184.123.665.067
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should calculate page views correctly', () => {
            expect(parser.getPageViews()).toEqual({
                '/home': 3,
                '/index': 1,
                '/about': 1,
            });
        });

        it('should calculate unique page views correctly', () => {
            expect(parser.getUniquePageViews()).toEqual({
                '/home': 2,
                '/index': 1,
                '/about': 1,
            });
        });

        it('should format page views in descending order', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews, 'desc');
            expect(formattedViews).toEqual([
                '/home 3 visits',
                '/index 1 visit',
                '/about 1 visit',
            ]);
        });

        it('should format page views in ascending order', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews, 'asc');
            expect(formattedViews).toEqual([
                '/index 1 visit',
                '/about 1 visit',
                '/home 3 visits',
            ]);
        });

        it('should format unique page views in descending order', () => {
            const uniquePageViews = parser.getUniquePageViews();
            const formattedUniqueViews = parser.formatPageViews(uniquePageViews, 'desc');
            expect(formattedUniqueViews).toEqual([
                '/home 2 visits',
                '/index 1 visit',
                '/about 1 visit',
            ]);
        });
    });

    describe('with empty data', () => {
        beforeEach(async () => {
            const mockData = ``;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should handle empty log data', () => {
            expect(parser.getPageViews()).toEqual({});
            expect(parser.getUniquePageViews()).toEqual({});
        });

        it('should format empty page views', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews);
            expect(formattedViews).toEqual([]);
        });
    });

    describe('with invalid data', () => {
        beforeEach(async () => {
            const mockData = `
        /home 126.318.035.038
        invalid_line_without_space
        /index 444.701.448.104
        /about
        184.123.665.067
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should ignore invalid lines', () => {
            expect(parser.getPageViews()).toEqual({
                '/home': 1,
                '/index': 1,
            });
            expect(parser.getUniquePageViews()).toEqual({
                '/home': 1,
                '/index': 1,
            });
        });
    });

    describe('with duplicate entries', () => {
        beforeEach(async () => {
            const mockData = `
        /home 126.318.035.038
        /home 126.318.035.038
        /home 126.318.035.038
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should count total page views correctly', () => {
            expect(parser.getPageViews()).toEqual({
                '/home': 3,
            });
        });

        it('should count unique page views correctly', () => {
            expect(parser.getUniquePageViews()).toEqual({
                '/home': 1,
            });
        });
    });

    describe('with multiple pages and IPs', () => {
        beforeEach(async () => {
            const mockData = `
        /home 126.318.035.038
        /about 184.123.665.067
        /contact 444.701.448.104
        /home 126.318.035.038
        /home 184.123.665.067
        /contact 126.318.035.038
        /about 444.701.448.104
        /about 444.701.448.104
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should calculate page views correctly', () => {
            expect(parser.getPageViews()).toEqual({
                '/home': 3,
                '/about': 3,
                '/contact': 2,
            });
        });

        it('should calculate unique page views correctly', () => {
            expect(parser.getUniquePageViews()).toEqual({
                '/home': 2,
                '/about': 2,
                '/contact': 2,
            });
        });

        it('should format page views correctly', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews, 'desc');
            expect(formattedViews).toEqual([
                '/home 3 visits',
                '/about 3 visits',
                '/contact 2 visits',
            ]);
        });

        it('should format unique page views correctly', () => {
            const uniquePageViews = parser.getUniquePageViews();
            const formattedUniqueViews = parser.formatPageViews(uniquePageViews, 'desc');
            expect(formattedUniqueViews).toEqual([
                '/home 2 visits',
                '/about 2 visits',
                '/contact 2 visits',
            ]);
        });
    });

    describe('sorting options', () => {
        beforeEach(async () => {
            const mockData = `
        /page1 126.318.035.038
        /page2 184.123.665.067
        /page3 444.701.448.104
        /page1 126.318.035.038
        /page2 184.123.665.067
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should sort page views in descending order by default', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews);
            expect(formattedViews).toEqual([
                '/page1 2 visits',
                '/page2 2 visits',
                '/page3 1 visit',
            ]);
        });

        it('should sort page views in ascending order when specified', () => {
            const pageViews = parser.getPageViews();
            const formattedViews = parser.formatPageViews(pageViews, 'asc');
            expect(formattedViews).toEqual([
                '/page3 1 visit',
                '/page1 2 visits',
                '/page2 2 visits',
            ]);
        });
    });

    describe('with malformed entries', () => {
        beforeEach(async () => {
            const mockData = `
        /home 126.318.035.038 extra_field
        /index
        justsomegarbage
        /about 929.398.951.889
        /home 184.123.665.067
      `;
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should handle malformed entries gracefully', () => {
            expect(parser.getPageViews()).toEqual({
                '/about': 1,
                '/home': 2,
            });
            expect(parser.getUniquePageViews()).toEqual({
                '/about': 1,
                '/home': 2,
            });

        });
    });

    describe('with large data set', () => {
        beforeEach(async () => {
            // Generate a large number of entries
            let mockData = '';
            for (let i = 0; i < 1000; i++) {
                mockData += `/page${i % 10} 126.318.035.${i % 50}\n`;
            }
            const mockFileReader = new MockFileReader(mockData);
            parser = new LogParser(mockFileReader);
            await parser.parseLogFile();
        });

        it('should handle large data sets efficiently', () => {
            const pageViews = parser.getPageViews();
            expect(Object.keys(pageViews).length).toEqual(10);
            expect(pageViews['/page0']).toEqual(100);
        });
    });
});
