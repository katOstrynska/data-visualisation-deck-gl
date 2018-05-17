const clamp = function(val, min, max) {
  return Math.min(Math.max(val, min), max);
};

// Converts from degrees to radians.
Math.deg2rad = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.rad2deg = function(radians) {
  return radians * 180 / Math.PI;
};

let panelButtonClass = "panel-button";
let panelButtonSelectedClass = "panel-button-selected";

let valuesToSelect = {
  temperature: "temp",
  humidity: "wilgotnosc_wzgledna",
  pm1: "PM1",
  pm2_5: "PM2.5",
  pm10: "PM10",
}

let currentSelectedValue = valuesToSelect.temperature;

let latitudeValueField = document.querySelector("#latitude-value");
let longitudeValueField = document.querySelector("#longitude-value");
let selectedValueLabel = document.querySelector("#selected-value-label");
let selectedValueField = document.querySelector("#selected-value");

let valueToLabel = {};
valueToLabel[valuesToSelect.temperature] = "Temperature";
valueToLabel[valuesToSelect.humidity] = "Humidity";
valueToLabel[valuesToSelect.pm1] = "PM1";
valueToLabel[valuesToSelect.pm2_5] = "PM2.5";
valueToLabel[valuesToSelect.pm10] = "PM10";

let valueToButton = {};
valueToButton[valuesToSelect.temperature] = document.querySelector("#temperature-button");
valueToButton[valuesToSelect.humidity] = document.querySelector("#humidity-button");
valueToButton[valuesToSelect.pm1] = document.querySelector("#pm1-button");
valueToButton[valuesToSelect.pm2_5] = document.querySelector("#pm2_5-button");
valueToButton[valuesToSelect.pm10] = document.querySelector("#pm10-button");


const OPTIONS = ['radius'];

let defaultOptions = {};

defaultOptions[valuesToSelect.temperature] = {
  colorRange: [ 
    [69,117,180],
    [145,191,219],
    [224,243,248],
    [254,224,144],
    [252,141,89],
    [215,48,39]
  ],
  range: {
		'min': 0,
		'max': 30
  },
  minMax: [9,21],
  minValue: 9,
  maxValue: 21,
  minHeight: 100,
  maxHeight: 260000 
}

defaultOptions[valuesToSelect.humidity] = {
  colorRange: [ 
    [69,117,180],
    [145,191,219],
    [224,243,248],
    [254,224,144],
    [252,141,89],
    [215,48,39]
  ],
  range: {
		'min': 0,
		'max': 100
  },
  minMax: [60,100],
  minValue: 60,
  maxValue: 100,
  minHeight: 100,
  maxHeight: 260000 
}

defaultOptions[valuesToSelect.pm1] = {
  colorRange: [ 
    [69,117,180],
    [145,191,219],
    [224,243,248],
    [254,224,144],
    [252,141,89],
    [215,48,39]
  ],
  range: {
		'min': 0,
		'max': 30
  },
  minMax: [0,24],
  minValue: 0,
  maxValue: 24,
  minHeight: 100,
  maxHeight: 260000 
}

defaultOptions[valuesToSelect.pm2_5] = {
  colorRange: [ 
    [69,117,180],
    [145,191,219],
    [224,243,248],
    [254,224,144],
    [252,141,89],
    [215,48,39]
  ],
  range: {
		'min': 0,
		'max': 50
  },
  minMax: [0,44],
  minValue: 0,
  maxValue: 44,
  minHeight: 100,
  maxHeight: 260000 
}

defaultOptions[valuesToSelect.pm10] = {
  colorRange: [ 
    [69,117,180],
    [145,191,219],
    [224,243,248],
    [254,224,144],
    [252,141,89],
    [215,48,39]
  ],
  range: {
		'min': 0,
		'max': 60
  },
  minMax: [0,52],
  minValue: 0,
  maxValue: 52,
  minHeight: 100,
  maxHeight: 260000 
}

let currentOptions = defaultOptions[valuesToSelect.temperature];

let data = [];

const colorRange = [ 
  [69,117,180],
  [145,191,219],
  [224,243,248],
  [254,224,144],
  [252,141,89],
  [215,48,39]
];

function getColorFromRange(range, ratio){
  let len = range.length;
  for (let i = 1; i <= len; i++) {
    if(ratio <= i/len){
      return range[i-1];
    }   
  }
  console.log(ratio);
}

const onHoverHandler = (info) => {
  let index = info.index;
  if(index > 0){
    console.log('Hovered:', data[index]);
    latitudeValueField.innerHTML = data[index].szerokosc_stopnie;
    longitudeValueField.innerHTML = data[index].dlugosc_stopnie;
    selectedValueField.innerHTML = data[index][currentSelectedValue];
  }
}

const changeSelectedValueFieldLabel = (selectedValue) => {
  latitudeValueField.innerHTML = "--.---"
  longitudeValueField.innerHTML = "--.---";
  selectedValueLabel.innerHTML = valueToLabel[selectedValue] + ":";
  selectedValueField.innerHTML = "-----";
}

