// common.js
var today = new Date();     // 오늘 날짜
var date = new Date();      // today의 Date를 세어주는 역할

// 이전 달 이동
function prevCalendar() {   
    today = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    buildCalendar();
}
// 다음 달 이동
function nextCalendar() {   
    today = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    buildCalendar();
}

// 달력 만들기(현재 달 기준)
function buildCalendar(){
    var firstDate = new Date(today.getFullYear(),today.getMonth(), 1);
    var lastDate = new Date(today.getFullYear(),today.getMonth() + 1, 0);

    var tbCalendar = document.getElementById("calendar");
    var tbCalendarYM = document.getElementById("tbCalendarYM");
    tbCalendarYM.innerHTML = today.getFullYear() + "년 " + (today.getMonth() + 1) + "월"; 

    /* 이번달이 끝나면 다음달로 넘겨주는 역할 */
    while (tbCalendar.rows.length > 2) {
        tbCalendar.deleteRow(tbCalendar.rows.length - 1); //열을 지워줌. 기본 열 크기는 body 부분에서 2로 고정되어 있다.
        //테이블의 tr 갯수 만큼의 열 묶음은 -1칸 해줘야지 30일 이후로 담을 달에 순서대로 열이 계속 이어진다.
    }

    var cnt = 0;    // 셀의 갯수
    var row = null;
    row = tbCalendar.insertRow();   // 테이블에 새로운 열 삽입 즉, 초기화

    // 1일이 시작되는 칸을 맞추어 줌
    for (i = 0; i < firstDate.getDay(); i++) {
        cell = row.insertCell();    // 열 한칸한칸 계속 만들어주는 역할
        cnt = cnt + 1;              // 열의 갯수를 계속 다음으로 위치하게 해주는 역할
    }

    // thisMonthDates = thisMonthDates - disableDates
    let todayDate;
    let thisMonthDates = []; // 해당 달의 전체 일을 넣고 공휴일을 빼는 배열
    let disableDates = []; // 1일부터 오늘 날짜까지 포함, 토/일요일, 법정공휴일 데이터가 들어감 (Array)

    // 법정 공휴일 구하기
    var year = today.getFullYear();
    var lastYear = 0;

    // year와 lastyear가 동일할경우 setLunarToSolar를 계산하지 않음
    var isSame = false;
    if (year == lastYear) {
        isSame = true;
    }

    const solarHolidays = ['0101','0301','0505','0606','0815','1003','1009','1225'];
    const lunarHolidays = ['0101','0102','0408','0814','0815','0816'];
    //대체공휴일 입력구간. 임시휴일이나 대체공휴일이 있을 경우 배열에 넣으면됨. yyyymmdd 입력
    var alternativeHolidays = [ "20150929", "20160210", "20170130", "20180926", "20180507", "20190506", "20200127", "20220309", "20220601", "20220912", "20221010", "20230124", "20240212", "20240506", "20251008", "20270209", "20290924", "20290507", "20300205", "20300506", "20320921", "20330202", "20340221", "20350918", "20360130" ];

    let setLunarToSolar = [];
    let holidays = [];

    // setLunarToSolar
    if (!isSame) {
        // 당년도의 음력휴일 양력으로 변환 (LunarCalendar.js)
        for (i = 0; i < lunarHolidays.length; i++) {
            var solar = Resut(year + "" + lunarHolidays[i]);
            if (i == 0) {
                //var cDate = new Date();
                var cMonth = solar.substring(0, 2);
                var cDay = solar.substring(2, 4);
                var cDate = new Date(parseInt(cMonth) + "/" + parseInt(cDay) + "/" + year);

                cDate.setDate(cDate.getDate() - 1); // 하루전

                /* cDate.setMonth(parseInt(cMonth-1)); // 월 설정
                cDate.setDate(parseInt(cDay)); //일 설정
                //cDate.setDate(-1); //하루전날 
                //var sdate = cDate.setDate(cDate.getDate()-1); */

                var sm = (cDate.getMonth() + 1);
                if (sm < 10) {
                    sm = "0" + sm;
                }

                var sd = (cDate.getDate());
                if (sd < 10) {
                    sd = "0" + sd;
                }
                sDate = sm + "" + sd;
                setLunarToSolar.push(sDate);
            }
            setLunarToSolar.push(solar);
        }

        lastYear = today.getFullYear();
    }

    if ((today.getMonth() + 1) < 10) {
        month1 = "0" + (today.getMonth() + 1);
    } else {
        month1 = today.getMonth() + 1;
    }

    for (i = 0; i < solarHolidays.length; i++) { // 양력휴일 넣음
        if (solarHolidays[i].substring(0, 2) == month1) {
            holidays.push(parseInt(solarHolidays[i].substring(2, 4))); //휴일이 있을경우 holidays에 넣는다.
        }
    }

    for (i = 0; i < setLunarToSolar.length; i++) { // 음력휴일 넣음
        if (setLunarToSolar[i].substring(0, 2) == month1) {
            holidays.push(parseInt(setLunarToSolar[i].substring(2, 4))); //휴일이 있을경우 holidays에 넣는다.
        }
    }

    for (i = 0; i < alternativeHolidays.length; i++) { //해당년도의 임시, 대체공휴일 추가
        if (alternativeHolidays[i].substring(0, 4) == year) {//공휴년도가 해당년도와 일치할경우
            if (alternativeHolidays[i].substring(4, 6) == month1) { //공휴년도가 해당월과 일치할경우
                holidays.push(alternativeHolidays[i].substring(6, 8)); //일치하는 휴일이 있을경우 list에 넣는다.
            }
        }
    }

    /* 달력 출력 */
    for (i = 1; i <= lastDate.getDate(); i++) { 
        thisMonthDates.push(i);
        cell = row.insertCell();    // tr 추가
        cell.innerHTML = i;
        cnt = cnt + 1;

        /* 일요일 계산 */
        if (cnt % 7 == 1) {     
            cell.innerHTML = "<font color=#F79DC2>" + i
            disableDates.push(i);
        }
        /* 토요일 구하기 */
        if (cnt % 7 == 0){    
            cell.innerHTML = "<font color=skyblue>" + i
            row = calendar.insertRow();
            disableDates.push(i);
        }
        /* 법정 공휴일에 빨간색 */
        for (let j = 0; j < holidays.length; j++) {
            if (i == holidays[j]) {
                cell.innerHTML = "<font color=#F79DC2>" + i;
            }
        }

        /* 오늘의 날짜에 노란색 칠하기 */
        if (today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && i == date.getDate()) {
            cell.bgColor = "#FAF58C";
            cell.innerHTML = "<font color=#2b4450>" + i;
            cell.style.fontWeight = "bold";
            todayDate = i;
        }
    }

    // 해당 월의 연차 쓸 수 없는 데이터 disableDates에 저장
    for (let i = firstDate.getDate(); i < todayDate + 1; i++) {
        disableDates.push(i);
    }
    for (let i = 0; i < holidays.length; i++) {
        disableDates.push(holidays[i]);
    }

    disableDates = new Set(disableDates);
    disableDates = [...disableDates];
    
    // 이번 달의 전체 일 중 disabledDate를 뺌
    for (let i = 0; i < disableDates.length; i++) {
        for (let j = 0; j < thisMonthDates.length; j++) {
            if(thisMonthDates[j] == disableDates[i]) {
                thisMonthDates.splice(j,1);
                j--;
            }
        }   
    }

    // console 출력
    // for (let i = 0; i < holidays.length; i++) {
    //     console.log(`${firstDate.getMonth()+1}월의 법정 공휴일 ${holidays[i]}일`);
    // }
    // console.log(`${firstDate.getMonth()+1}월의 연차 쓸 수 있는 날: ${thisMonthDates}`);

    // 화면 출력
    const messageInfo = document.querySelector('#message02 span');
    messageInfo.textContent = `${firstDate.getMonth()+1}월의 법정 공휴일 ${holidays}일`;

    // 랜덤 날짜 선택함수
    const randomBtn = document.querySelector('#randomBtn');
    const modal = document.querySelector('#modal');

    randomBtn.addEventListener('click', function() {
        const chosenDate = thisMonthDates[Math.floor(Math.random() * thisMonthDates.length)];
        const messageDate = document.querySelector('#message span');
        modal.classList.add('active');
        messageDate.textContent = `${chosenDate}`;
    });

    modal.addEventListener('click', function() {
        modal.classList.remove('active');
    });
}