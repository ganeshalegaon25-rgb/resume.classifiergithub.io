async function analyzePDF() {

    const fileInput = document.getElementById("pdfFile");

    if (!fileInput.files.length) {
        alert("Please upload a PDF resume");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("result").innerHTML = "";

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

    let foundSkills = [];
    let missingSkills = [];

    // Skill Keywords
    const skills = {
        Marketing: ["marketing", "sales", "seo", "advertising"],
        Finance: ["finance", "account", "banking", "excel"],
        HR: ["hr", "recruitment", "hiring", "communication"],
        IT: ["python", "java", "coding", "developer"]
    };

    // Role Detection
    for (const category in skills) {

        let matchCount = 0;

        skills[category].forEach(skill => {

            if (text.includes(skill)) {
                matchCount++;
                foundSkills.push(skill);
            } else {
                missingSkills.push(skill);
            }

        });

        if (matchCount >= 2) {
            role = category;
            score += matchCount * 10;
        }

    }

    // Resume Length Score
    if (text.length > 2000) {
        score += 20;
    } else if (text.length > 1000) {
        score += 10;
    }

    // Soft Skills Bonus
    if (text.includes("leadership")) score += 5;
    if (text.includes("management")) score += 5;
    if (text.includes("analysis")) score += 5;

    // Limit Score
    if (score > 100) score = 100;

    // Strength Level
    let level = "Average";

    if (score >= 80) {
        level = "Excellent";
    } else if (score >= 60) {
        level = "Good";
    } else {
        level = "Needs Improvement";
    }

    // Show Results
    document.getElementById("loading").style.display = "none";

    document.getElementById("result").innerHTML = `

        <h2>Analysis Result</h2>

        <p><strong>Predicted Role:</strong> ${role}</p>

        <p><strong>ATS Resume Score:</strong> ${score}/100</p>

        <div class="score-container">
            <div class="score-bar" id="scoreBar">${score}%</div>
        </div>

        <p><strong>Resume Strength:</strong> ${level}</p>

        <h3>Skills Found</h3>
        <ul>
            ${foundSkills.map(skill => `<li class="good">✔ ${skill}</li>`).join("")}
        </ul>

        <h3>Missing Skills</h3>
        <ul>
            ${missingSkills.slice(0,5).map(skill => `<li class="bad">✘ ${skill}</li>`).join("")}
        </ul>

    `;

    // Animate Score Bar
    setTimeout(() => {
        document.getElementById("scoreBar").style.width = score + "%";
    }, 100);

}
