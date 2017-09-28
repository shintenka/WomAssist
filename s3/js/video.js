window.onload = function(){
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
  window.URL = window.URL || window.webkitURL;
  
  var video = document.getElementById('myVideo');
  video.width = window.parent.screen.width;
  video.height = window.parent.screen.height;
  
  localStorage.setItem('start_detection_time', Math.floor( Date.now() / 1000 ));
  localStorage.setItem('end_detection_time', Math.floor( Date.now() / 1000 ));

  localStorage.setItem('detection_time', Math.floor( Date.now() / 1000 ));
  localStorage.setItem('not_detection_time', Math.floor( Date.now() / 1000 ));
  var localStream = null;
  // ウェブカメラの映像を一旦受け取る Canvas を生成する

  navigator.getUserMedia({video: true, audio: false},
   function(stream) { // for success case
    //console.log(video);
    video.src = window.URL.createObjectURL(stream);
   },
   function(err) { // for error case
    console.log(err);
   }
  );
  function face_ditection(){

      // 描画する Canvas を取得する
      canvas = document.getElementById('img_canvas');
      context = canvas.getContext('2d');

      context.drawImage(video, 0, 0);
      //画像データを取得する
      sourceImageData = context.getImageData(0, 0, window.parent.screen.width, window.parent.screen.height);
      sourceData = sourceImageData.data;

      //console.log(image); 
      // 顔検出
      var comp = ccv.detect_objects({
                 "canvas"        : ccv.grayscale(ccv.pre(canvas)),
                 "cascade"       : cascade,
                 "interval"      : 5,
                 "min_neighbors" : 1
      });
 
      // 結果の出力(出力したい時にコメントアウトとる)
      // 結果を出力したい時はindex.htmlのvideoとcanvasのstyle="display:none"を消す
//      context.drawImage(video, 0, 0);
//      context.lineWidth = 2;
//      context.strokeStyle = "#ff0000";
      
      //複数顔を検出した場合、一番領域の大きいもののみを保持する
      var max_comp_width = 0;
      var max_comp = 0;
      for (var i=0;i<comp.length;i++) {        
        if (max_comp_width < comp[i].width){
          max_comp = i;
        }
      }
      
      //顔検出できなかった場合、かつ領域が小さすぎる場合
      if(comp.length === 0 || comp[max_comp].width < 100){
        localStorage.setItem('not_detection_time', Math.floor( Date.now() / 1000 ));
      }
      //顔検出できた場合
      else{
        //顔検出位置を赤枠で囲う(テストの時に確認のため使用)
        //context.strokeRect(comp[max_comp].x,comp[max_comp].y,comp[max_comp].width,comp[max_comp].height);
	
          //連続で60秒顔検出されなければ作業時間のリセット(デモでは短くしてもよし)
        if ((Math.floor( Date.now() / 1000 ) - localStorage.getItem("detection_time")) > 6){
          //長期作業時間のリセット
          localStorage.setItem('start_detection_time', Math.floor( Date.now() / 1000 ));
          //長期作業の終了時間を格納
          localStorage.setItem('end_detection_time', localStorage.getItem("detection_time"));
          //ここで長期作業用のAPIを叩く
        }
        localStorage.setItem('detection_time', Math.floor( Date.now() / 1000 ));

        //顔近い判定
        if(comp[max_comp].width > 250){
          alert("顔ちけぇわ!!");
          //ここで姿勢APIを叩く
        }
      }
  }
  //1秒間隔で顔検出関数を呼ぶ
  setInterval(function(){
    window.requestAnimationFrame(face_ditection);
  },1000);
} 
