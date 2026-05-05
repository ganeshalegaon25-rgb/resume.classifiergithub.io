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

        }).catch(function (error) {
            document.getElementById("result").innerHTML = "Error reading PDF";
            console.error(error);
        });
    };

    reader.readAsArrayBuffer(file);
}

function classifyResume(text) {
    let role = "Unknown";
    let score = 50; // base score

    // Role detection
    if (text.includes("marketing") || text.includes("sales")) {
        role = "Marketing";
        score += 20;
    } else if (text.includes("finance") || text.includes("account")) {
        role = "Finance";
        score += 20;
    } else if (text.includes("hr") || text.includes("recruitment")) {
        role = "HR";
        score += 20;
    } else if (text.includes("python") || text.includes("java") || text.includes("coding")) {
        role = "IT";
        score += 20;
    }

    // Length scoring
    if (text.length > 1500) {
        score += 20;
    } else if (text.length > 800) {
        score += 10;
    } else {
        score -= 10;
    }

    // Bonus skills
    if (text.includes("communication")) score += 5;
    if (text.includes("management")) score += 5;
    if (text.includes("analysis")) score += 5;

    // Limit score (1–100)
    if (score > 100) score = 100;
    if (score < 1) score = 1;

    // Display result
    document.getElementById("result").innerHTML =
        "Predicted Role: " + role + "<br>Resume Score: " + score + "/100";
}
