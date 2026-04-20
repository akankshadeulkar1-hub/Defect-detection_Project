
let historyData = JSON.parse(localStorage.getItem("history")) || [];

const preview = document.getElementById("preview");

document.getElementById("fileInput").addEventListener("change", function () {
    preview.src = URL.createObjectURL(this.files[0]);
    preview.classList.remove("d-none");
    detectBtn.classList.remove("d-none");
});

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.querySelector(".main").classList.toggle("shift");
}

function startCamera() {
    document.getElementById("cameraBox").classList.remove("d-none");
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream);
}

function captureImage() {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    preview.src = canvas.toDataURL();
    preview.classList.remove("d-none");
    detectBtn.classList.remove("d-none");
}

function detectDefect() {
    loader.classList.remove("d-none");

    setTimeout(() => {
        loader.classList.add("d-none");

        let confidence = 92;

        document.getElementById("resultImage").src = preview.src;
        document.getElementById("defect").innerText = "Crack Detected";
        document.getElementById("confidence").innerText = confidence + "%";
        document.getElementById("progressBar").style.width = confidence + "%";

        dashboard.classList.remove("d-none");

        historyData.unshift({ img: preview.src, defect: "Crack", confidence });
        localStorage.setItem("history", JSON.stringify(historyData));

        loadHistory();
    }, 1500);
}

function loadHistory() {
    let list = document.getElementById("historyList");
    list.innerHTML = "";

    historyData.forEach(item => {
        let div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `<p>${item.defect} (${item.confidence}%)</p>`;
        div.onclick = () => showFromHistory(item);
        list.appendChild(div);
    });
}

function showFromHistory(item) {
    document.getElementById("resultImage").src = item.img;
    document.getElementById("defect").innerText = item.defect;
    document.getElementById("confidence").innerText = item.confidence + "%";
    document.getElementById("progressBar").style.width = item.confidence + "%";
    dashboard.classList.remove("d-none");
}

function clearHistory() {
    localStorage.clear();
    historyData = [];
    loadHistory();
}

loadHistory();

