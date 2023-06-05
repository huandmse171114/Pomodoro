// ---------------------- Timer handling -----------------------
// Setting default config for web app
window.config = {
    Pomodoro: 1500, //25 minutes
    ShortBreak: 300, //5 minutes
    LongBreak: 600, //15 minutes
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
    var todos;

    async function getTodos() {
        const response = await fetch("https://headspindemo-production.up.railway.app/api/todos");
        todos = await response.json();
        todos.forEach(todo => {
            let todoItem = document.createElement("li");
            todoItem.classList.add("tasks-item");
            todoItem.dataset.id = todo.id;
            todoItem.textContent = todo.value;

            //single click to checked / unchecked tasks handling
            todoItem.addEventListener("click", () => {
                if (todoItem.classList.contains("checked")) {
                    todoItem.classList.remove("checked");
                }else {
                    todoItem.classList.add("checked");
                }
                
                
            })

            // double click to remove tasks handling
            todoItem.addEventListener("dblclick", () => {
                tasksList.removeChild(todoItem);
            })

            switch (todo.status) {
                //status = 1: on going
                case 1:
                    tasksList.appendChild(todoItem);
                    break;
                //status = 2: finished
                case 2:
                    todoItem.style.textDecoration = "line-through"
                    tasksList.appendChild(todoItem);
                    break;
                //status = 3: removed
                case 3: 
                    break;
                default:
                    console.log("Default case")
            }
        })
    }

    getTodos();

    async function updateTodoStatus(id, status) {
        try {
            const response = await fetch(`https://headspindemo-production.up.railway.app/api/todos/${id}/${status}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            });
          } catch (error) {
            console.error("Error:", error);
          }
    }

    async function deleteTodoStatus(id) {
        try {
            const response = await fetch(`https://headspindemo-production.up.railway.app/api/todos/${id}`, {
              method: "DELETE",
            });
          } catch (error) {
            console.error("Error:", error);
          }
    }


    async function saveTodo(data) {
        try {
          const response = await fetch("https://headspindemo-production.up.railway.app/api/todos", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          const result = await response.json();
          console.log("Success:", result);
        } catch (error) {
          console.error("Error:", error);
        }
      }


    tasksSubmitBtn.addEventListener("click", () => {
        const tasks = window.config.tasks;
        const tasksInput = document.querySelector(".tasks-input");
        var value = tasksInput.value;
        tasks.push(value);
        tasksInput.value = "";
        const newTaskItem = document.createElement("li");
        newTaskItem.classList.add("tasks-item");
        newTaskItem.textContent = tasks[tasks.length - 1];

        //single click to checked / unchecked tasks handling
        newTaskItem.addEventListener("click", () => {
            if (newTaskItem.classList.contains("checked")) {
                newTaskItem.classList.remove("checked");
                updateTodoStatus(newTaskItem.dataset.id, 1)
            }else {
                newTaskItem.classList.add("checked");
                updateTodoStatus(newTaskItem.dataset.id, 2)
            }
        })

        // double click to remove tasks handling
        newTaskItem.addEventListener("dblclick", () => {
            tasksList.removeChild(newTaskItem);
        })


        tasksList.appendChild(newTaskItem);
        saveTodo({value: value, status: 1})
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
        window.config.Pomodoro = pomodoroSetting.value || 25 * 60
        window.config.ShortBreak = sBreakSetting.value || 5 * 60
        window.config.LongBreak = lBreakSetting.value || 15 * 60
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
    [minutes, seconds] = timeViewParts.map(part => parseInt(part));
    return minutes * 60 + seconds;
}

function app() {
    render();
    handlingTimingControl();
    handlingTaskViewControl();
    handlingSettingModal();
    handlingAudioControl();
}

app();
