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
}


/*
extract text from pdf
-- parameters: pdf file, as an object
-- return: string
*/
function stringFromPDF(PDFfile) {
}


/*
extract text from .txt
-- parameters: text file as a file object
-- return: string
*/
function stringFromTXT(TXTfile) {
}


/*
extract text from .docx
-- parameters: .docx file as object
-- return: string
NOTE: DONT IMPLEMENT THIS UNTIL WE ARE SURE THAT WE NEED IT
*/
function stringFromDOCX(DOCXfile) {
}


/*
build prompt to send to chatgdp
-- parameters: pdf in string format
-- return: prompt ready to send
*/
function buildPrompt(pdf) {
}


/*
send prompt to chatgdp and return response
-- parameters: prompt
-- return: chatgdp response
*/
function queryGPT(prompt) {
}


/*
check response to see if its dookie
-- parameters: response
-- return: boolena
*/
function checkResponse(resposne) {
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
