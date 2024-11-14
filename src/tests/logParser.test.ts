import { describe, it, expect, beforeEach } from 'vitest';
import { LogParser } from '../logParser';

describe('LogParser', () => {
    let parser: LogParser;

    beforeEach(() => {
        parser = new LogParser();
    });

    it('should calculate page views correctly', () => {
        parser.logEntries = [
            { page: '/home', ip: '126.318.035.038' },
            { page: '/home', ip: '184.123.665.067' },
            { page: '/index', ip: '444.701.448.104' },
            { page: '/about', ip: '929.398.951.889' },
            { page: '/home', ip: '184.123.665.067' },
        ];
        expect(parser.getPageViews()).toEqual({
            '/home': 3,
            '/index': 1,
            '/about': 1,
        });
    });

    it('should calculate unique page views correctly', () => {
        parser.logEntries = [
            { page: '/home', ip: '126.318.035.038' },
            { page: '/home', ip: '184.123.665.067' },
            { page: '/index', ip: '444.701.448.104' },
            { page: '/about', ip: '929.398.951.889' },
            { page: '/home', ip: '184.123.665.067' },
        ];
        expect(parser.getUniquePageViews()).toEqual({
            '/home': 2,
            '/index': 1,
            '/about': 1,
        });
    });

    it('should format page views in descending order (Most to Least)', () => {
        const pageViews = {
            '/home': 3,
            '/index': 1,
            '/about': 2,
        };
        const result = parser.formatPageViews(pageViews, 'desc');
        expect(result).toEqual([
            '/home 3 visits',
            '/about 2 visits',
            '/index 1 visit',
        ]);
    });

    it('should format page views in ascending order (Least to Most)', () => {
        const pageViews = {
            '/home': 3,
            '/index': 1,
            '/about': 2,
        };
        const result = parser.formatPageViews(pageViews, 'asc');
        expect(result).toEqual([
            '/index 1 visit',
            '/about 2 visits',
            '/home 3 visits',
        ]);
    });

    it('should format unique page views in descending order (Most to Least)', () => {
        const uniquePageViews = {
            '/home': 2,
            '/index': 1,
            '/about': 3,
        };
        const result = parser.formatPageViews(uniquePageViews, 'desc');
        expect(result).toEqual([
            '/about 3 visits',
            '/home 2 visits',
            '/index 1 visit',
        ]);
    });

    it('should format unique page views in ascending order (Least to Most)', () => {
        const uniquePageViews = {
            '/home': 2,
            '/index': 1,
            '/about': 3,
        };
        const result = parser.formatPageViews(uniquePageViews, 'asc');
        expect(result).toEqual([
            '/index 1 visit',
            '/home 2 visits',
            '/about 3 visits',
        ]);
    });
});
