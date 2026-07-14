//------------constants------------------//
const colors = {
     DEFAULT: "#2563EB",
    COMPARE: "#EF4444",
    MINIMUM: "#FACC15",
    MERGING: "#A855F7",
    SORTED: "#22C55E"
}

const algorithmInfo = {
    bubble: {
        name: "Bubble Sort",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "Yes",
        inPlace: "Yes",
        strategy:"Repeated Swapping"
    },

    selection: {
        name:"Selection Sort",
        best:"O(n²)",
        average:"O(n²)",
        worst:"O(n²)",
        space:"O(1)",
        stable: "No",
        inPlace: "Yes",
        strategy:"Minimum Selection"
    },

    insertion: {
        name: "Insertion Sort",
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
        stable: "Yes",
        inPlace: "Yes",
        strategy:"Incremental Insertion"
    },
    merge: {
        name:"Merge Sort",
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
        stable: "Yes",
        inPlace: "No",
        strategy:"Divide and Conquer"
    },

    quick: {
        name:"Quick Sort",
        best:"O(n log n)",
        average:"O(n log n)",
        worst:"O(n²)",
        space:"O(log n)",
        stable:"No",
        inPlace:"Yes",
        strategy:"Partitioning"
    }
    
}


const popupInfo = {
    bubble: {
        title: "Bubble Sort",
        idea: "Adjacent comparisons push the largest element to the end.",
        next: "Selection Sort"
    },

    selection: {
        title: "Selection Sort",
        idea: "Find the minimum element and place it at the beginning.",
        next: "Insertion Sort"
    },

    insertion: {
        title: "Insertion Sort",
        idea: "Build the sorted portion one element at a time.",
        next: "Merge Sort"
    },

    merge: {
        title: "Merge Sort",
        idea: "Divide the array, sort each half, then merge them.",
        next: "Quick Sort"
    },

    quick: {
        title: "Quick Sort",
        idea: "Partition around a pivot and sort recursively.",
        next: "🎉 You've completed all sorting algorithms!"
    }
}
//---------------------------------------//



//--------------DOM Elements-----------------//

const container = document.querySelector(".container");

const size = document.getElementById("sizeVal");
const speed = document.getElementById("speedVal");

const speedSlider = document.getElementById("speed");
const sizeSlider = document.getElementById("size");


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
const swaps = document.getElementById("swaps");
const swapsLabel = document.getElementById("swapsLabel");
const time = document.getElementById("time");
const status = document.getElementById("status");




//-------------------------------//






//-------------Global variables---------------//

let arr = createArray(sizeSlider.value);
let isPaused = false;
let isReset = false;
let comparisonsCount = 0;
let swapsCount = 0;
let startTime = 0;

//-------------------------------------//



//------------Initialisation-------------------//

renderBars(arr);
updateInfo(algorithm.value);
size.innerText = sizeSlider.value;
speed.innerText = speedSlider.value;

//-------------------------------//


//-----------------event Listeners-----------------------//

// Start Sorting//
sort.addEventListener("click", startSorting);

// Generate New Array//
generate.addEventListener("click", () => {
    arr = createArray(sizeSlider.value);
    renderBars(arr);
});

// Change Array Size//
sizeSlider.addEventListener("input", () => {
    arr = createArray(sizeSlider.value);
    size.innerText = sizeSlider.value;
    renderBars(arr);
});

// Change Speed//
speedSlider.addEventListener("input", () => {
    speed.innerText = speedSlider.value;

});

// Change Algorithm//

algorithm.addEventListener("change", () => {
    updateInfo(algorithm.value);
    arr = createArray(sizeSlider.value);
    renderBars(arr);
    swapsLabel.textContent =
    algorithm.value === "merge"
        ? "🔄 Moves"
        : "🔄 Swaps";
});

// Close Popup//
closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
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
    isReset = true;
    isPaused = false;
    pause.textContent = "Pause";
    pause.style.backgroundColor = "#ee9d06";
    popup.classList.add("hidden");
    arr = createArray(sizeSlider.value);
    renderBars(arr);
    controls(false);
    resetStats();
    status.textContent = isPaused ? "Paused" : "Running";
});
//----------------------------------------------//



//-----------helper functions-------------//

function createArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100) + 1);
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
    arr.forEach(value => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = `${barWidth}px`;
        bar.style.height = `${value}%`;

        container.appendChild(bar);
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

        <p><strong>Space:</strong> ${data.space}</p>

        <p><strong>Stable:</strong> ${data.stable}</p>  
        
        <p><strong>In Place:</strong> ${data.inPlace}</p>  
        
        <p><strong>Strategy:</strong> ${data.strategy}</p>  
        
        `
}

function resetStats() {
    comparisonsCount = 0;
    swapsCount = 0;
    comparisons.textContent = 0;
    swaps.textContent = 0;
    time.textContent = "0.00s";
    status.textContent = "Ready";
}

function showPopup(algorithmName) {
    const data = popupInfo[algorithmName];
    popupTitle.textContent = `🎉 ${data.title} Complete!`;
    popupIdea.textContent = `Key Idea : ${data.idea}`;
    popupNext.textContent = `next learning : ${data.next}`;
    popup.classList.remove("hidden");
}


//----------------------------------------------//


//------------animation functions-------------------//

async function swapBars(j) {

    const bars = getBars();
    bars[j].style.backgroundColor = colors.COMPARE;
    bars[j + 1].style.backgroundColor = colors.COMPARE;
    
    const delay =getDelay();
    await sleep(delay);


    comparisonsCount++;
    comparisons.textContent = comparisonsCount;
    if (arr[j] > arr[j + 1]) {

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapsCount++;
        swaps.textContent = swapsCount;

        const temp = bars[j].style.height;
        bars[j].style.height = bars[j + 1].style.height;
        bars[j + 1].style.height = temp;

        await sleep(delay);
        bars[j].style.backgroundColor = colors.DEFAULT;
        bars[j + 1].style.backgroundColor = colors.DEFAULT;

        return true;
    }

    bars[j].style.backgroundColor = colors.DEFAULT;
    bars[j + 1].style.backgroundColor = colors.DEFAULT;

    return false;
}


async function swapSelection(j, mini) {
    
    const bars = getBars();
    bars[j].style.backgroundColor = colors.COMPARE;
    bars[mini].style.backgroundColor = colors.COMPARE;
    
    const delay =getDelay();
    await sleep(delay);

    [arr[j], arr[mini]] = [arr[mini], arr[j]];
    swapsCount++;
    swaps.textContent = swapsCount;

    const temp = bars[j].style.height;
    bars[j].style.height = bars[mini].style.height;
    bars[mini].style.height = temp;

    await sleep(delay);
    bars[mini].style.backgroundColor = colors.DEFAULT;

}

async function shiftBars(current, next) {
    const bars = getBars();
    bars[current].style.backgroundColor = colors.COMPARE;
    bars[next].style.backgroundColor = colors.COMPARE;
    
    const delay =getDelay();
    await sleep(delay);
    swapsCount++;
    swaps.textContent = swapsCount;
    arr[next] = arr[current];
    bars[next].style.height = bars[current].style.height;

    await sleep(delay);
    bars[current].style.backgroundColor = colors.DEFAULT;
    bars[next].style.backgroundColor = colors.DEFAULT;
}

async function mergeArrays(left, mid, right) {
    const bars = getBars();
    
    for (let x = left; x <= right; x++){
        bars[x].style.backgroundColor = colors.MERGING;
    }
    const leftArray = arr.slice(left, mid + 1);
    const rightArray = arr.slice(mid + 1, right + 1);
    let i = 0;
    let j = 0;
    let k = left;
    while (i < leftArray.length && j < rightArray.length) {
        if (isReset) return;
        comparisonsCount++;
        comparisons.textContent = comparisonsCount;

        if (leftArray[i] <= rightArray[j]) {

            bars[k].style.backgroundColor = colors.COMPARE;
            await sleep(getDelay()/2);
            arr[k] = leftArray[i];

            swapsCount++;
            swaps.textContent = swapsCount;
            
            bars[k].style.height = `${arr[k]}%`;
            await sleep(getDelay()/2);
            bars[k].style.backgroundColor = colors.MERGING;

            k++;
            i++;

        }
        else {
            bars[k].style.backgroundColor = colors.COMPARE;
            await sleep(getDelay()/2);
            arr[k] = rightArray[j];


            swapsCount++;
            swaps.textContent = swapsCount;

            bars[k].style.height = `${arr[k]}%`;
            await sleep(getDelay());
            bars[k].style.backgroundColor = colors.MERGING;

            k++; j++;
        }
    }

    while (i < leftArray.length) {
        if (isReset) return;
        bars[k].style.backgroundColor = colors.COMPARE;
        await sleep(getDelay()*2);
        arr[k] = leftArray[i];

        swapsCount++;
        swaps.textContent = swapsCount;

        bars[k].style.height = `${arr[k]}%`;
        await sleep(getDelay()*2);

        bars[k].style.backgroundColor = colors.MERGING;
        i++; k++;
    }
    while (j < rightArray.length) {
        if (isReset) return;
        bars[k].style.backgroundColor = colors.COMPARE;
        await sleep(getDelay()*2);

        arr[k] = rightArray[j];

        swapsCount++;
        swaps.textContent = swapsCount;
        
        bars[k].style.height = `${arr[k]}%`;
        await sleep(getDelay()*2);
        bars[k].style.backgroundColor = colors.MERGING;

        j++; k++;
    }

    for (let x = left; x <= right; x++){
        bars[x].style.backgroundColor = colors.DEFAULT;
        await sleep(8);
    }

}

async function swapQuick(i,j) {
    const bars = getBars();
    bars[i].style.backgroundColor = colors.COMPARE;
    bars[j].style.backgroundColor = colors.COMPARE;

    await sleep(getDelay());
    if (i != j) {
    
        [arr[i], arr[j]] = [arr[j], arr[i]];
    
        swapsCount++;
        swaps.textContent = swapsCount;

        const temp = bars[i].style.height;
        bars[i].style.height = bars[j].style.height;
        bars[j].style.height = temp;

        await sleep(getDelay());
    }
        bars[i].style.backgroundColor = colors.DEFAULT;
        bars[j].style.backgroundColor = colors.DEFAULT;
}
//--------------------------------------------------//


//--------sorting algorithms-----------------------//
async function bubble() {
    const bars = getBars();

       for (let i = 0; i < arr.length - 1; i++) {
           if (isReset) return;

        let swapped = false;    
           for (let j = 0; j < arr.length - 1 - i; j++) {
               
               if (isReset) return;
            if (await swapBars(j)) { swapped = true; }
        }
           bars[arr.length - 1 - i].style.backgroundColor = colors.SORTED;
           
           await sleep(getDelay());
        if (!swapped) { break;}
    }
    
    for (let i = 0; i < bars.length; i++) {
    bars[i].style.backgroundColor = colors.SORTED;
        await sleep(15);
    }
}

async function selection() {
    const bars = getBars();

    for (let i = 0; i < arr.length; i++){
            if (isReset) return;
            bars[i].style.border = "3px solid black";
        let mini = i;
        bars[mini].style.backgroundColor = colors.MINIMUM;
        for (let j = i + 1; j < arr.length; j++){
            if (isReset) return;
            if (j != mini) {
                bars[j].style.backgroundColor = colors.COMPARE;
            }
            
            const delay =getDelay();
            await sleep(delay);

            
            comparisonsCount++;
            comparisons.textContent = comparisonsCount;
            if (arr[mini] > arr[j]) {
                bars[mini].style.backgroundColor = colors.DEFAULT;
                mini = j;
                bars[j].style.backgroundColor = colors.MINIMUM;

                await sleep(delay);
            }

            if (j != mini)
                bars[j].style.backgroundColor = colors.DEFAULT;

        }
        if (mini != i) {
            await swapSelection(i, mini);
        }
        bars[i].style.border = "none";
        bars[i].style.backgroundColor = colors.SORTED;
    }
}

async function insertion() {
    const bars=getBars();
    for (let i = 1; i < arr.length; i++) {
        if (isReset) return;
        let key = arr[i];
        let j = i - 1;
        while (j >= 0) {
            
            comparisonsCount++;
            comparisons.textContent = comparisonsCount;

            if (arr[j] <= key) { break; }
            if (isReset) return;
            await shiftBars(j, j + 1);
            j--;
        }
        arr[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;

        await sleep(getDelay());

        for (let k = 0; k <= i; k++) {
            bars[k].style.backgroundColor = colors.SORTED;
        }
    }
}

async function merge(left,right) {
    if (left >= right) { return; }

    if (isReset) return;

    const mid = Math.floor((left + right) / 2);

    await merge(left, mid);
    await merge(mid + 1, right);

    await mergeArrays(left, mid, right);
}


async function mergeAlgo() {
    await merge(0, arr.length - 1);

    const bars = getBars();
    for (const bar of bars) {
        bar.style.backgroundColor = colors.SORTED;
        await sleep(10);
    }
}

async function partition(low,high) {
    const bars = getBars();
    let pivot = arr[high];
    let i = low - 1;

    bars[high].style.backgroundColor = colors.MINIMUM;

    for (let j = low; j < high; j++) {

        if(isReset)return;
        bars[j].style.backgroundColor = colors.COMPARE;
        await sleep(getDelay());
        comparisonsCount++;
        comparisons.textContent = comparisonsCount;
        if (arr[j] < pivot) {
            i++;
            await swapQuick(i, j);
        }
        if (j != i) {
            bars[j].style.backgroundColor = colors.DEFAULT;
        }
    }
    await swapQuick(i + 1, high);
    bars[i + 1].style.backgroundColor = colors.SORTED;
    bars[high].style.backgroundColor = colors.DEFAULT;
    return i + 1;
}

async function quick(low,high) {
    if (low >= high || isReset) { return; }
    const pi = await partition(low, high);
    
    await quick(low, pi - 1);
    await quick(pi + 1, high);
}

async function quickAlgo() {
    await quick(0, arr.length - 1);
    const bars = getBars();
    for (const bar of bars) {
        bar.style.backgroundColor = colors.SORTED;
        await sleep(10);
    }
}
//--------------------------------------------//

const algorithms = {
    bubble,
    selection,
    insertion,
    merge: mergeAlgo,
    quick:quickAlgo
};
async function startSorting() {
    isPaused = false;
    isReset = false;
    resetStats();
    startTime = performance.now();
    pause.textContent = "Pause";
    controls(true);
    const selected = algorithm.value;

    status.textContent = "Running";
    if (!algorithms[selected]) {
        alert("This algorithm is not implemented yet.");
        controls(false);
        return;
    }

    await algorithms[selected]();
    if (!isReset) {
        showPopup(selected);
    }
    controls(false);
    status.textContent = "completed";
    const totalTime = (performance.now() - startTime);
    time.textContent = `${totalTime.toFixed(2)}ms`;
}

