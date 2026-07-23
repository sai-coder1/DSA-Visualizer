//-----------------constants-----------------//

const linearColors = {
     DEFAULT: "#2563EB",
    COMPARE: "#EF4444",
    CHECKED: "#FACC15",
    FOUND: "#22C55E",
}

const binaryColors = {
    DEFAULT: "#2563EB",
    LOW: "#FACC15",
    MID: "#EF4444",
    HIGH: "#A855F7",
    DISCARDED: "#9CA3AF",
    FOUND: "#22C55E"
}

const algorithmInfo={
    linear: {
        name:"Linear Search",
        best: "O(1)",
        average: "O(n)",
        worst: "O(n)",
        works: "Sorted & Unsorted arrays",
        strategy:"Sequential Search",
        idea:"Check every element one by one."
    },

    binary: {
        name:"Binary Search",
        best: "O(1)",
        average: "O(logn)",
        worst: "O(logn)",
        works: "Array must be sorted",
        strategy:"Divide and Conquer",
        idea:"Repeatedly divide the search space into halves."
    }
}


const popupInfo = {
     linear: {
        title: "Linear Search",
        idea: "Sequentially checks each element until the target is found.",
        next: "Binary Search"
    },

    binary: {
        title: "Binary Search",
        idea: "Repeatedly divides the search space in half.",
        next: "🎉 You've completed all searching algorithms!"
    }
}

//-----------------------------------------//



//-----------DOM elements-----------------//


const container = document.querySelector(".container");

const size = document.getElementById("sizeVal");
const speed = document.getElementById("speedVal");

const speedSlider = document.getElementById("speed");
const sizeSlider = document.getElementById("size");
const targetInput = document.getElementById("target");


const sort = document.getElementById("start");
const generate = document.getElementById("generate");

const algorithm = document.getElementById("algo");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupIdea = document.getElementById("popupIdea");
const popupNext = document.getElementById("popupNext");
const closePopup = document.getElementById("closePopup");

const info = document.getElementById("algorithmInfo")

const pause = document.getElementById("pause");
const reset = document.getElementById("reset");

const comparisons = document.getElementById("comparisons");
const currentIndexDisplay = document.getElementById("index");
const time = document.getElementById("time");
const status = document.getElementById("status");


//---------------------------------------------------//


//-------Global variables-------------------//
let arr = createArray(sizeSlider.value);
let isPaused = false;
let isReset = false;
let comparisonsCount = 0;
let currentIndex = 0;
let startTime = 0;
let discarded = new Set();
//------------------------------------------//


//--------------------Initialisation----------------//
renderBars(arr);
updateInfo(algorithm.value);
size.innerText = sizeSlider.value;
speed.innerText = speedSlider.value;

//-------------------------------------------------//


//--------------Event Listeners-------------//

// Start Sorting//
sort.addEventListener("click", startSearching);

// Generate New Array//
generate.addEventListener("click", () => {
    discarded.clear();
    arr = createArray(sizeSlider.value);

     if (algorithm.value === "binary") {
        arr.sort((a, b) => a - b);
    }

    renderBars(arr);
});

// Change Array Size//
sizeSlider.addEventListener("input", () => {
    arr = createArray(sizeSlider.value);
     if (algorithm.value === "binary") {
        arr.sort((a, b) => a - b);
    }

    size.innerText = sizeSlider.value;
    renderBars(arr);
});

// Change Speed//
speedSlider.addEventListener("input", () => {
    speed.innerText = speedSlider.value;
});

// Change Algorithm//

algorithm.addEventListener("change", () => {
    discarded.clear();
    updateInfo(algorithm.value);
    updateLegend(algorithm.value);
    arr = createArray(sizeSlider.value);

    if (algorithm.value === "binary") { arr.sort((a, b) => a - b); }
    renderBars(arr);
});

// Close Popup//
closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
    resetStats();
});

pause.addEventListener("click", () => { 
    isPaused = !isPaused;
    if (isPaused) {
        pause.textContent = "Resume";
        pause.style.backgroundColor = "#16a34a";
    }
    else {
        pause.textContent = "Pause";
        pause.style.backgroundColor = "#ee9d06";
    }
});

reset.addEventListener("click", () => {
    discarded.clear();

    isReset = true;
    isPaused = false;
    targetInput.value = "";
    pause.textContent = "Pause";
    pause.style.backgroundColor = "#ee9d06";
    popup.classList.add("hidden");
    arr = createArray(sizeSlider.value);
    if (algorithm.value === "binary") {
        arr.sort((a, b) => a - b);
    }

    renderBars(arr);
    controls(false);
    resetStats();
    status.textContent = isPaused ? "Paused" : "Searching";
});

//------------------------------------------------//

//-------------------helper functions---------------//

function createArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 100) + 1;
        
        if (!arr.includes(value)) { arr.push(value); }
    }
    return arr;
}

function updateBarWidths() {
    const bars = getBars();
    const containerWidth = container.clientWidth;
    const gap = 2;
    const barWidth = Math.max(2, (containerWidth / bars.length) - gap);
    bars.forEach(bar => {
        bar.style.width = `${barWidth}px`;
    });
}

window.addEventListener("resize", updateBarWidths);

function renderBars(arr) {
    container.innerHTML = "";

    const containerWidth = container.clientWidth;
    const gap = 2;
    const barWidth = Math.max(2, (containerWidth / arr.length) - gap);
    arr.forEach(number => {


        const wrapper = document.createElement("div");
        wrapper.className = "bar-wrapper";

        const pointer = document.createElement("div");
        pointer.className = "pointer hidden";

        const bar = document.createElement("div");
        bar.className = "bar";

        const value = document.createElement("span");
        value.className = "bar-value";
        
        const maxBarHeight = Math.max(...arr);
        const maxValue = 80;
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${(number / maxBarHeight) * maxValue}%`;

        value.textContent = number;

        wrapper.appendChild(pointer);
        wrapper.appendChild(bar);
        wrapper.appendChild(value);
        container.appendChild(wrapper);
    });
}

function showPointer(index, text, color) {
    const wrappers = document.querySelectorAll(".bar-wrapper");

    const pointer = wrappers[index].querySelector(".pointer");

    pointer.innerHTML = `<span class="pointer-label" > ${text}</span>
                         <span class ="pointer-arrow">▼</span>`
    
    pointer.style.color = color;
    pointer.classList.remove("hidden");
}

function clearPointers() {
    document.querySelectorAll(".pointer").forEach(pointer => {
        pointer.classList.add("hidden");
        pointer.innerHTML = "";
    });
}

function getBars() {
    return document.querySelectorAll(".bar");
}


async function sleep(speed) {

    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    return new Promise(resolve => setTimeout(resolve, speed))

}



function getDelay() {
    const userSpeed = 101-Number(speedSlider.value);
    if (arr.length <= 15) {
        return userSpeed * 4;
    }
    else if (arr.length <= 25) {
        return userSpeed * 2;
    }
    else {
        return userSpeed;
    }
}

function controls(decision) {
            
    sizeSlider.disabled = decision;
    sort.disabled = decision;
    algorithm.disabled = decision;
    generate.disabled = decision;
    targetInput.disabled = decision;
    pause.disabled = false;
    reset.disabled = false;

}

function updateInfo(sortType) {
    const data = algorithmInfo[sortType];

    if (!data) {
        info.innerHTML = "<h3>Information coming soon...</h3>";
        return;
    }

    info.innerHTML = `
    
        <h3> Algorithm Info</h3>

        <P><strong>Type : </strong> ${data.name}</p>
        <p><strong>Best Case:</strong> ${data.best}</p>

        <p><strong>Average:</strong> ${data.average}</p>

        <p><strong>Worst:</strong> ${data.worst}</p>

        <p><strong>works on:</strong> ${data.works}</p>

        <p><strong>Strategy:</strong> ${data.strategy}</p>  
        
        <p><strong>Idea:</strong> ${data.idea}</p>  
        
        `
}

function resetStats() {
    comparisonsCount = 0;
    currentIndexDisplay.textContent = 0;
    comparisons.textContent = 0;
    index.textContent = 0;
    time.textContent = "0.00s";
    status.textContent = "Ready";
    targetInput.value = "";
}

function showPopup(algorithmName, result) {
    if (result != -1) {
        const data = popupInfo[algorithmName];
        popupTitle.textContent = `🎉 ${data.title} Complete!`;
        popupIdea.textContent = `Key Idea : ${data.idea}`;
        popupNext.textContent = `next learning : ${data.next}`;
        popup.classList.remove("hidden");
    }
    else {
        const data = popupInfo[algorithmName];
        popupTitle.textContent = `😔 Oops! not found.`;
        popupIdea.textContent = `Your searching element is not here.`;
        popupNext.textContent = `next learning : ${data.next}`;
        popup.classList.remove("hidden");
    }
}

function highlightCurrent(currentIndex) {
    const bars = getBars();
   bars[currentIndex].style.backgroundColor = linearColors.COMPARE;
}

function markChecked(currentIndex) {
    const bars = getBars();
   bars[currentIndex].style.backgroundColor = linearColors.CHECKED;
}

function markFound(currentIndex) {
    const bars = getBars();
   bars[currentIndex].style.backgroundColor = linearColors.FOUND;
}
    
function highlightLow(low) {
    const bars = getBars();
    bars[low].style.backgroundColor = binaryColors.LOW;
}

function highlightHigh(high) {
    const bars = getBars();
    bars[high].style.backgroundColor = binaryColors.HIGH;
}
    
function highlightMid(mid) {
    const bars = getBars();
    bars[mid].style.backgroundColor = binaryColors.MID;
}    
    
async function markDiscarded(start, end) {
    const bars = getBars();
    for (let i = start; i <= end; i++){

        discarded.add(i);
        bars[i].style.backgroundColor = binaryColors.DISCARDED;
        await sleep(40);
    }
}

function resetColors() {
    const bars = getBars();
    bars.forEach(bar => { bar.style.backgroundColor = binaryColors.DEFAULT; });
    
    discarded.forEach(index => { bars[index].style.backgroundColor = binaryColors.DISCARDED; });
}    

function updateLegend(type) {
    const legend = document.getElementById("legend");
    if (type === "linear") {
        legend.innerHTML = `
            <div class="legend-item">
                <span class="color red"></span> Current
            </div>

            <div class="legend-item">
                <span class="color yellow"></span> Checked
            </div>

            <div class="legend-item">
                <span class="color green"></span> Found
            </div>
        `;
    }
    else {

        legend.innerHTML = `
            <div class="legend-item">
                <span class="color yellow"></span> Low
            </div>

            <div class="legend-item">
                <span class="color red"></span> Mid
            </div>

            <div class="legend-item">
                <span class="color purple"></span> High
            </div>

            <div class="legend-item">
                <span class="color gray"></span> Discarded
            </div>

            <div class="legend-item">
                <span class="color green"></span> Found
            </div>
        `;
    }
}    
//-------------------------------------------------//

//-----------main funtions---------------------//
async function linearSearch(target) {
    if (isReset) return;
    for (let i = 0; i < arr.length; i++){
        highlightCurrent(i);

        comparisonsCount++;
        comparisons.textContent = comparisonsCount;
        currentIndexDisplay.textContent = i;
        status.textContent = "Searching...";

        await sleep(getDelay());

        if (arr[i] === target) {
            markFound(i);
            status.textContent = "Found";
            controls(false);
            return i;
        }
        markChecked(i);
    }
    status.textContent = "Not Found";

        return -1;
}

async function binarySearch(target) {

    discarded.clear();
    let low = 0;
    let high = arr.length - 1;

    console.log("Target:", target);
console.log("Array:", arr);
console.log("Contains target?", arr.includes(target));

    while (low <= high) {

        if (isReset) return;

        resetColors();
        clearPointers();
        
        let mid = Math.floor((low + high) / 2);

        showPointer(low, "LOW", binaryColors.LOW);
        highlightLow(low);
        await sleep(getDelay() * 3);

        showPointer(high, "HIGH", binaryColors.HIGH);
        highlightHigh(high);
        await sleep(getDelay() * 3);


        showPointer(mid, "MID", binaryColors.MID);
        highlightMid(mid);
        
        await sleep(getDelay() * 3);
        comparisonsCount++;
        comparisons.textContent = comparisonsCount;
        currentIndexDisplay.textContent = mid;
        status.textContent = "Searching...";

        status.textContent = `Checking ${arr[mid]}...`;
        if (arr[mid] === target) {
            markFound(mid);
            status.textContent = "Found";

            await sleep(2000);
            return mid;
        }

        if (arr[mid] > target) {
            status.textContent = `${arr[mid]} > ${target}, discard right half`;
            await markDiscarded(mid, high);
            high = mid - 1;
        }
        else {
            status.textContent = `${arr[mid]} < ${target}, discard left half`;
            await markDiscarded(low, mid);
            low = mid + 1;
        }

    }

    status.textContent = "Not Found";
    return -1;
}

async function startSearching() {
    isReset = false;
    isPaused = false;
    const selectedAlgorithm = algorithm.value;
    const target = Number(targetInput.value);
    if(targetInput.value===""){
    alert("Please enter a target.");
        return;
    }
    if(target < 1 || target > 100){
    alert("Target should be between 1 and 100.");
        return;
    }    
    let result;
    controls(true);
    resetStats();
    startTime = performance.now();
    status.textContent = "Searching...";
    if(selectedAlgorithm==="linear"){
        result=await linearSearch(target);
    }
    else{
        result=await binarySearch(target);
    }
    const totalTime =
        ((performance.now() - startTime) / 1000).toFixed(2);

    time.textContent = `${totalTime}s`;
    targetInput.value = "";
    if (!isReset) {
        showPopup(selectedAlgorithm,result);
    }

    controls(false);
    arr = createArray(sizeSlider.value);
    if (algorithm.value === "binary") {
    arr.sort((a, b) => a - b);
   }
    renderBars(arr);
    isReset = false;
}    