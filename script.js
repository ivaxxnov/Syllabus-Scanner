/* Global Variables */
uploadedFiles = [];
finishedFiles = [];


/* Adding event listeners */
document.getElementById("formFileMultiple").addEventListener("change", addFilesToGlobalFiles);
document.getElementById("filelistplaceholder").addEventListener("click", removeClickedFile);
document.getElementById("startpipeline").addEventListener("click", startProcessing);

/*
Processing Functions
The following functions are built for pipeline handling
*/

// start processing, handles pipeline and shit

async function startProcessing(event) {
	// disable file upload / delete / processing capabilities
	document.getElementById("formFileMultiple").disabled = true;
	document.getElementById("startpipeline").disabled = true;
	document.querySelectorAll(".list-group-item").forEach(element => {element.disabled = true;});
	
	// Graphics
	displayButtonSpinners();
	updateProgressBar();

	// gonna make the pipeline work for just one document for now
	// make it work for multiple later
	let jsondata = await pipeline(uploadedFiles[0]);
	finished(uploadedFiles[0].name);
	console.log(jsondata);
}


// update graphics when a file finishes processing

function finished(filename) {
	finishedFiles.push(filename);
	displayButtonSpinners();
	updateProgressBar();
}
	

// adds spinners to buttons based on which are finished and which arent

function displayButtonSpinners() {
	// i know this looks mesys but it makes sense when you read it
	for (div of document.querySelectorAll("#button-name-size")) {
		div.querySelector(".spinner-border").style.display = finishedFiles.indexOf(div.parentElement.id) == -1 ? "" : "none";
	}
}

// updates progress bar based on which are finished and which arent

function updateProgressBar() {
	let pbar = document.querySelector(".progress-bar");
	pbar.style.width = `${Math.round(finishedFiles.length * 100 / uploadedFiles.length, 0)}%`;
	pbar.innerHTML = `${finishedFiles.length} / ${uploadedFiles.length}`;
}



/*
File List Functions
The following functions are built for the File list functionality in the UI
*/

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
		
		let btn = document.createElement('button');
		btn.id = fileName;
		btn.className = "list-group-item list-group-item-action d-flex gap-3 py-3";
		btn.innerHTML = `
			<i class="bi bi-file-earmark h5"></i>
			<div id="button-name-size" class="d-flex gap-2 w-100 justify-content-between">
				<div>
					<h6 class="mb-0 h5">${fileName}</h6>
					<p class="mb-0 opacity-75">${fileSize} kB</p>
				</div>
				<div class="spinner-border text-primary" style="display:none"></div>
			</div>`;

		btn.addEventListener("click", removeClickedFile);
		fileList.appendChild(btn);
	}

	// set start processing button as disabled or enabled
	if (uploadedFiles.length > 0) {
		document.getElementById("startpipeline").disabled = false
	} else {
		document.getElementById("startpipeline").disabled = true;
	}
}


// removes the clicked file from the files list and calls displaySelectedFiles() {

function removeClickedFile(event) {
	console.log("requested delete file");
	let filename = event.target.parentNode.querySelector("h6").innerHTML;
	let index = 0;
	
	for (; index < uploadedFiles.length; index++) {
		if (uploadedFiles[index].name == filename) {
			break;
		}
	}

	uploadedFiles.splice(index, 1);
	event.target.remove()
	displaySelectedFiles();
}

