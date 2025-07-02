document.getElementById('downloadPDF').addEventListener('click', () => {
  const output = document.getElementById('comparison-output');

  if (!output || output.innerHTML.trim() === '') {
    alert("No comparison result to download.");
    return;
  }

  // Grab content inside the `.card` (you can change to `.results` if needed)
  const card = output.querySelector('.card');
  if (!card) {
    alert("No comparison data found.");
    return;
  }

  // Create clean container (just for PDF export)
  const cleanDiv = document.createElement('div');
  cleanDiv.style.padding = '30px';
  cleanDiv.style.fontFamily = 'Arial, sans-serif';
  cleanDiv.style.fontSize = '15px';
  cleanDiv.style.color = '#333';
  cleanDiv.style.maxWidth = '700px';
  cleanDiv.innerHTML = `
    <h2 style="text-align:center; margin-bottom:20px;">University Comparison Report</h2>
    ${card.innerHTML}
  `;

  // Add it offscreen for PDF rendering
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.appendChild(cleanDiv);
  document.body.appendChild(container);

  const opt = {
    margin: 0.5,
    filename: 'university_comparison.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().from(cleanDiv).set(opt).save().then(() => {
    document.body.removeChild(container); // Clean up
  });
});