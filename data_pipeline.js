/*
The code in this file is meant to be for pdf processing purposes only!
*/


/*
handles the other functions for the pipeline and fits them all together
-- parameters: file as object
-- return: spreadsheet and calender as downloadable files
*/
async function pipeline(file) {
	//leave console outputs, its very useful for debugging and doesnt bother the user
	// its acceptable in a student project such as this one

	console.log("PIPELINE START - pipeline called with file:", file);

	console.log("1 - calling stringFromSyllabusFile()");
	let string = await stringFromSyllabusFile(file);
	console.log("1.5 - stringFromSyllabusFile() returned:", string);

	console.log("2 - calling returnGPTJSON() with string");
	let JSONData = await returnGPTJSON(string);	// please note the response is checked within the function
	console.log("2.5 - returnGPTJSON() returned:", JSONData);

	console.log("3 - calling buildSpreadsheet() with JSON:", JSONData);
	let spreadsheet = buildSpreadsheet(JSONData);
	console.log("3.5 - buildSpreadsheet() returned:", spreadsheet);

	console.log("4 - calling buildCalender() with JSON:", JSONData);
	let calender = buildCalender(JSONData);
	console.log("4.5 - buildCalender() returned:", calender);

	console.log("PIPELINE END - pipeline returning:", [spreadsheet, calender]);
	return [spreadsheet, calender];
}


/*
detects the filetype and uses the correct function to extract the text from it
-- parameters: file as object
-- return: string
*/
async function stringFromSyllabusFile(file) { 
    let fileExtension = file.name.split('.').pop().toLowerCase();
    //Extracts the file type by spliting and popping at the '.'

    if (fileExtension === 'pdf') {
        return await stringFromPDF(file);
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
-- return: chatgdp response as an object following our formatting
*/
async function returnGPTJSON(syllabus) {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        // went with 3 tries, seemed like a good number of tries, can be changed easily
        
        try {
            const response = await parse_syllabus(syllabus);
            // this needs to be replaced with the actual api call function
            
            if (checkResponse(response)) {
                return JSON.parse(response);
                // returning what chatgpt responsed with once its checked to see if its good
            }
            console.log(`Attempt ${attempt}: Invalid response from gpt, retrying...`);
            
        } catch (error) {
            console.error("GPT query failed:", error);
            // a pretty simple error is thrown if the sendPromptToGPT or anything above doesn't work
        }
    }

    throw new Error("Failed to get a valid response from chatGPT after several attempts.");
    // i don't think this is necessary but, throws a final error if overall goal isn't reached.
}


/*
check response to see if chatgpt spit out garbage or not
(if it has all the fields it should have, and fields like date/time are formatted correctly)
-- parameters: response as a JSON string
-- return: boolena
*/
function checkResponse(response) {
    if(!response) {
        console.log("Empty Response")
        return false
    }

    let obj = ""
    try {
        obj = JSON.parse(response)
    } catch (e) {
        console.log("Bad JSON Formatting")
        console.log(e)
        return false
    }

    // Check for the presence of key fields
    if (!obj.subject || !Array.isArray(obj.schedule) || !obj.marking_weights) {
        console.log("Response is missing one or more key fields.");
        return false;
        // key information like subject, schedule etc are checked.
    }

    // Check each schedule item for correct structure and valid date/time
    for (const item of obj.schedule) {

        const date = new Date(item.due_date);
        // used built in techniques to set the date

        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        // used regex similar to what we learnedin class to determine valid dates

        if (!item.title || isNaN(date.getTime()) || item.due_date !== date.toISOString().split('T')[0] || !timeRegex.test(item.time)) {
            console.log("Invalid schedule item:", item);
            // if the date or time associated with a specifc assignment/project/task is invalid, false in returned
            return false;
        }
    }

    // Check marking weights: Ensure all values are numbers and their sum equals 100
    let totalWeight = 0;

    for (const key in obj.marking_weights) {

        const weight = obj.marking_weights[key];

        if (typeof weight !== 'number' || weight < 0) {
            console.log(`Invalid weight for ${key}:`, weight);
            return false;
        }

        totalWeight += weight;
        // used a for loop to check the weight of each task and make sure its between 0 and 100 then added it to the total
    }

    if (totalWeight !== 100 && totalWeight!== 1) {
        console.log("Total weights do not add up to 100%:", totalWeight);
        // if total is not 100, we know something went wrong because each class only has 100% to distribute

        return false;
    }

    return true;
    // if everything is good, true is returned.
}


/*
build spreadsheet file with response
PLEASE NOTE, the spreadsheet will be created by another team, it is up to the one responsible
for this function to export that spreadsheet and save it in this file, and then put the assignments and due dates in their respective spots.
-- parameters: response
-- return: file (as object)
*/
function buildSpreadsheet(response) {
	let sheetRaw = XLSX.readFile("./template.xlsx");
	let sheetJSON = XLSX.utils.sheet_to_json(sheetRAW);
	console.log(sheetJSON);

	// TODO
	// INSERT RESPONSE INTO SHEETJSON
	// unfortunately still figuring out how to do proper mark weightings
	// TODO
	
	let newSheet = XLSX.utils.book_new();
	sheetRaw = XLSX.utils.json_to_sheet(sheetJSON);
	let preparedFile = XLSX.utils.book_append_sheet(newSheet, "Syllabus-Scanner.xlsx");

	return preparedFile;	
}


/*
build calender importable file with response
PLEASE NOTE, the filetype can be whatever you want, its up to you to do your research and choose
a filetype thats both easy to work with using string manipulation and (mostly) universally importable.
-- parameters: response
-- return: file (as object)
*/
function buildCalender(response) {
    let icsFileContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Your Organization//Your Product//EN\n";

    response.schedule.forEach(event => {
        const startDate = event.due_date.replace(/-/g, '') + 'T' + event.time.replace(/:/g, '') + '00';
        const endDate = startDate; // Simple example: using the same start and end date

        icsFileContent += "BEGIN:VEVENT\n";
        icsFileContent += `DTSTART:${startDate}\n`;
        icsFileContent += `DTEND:${endDate}\n`;
        icsFileContent += `SUMMARY:${event.title}\n`;
        icsFileContent += "END:VEVENT\n";
    });

    icsFileContent += "END:VCALENDAR";

    // return only the iCalendar file content as a string
    return icsFileContent;
    /* outputs the ics 'code' for the chatgpt prompt, which you take put it in a text file
    then change the text file into a ics file and you should see the events with their title and time in the
    correct date depending on the response from chat gpt. */

}
