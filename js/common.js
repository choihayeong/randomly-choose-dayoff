// import { LunarCalendar } from 'LunarCalendar.js';

let currentDate = new Date();
const date = new Date();      // today의 Date를 세어주는 역할

const calPrevBtn = document.querySelector('.btn-calprev');
const calNextBtn = document.querySelector('.btn-calnext');
const randomBtn = document.querySelector('#randomBtn');

// 랜덤 선택 버튼 활성화/비활성화
function disabledRndBtn(currentDate) {
    if (currentDate < date) {
        if (currentDate.getMonth() === date.getMonth() && currentDate.getFullYear() === date.getFullYear()) {
            randomBtn.removeAttribute('disabled');
        } else {
            randomBtn.disabled = "true";
        }
    } else {
        randomBtn.removeAttribute('disabled');
    }
}
// move to prevMonth / nextMonth
function prevCalendar() {   
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    buildCalendar();
    disabledRndBtn(currentDate);
}
function nextCalendar() {   
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    buildCalendar();
    disabledRndBtn(currentDate);
}

calPrevBtn.addEventListener('click', prevCalendar);
calNextBtn.addEventListener('click', nextCalendar);

// randomBtn click event
let datesArr;
datesArr = buildCalendar();

const modal = document.querySelector('#modal');
const alertMsg = modal.querySelector('#alert');

function randomBtnEvent() {
    datesArr = buildCalendar();
    const chosenDate = datesArr[Math.floor(Math.random() * datesArr.length)];

    modal.classList.add('active');
    alertMsg.innerHTML = `<span>${chosenDate}</span>일이 선택되었습니다!`;
}
function closeModalEvent() {
    modal.classList.remove('active');
}

randomBtn.addEventListener('click', randomBtnEvent);
modal.addEventListener('click', closeModalEvent);

