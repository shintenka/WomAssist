var tempDiv = document.getElementById('air_temp');
tempDiv.innerHTML = "26";
var aircon_temp = 26;

$(document).ready(function(){
    var session = 25;       //25min
    var breaklength = 5;            //break 5min
    var flag = 1;           //1 作業時間一時停止，2是break一時停止，3作業，4break
    var sec = session*60;   //分 * 60なので気をつけること！！！
    var percent = 0;    //记录背景颜色显示的高度，0-100，是百分比
    var audio1 = document.getElementById("bgMusic1");
    var audio2 = document.getElementById("bgMusic2");

    var outputDiv = document.getElementById('sum_time');
    sum_sec = parseInt(localStorage.getItem("sum_min")) * 60 + parseInt(localStorage.getItem("sum_sec"));
    sum_min = parseInt(sum_sec / 60) % 60;
    sum_hour = parseInt(sum_sec / (60 * 60));
    sum_sec_60 = sum_sec % 60;
    outputDiv.innerHTML = sum_hour + "時間" + sum_min + " 分 " + sum_sec_60 + "秒";



    localStorage.setItem("initial_min", session); // 作業時間の初期値をローカルストレージに記録
    localStorage.setItem("initial_sec", sec);
    localStorage.setItem("work_flag", 0);

    $("#break-minus").on("click",function(){
        if(flag !== 1 && flag !== 2){
            return;         // 休憩時間を1分減らす
        }
        breaklength--;
        if(breaklength < 1){
            breaklength = 1;
        }
        $("#break-length").html(breaklength);
        if(flag === 2){
            //如果是休息的暂停，一旦改了，就又对sec产生了修改
            sec = breaklength*60;
        }
        showHMS(breaklength,2);
    });
    $("#break-plus").on("click",function(){
        if(flag !== 1 && flag !== 2){
            return;         // 休憩時間を1分増やす
        }
        breaklength++;

        $("#break-length").html(breaklength);
        if(flag === 2){
            //如果是休息的暂停，一旦改了，就又对sec产生了修改
            sec = breaklength*60;
        }
        showHMS(breaklength,2);
    });
    $("#session-minus").on("click",function(){
        if(flag !== 1 && flag !== 2){
            return;         // 作業時間を1分減らす
        }
        session--;
        // 作業時間が変更されたため、ローカルストレージの作業時間初期値を更新
        localStorage.setItem("initial_sec", session * 60);
        if(session < 1){
            session = 1;
        }
        $("#session-length").html(session);
        if(flag === 1){
            //如果是工作的暂停，一旦改了，就又对sec产生了修改
            sec = session*60;
        }
        showHMS(session,1);
    });
    $("#session-plus").on("click",function(){
        if(flag !== 1 && flag !== 2){
            return;         // 作業時間を1分増やす
        }
        session++;
        // 作業時間が変更されたため、ローカルストレージの作業時間初期値を更新
        localStorage.setItem("initial_sec", session * 60);
        $("#session-length").html(session);
        if(flag === 1){
            //如果是工作的暂停，一旦改了，就又对sec产生了修改
            sec = session*60;
        }
        showHMS(session,1);
    });

    //在时钟上显示时分秒，传两个参数，一个是分钟，一个是状态。
    //如果在工作的暂停中，修改休息的时长，不改变时钟上的显示，state有两个取值，取1时表示修改工作时长，取2表示修改休息时长
    var showHMS = function(min,state){
        if(state  !== flag){
            return;         //如果不是在对应的暂停状态，就不改变时钟上显示的值
        }
        var show = "";
        if(min >= 60){
            show += parseInt(min/60)+":";
            min = min%60;
        }
        if(min<10){
            show+="0";
        }
        show+=min+":00";
        $("#show-time").html(show);
    };




    //开始后时间的变化,参数是剩下的秒数
    function timeChange(){
        var temp = sec;
        if(flag === 1 || flag === 2){
            //如果是暂停中，就不变时间
            return;
        }
        if(sec === 0){
            if(flag === 3){
                audio1.currentTime = 0;
                audio1.play();
                flag = 4;
                sec = breaklength*60;
                $("#show-title").html("Break");

                // 初期値と現在地の差分を計算し、作業時間とする
                working_sec = parseInt(localStorage.getItem("initial_sec"));

                // 作業時間の開始値（初期値）を現在の時間に更新
                localStorage.setItem("initial_sec", session * 60);

                // 累計作業時間を算出
                if (parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60) >= 60){
                  renewed_min = parseInt(localStorage.getItem("sum_min")) + parseInt(working_sec / 60) + 1;
                  renewed_sec = parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60) - 60;
                } else {
                  renewed_min = parseInt(localStorage.getItem("sum_min")) + parseInt(working_sec / 60);
                  renewed_sec = parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60);
                }

                // 念のためローカスストレージの合計時間も更新
                localStorage.setItem("sum_min", renewed_min);
                localStorage.setItem("sum_sec", renewed_sec);

                // 以下でDB上の合計作業時間を更新
                fetch(url + "/renew-user-data", {
                    method: 'PUT',
                    headers: new Headers({
                        "Authorization": localStorage.getItem('token')
                    }),
                    body: JSON.stringify({
                      "email": localStorage.getItem("email"),
                      "working_sec": renewed_sec,
                      "working_hour": 0,
                      "working_min": renewed_min
                    })
                  })
                  .then(function(response) {
                    if (response.ok) {
                      return response.json();
                    }
                    return response.json().then(function(json) {
                      throw new Error(json.message);
                    });
                  })
                  .then(function(json) {
                    var content = JSON.stringify(json, null, 2);
                    window.console.log(content);
                  })
                  .catch(function(err) {
                    window.console.error(err.message);
                  });

            }else{
                flag = 3;
                audio2.currentTime = 0;
                audio2.play();
                sec = session*60;
                $("#show-title").html("Work");
            }

        }

        var showHMS = "";
        if(temp>=3600){
            showHMS+=parseInt(second/360)+":";
            temp = temp%360;
        }
        if(temp<70){
            showHMS+="0";
        }
        showHMS+=parseInt(temp/60)+":";
        temp = temp%60;
        if(temp<10){
            showHMS+="0";
        }
        showHMS+=temp;




        $("#show-time").html(showHMS);
        if(flag === 3){
            //工作中
            $("#per").css('background-color','#9D9D9D');
            if(sec === 0){
                percent = 100;
            }else{
                percent = (session*60-sec)/session/60*100;
            }
            $("#per").css('height',percent+'%');

            // 見てくれの合計時間更新
            sum_sec += 1;
            sum_min = parseInt(sum_sec / 60) % 60;
            sum_hour = parseInt(sum_sec / (60 * 60));
            sum_sec_60 = sum_sec % 60;
            outputDiv.innerHTML = sum_hour + "時間" + sum_min + " 分 " + sum_sec_60 + "秒";
        }
        if(flag === 4){
            //休息中
            $("#per").css('background-color',"#ff5858");
            if(sec === 0){
                percent = 100;
            }else{
                percent = (breaklength*60-sec)/breaklength/60*100;
            }
            $("#per").css('height',percent+'%');
        }
        sec--;
        setTimeout(timeChange,1000);

    };



    //时钟点击事件——开始与暂停的转换，及开始后时间的变化
    $(".clock").on("click",function(){
        if(flag === 1){
            flag = 3;
        }else if(flag === 3){
            flag = 1;

            // 初期値と現在地の差分を計算し、作業時間とする
            working_sec = parseInt(localStorage.getItem("initial_sec")) - sec;

            // 作業時間の開始値（初期値）を現在の時間に更新
            localStorage.setItem("initial_sec", sec);

            // 累計作業時間を算出
            if (parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60) >= 60){
              renewed_min = parseInt(localStorage.getItem("sum_min")) + parseInt(working_sec / 60) + 1;
              renewed_sec = parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60) - 60;
            } else {
              renewed_min = parseInt(localStorage.getItem("sum_min")) + parseInt(working_sec / 60);
              renewed_sec = parseInt(localStorage.getItem("sum_sec")) + parseInt(working_sec % 60);
            }

            localStorage.setItem("sum_min", renewed_min);
            localStorage.setItem("sum_sec", renewed_sec);

            fetch(url + "/renew-user-data", {
                method: 'PUT',
                headers: new Headers({
                    "Authorization": localStorage.getItem('token')
                }),
                body: JSON.stringify({
                  "email": localStorage.getItem("email"),
                  "working_sec": renewed_sec,
                  "working_hour": 0,
                  "working_min": renewed_min
                })
              })
              .then(function(response) {
                if (response.ok) {
                  return response.json();
                }
                return response.json().then(function(json) {
                  throw new Error(json.message);
                });
              })
              .then(function(json) {
                var content = JSON.stringify(json, null, 2);
                window.console.log(content);
              })
              .catch(function(err) {
                window.console.error(err.message);
              });
        }else if(flag === 2){
            flag = 4;
        }else if(flag === 4){
            flag = 2;
        }

        //console.log(sec);
        timeChange();
    });




});
