# randomly-choose-dayoff
Randomly choose your day-off

랜덤으로 현재 달력의 월을 기준으로 날짜를 선택해줍니다.

현재 달력의 전체 일 수 중에서 다음 조건을 제외하고 선택
- 1일부터 오늘 날짜까지 포함
- 토/일요일
- 법정공휴일 및 대체공휴일 

법정공휴일 중 음력으로 계산해줘야 되는 것은 (LunarCalendar.js 이용) <br>
출처: https://blog.naver.com/deeperain/221487812539
