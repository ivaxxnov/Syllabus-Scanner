# Syllabus-Scanner
currently hosted at: https://kianbahasadri.github.io/Syllabus-Scanner/

-----------------------
# TODO
- Build actual website, model it after [course central](https://coursecentral.ca/)
- pdf text extraction
	- look into how it gonna be done
- chatgpt api call and prompt
	- probably seperate the api call and the prompt building
- make google sheets document with grade calculator built in
- export google sheets document with placeholders
- function to fill in placeholders with prompt response
	- probably add a function to check prompt response for accuracy and potentially terminate the pipeline
- return files to website for download
- profit
-----------------------


## Overview

Syllabus-Scanner is a site designed to simplify the process of creating a schedule for the school semester. The site uses AI scanning of PDF files, to interpret and extract key details such as course and assignment names, as well as due dates. The extracted information is then compiled into a nicely formatted spreadsheet, sorted in order of due date, with colour coding for easy readability. The spreadsheet file is returned to the user and can be used with common spreadsheet applications such as Google Sheets or Microsoft Excel.

## Features

1. **PDF Reading**: Syllabus-Scanner reads PDF files, allowing users to upload their course syllabi effortlessly.

2. **User Interaction**: Users have the flexibility to add multiple files, delete unwanted files, or continue with the processing flow.

3. **AI Processing**: The tool utilizes AI with tailored prompts, to extract relevant information. This includes assignments, tests, quizzes, problem sets, labs, tutorials, and more.

4. **Spreadsheet Generation**: The extracted data is then formatted into a spreadsheet with columns for the course name, assignment name, due date, and color-coded by course. Additional optional features may include due time and assignment weightage.

## How It Works

1. **Upload Syllabi**: Users drag and drop their syllabi files into a designated box on the interface.

2. **AI Processing**: Syllabus-Scanner sends the uploaded files to an AI for scanning and formatting.

3. **Spreadsheet Output**: The processed data is then compiled into a downloadable spreadsheet (in XLS format) and returned to the user.
