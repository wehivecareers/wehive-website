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
            console.log("Counter Data:", rows);
            
            // Trigger animations using the fetched data from the sheet
            rows.slice(1).forEach((row,index)=>{

    if(!row.c[1] || !row.c[1].v) return;

    const value = row.c[1].v.toString();

    if(index === 0){
        animateCounter("graduates-count", value);
    }

    if(index === 1){
        animateCounter("partners-count", value);
    }

    if(index === 2){
        animateCounter("success-rate", value);
    }

});
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

// --- Phase 3: Dynamic Success Gallery (Placement Page) ---
document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("gallery-container");
    
    // Only run this script if we are on the placement page
    if (galleryContainer) {
        const sheetId = "19DepbetU09lkBzfUXZirUf8hwixpHUVCvg-Es-ppOOE";
        // Using the exact Gallery GID you provided
        const galleryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=129193964`;

        fetch(galleryUrl)
            .then(res => res.text())
            .then(text => {
                const data = JSON.parse(text.substr(47).slice(0, -2));
                const rows = data.table.rows;
                
                let cardsFound = false;
                galleryContainer.innerHTML = ""; // Clear loading text

                rows.forEach(row => {
                    // Check if row exists and has the 5 required columns
                    if (row && row.c && row.c[0] && row.c[1] && row.c[2] && row.c[3] && row.c[4]) {
                        const imgUrl = row.c[0].v;
                        const studentName = row.c[1].v;
                        const description = row.c[2].v;
                        const category = row.c[3].v;
                        const status = row.c[4].v;

                        // Only render if the client marked Status as "Active"
                        if (status.toString().toLowerCase() === "active") {
                            cardsFound = true;
                            const card = document.createElement("div");
                            card.className = "success-card";
                            card.setAttribute("data-category", category);
                            card.innerHTML = `
                                <div class="card-img-wrapper" onclick="openLightbox('${imgUrl}')">
                                    <img src="${imgUrl}" alt="${studentName}">
                                    <div class="hover-overlay">
                                        <span><i class="fas fa-search-plus"></i> View</span>
                                    </div>
                                </div>
                                <div class="card-info">
                                    <h4>${studentName}</h4>
                                    <p>${description}</p>
                                </div>
                            `;
                            galleryContainer.appendChild(card);
                        }
                    }
                });

                if (!cardsFound) {
                    galleryContainer.innerHTML = "<p style='text-align:center; width:100%; color:var(--text-light);'>Gallery images will appear here once added to the Google Sheet.</p>";
                }
            })
            .catch(err => {
                console.error("Error fetching gallery:", err);
                galleryContainer.innerHTML = "<p style='text-align:center; width:100%; color:red;'>Error loading gallery. Please check Google Sheet permissions.</p>";
            });
    }
});

// Logic for the Filter Buttons
function filterGallery(category, btnElement) {
    // 1. Highlight the clicked button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    // 2. Show/Hide the cards
    const cards = document.querySelectorAll('.success-card');
    cards.forEach(card => {
        if (category === 'All' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Logic for the Popup Lightbox
function openLightbox(imgSrc) {
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    modalImg.src = imgSrc;
    modal.style.display = 'flex';
}

function closeLightbox() {
    document.getElementById('lightbox-modal').style.display = 'none';
}

// --- Phase 4: Dynamic Testimonials Page (FINAL UPDATED WITH ZOOM) ---
document.addEventListener("DOMContentLoaded", async () => {
    const testimonialContainer = document.getElementById("testimonial-container");
    if (!testimonialContainer) return;

    const sheetId = "19DepbetU09lkBzfUXZirUf8hwixpHUVCvg-Es-ppOOE";
    const gid = "902671307";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

    try {
        const res = await fetch(url, { cache: "no-store" });
        const text = await res.text();
        const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!match) throw new Error("Could not parse Google Sheet");

        const data = JSON.parse(match[1]);
        const rows = data.table?.rows || [];

        testimonialContainer.innerHTML = ""; 

        let activeFound = false;
        rows.forEach((row, index) => {
            if (index === 0) return; // Skip header

            const c = row.c || [];
            const photoUrl = c[0]?.v || "";
            const studentName = c[1]?.v || "Student";
            const companyName = c[2]?.v || "";
            const reviewText = c[3]?.v || "";
            const status = String(c[4]?.v || "").toLowerCase().trim();

            if (status === "active") {
                activeFound = true;
                const card = document.createElement("div");
card.className = "swiper-slide";

card.innerHTML = `
<div class="testi-card">
   ...
</div>
`;
                card.innerHTML = `
                    <i class="fa-solid fa-quote-right quote-icon"></i>
                    <p class="testi-text">"${reviewText}"</p>
                    <div class="testi-profile">
                        <img src="${photoUrl}" alt="${studentName}" onclick="openLightbox('${photoUrl}')" style="cursor: zoom-in;">
                        <div class="testi-info">
                            <h4>${studentName}</h4>
                            <p>${companyName}</p>
                        </div>
                    </div>
                `;
                testimonialContainer.appendChild(card);
            }
        });

        if (!activeFound) {
            testimonialContainer.innerHTML = "<p>No active testimonials found.</p>";
        }
    } catch (err) {
        console.error("DEBUG ERROR:", err);
        testimonialContainer.innerHTML = `<p style='color:red;'>Error: ${err.message}</p>`;
    }
});

// ADD THESE TWO FUNCTIONS AT THE VERY BOTTOM OF app.js IF YOU DON'T HAVE THEM
function openLightbox(imgSrc) {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
        document.getElementById('lightbox-img').src = imgSrc;
        modal.style.display = 'flex';
    }
}
function closeLightbox() {
    document.getElementById('lightbox-modal').style.display = 'none';
}
