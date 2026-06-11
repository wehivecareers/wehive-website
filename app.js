document.addEventListener("DOMContentLoaded", () => {
    // Phase 1 Mock Data (Will be replaced by Google Sheets later)
    const mockCounterData = [
        { Metric: "Trained Graduates", Value: "500+" },
        { Metric: "Active Hiring Partners", Value: "150+" },
        { Metric: "Placement Success Rate", Value: "92%" }
    ];

    document.getElementById("graduates-count").innerText = mockCounterData[0].Value;
    document.getElementById("partners-count").innerText = mockCounterData[1].Value;
    document.getElementById("success-rate").innerText = mockCounterData[2].Value;

    const mockCourseData = [
        { CourseName: "Full-Stack Development", Description: "Master frontend and backend technologies to build complete web applications." },
        { CourseName: "Java Development", Description: "Learn core and advanced Java, Spring Boot, and enterprise application building." },
        { CourseName: "Python Development", Description: "Dive into Python for web development, scripting, and data manipulation." },
        { CourseName: "Software Testing", Description: "Comprehensive manual and automation testing using Selenium and modern tools." }
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
