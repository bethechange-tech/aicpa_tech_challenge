import { LogParser } from './logParser';

const parser = new LogParser();
parser.readLogFile('web.log');

const pageViews = parser.getPageViews();
console.log('Page Views (Most to Least):');
console.log(parser.formatPageViews(pageViews, 'desc').join('\n'));

console.log('Page Views (Least to Most):');
console.log(parser.formatPageViews(pageViews, 'asc').join('\n'));

const uniquePageViews = parser.getUniquePageViews();
console.log('\nUnique Page Views (Most to Least):');
console.log(parser.formatPageViews(uniquePageViews, 'desc').join('\n'));

console.log('Unique Page Views (Least to Most):');
console.log(parser.formatPageViews(uniquePageViews, 'asc').join('\n'));
