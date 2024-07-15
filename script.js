const clock = document.querySelector(".clock"),
hourHand = document.querySelector(".hour"),
minuteHand = document.querySelector(".min"),
secondHand = document.querySelector(".sec"),
am_pm = document.querySelector(".am-pm")
// function to initialize  the clock.
function initClock(){
    setInterval(setTime,1000);
}

initClock();

let alarmRinging = false;
let message_bool = false;
let message_text =""

// function to refresh after every second so that the time is refreshed in browser
function setTime(){
    const  now = new Date();
    const today = now.getDay();

    const seconds = now.getSeconds();
    let secondsString = seconds.toString();
    if(secondsString.length < 2){
        secondsString = "0" + secondsString
    }
    secondHand.innerHTML = secondsString;

    const minutes = now.getMinutes();
    let minutesString = minutes.toString();
    if(minutesString.length < 2){
        minutesString = "0" + minutesString
    }
    minuteHand.innerHTML = minutesString;

    var hours = now.getHours();
    if(hours > 12){
        hours = hours % 12;
        am_pm.innerHTML = "PM"
    }
    else{
        am_pm.innerHTML = "AM"
    }
    if(hours == 12)
    am_pm.innerHTML = "PM";
    let hoursString = hours.toString();
    if(hoursString.length < 2){
        hoursString = "0" + hoursString;
    }
    hourHand.innerHTML = hoursString;


    alarms.forEach((alarm) => {
        let dayMatch = false;
        alarm.days.forEach((day) => {
          if (day === correct_today(today)) {
            dayMatch = true;
          }
        });

        if (
          alarm.time === `${hoursString}:${minutesString}` &&
          am_pm.innerHTML == alarm.zone &&
          alarm.active &&
          dayMatch &&
          alarmRinging === false
        )
          //if all conditon match
          ringAlarm(alarm);

      });



    const tick = new Audio("tick.mp3");
    // tick.play();
}

function ringAlarm(alarm) {
    alarmRinging = true;
    var audio = new Audio("alarm.wav");
    audio.play();
    if(message_bool == false){
      message_text = "Hey its time to " + alarm.name
      message(message_text);
      message_bool = true;
    }
    alarmRinging = false;
  }

const alarms = [
  // {
  //   id :1,
  //   time:"12:00",
  //   zone:"AM",
  //   name: "wake_up",
  //   days: [0],
  //   active: true,
  // }
  ];

const alarmList = document.querySelector(".alarms")
// Function to create alarm that we saw in the list.
function initAlarms(){
    
  alarmList.innerHTML = ""
    if(alarms.length){
        
        alarms.forEach((alarm)=>{
            const alarmElement = document.createElement("div");
            alarmElement.classList.add("alarm");
            alarmElement.dataset.id = alarm.id;
            let alarmDays = "";
            alarm.days.forEach((day) =>{
                daysletter = dayName(day)
                alarmDays += `<div class="day">${daysletter}</div>`;
            })
            active = alarm.active ? "checked":"";
            alarmElement.innerHTML = `                
            <div class="head">
            <div class="name">${alarm.name}</div>
            </div>
            <div class="body">
                <div class="left">
                    <div class="time">${alarm.time}<span>${alarm.zone}</span></div>
                </div>
                <div class="days">
                    ${alarmDays}
                </div>
                <label class="toggle">
                    <input type="checkbox" class="checkbox" hidden ${active}>
                    <div class="track"></div>
                    <div class="thumb"></div>
                </label>
            </div>
            <div class="delete">
                <img src="delete.png" alt =""/>
            </div>`;


        alarmList.appendChild(alarmElement);
        });
    }
    else{
        alarmList.innerHTML = `<div class="no-alarms">No Alarms,click on below + Button to Add Alarm</div>`
    }
}