const deselectCurrentButton = () => {
  valueToButton[currentSelectedValue].classList.remove(panelButtonSelectedClass);
  valueToButton[currentSelectedValue].classList.add(panelButtonClass);
}

const selectButton = (valueToSelect) => {
  valueToButton[valueToSelect].classList.remove(panelButtonClass);
  valueToButton[valueToSelect].classList.add(panelButtonSelectedClass);
}

const LIGHT_SETTINGS = {
  lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const MAPBOX_TOKEN = "pk.eyJ1Ijoia2F0b3N0ciIsImEiOiJjamZyNG9oaGkwYXI5MzJwZHdpdTRrOTd3In0.mx2I8zjc6KYOPc9zXt5xLg"; // eslint-disable-line

const deckgl = new deck.DeckGL({
    mapboxApiAccessToken: MAPBOX_TOKEN,
    mapStyle: 'https://free.tilehosting.com/styles/darkmatter/style.json?key=U0iNgiZKlYdwvgs9UPm1',
    longitude: 6,
    latitude: 57,
    zoom: 5.5,
    pitch: 40
});

const reloadMap = function(){  
  const options = {};
  
  OPTIONS.forEach(key => {
    const value = document.getElementById(key).value;
    document.getElementById(key + '-value').innerHTML = value;
    options[key] = value;
  });

  let tmpData = [];

  let tmpAverageMapCenterCartesian = [];

  data.forEach(element => {
    let long = element.dlugosc_stopnie;
    let lat = element.szerokosc_stopnie;

    let tmpCentroid = [long, lat];
    
    let valueClamped = clamp(element[currentSelectedValue], currentOptions.minMax[0], currentOptions.minMax[1]);
    let ratio = (valueClamped - currentOptions.minMax[0]) / (currentOptions.minMax[1] - currentOptions.minMax[0]);

    let tmpColor = getColorFromRange(currentOptions.colorRange, ratio);

    let tmpElevation = currentOptions.minHeight + (currentOptions.maxHeight - currentOptions.minHeight) * ratio;

    tmpData.push(
      {
        centroid : tmpCentroid,
        color : tmpColor,
        elevation : tmpElevation
      }
    );

  });

  let hexagonLayer = new deck.HexagonCellLayer({
    id: 'hexagon-cell-layer',
    data : tmpData,
    radius: 100,
    elevationScale: 1,
    angle: 0,
    pickable: true,
    onHover: onHoverHandler,
    ...options
  });

  deckgl.setProps({
    longitude: 5,
    latitude: 5,
    layers: [hexagonLayer]
  });
}

// sliders
let valueSlider = document.getElementById('value-slider');

let valueSliderMinMax = [
  document.getElementById('value-slider-value-min'),
  document.getElementById('value-slider-value-max')
]

noUiSlider.create(valueSlider, {
	start: [20, 80],
	connect: true,
	range: {
		'min': 0,
		'max': 200
	}
});

valueSliderMinMax[0].innerHTML = 20;
valueSliderMinMax[1].innerHTML = 80;

valueSlider.noUiSlider.on('slide', function( values, handle ) {
  valueSliderMinMax[handle].innerHTML = values[handle];
  defaultOptions[currentSelectedValue].minMax[handle] = values[handle];
  reloadMap();
  //console.log(valueSlider.noUiSlider.get());
});

const updateValueSlider = (selectedValue) => {
  valueSlider.noUiSlider.updateOptions(
    {
      start: [defaultOptions[selectedValue].minMax[0], defaultOptions[selectedValue].minMax[1]],
      range: {
        ...defaultOptions[selectedValue].range
      }
    }, // Object
    false // Boolean 'fireSetEvent'
  );

  valueSliderMinMax[0].innerHTML = defaultOptions[selectedValue].minMax[0];
  valueSliderMinMax[1].innerHTML = defaultOptions[selectedValue].minMax[1];
}

const onValueButtonClicked = (valueToSelect) => {
  console.log(valueToSelect);
  deselectCurrentButton();

  currentSelectedValue = valueToSelect;
  currentOptions = defaultOptions[currentSelectedValue];

  selectButton(currentSelectedValue);
  changeSelectedValueFieldLabel(currentSelectedValue);
  updateValueSlider(currentSelectedValue);

  reloadMap();
}

Object.keys(valueToButton).forEach(valueToSelect => {
  valueToButton[valueToSelect].onclick = () => {
    if(currentSelectedValue !== valueToSelect){
      onValueButtonClicked(valueToSelect);
    }
  }
});

onValueButtonClicked(currentSelectedValue);
// selectButton(currentSelectedValue);
// changeSelectedValueFieldLabel(currentSelectedValue);

OPTIONS.forEach(key => {
  document.getElementById(key).oninput = reloadMap;
});

d3.csv("https://raw.githubusercontent.com/katOstrynska/data-visualisation-deck-gl/master/data/wyniki_rejs.csv", function(error, downloadedData) {
  if (error) throw error;
  data = downloadedData;
  reloadMap();
});


