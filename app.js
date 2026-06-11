// Function to toggle the mobile hamburger menu
function toggleMenu() {
    document.getElementById("mobileMenu").classList.toggle("show");
}

// ... Keep your existing document.addEventListener code below this line!

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Phase 1: Running Numbers Animation Logic ---
    function animateCounter(id, targetStr) {
        const obj = document.getElementById(id);
        
        // Extract the pure number and the symbol (e.g., "500+" -> 500 and "+")
        const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''));
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

    // Mock Data from Google Sheets
    const mockCounterData = [
        { Metric: "Trained Graduates", Value: "500+" },
        { Metric: "Active Hiring Partners", Value: "150+" },
        { Metric: "Placement Success Rate", Value: "92%" }
    ];

    // Trigger the running numbers animation using the Google Sheet values
    animateCounter("graduates-count", mockCounterData[0].Value);
    animateCounter("partners-count", mockCounterData[1].Value);
    animateCounter("success-rate", mockCounterData[2].Value);


    // --- Phase 2: Dynamic Services Data ---
    const mockCourseData = [
        { CourseName: "Full-Stack Development", Description: "Master frontend and backend technologies to build complete web applications." },
        { CourseName: "Java Development", Description: "Learn core and advanced Java, Spring Boot, and enterprise application building." },
        { CourseName: "Python Development", Description: "Dive into Python for web development, scripting, and data manipulation." },
        { CourseName: "Software Testing", Description: "Comprehensive manual and automation testing using Selenium and modern tools." },
        { CourseName: "Database Management", Description: "Master SQL, database architecture, and data optimization techniques." },
        { CourseName: "Networking Fundamentals", Description: "Understand the core concepts of routing, switching, and IT infrastructure." }
    ];

    const servicesContainer = document.getElementById("services-container");
    servicesContainer.innerHTML = ""; 

    mockCourseData.forEach(course => {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
            <h3><i class="fa-solid fa-code" style="color: var(--accent-color); margin-right: 10px;"></i> ${course.CourseName}</h3>
            <p>${course.Description}</p>
        `;
        servicesContainer.appendChild(card);
    });
});
