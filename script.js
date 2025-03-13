const fileSelect = document.getElementById("fileSelect");
const loadDXFButton = document.getElementById("loadDXF");
const uploadDXFInput = document.getElementById("uploadDXF");

const scaleFactorInput = document.getElementById("scaleFactor");
const offsetXInput = document.getElementById("offsetX");
const offsetYInput = document.getElementById("offsetY");
const applyChangesButton = document.getElementById("applyChanges");

const holeSizeInput = document.getElementById("holeSize");
const holeXInput = document.getElementById("holeX");
const holeYInput = document.getElementById("holeY");
const applyHoleChangesButton = document.getElementById("applyHoleChanges");
const downloadDXFButton = document.getElementById("downloadDXF");

let currentDXFData = null;

// Function to fetch and load DXF file
async function loadDXFFile(filename) {
    const response = await fetch(`dxf/${filename}`);
    const dxfText = await response.text();
    currentDXFData = dxfText;
    renderDXF(dxfText);
}

// Function to render DXF using OpenJSCAD
function renderDXF(dxfData) {
    OpenJsCad.runJscadScript("viewer", `
        function main() {
            return '${dxfData}';
        }
    `);
}

// Load DXF from selection
loadDXFButton.addEventListener("click", () => {
    const selectedFile = fileSelect.value;
    loadDXFFile(selectedFile);
});

// Load DXF from upload
uploadDXFInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        currentDXFData = e.target.result;
        renderDXF(currentDXFData);
    };
    reader.readAsText(file);
});

// Apply Transformations (Scaling, Offset)
applyChangesButton.addEventListener("click", () => {
    if (!currentDXFData) return;

    const scaleFactor = parseFloat(scaleFactorInput.value);
    const offsetX = parseFloat(offsetXInput.value);
    const offsetY = parseFloat(offsetYInput.value);

    let modifiedDXF = currentDXFData.replace(
        /0\nLINE\n8\n0\n10\n(-?\d+\.?\d*)\n20\n(-?\d+\.?\d*)/g,
        (match, x, y) => {
            return `0\nLINE\n8\n0\n10\n${x * scaleFactor + offsetX}\n20\n${y * scaleFactor + offsetY}`;
        }
    );

    currentDXFData = modifiedDXF;
    renderDXF(modifiedDXF);
});

// Apply Hole Modifications
applyHoleChangesButton.addEventListener("click", () => {
    if (!currentDXFData) return;

    const newHoleSize = parseFloat(holeSizeInput.value);
    const newHoleX = parseFloat(holeXInput.value);
    const newHoleY = parseFloat(holeYInput.value);

    let modifiedDXF = currentDXFData.replace(
        /0\nCIRCLE\n8\n0\n10\n(-?\d+\.?\d*)\n20\n(-?\d+\.?\d*)\n40\n(-?\d+\.?\d*)/g,
        (match, x, y, r) => {
            return `0\nCIRCLE\n8\n0\n10\n${newHoleX}\n20\n${newHoleY}\n40\n${newHoleSize / 2}`;
        }
    );

    currentDXFData = modifiedDXF;
    renderDXF(modifiedDXF);
});

// Download Modified DXF
downloadDXFButton.addEventListener("click", () => {
    if (!currentDXFData) return;

    const blob = new Blob([currentDXFData], { type: "application/dxf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "modified_part.dxf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
