function downloadPdf() {
    var input = document.getElementById('pdfInput');
    var file = input.files[0];

    if (file) {
        var a = document.createElement('a');
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = file.name;

        // Append the anchor to the body
        document.body.appendChild(a);

        // Trigger a click on the anchor
        a.click();

        // Remove the anchor from the body
        document.body.removeChild(a);

        // Release the object URL
        URL.revokeObjectURL(url);
    } else {
        alert('Please select a PDF file');
    }
}
