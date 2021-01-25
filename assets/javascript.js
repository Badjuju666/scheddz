
/* main function that updates the ui over time */

function getNow() {
    return moment();
}

function tick() {
    const now = getNow();

    const newCurrentHour = now.hours();

    if (newCurrentHour !== currentHour) {
        currentHour = now.hours();

        updateRowClasses(currentHour);
    }

    updateClockText(now);   
}

/* END main function that updates the ui over time */



/* LocalStorage helpers */

function getStorage() {
    const serializedValue = localStorage.getItem('storage') || '';

    // If JSON.parse fails (like when passing an empty string), let's return an array with a default text value
    try {
        return JSON.parse(serializedValue);
    } catch(error) {
        // console.error(error);
        return ['Update the text for 9am here'];
    }
}

function setStorage(storage) {
    const serializedValue = JSON.stringify(storage);

    localStorage.setItem('storage', serializedValue);
}

/* END LocalStorage helpers */


/* Getting reference to elements */

function getScheduleElements() {
    const eles = [];

    // Starting hour value (9am)
    let hour = 9;

    const times = [
        '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
    ];

    for (let i = 0; i < times.length; i++) {
        const time = times[i];

        eles.push({
            divTextarea: $(`#textarea-col-${time}`),
            textareaEle: $(`#textarea-${time}`),
            saveButtonEle: $(`#save-button-${time}`),
            hour: hour,
        });

        hour += 1;
    }

    return eles;
}

/* END Getting reference to elements */



/* Handle clock text */

function updateClockText (now) {
    const currentDayEle = $('#current-day');

    currentDayEle.text(now.format("dddd, MMMM Do YYYY, h:mm:ss A"));
}

/* END Handle clock text */



/* Past, present, future class helpers */

function removeClasses(ele) {
    ele.removeClass('past');
    ele.removeClass('present');
    ele.removeClass('future');
}

function addPastClass(ele) {
    removeClasses(ele);
    ele.addClass('past');
}

function addPresentClass(ele) {
    removeClasses(ele);
    ele.addClass('present');
}

function addFutureClass(ele) {
    removeClasses(ele);
    ele.addClass('future');
}

/* End Past, present, future class helpers */

/* Updating row classes for past, present, future */

function updateRowClasses(currentHour) {
    console.log('here', scheduleElements);
    for (let i = 0; i < scheduleElements.length; i++) {
        const ele = scheduleElements[i].divTextarea;
        const hour = scheduleElements[i].hour;
    
        if (hour < currentHour) {
            addPastClass(ele);
        } else if (hour === currentHour) {
            addPresentClass(ele);
        } else {
            addFutureClass(ele);
        }
    }
}

/* END Updating row classes for past, present, future */

/* Getting and saving text for textareas */

function setTextareaTexts(source, scheduleElements) {
    for (let i = 0; i < scheduleElements.length; i++) {
        const textareaEle = scheduleElements[i].textareaEle;
        textareaEle.val(source[i] || '');
    }
}

function bindSaveFuncs(storage, scheduleElements) {
    for (let i = 0; i < scheduleElements.length; i++) {
        const saveButtonEle = scheduleElements[i].saveButtonEle;
        const textareaEle = scheduleElements[i].textareaEle;

        saveButtonEle.click(() => {
            storage[i] = textareaEle.val() || '';

            setStorage(storage);
        });
    }
}

/* END Getting and saving text for textareas */



// Store the current hour (used to update the past, present, future classes on the row divs)
let currentHour;

// Get storage from LocalStorage
const storage = getStorage();

// Get jQuery reference to schedule elements to set textarea texts and bind save functions to save buttons
const scheduleElements = getScheduleElements();

// Set the text of all the textareas from storage
setTextareaTexts(storage, scheduleElements);

// Bind save functions to save buttons
bindSaveFuncs(storage, scheduleElements);

// Call tick ever second
setInterval(tick, 1000);

// Call tick asap to update ui asap
tick();
