/*
Light/Dark Mode Functions
Fuck this shit btw
*/
(() => {
	'use strict'
  
	// Getting stored theme/Setting stored theme
	const getStoredTheme = () => localStorage.getItem('theme')
	const setStoredTheme = theme => localStorage.setItem('theme', theme)
  
	// If user does not have a stored theme, match their OS preference for light/dark mode
	const getPreferredTheme = () => {
		const storedTheme = getStoredTheme()
		if (storedTheme) {
			return storedTheme
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}
  
	// Switch theme and icons to opposite
	const setTheme = theme => {
		if (theme === 'dark') {
		  document.documentElement.setAttribute('data-bs-theme', 'dark')
		  document.getElementById('theme-icon').classList.add('bi-sun-fill')
		  document.getElementById('theme-icon').classList.remove('bi-moon-fill')
		} else {
		  document.documentElement.setAttribute('data-bs-theme', 'light')
		  document.getElementById('theme-icon').classList.add('bi-moon-fill')
		  document.getElementById('theme-icon').classList.remove('bi-sun-fill')
		}
	}
  
	// Main function for the button, basically a pipeline for the theme change
    const switchMode = () => {
		const currentTheme = getStoredTheme() || getPreferredTheme()
		const newTheme = currentTheme === 'light' ? 'dark' : 'light'
		setStoredTheme(newTheme)
		setTheme(newTheme)
	  }

  	setTheme(getPreferredTheme());

	window.switchMode = switchMode;
})();

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
	
	// Show progress bar, start spinners
	document.querySelector(".progress.w-100.my-3").style.display = "";
	displayButtonSpinners();

	// gonna make the pipeline work for just one document for now
	// make it work for multiple later
	

  let promises = [];
  for (let i = 0; i < uploadedFiles.length; i++) {
    let promise = pipeline(uploadedFiles[i]).then(function(jsonData) {
      finishedFiles.push(uploadedFiles[i].name);
      displayButtonSpinners();
      updateProgressBar();
      return jsonData; 
    });
    promises.push(promise);
  }
  let jsonDataArr = await Promise.all(promises);
	
	console.log("spreadsheet handler was called");
	let table = await spreadsheetHandler(jsonDataArr);
	console.log("spreadsheet handler returned:", table);

	document.getElementById("downloaddata").disabled = false;
	document.getElementById("downloaddata").addEventListener("click", function(){
			table.download("xlsx", "data.xlsx", {sheetName:"My Data"});
	});

	document.querySelector("#thisisjustblankspace").remove();
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