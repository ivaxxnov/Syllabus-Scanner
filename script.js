/* Global Variables */
uploadedFiles = []


/* Adding event listeners */
document.getElementById("formFileMultiple").addEventListener("change", addFilesToGlobalFiles);
document.getElementById("filelistplaceholder").addEventListener("click", removeClickedFile);


/* Functions */
// adds uploaded files to global variable files and calls displaySelectedFiles()

function addFilesToGlobalFiles(event) {
	console.log("file upload detected");
	let files = event.target.files;
	
	// prevent losers from spamming our website
	if (uploadedFiles.length + files.length > 6) {
		window.alert("No more 6 courses can be taken at a time!");
		return;
	}

	for (let i = 0; i < files.length; i++) {
		uploadedFiles.push(files[i]);
	}
	displaySelectedFiles();
}


// lists the syllabus files uploaded to the page by the user

function displaySelectedFiles() {
	console.log("refreshing selected file list");
	let fileList = document.getElementById('selectedfilelist');
	fileList.innerHTML = "";
	
	for (let i = 0; i < uploadedFiles.length; i++) {
		let fileName = uploadedFiles[i].name;
		let fileSize = Math.round(uploadedFiles[i].size / 1000, 1);
		
		fileList.innerHTML += `
			<btn class="list-group-item list-group-item-action d-flex gap-3 py-3">
				<i class="bi bi-file-earmark"></i>
				<div class="d-flex gap-2 w-100 justify-content-between">
					<div>
						<h6 class="mb-0">${fileName}</h6>
						<p class="mb-0 opacity-75">${fileSize} kB</p>
					</div>
				</div>
			</btn>`;
	}
}


// removes the clicked file from the files list and calls displaySelectedFiles() {

function removeClickedFile(event) {
	console.log("requested delete file");
	let filename = event.target.innerHTML;
	uploadedFiles.splice(uploadedFiles.indexOf(filename), 1); // delete from uploadedFiles array
	event.target.remove()
	displaySelectedFiles();
}

