// ---------------------- Timer handling -----------------------
// Setting default config for web app
window.config = {
    Pomodoro: 5, //25 minutes
    ShortBreak: 5, //5 minutes
    LongBreak: 10, //15 minutes
    timingOption: "Pomodoro",
    shortBreakNo: 0, //number of short break before having long break, reset at 2
    tasks: [],
    songs: [
        {
            title: "Toan cao cap lofi cuc chill",
            author: "Minh Huan",
            audio: "assets/audio/audio0.mp3",
            img: "assets/audio/audio0.jpg"
        },
        {
            title: "Toan cao cap lofi cuc chill",
            author: "Minh Huan",
            audio: "assets/audio/audio0.mp3",
            img: "assets/audio/audio0.jpg"
        },
        {
            title: "Toan cao cap lofi cuc chill",
            author: "Minh Huan",
            audio: "assets/audio/audio0.mp3",
            img: "assets/audio/audio0.jpg"
        },
        {
            title: "Toan cao cap lofi cuc chill",
            author: "Minh Huan",
            audio: "assets/audio/audio0.mp3",
            img: "assets/audio/audio0.jpg"
        },
        {
            title: "Toan cao cap lofi cuc chill",
            author: "Minh Huan",
            audio: "assets/audio/audio0.mp3",
            img: "assets/audio/audio0.jpg"
        }
    ]
}

function completeTiming() {
    alert("You have finished!");
    if (window.config.timingOption === "Pomodoro") {
        if (window.config.shortBreakNo < 2) {
            window.config.shortBreakNo += 1;
            window.config.timingOption = "ShortBreak";
            render();
        }else {
            window.config.shortBreakNo = 0;
            window.config.timingOption = "LongBreak";
            render();
        }
    }else {
        window.config.timingOption = "Pomodoro";
        render();
    }
}

function render(obj) {
    if (obj) {
        var {newTime} = obj;
    }

    //render timer view
    let timerView = document.querySelector(".timer-view");

    if (newTime) {
        timerView.innerHTML = newTime.minutes + ":" + newTime.seconds;
    }else {
        let timerOptionList = document.querySelectorAll(".timer-option-item");
        let activeOption = window.config.timingOption;
        let activeOptionTime = secToMinAndSec(window.config[activeOption]);
        timerView.innerHTML = activeOptionTime.minutes + ":" + activeOptionTime.seconds;
        // setting active option
        document.querySelector(".timer-option-item.active")?.classList.remove("active");
        timerOptionList.forEach(option => {
            if (option.innerHTML.replace(" ", "") === activeOption) option.classList.add("active");
        })
    }
}

function handlingTimingControl() {
    let startBtn = document.querySelector(".start-btn");
    let pauseBtn = document.querySelector(".pause-btn");
    let backwardBtn = document.querySelector(".backward-btn");
    let forwardBtn = document.querySelector(".forward-btn");
    let timerOptionList = document.querySelectorAll(".timer-option-item"); 
    let timeIntervalID;
    let currTime;

    function handlingClickStart(){
        if (!currTime) currTime = timeViewToSecs(document.querySelector(".timer-view").innerHTML);
        startBtn.removeEventListener("click", handlingClickStart)
        startBtn.classList.add("clicked");
        pauseBtn.classList.remove("clicked");
        timeIntervalID = setInterval(() => {
            if (currTime >= 1) {
                render({newTime: secToMinAndSec(--currTime)});
            }else {
                clearInterval(timeIntervalID);
                startBtn.addEventListener("click", handlingClickStart);
                startBtn.classList.remove("clicked");
                completeTiming();
            }
        }, 1000)
    }

    function handlingClickPause(){
        if (timeIntervalID) {
            clearInterval(timeIntervalID);
            startBtn.addEventListener("click", handlingClickStart);
            startBtn.classList.remove("clicked");
            pauseBtn.classList.add("clicked");
        }
    }

    function handlingClickForward() {
        if (!currTime) currTime = timeViewToSecs(document.querySelector(".timer-view").innerHTML);
        currTime += 15;
        render({newTime: secToMinAndSec(currTime)})
    }

    function handlingClickBackward() {
        if (!currTime) currTime = timeViewToSecs(document.querySelector(".timer-view").innerHTML);
        if (currTime > 15) {
            currTime -= 15;
            render({newTime: secToMinAndSec(currTime)})
        }
    }

    pauseBtn.addEventListener("click", handlingClickPause);
    startBtn.addEventListener("click", handlingClickStart);
    backwardBtn.addEventListener("click", handlingClickBackward);
    forwardBtn.addEventListener("click", handlingClickForward);

    timerOptionList.forEach(option => {
        option.addEventListener("click", () => {
            clearInterval(timeIntervalID);
            currTime = undefined;
            startBtn.classList.remove("clicked");
            pauseBtn.classList.remove("clicked");
            startBtn.addEventListener("click", handlingClickStart);
            window.config.timingOption = option.innerHTML.replace(" ", "");
            render();
        })
    })
}

