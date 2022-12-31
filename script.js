function getbyid(id) {
  return document.getElementById(id);
}
class LS {
  get(name) {
    return localStorage.getItem(name);
  }
  set(name, value) {
    localStorage.setItem(name, value);
  }
  del(name) {
    localStorage.removeItem(name);
  }
}
let ls = new LS();
let settings = {
  weekends: (ls.get('weekends') == null ? [6, 0] : JSON.parse(ls.get('weekends'))),
  sleepTime: (ls.get('sleep') == null ? [21, 7] : JSON.parse(ls.get('sleep'))),
  theme: (ls.get('theme') == null ? 0 : ls.get('theme'))
}

getbyid('pages').onclick = function(event) {
  if (event.target.nodeName != 'LI') return;
  const m = event.target.getAttribute('mode');
  for (let f of event.target.parentNode.childNodes) {
    if (f.nodeName != 'LI') continue;
    f.classList.remove('chose');
  }
  event.target.classList.add('chose');
  const pg = document.getElementsByClassName('container');
  for (let i of pg) {
    i.hidden = true;
  }
  pg[m].hidden = false;
}
getbyid('settings_btn').onclick = () => {
  getbyid('settings').hidden = false;
  let checkboxes = document.getElementsByName('1');
  for (let i of checkboxes) {
    for (let j = 0; j < settings.weekends.length; j++) {
      if (i.value == settings.weekends[j]) i.checked = true;
    }
  }
  document.getElementsByName('0')[settings.theme].checked = true;
  document.getElementById('sleepFrom').value = settings.sleepTime[0];
  document.getElementById('sleepTo').value = settings.sleepTime[1];
}
getbyid('close_set').onclick = () => getbyid('settings').hidden = true;

function changeDateNTime() {
  let today = new Date();
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']
  getbyid('today').innerHTML = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
  let time = [today.getHours(), today.getMinutes(), today.getSeconds()];
  getbyid('time').innerHTML = `${time[0] < 10 ? '0' : ''}${time[0]}:${time[1] < 10 ? '0' : ''}${time[1]}:${time[2] < 10 ? '0' : ''}${time[2]}`;

  for (let i = 0; i < settings.weekends.length; i++) {
    if (today.getDay() == settings.weekends[i]) {
      getbyid('is_weekend').innerHTML = 'Выходной, можно отдыхать.';
      break;
    }
    getbyid('is_weekend').innerHTML = 'Будний день, надо работать!';
  }
  if (settings.sleepTime[0] <= today.getHours() || settings.sleepTime[1] > today.getHours()) {
    getbyid('beforeSleep').innerHTML = 'Иди спать!';
  } else {
    if (settings.sleepTime[0] - today.getHours() - 1 <= 0) {
      getbyid('beforeSleep').innerHTML = `Спать через ${60 - today.getMinutes()} минут.`;
    }
    else {
      getbyid('beforeSleep').innerHTML = `Спать через ${settings.sleepTime[0] - today.getHours()} часов.`;
    }
  }
  if (settings.theme == 1) {
    document.body.style = 'background-color:#D0D0D0; color:black;';
    getbyid('variables').innerText = `
    :root {
      --checkedColor: #BBBBBB;
      --selectBG: #E4E4E4;
      --buttonBG: #E4E4E4;
      --buttonBorder: #A6A6A6;
      --settingsBtnBG: #E4E4E4;
      --settingsBtnBorder: #A6A6A6;
      --settingsBG: #B2B2B2;
      --settingsBorder: #8B8B8B;
      --settingsCloseBG: #EAEAEA;
      --settingsCloseBorder: #8B8B8B;
    }
    `;
  }
  else if (settings.theme == 0) {
    document.body.style = 'background-color:#2F2F2F; color:white;';
    getbyid('variables').innerText = `
    :root {
      --checkedColor: #565656;
      --selectBG: #7D7D7D;
      --buttonBG: #686868;
      --buttonBorder: #808080;
      --settingsBtnBG: #474747;
      --settingsBtnBorder: #626262;
      --settingsBG: #1E1E1E;
      --settingsBorder: #9D9D9D;
      --settingsCloseBG: #717171;
      --settingsCloseBorder: #9D9D9D;
    }
    `;
  }
}
getbyid('sleepFrom').onchange = function() {
  let val = parseInt(getbyid('sleepFrom').value);
  settings.sleepTime[0] = val;
  ls.set('sleep', JSON.stringify(settings.sleepTime));
  changeDateNTime();
}
getbyid('sleepTo').onchange = function() {
  let val = parseInt(getbyid('sleepTo').value);
  settings.sleepTime[1] = val;
  ls.set('sleep', JSON.stringify(settings.sleepTime));
  changeDateNTime();
}

let checkboxes = document.getElementsByName('1');
for (let i of checkboxes) {
  i.onclick = function() {
    settings.weekends = [];
    for (let j of checkboxes) {
      if (j.checked) settings.weekends.push(j.value);
      ls.set('weekends', JSON.stringify(settings.weekends));
      changeDateNTime();
    }
  }
}
let radios = document.getElementsByName('0');
for (i of radios) {
  i.onclick = function() {
    for (let j of radios) {
      if (j.checked) settings.theme = j.value;
      ls.set('theme', settings.theme);
      changeDateNTime();
    }
  }
}

