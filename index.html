const { primitives, transforms, booleans } = window.jscadModeling;
const { render, update } = window.jscadWeb;
const { deserialize } = window.jscadDxfDeserializer;

console.log('Script loaded'); // Check if script runs at all

const viewerOptions = {
  target: document.getElementById('viewer'),
  width: 800,
  height: 400,
};

let viewer = null;
let dxfGeometry = null;

// Handle DXF upload
document.getElementById('dxfInput').addEventListener('change', (event) => {
  console.log('File input changed');
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('File read:', e.target.result.slice(0, 50)); // Log first 50 chars
      dxfGeometry = deserialize({ output: 'geometry' }, e.target.result);
      updateDesign();
    };
    reader.readAsText(file);
  }
});

// Load sample DXF with error handling
window.loadSampleDXF = function () {
  console.log('Loading sample DXF');
  fetch('./dxfs/sample.dxf')
    .then(response => {
      if (!response.ok) throw new Error('Sample DXF not found');
      return response.text();
    })
    .then(dxfData => {
      console.log('Sample DXF loaded:', dxfData.slice(0, 50));
      dxfGeometry = deserialize({ output: 'geometry' }, dxfData);
      updateDesign();
    })
    .catch(error => {
      alert('Failed to load sample DXF. Please check the file or upload your own.');
      console.error('Load error:', error);
    });
};

// Parametric design function with two holes
function design(params = {}) {
  console.log('Designing with params:', params);
  let { size = 10, height = 5, holeRadius1 = 2, holeX1 = 0, holeY1 = 0, holeRadius2 = 1, holeX2 = 2, holeY2 = 2 } = params;

  const maxRadius = size / 2;
  holeRadius1 = Math.min(Math.max(holeRadius1, 0.1), maxRadius);
  holeRadius2 = Math.min(Math.max(holeRadius2, 0.1), maxRadius);

  const maxPos = size / 2;
  holeX1 = Math.min(Math.max(holeX1, -maxPos), maxPos);
  holeY1 = Math.min(Math.max(holeY1, -maxPos), maxPos);
  holeX2 = Math.min(Math.max(holeX2, -maxPos), maxPos);
  holeY2 = Math.min(Math.max(holeY2, -maxPos), maxPos);

  const cube = primitives.cube({ size });
  const hole1 = primitives.cylinder({ radius: holeRadius1, height: height + 1 });
  const hole2 = primitives.cylinder({ radius: holeRadius2, height: height + 1 });

  const positionedHole1 = transforms.translate([holeX1, holeY1, 0], hole1);
  const positionedHole2 = transforms.translate([holeX2, holeY2, 0], hole2);

  let result = booleans.subtract(cube, positionedHole1);
  result = booleans.subtract(result, positionedHole2);

  return transforms.translate([0, 0, height / 2], result);
}

// Update the viewer and provide feedback
window.updateDesign = function () {
  console.log('Updating design');
  const size = parseFloat(document.getElementById('size').value);
  const height = parseFloat(document.getElementById('height').value);
  const holeRadius1 = parseFloat(document.getElementById('holeRadius1').value);
  const holeX1 = parseFloat(document.getElementById('holeX1').value);
  const holeY1 = parseFloat(document.getElementById('holeY1').value);
  const holeRadius2 = parseFloat(document.getElementById('holeRadius2').value);
  const holeX2 = parseFloat(document.getElementById('holeX2').value);
  const holeY2 = parseFloat(document.getElementById('holeY2').value);
  const params = { size, height, holeRadius1, holeX1, holeY1, holeRadius2, holeX2, holeY2 };

  const solids = [design(params)];
  if (dxfGeometry) solids.push(dxfGeometry);

  console.log('Solids prepared:', solids.length);
  if (viewer) {
    viewer.update({ solids });
    console.log('Viewer updated');
  } else {
    viewer = render(viewerOptions, solids);
    console.log('Viewer rendered');
  }

  const feedback = `
    Size: ${size.toFixed(1)}, Height: ${height.toFixed(1)}<br>
    Hole 1 - Radius: ${holeRadius1.toFixed(1)}, X: ${holeX1.toFixed(1)}, Y: ${holeY1.toFixed(1)}<br>
    Hole 2 - Radius: ${holeRadius2.toFixed(1)}, X: ${holeX2.toFixed(1)}, Y: ${holeY2.toFixed(1)}
  `;
  document.getElementById('feedback').innerHTML = feedback;
};

// Initial render
console.log('Initial render');
updateDesign();
