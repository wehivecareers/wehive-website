// Function to toggle the mobile hamburger menu
function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("show");
}

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Phase 1: Running Numbers Animation Logic ---
    function animateCounter(id, targetStr) {
        const obj = document.getElementById(id);
        if (!obj) return; // Failsafe if ID is missing

        // Extract the pure number and the symbol (e.g., "500+" -> 500 and "+")
        const targetNum = parseInt(targetStr.replace(/[^0-9]/g, '')) || 0;
        const suffix = targetStr.replace(/[0-9]/g, '');
        
        let startTimestamp = null;
        const duration = 2000; // Animation takes exactly 2 seconds

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // Calculate current number and update the HTML
            obj.innerText = Math.floor(progress * targetNum) + suffix;
            
            // If not finished, keep animating
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // Ensure it ends on the exact target number
                obj.innerText = targetNum + suffix;
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- Phase 2: Live Google Sheets Fetching ---
    // Your exact Google Sheet ID
    const sheetId = "19DepbetU09lkBzfUXZirUf8hwixpHUVCvg-Es-ppOOE";

    // 1. Fetch Counter Data (gid=0)
    const counterUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=0`;
    
    fetch(counterUrl)
        .then(res => res.text())
        .then(text => {
            // Strip Google's JSON wrapper to get the raw data
            const data = JSON.parse(text.substr(47).slice(0, -2));
            const rows = data.table.rows;

            // Trigger animations using the fetched data from the sheet
            if(rows[0] && rows[0].c[1]) animateCounter("graduates-count", rows[0].c[1].v.toString());
            if(rows[1] && rows[1].c[1]) animateCounter("partners-count", rows[1].c[1].v.toString());
            if(rows[2] && rows[2].c[1]) animateCounter("success-rate", rows[2].c[1].v.toString());
        })
        .catch(err => console.error("Error fetching counters:", err));


    // 2. Fetch Courses Data (gid=348837550)
    const coursesUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=348837550`;
    
    fetch(coursesUrl)
        .then(res => res.text())
        .then(text => {
            const data = JSON.parse(text.substr(47).slice(0, -2));
            const rows = data.table.rows;
            const servicesContainer = document.getElementById("services-container");
            
            if (!servicesContainer) return;
            servicesContainer.innerHTML = ""; // Clear existing placeholder text

            rows.forEach(row => {
                // Check if the row has data in all three columns (Name, Desc, Status)
                if (row.c[0] && row.c[1] && row.c[2]) {
                    const courseName = row.c[0].v;
                    const description = row.c[1].v;
                    const status = row.c[2].v;

                    // Only render if the client set Status to "Active"
                    if (status.toString().toLowerCase() === "active") {
                        const card = document.createElement("div");
                        card.className = "service-card";
                        card.innerHTML = `
                            <h3><i class="fa-solid fa-code" style="color: var(--accent-color); margin-right: 10px;"></i> ${courseName}</h3>
                            <p>${description}</p>
                        `;
                        servicesContainer.appendChild(card);
                    }
                }
            });
        })
        .catch(err => {
            console.error("Error fetching courses:", err);
            const container = document.getElementById("services-container");
            if (container) {
                container.innerHTML = "<p style='text-align:center; width:100%; color: red;'>Error loading courses. Please check Google Sheet permissions.</p>";
            }
        });
});
