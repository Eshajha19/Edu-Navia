import Papa from "papaparse";
import datasetUrl from "../dev/admission_prediction_full_dataset.csv?url";

const examFilter = document.getElementById("examFilter");
const courseFilter = document.getElementById("courseFilter");
const universityFilter = document.getElementById("universityFilter");
const trendChart = document.getElementById("trendChart");
const recordCount = document.getElementById("recordCount");
const dataError = document.getElementById("dataError");
let records = [];

function setOptions(select, values, label) {
  const selectedValue = select.value;
  select.replaceChildren(new Option(`All ${label}`, "all"));
  [...new Set(values.filter(value => typeof value === "string" && value.trim()))]
    .sort((a, b) => a.localeCompare(b))
    .forEach(value => select.add(new Option(value, value)));
  select.value = [...select.options].some(option => option.value === selectedValue) ? selectedValue : "all";
}

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function renderTrends() {
  const filtered = records.filter(record =>
    (examFilter.value === "all" || record.entrance_exam === examFilter.value) &&
    (courseFilter.value === "all" || record.course === courseFilter.value) &&
    (universityFilter.value === "all" || record.university === universityFilter.value)
  );
  const byYear = new Map();
  filtered.forEach(record => {
    const year = String(record.year);
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(record);
  });

  const summaries = [...byYear.entries()].map(([year, yearRecords]) => ({
    year,
    medianClosingRank: median(yearRecords.map(record => Number(record.closing_rank))),
    count: yearRecords.length
  })).filter(item => item.medianClosingRank !== null).sort((a, b) => a.year.localeCompare(b.year));

  recordCount.textContent = `${filtered.length.toLocaleString("en-IN")} sample records`;
  trendChart.replaceChildren();
  const max = Math.max(...summaries.map(item => item.medianClosingRank), 1);
  summaries.forEach(summary => {
    const row = document.createElement("div");
    row.className = "chart-row";
    const year = document.createElement("span");
    year.className = "chart-year";
    year.textContent = summary.year;
    const track = document.createElement("div");
    track.className = "bar-track";
    const bar = document.createElement("div");
    bar.className = "bar-fill";
    bar.style.width = `${Math.max(2, summary.medianClosingRank / max * 100)}%`;
    bar.title = `Median closing rank from ${summary.count} generated sample records`;
    track.append(bar);
    const value = document.createElement("span");
    value.className = "chart-value";
    value.textContent = `${Math.round(summary.medianClosingRank).toLocaleString("en-IN")} median`;
    row.append(year, track, value);
    trendChart.append(row);
  });
  if (!summaries.length) {
    const empty = document.createElement("p");
    empty.className = "chart-footnote";
    empty.textContent = "No sample records match these filters.";
    trendChart.append(empty);
  }
}

async function loadRecords() {
  try {
    const response = await fetch(datasetUrl);
    if (!response.ok) throw new Error(`Dataset request failed: ${response.status}`);
    const csv = await response.text();
    const result = Papa.parse(csv, { header: true, dynamicTyping: true, skipEmptyLines: true });
    if (result.errors.length) console.warn("Some sample admission rows could not be parsed", result.errors.slice(0, 3));
    records = result.data.filter(record => record.year && record.entrance_exam && record.course && record.university && Number.isFinite(Number(record.closing_rank)));
    setOptions(examFilter, records.map(record => record.entrance_exam), "exams");
    setOptions(courseFilter, records.map(record => record.course), "courses");
    setOptions(universityFilter, records.map(record => record.university), "universities");
    renderTrends();
  } catch (error) {
    console.error("Could not load sample admission data", error);
    recordCount.textContent = "Sample records unavailable";
    dataError.hidden = false;
  }
}

[examFilter, courseFilter, universityFilter].forEach(select => select.addEventListener("change", renderTrends));
document.getElementById("eligibilityForm").addEventListener("submit", event => {
  event.preventDefault();
  const marks = Number(document.getElementById("studentMarks").value);
  const minimum = Number(document.getElementById("minimumMarks").value);
  const required = document.getElementById("requiredSubjects").value.split(",").map(value => value.trim()).filter(Boolean);
  const studentSubjects = new Set(document.getElementById("studentSubjects").value.split(",").map(value => value.trim().toLocaleLowerCase()).filter(Boolean));
  const missingSubjects = required.filter(subject => !studentSubjects.has(subject.toLocaleLowerCase()));
  const marksMet = marks >= minimum;
  const eligible = marksMet && missingSubjects.length === 0;
  const result = document.getElementById("eligibilityResult");
  result.dataset.state = eligible ? "met" : "check";
  result.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = eligible ? "Entered requirements met" : "One or more requirements not met";
  result.append(title);
  const details = [];
  details.push(marksMet ? `Your aggregate (${marks}%) meets the entered minimum (${minimum}%).` : `Your aggregate (${marks}%) is below the entered minimum (${minimum}%).`);
  if (required.length) details.push(missingSubjects.length ? `Missing listed subjects: ${missingSubjects.join(", ")}.` : "All listed required subjects are present.");
  else details.push("No subject requirements were entered.");
  result.append(document.createTextNode(`${details.join(" ")} This checks only the details entered here.`));
  result.hidden = false;
});

loadRecords();