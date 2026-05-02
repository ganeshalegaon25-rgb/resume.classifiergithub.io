function analyzeResume() {
    let text = document.getElementById("resume").value.toLowerCase();

    let role = "Unknown";
    let score = "Average";

    if (text.includes("marketing") || text.includes("sales")) {
        role = "Marketing";
    } else if (text.includes("finance") || text.includes("account")) {
        role = "Finance";
    } else if (text.includes("hr") || text.includes("recruitment")) {
        role = "HR";
    } else if (text.includes("python") || text.includes("coding")) {
        role = "IT";
    }

    if (text.length > 300) {
        score = "Good";
    } else if (text.length < 100) {
        score = "Poor";
    }

    document.getElementById("result").innerHTML =
        "Predicted Role: " + role + "<br>Resume Score: " + score;
}
