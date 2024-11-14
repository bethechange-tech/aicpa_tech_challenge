import * as fs from 'fs';
import {
    groupBy,
    countBy,
    map,
    uniqBy,
    orderBy,
    toPairs,
    mapValues
} from 'lodash';

/**
 * Represents a log entry with page URL and IP address.
 */
interface LogEntry {
    /** The URL of the page. */
    page: string;

    /** The IP address of the visitor. */
    ip: string;
}

/**
 * Sorting options for page views.
 */
type SortOrder = 'asc' | 'desc';

/**
 * A class to parse log files and analyze page view statistics.
 */
export class LogParser {
    /** An array to store parsed log entries. */
    public logEntries: LogEntry[];

    /**
     * Initializes a new instance of the LogParser class.
     */
    constructor() {
        this.logEntries = [];
    }

    /**
     * Reads a log file, parses each line, and stores entries in `logEntries`.
     * @param {string} filePath - The path to the log file.
     */
    public readLogFile(filePath: string): void {

        // Read the file content as a string
        const data = fs.readFileSync(filePath, 'utf8');

        // Split the content into lines
        const lines = data.split('\n');

        // Initialize an array to hold the log entries
        const entries: LogEntry[] = [];

        // Process each line
        for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip empty lines
            if (!trimmedLine) {
                continue;
            }

            const [page, ip] = trimmedLine.split(' ');

            if (page && ip) {
                entries.push({ page, ip });
            }
        }

        this.logEntries = entries;
    }


    /**
     * Calculates the total number of page views for each page.
     * @returns {Record<string, number>} An object where each key is a page and each value is the total view count.
     */
    public getPageViews(): { [page: string]: number } {
        return countBy(this.logEntries, 'page');
    }

    /**
     * Calculates the unique number of views for each page based on unique IP addresses.
     * @returns {Record<string, number>} An object where each key is a page and each value is the unique view count.
     */
    getUniquePageViews(): { [page: string]: number } {
        // Group entries by page
        const groupedEntries = groupBy(this.logEntries, 'page');

        // For each page, count the number of unique IP addresses
        return mapValues(groupedEntries, entries => uniqBy(entries, 'ip').length);
    }

    /**
     * Formats the page view counts into a sorted array of strings.
     * @param {Record<string, number>} views - An object where each key is a page and each value is the view count.
     * @param {SortOrder} [order='desc'] - The sort order, either 'asc' for least to most or 'desc' for most to least.
     * @returns {string[]} An array of formatted strings showing page views in the specified order.
     */
    formatPageViews(views: { [page: string]: number }, order: SortOrder = 'desc'): string[] {
        // Convert the views object into an array of [page, count] pairs
        const entries = toPairs(views);

        // Sort the entries based on the count
        const sortedEntries = orderBy(entries, [1], [order]);

        // Map the sorted entries into formatted strings
        const formattedViews = map(sortedEntries, ([page, count]) => {
            const visitWord = count > 1 ? 'visits' : 'visit';
            return `${page} ${count} ${visitWord}`;
        });

        return formattedViews;
    }
}
