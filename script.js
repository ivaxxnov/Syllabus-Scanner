document.getElementById('upload-btn').addEventListener('click', function() {
const fileList = document.getElementById('file-list');
const input = document.getElementById('pdfInput');

	Array.from(input.files).forEach(file => {
			const listItem = document.createElement('li');
			listItem.className = 'file-item';

			const fileName = document.createElement('span');
			const shortenedName = getShortenedFileName(file.name);
			fileName.textContent = shortenedName;
			fileName.title = file.name;
			fileName.classList.add('file-name');
			fileName.addEventListener('click', function() {
					// add functionality for click from here
					// maybe it uploads and converts to excel? idk
			});

			const removeButton = document.createElement('button');
			removeButton.textContent = 'x';
			removeButton.addEventListener('click', function() {
					listItem.remove();
			});

			listItem.appendChild(fileName);
			listItem.appendChild(removeButton);
			fileList.appendChild(listItem);
	});
input.value = '';
});

function getShortenedFileName(fullName) {
    const maxLength = 20; // Set the maximum length for the displayed name
    if (fullName.length <= maxLength) {
        return fullName;
    }
    const extension = fullName.split('.').pop();
    const truncatedName = fullName.substring(0, maxLength - 3);
    return truncatedName + '...' + extension;
}

var originalSheet;

function handleFile() {
    var fileInput = document.getElementById('fileInput');
    var excelContainer = document.getElementById('excel-container');

    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });

        var sheetName = workbook.SheetNames[0];
        var sheet = workbook.Sheets[sheetName];

        originalSheet = sheet;
        var html = XLSX.utils.sheet_to_html(sheet, { editable: true });

        excelContainer.innerHTML = html;
        initializeEmptyCells();
    };

    reader.readAsArrayBuffer(file);
}
/*Download doesnt work :( the alert does though!*/
function downloadFile() {
    if (originalSheet) {
        var editedWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(editedWorkbook, XLSX.utils.table_to_sheet(document.getElementById('excel-container')));

        var blob = XLSX.write(editedWorkbook, { bookType: 'xlsx', bookSST: false, type: 'blob' });

        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'edited_file.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        alert('Please load an Excel file first.');
    }
}

function addRow() {
    var table = document.querySelector('#excel-container table');
    var newRow = table.insertRow(-1); // -1 inserts the row at the end

    for (var i = 0; i < table.rows[0].cells.length; i++) {
        var newCell = newRow.insertCell(i);
        newCell.innerHTML = '0'; // Initialize with '0'
    }
}

function addColumn() {
    var table = document.querySelector('#excel-container table');

    for (var i = 0; i < table.rows.length; i++) {
        var newRowCell = table.rows[i].insertCell(-1); // -1 inserts the cell at the end
        newRowCell.innerHTML = '0'; // Initialize with '0'
    }
}

function initializeEmptyCells() {
    var table = document.querySelector('#excel-container table');

    for (var i = 0; i < table.rows.length; i++) {
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            if (table.rows[i].cells[j].innerHTML === '') {
                table.rows[i].cells[j].innerHTML = '0'; // Initialize with '0'
            }
        }
    }
}

