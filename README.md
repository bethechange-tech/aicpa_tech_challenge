# Log Parser

This is a TypeScript application that reads a log file with page URLs and IP addresses, calculates page view statistics, and formats the results based on sorting options.

## Table of Contents

- [Log Parser](#log-parser)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Usage](#usage)
    - [1. Prepare the Log File](#1-prepare-the-log-file)
    - [2. Run the Application](#2-run-the-application)
    - [Sorting Options](#sorting-options)
    - [Run Tests](#run-tests)
    - [Test Coverage](#test-coverage)
  - [Instructions](#instructions)

## Requirements

- **Node.js** (>= 14.0)

- **npm** (>= 6.0)

## Installation

1. Clone the repository:

```bash

git  clone  https://github.com/bethechange-tech/aicpa_tech_challenge

```

2. Navigate  to  the  project  directory:

```bash

cd log-parser

```

3. Install  dependencies:

```bash

npm install

```

## Usage

### 1. Prepare the Log File

Ensure  that  the  log  file (e.g., `web.log`) is in the root directory of the project. Each line in the log file should follow this format:`

/page_name  IP_address

`Example`web.log`file:`

/home  126.318.035.038

/about  126.318.035.038

/index  444.701.448.104

/home  126.318.035.038

/index  929.398.951.889

perl

### 2. Run the Application

To run the application and parse the log file, use:

```bash

npm  start
```

This will read `web.log`, calculate page views and unique page views, and display the results in the console.

### Sorting Options

You can specify sorting options (Most to Least or Least to Most) for the output by modifying the parameters in `src/index.ts`:

typescript

`console.log(parser.formatPageViews(pageViews,  'desc').join('\n')); //  Most  to  Least

console.log(parser.formatPageViews(pageViews,  'asc').join('\n')); //  Least  to  Most`

Testing

-------

This project uses **Vitest** for testing.

### Run Tests

To run the tests:

bash

`npm  test`

### Test Coverage

Tests verify:

- Calculation of total and unique page views.

- Sorting functionality for both "Most to Least" and "Least to Most" options.

Example Output

--------------

Sample output in the console after running `npm  start`:

bash

`Page  Views (Most to  Least):

/home  3  visits

/index  2  visits

/about  1  visit

Page  Views (Least to  Most):

/about  1  visit

/index  2  visits

/home  3  visits

Unique  Page  Views (Most to  Least):

/home  2  visits

/index  2  visits

/about  1  visit

Unique  Page  Views (Least to  Most):

/about  1  visit

/home  2  visits

/index  2  visits`

## Instructions

*  *  *  *  *

Follow the steps in the [Installation](#installation) and [Usage](#usage) sections to set up and run the application. Use the [Testing](#testing) section to run unit tests and verify functionality.

*  *  *  *  *

**Note**: Ensure that all dependencies are correctly installed, and adjust any file paths as necessary for your environment.


1\. **Clone the Repository**:

```bash

git  clone  https://github.com/bethechange-tech/aicpa_tech_challenge

```

2. **Navigate to the Project Directory**:

```bash 
cd  log-parser`
```

3. **Install Dependencies**:

```bash
`npm  install`
```

4. **Prepare the Log File**:

```bash
- Place your `web.log` file in the root directory.

- Ensure each line follows the format:

`/page_name  IP_address`
```

5. **Run the Application**:

```bash
`npm run build && npm start`
```


6. **View the Output**:

```bash
The application will display the page views and unique page views in the console, sorted based on the default or specified sorting order.
```

7. **Run Tests**:


```bash
To verify the functionality of the application:

`npm  test`
```
