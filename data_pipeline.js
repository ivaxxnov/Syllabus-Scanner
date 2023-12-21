/*
The code in this file is meant to be for pdf processing purposes only!
*/


/*
handles the other functions for the pipeline and fits them all together
-- parameters: file as object
-- return: spreadsheet and calender as downloadable files
*/
function pipeline(file) {
}


/*
detects the filetype and uses the correct function to extract the text from it
-- parameters: file as object
-- return: string
*/
function stringFromSyllabusFile(file) { 
    let fileExtension = file.name.split('.').pop().toLowerCase();
    //Extracts the file type by spliting and popping at the '.'

    if (fileExtension === 'pdf') {
        return stringFromPDF(file);
    } else if (fileExtension === 'txt') {
        return stringFromTXT(file);
    } else if (fileExtension === 'docx') {
        return stringFromDOCX(file);
    } else {
        console.log("Unsupported file type, please use PDF, TXT, or DOCX:", fileExtension);
        return null;
  //Pretty basic conditonals, calliing the specific functions depending on the type
  //Sends a error if a unsupported type is passed.    

    }
}


/*
extract text from pdf
-- parameters: pdf file, as an object
-- return: string
*/
function stringFromPDF(PDFfile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = function () {
            let typedArray = new Uint8Array(this.result);

            // Initialize PDF.js
            pdfjsLib.getDocument({ data: typedArray }).promise.then(function (pdfDoc) {
                // Initialize a variable to store the text content
                let pdfText = '';

                // Loop through each page of the PDF
                let promises = [];
                for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                    promises.push(pdfDoc.getPage(pageNum).then(function (page) {
                        // Extract text content from the page
                        return page.getTextContent();
                    }).then(function (textContent) {
                        // Concatenate the text content to the variable
                        pdfText += textContent.items.map(function (item) {
                            return item.str;
                        }).join(' ');
                    }));
                }

                // Wait for all promises to resolve
                Promise.all(promises).then(function () {
                    resolve(pdfText);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };
        // Read the contents of the PDF file
        reader.readAsArrayBuffer(PDFfile);
    });
}


/*
extract text from .txt
-- parameters: text file as a file object
-- return: string
*/
function stringFromTXT(TXTfile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = function () {
            let text = this.result;
            resolve(text);
        };

        reader.onerror = function () {
            reject(new Error('Error reading the TXT file.'));
        };

        // Read the contents of the TXT file
        reader.readAsText(TXTfile);
    });
}


/*
extract text from .docx
-- parameters: .docx file as object
-- return: string
NOTE: DONT IMPLEMENT THIS UNTIL WE ARE SURE THAT WE NEED IT
*/
function stringFromDOCX(DOCXfile) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = function () {
            let arrayBuffer = this.result;

            // Using mammoth.js to convert DOCX to plain text
            mammoth.extractRawText({ arrayBuffer: arrayBuffer })
                .then(result => {
                    let text = result.value || '';
                    resolve(text);
                })
                .catch(error => {
                    reject(new Error('Error reading the DOCX file.'));
                });
        };

        reader.onerror = function () {
            reject(new Error('Error reading the DOCX file.'));
        };

        // Read the contents of the DOCX file
        reader.readAsArrayBuffer(DOCXfile);
    });
}

/*
The actual API call and prompting is done in another file (in another branch currently).
Assume that you are able to get a response object (as seen in the example) with the data.
If the response object is bad (use checkResponse) then re-prompt gpt.
do not get stuck in an infinite loop--if gpt is giving us garbage a couple times then terminate.
-- parameters: prompt
-- return: chatgdp response as an object (will probably be a promise)
*/
function queryGPT(prompt) {
}


/*
check response to see if chatgpt spit out garbage or not
(if it has all the fields it should have, and fields like date/time are formatted correctly)
-- parameters: response
-- return: boolena
*/
function checkResponse(response) {
}

/*
build spreadsheet file with response
PLEASE NOTE, the spreadsheet will be created by another team, it is up to the one responsible
for this function to export that spreadsheet and save it in this file, and then put the assignments and due dates in their respective spots.
-- parameters: response
-- return: file (as object)
*/
function buildSpreadsheet(response) {
}


/*
build calender importable file with response
PLEASE NOTE, the filetype can be whatever you want, its up to you to do your research and choose
a filetype thats both easy to work with using string manipulation and (mostly) universally importable.
-- parameters: response
-- return: file (as object)
*/
function buildCalender(response) {
}
