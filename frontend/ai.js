document.getElementById("recommenderForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Convert numeric fields
    data.score_10th = parseInt(data.score_10th);
    data.score_12th = parseInt(data.score_12th);
    data.entrance_score = parseInt(data.entrance_score);
    data.budget_k_per_year = parseInt(data.budget_k_per_year);

    // Send to backend
    const response = await fetch("/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const result = await response.json();

    // Display results
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    for (const [target, recs] of Object.entries(result)) {
        resultsDiv.innerHTML += `<h3>${target.charAt(0).toUpperCase() + target.slice(1)}</h3>`;
        recs.forEach(r => {
            resultsDiv.innerHTML += `<p>${r[0]} (Probability: ${r[1].toFixed(3)})</p>`;
        });
    }
});
