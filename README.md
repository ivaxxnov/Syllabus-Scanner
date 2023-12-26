<p align="center">
  <img src="/images/left.png" alt="Left Design" style="height: 200px;"/>
  <img src="https://ivaxxnov.github.io/Syllabus-Scanner/logo.webp" alt="Syllabus Scanner Logo" style="height: 200px; width: auto;"/>
  <img src="/images/right.png" style="height: 200px;"/>
</p>



# Syllabus-Scanner

Syllabus-Scanner is a web application designed to streamline the process of organizing schedules for the school semester. It leverages chatGPT to analyze syllabus files, extracting critical information such as course names, assignment details, due dates, and quiz dates. This data is then compiled into user-friendly formats: a color-coded, sorted spreadsheet and a calendar file compatible with major calendar applications (Google, Microsoft, Apple) for effortless tracking.

**Live Demo/Hosted At**: [Syllabus-Scanner](https://ivaxxnov.github.io/Syllabus-Scanner/)

## How It Works

1. **Upload Syllabi**: Users can upload their syllabus files by dragging and dropping them into the upload section on the web interface.

2. **Processing**: The application processes the uploaded files through a pipeline, extracting and formatting the necessary information.

3. **Output**: Users receive neatly organized, downloadable files – a spreadsheet and a calendar file, ready for use.

### User Interface Workflow

- **File Upload**: The interface allows users to upload syllabus files easily.
- **Start Process**: Users initiate the processing with a button click.
- **Progress Bar**: While the files are being processed, a progress bar indicates the ongoing operation.
- **Download Processed Files**: After processing, the interface presents the files for download.

### Data Processing Pipeline

- **Pipeline Handler**: A function named `pipeline()` orchestrates the entire processing workflow.
- **Steps in the Pipeline**:
  1. Extract text from PDF files.
  2. Build a prompt from the extracted text.
  3. Query chatGPT with the prompt.
  4. Validate the response from chatGPT.
  5. Populate a spreadsheet with data for grade calculations.
  6. Generate a calendar file with the processed data.
  7. Return the prepared files for download.

## Tech Stack

- **Frontend**: JavaScript, HTML, CSS, Bootstrap
- **Backend**: chatGPT Queries
- **Hosting**: GitHub Pages

## Project Status

This project is currently in development. Key functionalities are being implemented and refined. Current Status: Testing/Refinement.

#

<p align="center">
  <img src="/images/left.png" alt="Left Design" style="height: 200px;"/>
  <img src="https://ivaxxnov.github.io/Syllabus-Scanner/logo.webp" alt="Syllabus Scanner Logo" style="height: 200px; width: auto;"/>
  <img src="/images/right.png" style="height: 200px;"/>
</p>

