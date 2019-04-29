let picture;

function setup() {
  createCanvas(1,1);
  uploadContainer = createDiv('');
  controlsContainer = createDiv('');
  fileInput = createFileInput(loadFile);

  compareDropDown = createSelect();
  compareDropDown.option('brightness');
  compareDropDown.option('hue');
  compareDropDown.option('saturation');

  verticalInput = createCheckbox("vertical", false);
  invertedInput = createCheckbox("invert", false);
  thresholdLabel = createP("Threshold:");
  thresholdInput = createSlider(0, 100, 25);
  thresholdValue = createP(thresholdInput.value());
  processButton = createButton('process');

  uploadContainer.child(fileInput);
  controlsContainer.child(compareDropDown);
  controlsContainer.child(verticalInput);
  controlsContainer.child(invertedInput);
  controlsContainer.child(thresholdLabel);
  controlsContainer.child(thresholdInput);
  controlsContainer.child(thresholdValue);
  controlsContainer.child(processButton);
}

function draw() {
  thresholdValue.html(thresholdInput.value());
}

function loadFile(file) {
  if (file.type === 'image') {
    picture = new Picture(file.data);

    processButton.mousePressed(function() {
      picture.compareProperty = compareDropDown.value();
      picture.threshold = thresholdInput.value();
      picture.inverted = invertedInput.checked();
      picture.vertical = verticalInput.checked();
      picture.sortPixels();
    });
  }
}