function handlingTaskViewControl() {
    const tasksList = document.querySelector(".tasks-list");
    const tasksSubmitBtn = document.querySelector(".tasks-submit-btn");

    tasksSubmitBtn.addEventListener("click", () => {
        const tasks = window.config.tasks;
        const tasksInput = document.querySelector(".tasks-input");
        tasks.push(tasksInput.value);
        tasksInput.value = "";
        const newTaskItem = document.createElement("li");
        newTaskItem.classList.add("tasks-item");
        newTaskItem.innerHTML = tasks[tasks.length - 1];

        //single click to checked / unchecked tasks handling
        newTaskItem.addEventListener("click", () => {
            newTaskItem.classList.toggle("checked");
        })

        // double click to remove tasks handling
        newTaskItem.addEventListener("dblclick", () => {
            tasksList.removeChild(newTaskItem);
        })


        tasksList.appendChild(newTaskItem);
    })

}

function handlingSettingModal() {
    const settingModal = document.querySelector(".setting-modal");
    const settingBtn = document.querySelector(".setting-btn");
    const settingModalOverlay = document.querySelector(".setting-modal-overlay");
    const settingModalBtn = document.querySelector(".setting-modal-btn");
    const pomodoroSetting = document.querySelector("#pomodoro-time-input");
    const sBreakSetting = document.querySelector("#sBreak-time-input");
    const lBreakSetting = document.querySelector("#lBreak-time-input");

    settingBtn.addEventListener("click", (e) => {
        settingModal.style.display = "flex";
        pomodoroSetting.value = window.config.Pomodoro;
        sBreakSetting.value = window.config.ShortBreak;
        lBreakSetting.value = window.config.LongBreak;
    })

    settingModalOverlay.addEventListener("click", () => {
        settingModal.style.display = "none";
    })

    settingModalBtn.addEventListener("click", () => {
        window.config.Pomodoro = pomodoroSetting.value ? pomodoroSetting.value : 25 * 60
        window.config.ShortBreak = sBreakSetting.value ? sBreakSetting.value : 5 * 60
        window.config.LongBreak = lBreakSetting.value ? lBreakSetting.value : 15 * 60
        settingModal.style.display = "none";
        render();
    })
}

function handlingAudioControl() {
    // Coming Soon :>>
}

function secToMinAndSec(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = sec - minutes*60;
    if (seconds < 10) seconds = "0" + seconds;
    return {
        minutes,
        seconds
    }
}

function timeViewToSecs(timeView) {
    let timeViewParts = timeView.split(":");
    timeViewParts = timeViewParts.map(part => parseInt(part));
    return timeViewParts[0] * 60 + timeViewParts[1];
}

function app() {
    render();
    handlingTimingControl();
    handlingTaskViewControl();
    handlingSettingModal();
    handlingAudioControl();
}

app();
