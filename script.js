async function analyzePDF() {

    const fileInput = document.getElementById("pdfFile");

    if (!fileInput.files.length) {
        alert("Please upload a PDF resume");
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

        });

    };

    reader.readAsArrayBuffer(file);

}

function classifyResume(text) {

    let role = "Unknown";
    let score = 40;

    // Role Detection
    if (
        text.includes("marketing") ||
        text.includes("sales") ||
        text.includes("seo")
    ) {

        role = "Marketing";
        score += 25;

    }

    else if (
        text.includes("finance") ||
        text.includes("account") ||
        text.includes("banking")
    ) {

        role = "Finance";
        score += 25;

    }

    else if (
        text.includes("hr") ||
        text.includes("recruitment") ||
        text.includes("hiring")
    ) {

        role = "HR";
        score += 25;

    }

    else if (
        text.includes("python") ||
        text.includes("java") ||
        text.includes("coding") ||
        text.includes("developer")
    ) {

        role = "IT";
        score += 25;

    }

    // Resume Length Analysis
    if (text.length > 2000) {

        score += 25;

    }

    else if (text.length > 1000) {

        score += 15;

    }

    else {

        score += 5;

    }

    // Skills Bonus
    if (text.includes("communication")) score += 5;
    if (text.includes("leadership")) score += 5;
    if (text.includes("management")) score += 5;
    if (text.includes("analysis")) score += 5;
    if (text.includes("excel")) score += 5;

    // Limit Score
    if (score > 100) score = 100;

    // Result Display
    document.getElementById("result").innerHTML =
        "<h2>Predicted Role: " + role + "</h2>" +
        "<h2>Resume Score: " + score + "/100</h2>";

    // Progress Bar
    let scoreBar = document.getElementById("scoreBar");

    scoreBar.style.width = score + "%";

    scoreBar.innerHTML = score + "%";

}