// generate calendar
function buildCalendar(){
    const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const calTable = document.querySelector("#calTable tbody");
    const currentYM = document.querySelector("#currentYM");
    currentYM.textContent = currentDate.getFullYear() + "년 " + (currentDate.getMonth() + 1) + "월"; 

    /* 이번달이 끝나면 다음달로 넘겨주는 역할 */
    while (calTable.rows.length > 0) {
        calTable.deleteRow(calTable.rows.length - 1);
    }

    let cnt = 0;
    let row = null;
    let cell = null;
    row = calTable.insertRow();

    for (i = 0; i < firstDate.getDay(); i++) {
        cell = row.insertCell();
        cnt = cnt + 1;
    }

    let todayDate;
    let thisMonthDates = [];
    let disableDates = [];

    // 법정 공휴일 구하기
    const year = currentDate.getFullYear();
    let lastYear = 0;

    // year와 lastyear가 동일할경우 setLunarToSolar를 계산하지 않음
    let isSame = false;
    if (year == lastYear) {
        isSame = true;
    }

    const solarHolidays = ['0101','0301','0505','0606','0815','1003','1009','1225'];
    const lunarHolidays = ['0101','0102','0408','0814','0815','0816'];
    //대체공휴일 입력구간. 임시휴일이나 대체공휴일이 있을 경우 배열에 넣으면됨. yyyymmdd 입력
    let alternativeHolidays = [ "20150929", "20160210", "20170130", "20180926", "20180507", "20190506", "20200127", "20220309", "20220601", "20220912", "20221010", "20230124", "20240212", "20240506", "20251008", "20270209", "20290924", "20290507", "20300205", "20300506", "20320921", "20330202", "20340221", "20350918", "20360130" ];

    let setLunarToSolar = [];
    let holidays = [];

    // setLunarToSolar
    if (!isSame) {
        // 당년도의 음력휴일 양력으로 변환 (LunarCalendar.js)
        for (i = 0; i < lunarHolidays.length; i++) {
            var solar = Resut(year + "" + lunarHolidays[i]);
            if (i == 0) {
                let cMonth = solar.substring(0, 2);
                let cDay = solar.substring(2, 4);
                let cDate = new Date(parseInt(cMonth) + "/" + parseInt(cDay) + "/" + year);

                cDate.setDate(cDate.getDate() - 1); // 하루전

                // cDate.setMonth(parseInt(cMonth-1)); // 월 설정
                // cDate.setDate(parseInt(cDay)); //일 설정
                // //cDate.setDate(-1); //하루전날 
                // //var sdate = cDate.setDate(cDate.getDate()-1);

                let sm = (cDate.getMonth() + 1);
                if (sm < 10) {
                    sm = "0" + sm;
                }

                let sd = (cDate.getDate());
                if (sd < 10) {
                    sd = "0" + sd;
                }
                let sDate = sm + "" + sd;
                setLunarToSolar.push(sDate);
            }
            setLunarToSolar.push(solar);
        }

        lastYear = currentDate.getFullYear();
    }

    let monthStr;

    if ((currentDate.getMonth() + 1) < 10) {
        monthStr = "0" + (currentDate.getMonth() + 1);
    } else {
        monthStr = currentDate.getMonth() + 1;
    }

    for (i = 0; i < solarHolidays.length; i++) {
        if (solarHolidays[i].substring(0, 2) == monthStr) {
            holidays.push(Number(solarHolidays[i].substring(2, 4)));
        }
    }
    for (i = 0; i < setLunarToSolar.length; i++) {
        if (setLunarToSolar[i].substring(0, 2) == monthStr) {
            holidays.push(Number(setLunarToSolar[i].substring(2, 4)));
        }
    }
    for (i = 0; i < alternativeHolidays.length; i++) {
        if (alternativeHolidays[i].substring(0, 4) == year) {
            if (alternativeHolidays[i].substring(4, 6) == monthStr) {
                holidays.push(Number(alternativeHolidays[i].substring(6, 8)));
            }
        }
    }

    // asc-sorting for arr(holidays)
    holidays.sort(function(a,b) {
        return a-b;
    });

    /* 달력 출력 */
    for (i = 1; i <= lastDate.getDate(); i++) { 
        thisMonthDates.push(i);
        cell = row.insertCell();
        // cell.textContent = i;
        cell.innerHTML = `<button type="button">${i}</button>`;
        cnt = cnt + 1;

        /* 일요일 계산 */
        if (cnt % 7 == 1) {
            cell.classList.add('sun');
            cell.textContent = i;
            disableDates.push(i);
        }
        /* 토요일 구하기 */
        if (cnt % 7 == 0){
            cell.classList.add('sat');
            // cell.textContent = i;
            cell.innerHTML = `<button type="button">${i}</button>`;
            row = calTable.insertRow();
            disableDates.push(i);
        }
        /* 법정 공휴일에 빨간색 */
        for (let j = 0; j < holidays.length; j++) {
            if (i == holidays[j]) {
                cell.classList.add('holiday');
                // cell.textContent = i;
                cell.innerHTML = `<button type="button">${i}</button>`;
            }
        }
        /* 오늘의 날짜에 노란색 칠하기 */
        if (currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() && i == date.getDate()) {
            cell.classList.add("current-date");
            // cell.textContent = i;
            cell.innerHTML = `<button type="button">${i}</button>`;
            todayDate = i;
        }
    }

    // 해당 월의 선택할 수 없는 데이터 disableDates에 저장
    for (let i = firstDate.getDate(); i < todayDate + 1; i++) {
        disableDates.push(i);
    }
    for (let i = 0; i < holidays.length; i++) {
        disableDates.push(holidays[i]);
    }

    disableDates = new Set(disableDates);
    disableDates = [...disableDates];

    // asc-sorting for arr(disableDates)
    disableDates.sort(function(a,b) {
        return a-b;
    });
    
    // 이번 달의 전체 일 중 disabledDate를 뺌
    for (let i = 0; i < disableDates.length; i++) {
        for (let j = 0; j < thisMonthDates.length; j++) {
            if(thisMonthDates[j] == disableDates[i]) {
                thisMonthDates.splice(j,1);
                j--;
            }
        }
    }
    
    // show current Holidays
    const holidayInfo = document.querySelector('#holidayInfo span');
    
    if (holidays.length !== 0) {
        holidayInfo.textContent = `${firstDate.getMonth() + 1}월의 법정 공휴일 ${holidays}일`;
    } else {
        holidayInfo.textContent = `${firstDate.getMonth() + 1}월의 법정 공휴일은 없습니다.`;
    }

    // console 출력
    /* for (let i = 0; i < holidays.length; i++) {
        console.log(`${firstDate.getMonth()+1}월의 법정 공휴일 ${holidays[i]}일`);
    }
    console.log(`${firstDate.getMonth()+1}월의 연차 쓸 수 있는 날: ${thisMonthDates}`); */

    return thisMonthDates;
}