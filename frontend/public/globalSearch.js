document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return; // exit if element is missing

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (!query) return;

    const Colleges = Parse.Object.extend("Colleges");
    const parseQuery = new Parse.Query(Colleges);
    parseQuery.contains("name", query);
    parseQuery.limit(10);

    try {
      const results = await parseQuery.find();
      console.log("Search results:", results);
    } catch (err) {
      console.error("Search error:", err);
    }
  });
});
