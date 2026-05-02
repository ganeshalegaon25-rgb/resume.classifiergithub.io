async function analyzePDF() {
    const file = document.getElementById("pdfFile").files[0];

    if (!file) {
        alert("Please upload a PDF");
        return;
    }

    const reader = new FileReader();

    reader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();

            content.items.forEach(item => {
                text += item.str + " ";
            });
        }

        classifyResume(text.toLowerCase());
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
