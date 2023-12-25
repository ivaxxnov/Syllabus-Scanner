# Syllabus-Scanner
currently hosted at: https://ivaxxnov.github.io/Syllabus-Scanner/  

## Overview

Syllabus-Scanner is a site designed to simplify the process of creating a schedule for the school semester. The site uses chatGPT to scan your Syllabus files and extracts key details such as course name, assignments, due dates, and quiz dates. The extracted information is then compiled into two files. A nicely formatted spreadsheet, sorted in order of due date, with colour coding for easy readability, as well as a calendar file which is able to be imported into any major calendar application (Google, Microsoft, Apple) for easy tracking. The files are then returned to the user for download.

## How It Works

1. **Upload Syllabi**: Users drag and drop their syllabi files into a designated box on the interface.

2. **Processing**: Syllabus-Scanner sends the uploaded files through a processing pipeline for scanning and formatting.

3. **Output**: The processed data is then compiled into downloadable files and returned to the user.

#### User Interface Step-Through:
1. Interface clearly displays file upload section
2. User uploads files and starts process with button
3. Calls pipeline and gives it files
4. While waiting for response from pipeline, displays a progress bar
5. Pipeline returns the files
7. interface clearly presents files for download

#### Pipeline Step-Through:
- Single handler function called "pipeline()" will handle all subsequent functions 
1. PDF text extraction
2. Build prompt using extracted text
3. query gpt with prompt
4. check gpt response
5. insert values from response into grade calc spreadsheet file
6. insert values from response into calendar file
7. return files
