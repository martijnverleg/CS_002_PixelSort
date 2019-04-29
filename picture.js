function Picture(source) {
  this.source = source;

  this.image = loadImage(this.source, function(img) {
    this.canvas = createCanvas(img.width, img.height);
    image(img, 0, 0);
    loadPixels();
  });

  // settings
  this.compareProperty = brightness
  this.vertical = false;
  this.inverted = false;
  this.threshold = 0;

  // sorting functions
  this.sortPixels = function() {
    let compareOptions = this.getCompareOptions();

    if(!this.vertical) {
      this.getHorizontalRange(compareOptions);
    } else {
      this.getVerticalRange(compareOptions);
    }

    updatePixels();
    redraw();
  }

  this.getCompareOptions = function() {
    if(!this.inverted) {
      switch(this.compareProperty) {
        case "hue":
          return new compareOptions(this.regularHueCompare, hue);
        case "saturation":
          return new compareOptions(this.regularSaturationCompare, saturation);
        case "brightness":
           return new compareOptions(this.regularBrightnessCompare, brightness);
      }

      return new compareOptions(this.regularBrightnessCompare, brightness);
    } else {
      switch(this.compareProperty) {
        case "hue":
          return new compareOptions(this.invertedHueCompare, hue);
        case "saturation":
          return new compareOptions(this.invertedSaturationCompare, saturation);
        case "brightness":
           return new compareOptions(this.invertedBrightnessCompare, brightness);
      }

      return new compareOptions(this.invertedBrightnessCompare, brightness);
    }
  }

  this.getHorizontalRange = function(compareOptions) {
    for(let y = 0; y < this.image.height; y++) {
      let pixelRange = []
      let rangeIndex = 0;

      for(let x = 0; x < this.image.width; x++) {
        let c = this.getColor(x, y);

        if(compareOptions.property(c) >= this.threshold) {
          if(pixelRange.length < 1) {
            rangeIndex = x;
          }
          pixelRange.push(c);
        }

        if((pixelRange.length > 0 && compareOptions.property(c) < this.threshold) || rangeIndex + pixelRange.length >= this.image.width) {
          timsort.sort(pixelRange, compareOptions.function);
          this.setHorizontalRange(rangeIndex, y, pixelRange);
          pixelRange = [];
        }
      }
    }
  }

  this.setHorizontalRange = function(startX, startY, range) {
    for(let i = 0; i < range.length; i++) {
      set(startX + i, startY, range[i]);
    }
  }

  this.getVerticalRange = function(compareOptions) {
    for(let x = 0; x < this.image.width; x++) {
      let pixelRange = []
      let rangeIndex = 0;
      
      for(let y = 0; y < this.image.height; y++) {
        let c = this.getColor(x, y);
        
        if(compareOptions.property(c) >= this.threshold) {
          if(pixelRange.length === 0) {
            rangeIndex = y;
          }
          pixelRange.push(c);
        }

        if(pixelRange.length > 0 && compareOptions.property(c) < this.threshold || rangeIndex + pixelRange.length >= this.image.height) {
          timsort.sort(pixelRange, compareOptions.function);
          this.setVerticalRange(x, rangeIndex, pixelRange);
          pixelRange = [];
        }
      }
    }
  }

  this.setVerticalRange = function(startX, startY, range) {
    for(let i = 0; i < range.length; i++) {
      set(startX, startY + i, range[i]);
    }
  }

  // get color val from xy coordinates in pixel array
  this.getColor = function(x, y) {
    let colorIndex = (y * this.image.width + x) * 4;
    return color(pixels[colorIndex], pixels[colorIndex + 1], pixels[colorIndex + 2], pixels[colorIndex + 3]);
  }

  // compare functions
  this.regularHueCompare = function(a, b) {
    return hue(a) - hue(b);
  }

  this.regularSaturationCompare = function(a, b) {
    return saturation(a) - saturation(b);
  }

  this.regularBrightnessCompare = function(a, b) {
    return brightness(a) - brightness(b);
  }

  this.invertedHueCompare = function(a, b) {
    return hue(b) - hue(a);
  }

  this.invertedSaturationCompare = function(a, b) {
    return saturation(b) - saturation(a);
  }

  this.invertedBrightnessCompare = function(a, b) {
    return brightness(b) - brightness(a);
  }
}

function compareOptions(compareFunction, compareProperty) {
  this.function = compareFunction;
  this.property = compareProperty;
}