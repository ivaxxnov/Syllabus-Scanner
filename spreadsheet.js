

/*
this is like pipeline function but for spreadsheet
*/
async function spreadsheetHandler(array_of_json) {
}

/*renders spreadhseet*/
async function renderSpreadsheet(JSONDATA) {
  let sheetData = await openAndFillTemplate(JSONDATA);
  console.log("filled sheetData:", sheetData);

  let table = new Tabulator("#example-table", {
    height:205,
    data: sheetData,
    layout:"fitColumns", //fit columns to width of table (optional)
    columns: [
      {title: "CLASS", field: "CLASS", hozAlign: "left", width: 200, editor: "input"},
      {title: "ASSIGNMENT", field: "ASSIGNMENT", hozAlign: "left", editor: "input"},
      {title: "DUE DATE", field: "DUE_DATE", sorter: "date", hozAlign: "center", editor: "input"},
      {title: "TIME", field: "TIME", hozAlign: "center", editor: "input", formatter: "date", formatterParams: {outputFormat: "HH:mm"}},
      {title: "GRADE", field: "GRADE", hozAlign: "center", editor: "input"},
      {title: "WEIGHT", field: "WEIGHT", hozAlign: "center", editor: "number"},
      {title: "DONE", field: "DONE", hozAlign: "center", formatter: "tickCross", editor: "tickCross"}
    ],
  });
}


/*
build spreadsheet file with response
PLEASE NOTE, the spreadsheet will be created by another team, it is up to the one responsible
for this function to export that spreadsheet and save it in this file, and then put the assignments and due dates in their respective spots.
-- parameters: response
-- return: file (as object)
*/
async function openAndFillTemplate(response) {
	console.log("building workbook");
	let responseFile = await fetch("./template.xlsx");

	// do a bunch of bullshit to turn template file into an object
	// read about it here: https://docs.sheetjs.com/docs/getting-started/roadmap/
	let arrayBuffer = await responseFile.arrayBuffer();

	let workbook = XLSX.read(arrayBuffer, { type: "buffer" });
	let firstSheetName = workbook.SheetNames[0];
	let worksheet = workbook.Sheets[firstSheetName];
	let sheetJSON = XLSX.utils.sheet_to_json(worksheet);
	
	let coursename = response.subject;
	let events = response.schedule;
	
	for (let i = 0; i < events.length; i++) {
		let event = events[i];
		sheetJSON[i].CLASS = coursename;
		sheetJSON[i].ASSIGNMENT = event.title;
		sheetJSON[i].DUE_DATE = event.due_date;
		sheetJSON[i].TIME = event.time;
		sheetJSON[i].WEIGHT = 0;
	}

	// TODO: INSERT WEIGHTINGS INTO SHEETJSON
	// unfortunately still figuring out how to do proper mark weightings with gpt
	// TODO

	return sheetJSON;
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