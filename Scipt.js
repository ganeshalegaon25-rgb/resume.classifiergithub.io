async function analyzePDF() {
    const fileInput = document.getElementById("pdfFile");

    if (!fileInput.files.length) {
        alert("Please upload a PDF first");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {

            let text = "";
            let promises = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(
                    pdf.getPage(i).then(function (page) {
                        return page.getTextContent().then(function (content) {
                            content.items.forEach(item => {
                                text += item.str + " ";
                            });
                        });
                    })
                );
            }

            Promise.all(promises).then(function () {
                classifyResume(text.toLowerCase());
            });

        }).catch(function(error){
            document.getElementById("result").innerHTML = "Error reading PDF";
            console.error(error);
        });
    };

    reader.readAsArrayBuffer(file);
}

function classifyResume(text) {
    let role = "Unknown";
    let score = "Average";

    if (text.includes("marketing") || text.includes("sales")) {
        role = "Marketing";
    } else if (text.includes("finance") || text.includes("account")) {
        role = "Finance";
    } else if (text.includes("hr") || text.includes("recruitment")) {
        role = "HR";
    } else if (text.includes("python") || text.includes("java") || text.includes("coding")) {
        role = "IT";
    }

    if (text.length > 1000) {
        score = "Good";
    } else if (text.length < 300) {
        score = "Poor";
    }

    document.getElementById("result").innerHTML =
        "Predicted Role: " + role + "<br>Resume Score: " + score;
}