const FULL_DASH_ARRAY = 283;
function calculateTimeFraction(t1, t2) {
  const rawTimeFraction = t1 / t2;
  return rawTimeFraction - (1 / t2) * (1 - rawTimeFraction);
}
function setCircleDasharray(t1, t2) {
  const circleDasharray = `${(
    calculateTimeFraction(t1, t2) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("timer_left_path")
    .setAttribute("stroke-dasharray", circleDasharray);
}

let tleft;
let TIME_LIMIT;

function changeTimer(mins, secs, timerID) {
  mins = parseInt(mins);
  secs = parseInt(secs);
  tleft = TIME_LIMIT;
  if (timerID === undefined) {
    return _i = setInterval(() => {
      tleft--;
      if (--secs < 0) {
        if (mins == 0) {
          clearInterval(_i);
          return;
        }
        secs = 59;
        mins--;
      }
      if (mins == 0 && secs == 0) {
        getbyid('timer_start').hidden = false;
        getbyid('timer_stop').hidden = true;
      }
      getbyid('timer_left').innerHTML = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      setCircleDasharray(tleft, TIME_LIMIT);
    }, 1000);
  }
  clearInterval(timerID);
}

for (let i = 0; i < 60; i++) {
  let opt = document.createElement('option');
  let opt2 = document.createElement('option')
  opt.innerHTML = i;
  opt2.innerHTML = i;
  getbyid('timer_m').append(opt);
  getbyid('timer_s').append(opt2);
}

let tid;
getbyid('timer_start').onclick = () => {
  document
    .getElementById("timer_left_path")
    .setAttribute("stroke-dasharray", '283 283');
  getbyid('timer_stop').hidden = false;
  getbyid('timer_start').hidden = true;
  let m = parseInt(getbyid('timer_m').value);
  let s = parseInt(getbyid('timer_s').value);
  TIME_LIMIT = (m * 60) + s;
  getbyid('timer_left').innerHTML = `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  tid = changeTimer(m, s);
}
getbyid('timer_stop').onclick = () => {
  getbyid('timer_stop').hidden = true;
  getbyid('timer_start').hidden = false;
  changeTimer(0, 0, tid);
}
let sleft;
function setCircleDasharraySW(t1) {
  const circleDasharray = `${(
    calculateTimeFraction(t1, 60) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("stopwatch_left_path")
    .setAttribute("stroke-dasharray", circleDasharray);
}
function setCircleDasharrayNY(t1, t2) {
  const circleDasharray = `${(
    calculateTimeFraction(t1, t2) * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("newyear_left_path")
    .setAttribute("stroke-dasharray", circleDasharray);
}
function toggleStopwatch(timerID) {
  sleft = 0;
  mins = 0;
  secs = 0;
  if (timerID === undefined) {
    return setInterval(() => {
      sleft++;
      if (++secs > 59) {
        sleft = 0;
        secs = 0;
        mins++;
      }
      getbyid('stopwatch_left').innerHTML = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
      setCircleDasharraySW(sleft + 1);
    }, 1000);
  } else clearInterval(timerID);
}

let swid;
getbyid('stopwatch_toggle').onclick = function() {
  if (swid) {
    getbyid('stopwatch_toggle').innerHTML = 'Старт';
    toggleStopwatch(swid);
    swid = undefined;
    return;
  }
  document
    .getElementById("stopwatch_left_path")
    .setAttribute("stroke-dasharray", '0 283');
  getbyid('stopwatch_toggle').innerHTML = 'Стоп';
  getbyid('stopwatch_left').innerHTML = '00:00';
  swid = toggleStopwatch();
}
let nyLoaded = false;
function changeNYCountdown() {
  let now = new Date();
  let nextYear = new Date(new Date().getFullYear() + 1, 0, 1);
  let today = Date.parse(new Date());
  let newYearDay = new Date(nextYear);
  let remaningDT = newYearDay - today;
  let endtime = new Date(Date.parse(new Date()) + remaningDT);

	let t = (Date.parse(endtime) - Date.parse(new Date())) / 1000;
  let is_upper = new Date(now.getFullYear(), 1, 29).getMonth() == 1;
  let seconds = Math.floor(t % 60);
  let minutes = Math.floor((t / 60) % 60);
  let hours = Math.floor((t / (60 * 60)) % 24);
  let days = Math.floor(t / (60 * 60 * 24));

  getbyid('newyear_left').innerHTML = `${days} дней, ${hours} часов, ${minutes} минут и ${seconds} секунд.`;
  getbyid('newyear_now').innerHTML = now.getFullYear();
  if (days <= 3) getbyid('nyNote').innerHTML = 'Скоро Новый Год!';
  if (days == 0 && hours > 5) getbyid('nyNote').innerHTML = 'Завтра Новый Год!';
  if (days == 0 && hours <= 5) getbyid('nyNote').innerHTML = 'Через несколько часов Новый Год!';
  if (now.getMonth() == 0 && now.getDate() == 1) {
    if (!nyLoaded) {
      getbyid('happyny').click();
      let _canv = document.createElement('canvas');
      _canv.id = 'canvas';
      document.body.prepend(_canv);
      fwmainloop();
      nyLoaded = true;
    }
    getbyid('newyear_left').innerHTML = 'Кликни в любое место :)';
    getbyid('nyNote').innerHTML = 'С Новым Годом!';
  }
  if (days > 3 && days != (is_upper ? 365 : 364)) getbyid('nyNote').innerHTML = 'До нового ' + (now.getFullYear() + 1) + ' года:';
  setCircleDasharrayNY(t, 60 * 60 * 24 * (is_upper ? 366 : 365));
}

changeDateNTime();
changeNYCountdown();
setInterval(changeDateNTime, 1000);
setInterval(changeNYCountdown, 1000);