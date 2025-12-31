let extractedText = "";

/* ================================
   PDF UPLOAD & TEXT EXTRACTION
================================ */
document.getElementById("fileInput").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    extractedText = "";
    document.getElementById("paperText").value = "📄 Reading PDF... Please wait";

    const reader = new FileReader();

    reader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            textContent.items.forEach(item => {
                extractedText += item.str + " ";
            });
        }

        document.getElementById("paperText").value = extractedText;
    };

    reader.readAsArrayBuffer(file);
});

/* ================================
   MAIN SUMMARY FUNCTION
================================ */
function generateSummary() {
    const text = document.getElementById("paperText").value.trim();
    const summaryType = document.getElementById("summaryType").value;

    if (!text) {
        alert("Please upload a PDF or paste research paper text.");
        return;
    }

    document.getElementById("loading").classList.remove("hidden");
    document.querySelector(".output").classList.add("hidden");

    /* =====================================
       AI API PLACEHOLDER (Frontend Demo)
       Replace with OpenAI / Gemini backend
    ====================================== */
    setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
        document.querySelector(".output").classList.remove("hidden");

        // SUMMARY OUTPUT
        let summaryText = "";
        if (summaryType === "short") {
            summaryText =
                "This research paper presents a concise overview of the research objective, methodology, and key findings.";
        } else if (summaryType === "detailed") {
            summaryText =
                "This paper provides a detailed explanation of the research background, problem formulation, methodology, experiments, result analysis, and future research directions.";
        } else {
            summaryText =
                "• Research problem identified\n• Proposed approach explained\n• Experimental evaluation performed\n• Conclusions and limitations discussed";
        }

        document.getElementById("summaryResult").innerText = summaryText;

        // KEYWORDS
        displayKeywords(extractKeywords(text));

        // CITATIONS
        displayCitations(extractCitations(text));

    }, 2000);
}

/* ================================
   KEYWORD EXTRACTION
================================ */
function extractKeywords(text) {
    const stopWords = [
        "the","is","and","are","was","were","of","to","in","for","with",
        "this","that","from","by","on","as","an","be","at","or"
    ];

    const words = text
        .toLowerCase()
        .match(/\b[a-z]{5,}\b/g) || [];

    const filtered = words.filter(word => !stopWords.includes(word));

    return [...new Set(filtered)].slice(0, 12);
}

function displayKeywords(keywords) {
    const keywordDiv = document.getElementById("keywords");
    keywordDiv.innerHTML = "";

    keywords.forEach(word => {
        const span = document.createElement("span");
        span.innerText = word;
        keywordDiv.appendChild(span);
    });
}

/* ================================
   CITATION EXTRACTION
================================ */
function extractCitations(text) {
    const citations = text.match(/\[(\d+)\]|\(\d{4}\)/g);
    return citations ? [...new Set(citations)] : [];
}

function displayCitations(citations) {
    const citationList = document.getElementById("citations");
    citationList.innerHTML = "";

    if (citations.length === 0) {
        const li = document.createElement("li");
        li.innerText = "No citations detected";
        citationList.appendChild(li);
        return;
    }

    citations.forEach(cite => {
        const li = document.createElement("li");
        li.innerText = cite;
        citationList.appendChild(li);
    });
}
