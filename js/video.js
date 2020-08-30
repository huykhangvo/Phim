(function(win, doc){
	var myVideo = function(e,obj){
        if(!e && !obj) {
            throw new Error("Lỗi");
        }
        var arrSettings = [];
		var parentObj = obj;
		for(var i = 0;i<parentObj.length;i++){
			var arr = {
				videoBox : parentObj.eq(i)[0],    
				video : parentObj.eq(i).find('.video')[0],          
				videoControls : parentObj.eq(i).find('.video-controls')[0],  
				loadingLine : parentObj.eq(i).find('.loading-line')[0],
				loadingLineEm : parentObj.eq(i).find('.loading_em')[0],     
				loadingLineSp : parentObj.eq(i).find('.loading_span')[0],  
				VideoBtn : parentObj.eq(i).find('.video-btn')[0],         
				VideoNow : parentObj.eq(i).find('.video-now')[0],        
				VideoCount : parentObj.eq(i).find('.video-count')[0],  
				VideoFullScreen : parentObj.eq(i).find('.video-fullscreen')[0], 
				percent : 0, 
				autoPlay:'false' 
			}
			arrSettings.push(arr)
		}	
		
		for(var i = 0;i< arrSettings.length;i++){
			var a = this.init(e,arrSettings[i]);
		}
	}
	myVideo.prototype = {
		init:function(e,defaultSettings){
			var that = this;
			defaultSettings.video.addEventListener("timeupdate",function(){
				defaultSettings.percent = Math.floor(this.currentTime/this.duration*100)
			    if(defaultSettings.percent != 0){
			    	defaultSettings.loadingLineEm.style.width = defaultSettings.percent + '%';
			    	defaultSettings.loadingLineSp.style.left = defaultSettings.percent + '%';
			    	defaultSettings.loadingLineSp.style.marginLeft = '-10px';
			    	defaultSettings.VideoNow.innerHTML = that.Appendzero(Math.floor(this.currentTime/60)) + ':' + that.Appendzero(Math.floor(this.currentTime%60))
			    	defaultSettings.VideoCount.innerHTML = that.Appendzero(Math.floor(this.duration/60)) + ':' + that.Appendzero(Math.floor(this.duration%60))
			    }
			    if(defaultSettings.percent == 100){
			    	defaultSettings.VideoBtn.setAttribute("class", "video-btn pause")
			    }
			});
			defaultSettings.VideoBtn.addEventListener('click',function(){
				that.playPause(defaultSettings)
			})
			defaultSettings.VideoFullScreen.addEventListener('click',function(){
				that.launchFullScreen(defaultSettings)
			})
			defaultSettings.videoBox.onmouseenter = function(){
				defaultSettings.videoControls.style.bottom = '0px'
			}
			defaultSettings.videoBox.onmouseleave = function(){
				defaultSettings.videoControls.style.bottom = '-75px'
			}
			if(defaultSettings.autoPlay == 'true'){
				that.playPause(defaultSettings)
			}
			window.onresize = function(){
				if(!that.checkFull()){
					defaultSettings.videoBox.setAttribute("class", "video-wrap")
			    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "false")
				}
			}
			that.videoRange(e,defaultSettings)
		},
		playPause:function(defaultSettings){
	       	if (defaultSettings.video.paused){
	        	defaultSettings.video.play();
	            defaultSettings.VideoBtn.setAttribute("class", "video-btn play")
	       	}else{
	            defaultSettings.video.pause();
	            defaultSettings.VideoBtn.setAttribute("class", "video-btn pause")
	       	}
		},
		Appendzero:function(obj){
			if(obj<10) return "0" +""+ obj;  
        	else return obj;
		},
		launchFullScreen:function(defaultSettings){
			if(defaultSettings.VideoFullScreen.getAttribute("data-videofull") == 'false'){
				var element = document.documentElement;
				if(element.requestFullScreen) {
			        element.requestFullScreen(); 
			    } else if(element.mozRequestFullScreen) {
			        element.mozRequestFullScreen(); 
			    } else if(element.webkitRequestFullScreen) {
			        element.webkitRequestFullScreen();
			    }
			    defaultSettings.videoBox.setAttribute("class", "video-wrap video-fullscreen-active")
		    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "true")
			}else{
				var element = document;
				if(element.exitFullscreen) {
			        element.exitFullscreen();
			    } else if(element.mozCancelFullScreen) {
			        element.mozCancelFullScreen(); 
			    } else if(element.webkitCancelFullScreen) {
			        element.webkitCancelFullScreen();
			    }
			    defaultSettings.videoBox.setAttribute("class", "video-wrap")
		    	defaultSettings.VideoFullScreen.setAttribute("data-videofull", "false")
			}
		},
		checkFull:function(){
			var isFull =  document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
			//to fix : false || undefined == undefined
			if(isFull === undefined) isFull = false;
			return isFull;
		},
		videoRange:function(e,aaa){
		
			var defaultSettings = aaa;
			var dv = defaultSettings.loadingLineSp;
			var video = defaultSettings.video;
			var Lwidth = parseInt(defaultSettings.videoControls.offsetWidth);
			var isDown = false;
			var x;
		
			dv.onmousedown = function(e) {
			  
			    x = e.clientX;
			
			   
			    l = dv.offsetLeft;
			   
			    isDown = true;
			   
			}
		
			win.onmousemove = function(e) {
			    if (isDown == false) {
			        return;
			    }
			    //获取x和y
			    var nx = e.clientX;
			    var ny = e.clientY;
			
			    var nl = nx - (x - l);
			    dv.style.left = (nl + 10) + 'px';
			    defaultSettings.loadingLineEm.style.width = (nl) + 'px';
			}
		
			dv.onmouseup = function() {
			  
			    isDown = false;
			    var time = parseInt(dv.style.left)/Lwidth*video.duration;
				video.currentTime = time;                     
			}
			
			var line = defaultSettings.loadingLine
			line.onclick=function(e){
				x = e.clientX;
				var getOffsetLeft = function(obj){    
		            var tmp = obj.offsetLeft;
		            var val = obj.offsetParent;
		            while(val != null){
		            tmp += val.offsetLeft;
		            	val = val.offsetParent;
		            }
		            return tmp;
				}
				x = x-getOffsetLeft(video);
				dv.style.left = (x + 10) + 'px';
			    defaultSettings.loadingLineEm.style.width = (x) + 'px';
			    var time = parseInt(dv.style.left)/Lwidth*video.duration;
				video.currentTime = time;                    
			}
		}
	}
	win.myVideo = myVideo;
})(window, document)
