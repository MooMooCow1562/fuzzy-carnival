//fuzzyscript.js
let inputColor;
let paletteColors;
let bestMatch = [0, 0, 0];
let dominance = [1, 1, 1];
let bestMatchScore = 999;

//dominance weights
const singleDom = 0.9;
const dualDom = 0.95;
const leastSingleDom = 1.1;
const leastDualDom = 1.05;

//convert hex to rgb array
function hexToRGB(input) {
    let r = parseInt(input.slice(1, 3), 16);
    let g = parseInt(input.slice(3, 5), 16);
    let b = parseInt(input.slice(5, 7), 16);
    return [r, g, b];
}
//for those smallest values below 16 that need a leading zero
function addLeadingZero(num) {
    if (num.length < 2) {
        return '0' + num;
    }
    return num;
}
//egregious, but functional.
function findDominantColor() {
    if (inputColor[0] > inputColor[1] && inputColor[0] > inputColor[2]) {
        dominance[0] = singleDom;
        findLeastDominantColor();
    } else if (inputColor[1] > inputColor[0] && inputColor[1] > inputColor[2]) {
        dominance[1] = singleDom;
        findLeastDominantColor();
    } else if (inputColor[2] > inputColor[0] && inputColor[2] > inputColor[1]) {
        dominance[2] = singleDom;
        findLeastDominantColor();
    } else if (inputColor[0] === inputColor[1] && inputColor[0] > inputColor[2]) {
        dominance = [dualDom, dualDom, leastDualDom];
    } else if (inputColor[0] === inputColor[2] && inputColor[0] > inputColor[1]) {
        dominance = [dualDom, dualDom, leastDualDom];
    } else if (inputColor[1] === inputColor[2] && inputColor[1] > inputColor[0]) {
        dominance = [dualDom, dualDom, leastDualDom];
    }
}
//less egregious, but still functional.
function findLeastDominantColor() {
    if (inputColor[0] < inputColor[1] && inputColor[0] < inputColor[2]) {
        dominance[0] = leastSingleDom;
    } else if (inputColor[1] < inputColor[0] && inputColor[1] < inputColor[2]) {
        dominance[1] = leastSingleDom;
    } else if (inputColor[2] < inputColor[0] && inputColor[2] < inputColor[1]) {
        dominance[2] = leastSingleDom;
    }
}
//update the output color box
function updateClosestColor() {
    document.getElementById("outputcolor").style.backgroundColor = `rgb(${bestMatch[0]}, ${bestMatch[1]}, ${bestMatch[2]})`;
    document.getElementById("outputcolor").innerText = `#${addLeadingZero(bestMatch[0].toString(16))}${addLeadingZero(bestMatch[1].toString(16))}${addLeadingZero(bestMatch[2].toString(16))}`;
}
//main function to process colors
function processColors() {
    inputColor = hexToRGB(document.getElementById("inputcolor").value);
    console.log("Input Color: ", inputColor);
    paletteColors = [hexToRGB(document.getElementById("color1").value),
    hexToRGB(document.getElementById("color2").value),
    hexToRGB(document.getElementById("color3").value),
    hexToRGB(document.getElementById("color4").value),
    hexToRGB(document.getElementById("color5").value)];
    console.log("Palette Colors: ", paletteColors);
    findDominantColor();
    console.log("Dominance: ", dominance);
    for (let i = 0; i < paletteColors.length; i++) {
        let score = Math.abs((inputColor[0] - paletteColors[i][0]) * dominance[0]) +
            Math.abs((inputColor[1] - paletteColors[i][1]) * dominance[1]) +
            Math.abs((inputColor[2] - paletteColors[i][2]) * dominance[2]);
        console.log(`Score for color ${i + 1}: `, score);
        if (i === 0 || score < bestMatchScore) {
            bestMatch = paletteColors[i];
            bestMatchScore = score;
        }
    }
    updateClosestColor();
}