initAlarms()
// Function to get the Day number to diplay it in alarm.
function dayName(day){
    return ["M","T","W","T","F","S","S"][day];
}
// this is to delete and also toggle the alarm from the list .
alarmList.addEventListener("click", (e)=>{
    if(e.target.classList.contains("checkbox")){
        const alarmId = e.target.parentElement.parentElement.parentElement.dataset.id;
        
        const alarm = alarms.find((alarm) => alarm.id == alarmId)
        alarm.active = !alarm.active;
        let flag = "ON"
        if(alarm.active == true){
          flag = "ON";

        }
        else{
          flag = "OFF"
          message_bool = false;
        }
        message_text = "This " + alarm.time + " "+ alarm.zone +" Alarm is " + flag;
        message(message_text)
    }
    if(e.target.classList.contains("delete")){
        const alarmId = e.target.parentElement.dataset.id;

        const alarm = alarms.find((alarm) => alarm.id == alarmId)
        alarms.splice(alarms.indexOf(alarm),1)
        alarmList.innerHTML ="";
        message_text = "This " + alarm.time + " "+ alarm.zone +" Alarm is Deleted";
        message(message_text)
        initAlarms()
    }
})


const add_alarm = document.getElementById("add-alarm-btn")
const close =  document.querySelector(".close")
const cancel =  document.querySelector(".cancel")
const days =  document.querySelectorAll(".day");
const save =  document.querySelector(".save");

add_alarm.addEventListener("click", AddAlarm)

// This the function that is triggered when we click that + buttton
function AddAlarm(){
    var element = document.getElementById("add-alarm-modal");
    element.classList.add("active")

    close.addEventListener("click", function(){
        element.classList.remove("active");
    })

    cancel.addEventListener("click", function(){
        element.classList.remove("active")
    })
}


// for making the days class selected in modal.
days.forEach((day) => {
  day.addEventListener("click",(e)=>{
    if(e.target.classList.contains("active")){
      e.target.classList.remove("active")
    }
    else{
      e.target.classList.add("active")
    }
  })
})

// this to save the detais and append it to alarms array
save.addEventListener("click", function(){
    var text = document.getElementById("name").value;
  
    if(alarms.length == 0){
      var Id = 1
    }
    else{
      var Id = alarms.slice(-1)[0].id;
      Id = parseInt(Id) + 1;
    }     
    var alarm_days = []

    for(let i = 0;i< days.length;i++){
      if(days[i].classList.contains("active")){
        alarm_days.push(i%17)
      }
    }

    var get_hour = parseInt(document.getElementById("input_hour").value);
    var get_min = parseInt(document.getElementById("input_min").value);
    var get_zone = document.getElementById("Zone").value;

    if(get_hour == NaN) get_hour = 12;    
    if(get_min == NaN) get_min = 0;

    var g_hour = get_hour.toString()
    var g_min = get_min.toString()

    if(g_hour.length < 2){
      g_hour = "0" + g_hour
    }

    if(g_min.length<2){
      g_min = "0" + g_min
    }
    var Child_Alarm = {
      id :Id,
      time: `${g_hour}:${g_min}`,
      zone:`${get_zone}`,
      name: text,
      days: alarm_days,
      active: true,
    }
    alarms.push(Child_Alarm)
    initAlarms()

    message_text = "Alarm saved  " + g_hour +":"+ g_min + " " + get_zone
    message(message_text)
    var element = document.getElementById("add-alarm-modal");
    element.classList.remove("active")
  })
  
  // Function to correct the day number according to this program
  // because the number convention starts with sunday but mine starts with monday
  // because the number for sunday is 0 and saturday is 6 but mine is sunday 6 and monday 0
  function correct_today(day){
    return [6,0,1,2,3,4,5][day];
  }


  const close_message = document.querySelector(".close2");

  // this is the function to simply show the alert message rather than using alert method
  function message(message_text){
    var element = document.getElementById("show_message");
    element.classList.add("active")

    const paragraph = document.querySelector(".para")

    paragraph.innerHTML = message_text;
    close_message.addEventListener("click", function(){
      element.classList.remove("active")
  
    });

  };