const form = document.getElementById("costForm");
const results = document.getElementById("results");
const budgetResult = document.getElementById("budgetResult");
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function amount(id) {
  return Number(document.getElementById(id).value) || 0;
}

function showAmount(id, value) {
  document.getElementById(id).textContent = currency.format(value);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const years = amount("years");
  const tuition = amount("tuition") * years;
  const living = (amount("housing") + amount("living")) * 12 * years;
  const travel = amount("travel") * years;
  const oneTime = amount("oneTime");
  const gross = tuition + living + travel + oneTime;
  const aid = Math.min(amount("aid") * years, gross);
  const net = gross - aid;

  showAmount("tuitionTotal", tuition);
  showAmount("livingTotal", living);
  showAmount("travelTotal", travel);
  showAmount("oneTimeTotal", oneTime);
  showAmount("aidTotal", -aid);
  showAmount("grossTotal", gross);
  showAmount("netTotal", net);
  document.getElementById("durationSummary").textContent = `Across ${years} ${years === 1 ? "year" : "years"}`;

  const budgetInput = document.getElementById("budget");
  if (budgetInput.value !== "") {
    const difference = amount("budget") - net;
    budgetResult.dataset.state = difference >= 0 ? "within" : "over";
    budgetResult.textContent = difference >= 0
      ? `Your entered budget is ${currency.format(difference)} above this estimate.`
      : `This estimate is ${currency.format(Math.abs(difference))} above your entered budget.`;
    budgetResult.hidden = false;
  } else {
    budgetResult.hidden = true;
  }

  results.hidden = false;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("resetButton").addEventListener("click", () => {
  results.hidden = true;
  document.getElementById("tuition").focus();
});