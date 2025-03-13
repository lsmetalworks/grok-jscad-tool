const { primitives, transforms, booleans } = window.jscadModeling;
const { render, update } = window.jscadWeb;
const { deserialize } = window.jscadDxfDeserializer;

const viewerOptions = {
  target: document.getElementById('viewer'),
  width: 800,
  height: 400,
};

let viewer = null;
let dxfGeometry = null;

// Handle DXF upload
document.getElementById('dxfInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dxfData = e.target.result;
      dxfGeometry = deserialize({ output: 'geometry' }, dxfData);
      updateDesign();
    };
    reader.readAsText(file);
  }
});

// Load sample DXF with error handling
window.loadSampleDXF = function () {
  fetch('./dxfs/sample.dxf')
    .then(response => {
      if (!response.ok) throw new Error('Sample DXF not found');
      return response.text();
    })
    .then(dxfData => {
      dxfGeometry = deserialize({ output: 'geometry' }, dxfData);
      updateDesign();
    })
    .catch(error => {
      alert('Failed to load sample DXF. Please check the file or upload your own.');
      console.error(error);
    });
};

// Parametric design function with two holes
function design(params = {}) {
  let { size = 10, height = 5, holeRadius1 = 2, holeX1 = 0, holeY1 = 0, holeRadius2 = 1, holeX2 = 2, holeY2 = 2 } = params;

  // Validation: Limit hole radius to half the size and ensure minimum
  const maxRadius = size / 2;
  holeRadius1 = Math.min(Math.max(holeRadius1, 0.1), maxRadius);
  holeRadius2 = Math.min(Math.max(holeRadius2, 0.1), maxRadius);

  // Validation: Limit hole positions to within cube bounds
  const maxPos = size / 2;
  holeX1 = Math.min(Math.max(holeX1, -maxPos), maxPos);
  holeY1 = Math.min(Math.max(holeY1, -maxPos), maxPos);
  holeX2 = Math.min(Math.max(holeX2, -maxPos), maxPos);
  holeY2 = Math.min(Math.max(holeY2, -maxPos), maxPos);

  // Create the base cube
  const cube = primitives.cube({ size });

  // Create cylinders for the holes
  const hole1 = primitives.cylinder({ radius: holeRadius1, height: height + 1 });
  const hole2 = primitives.cylinder({ radius: holeRadius2, height: height + 1 });

  // Position the holes
  const positionedHole1 = transforms.translate([holeX1, holeY1, 0], hole1);
  const positionedHole2 = transforms.translate([holeX2, holeY2, 0], hole2);

  // Subtract both holes from the cube
  let result = booleans.subtract(cube, positionedHole1);
  result = booleans.subtract(result, positionedHole2);

  // Center the result
  return transforms.translate([0, 0, height / 2], result);
}

// Update the viewer and provide feedback
window.updateDesign = function () {
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

  if (viewer) {
    viewer.update({ solids });
  } else {
    viewer = render(viewerOptions, solids);
  }

  // Provide UI feedback
  const feedback = `
    Size: ${size.toFixed(1)}, Height: ${height.toFixed(1)}<br>
    Hole 1 - Radius: ${holeRadius1.toFixed(1)}, X: ${holeX1.toFixed(1)}, Y: ${holeY1.toFixed(1)}<br>
    Hole 2 - Radius: ${holeRadius2.toFixed(1)}, X: ${holeX2.toFixed(1)}, Y: ${holeY2.toFixed(1)}
  `;
  document.getElementById('feedback').innerHTML = feedback;
};

// Initial render
updateDesign();
