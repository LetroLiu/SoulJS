/********************
/**file name:soul.js
/**create date:2013-11-22
/**email:245841000@qq.com
/**auther:Richard Liu
/**version:1.0
********************/
(function(window,undefined){
	var soul=function(){};
	soul=soul.prototype={
		$:window.document,
		eventEl:[],
		targEl:null,
		getEl:function(o){
			return this.isObject(o)?o:this.$.getElementById(o);
			//return el.nodeType?el:this.$.getElementById(el);
		},
		createEl:function(el){
			return el.nodeType?el:this.$.createElement(el);
		},
		html:function(){
			
		},
		text:function(){
			
		},
		elAttr:function(el,name,value){
			targEl=el;
			if(this.isObject(name)){
				for(var o in name){
					this.elAttr(el,o,name[o]);
				}
				return this;
			}
			if(name=="style"){
				value=value.replace(/\s+/g,'').split(";");
				for(var o=0;o<value.length-1;o++){
					this.isObject(el["style"]) && (el["style"][value[o].split(":")[0]]=value[o].split(":")[1]);//here is to fix ie bug.
				}
				if(typeof(el["style"]))return el;

			}
			el.setAttribute(name,value);
			return this;
		},
		oAtts:function(attributes){
			for(var o in attributes){
				this[o] && (this[o]=attributes[o]);
			}
			return this;
		},
		att:function(obj,att){
			return obj[att];
		},
		isFunction:function(f){
			return this.lower(typeof(f))==="function";
		},
		isObject:function(o){
			return this.lower(typeof(o))==="object";
		},
		isString:function(s){
			return this.lower(typeof(s))==="string";
		},
		lower:function(s){
			return s.toString().toLowerCase();
		},
		bind:function(event,call,obj,useCapture){
			(obj=obj?obj:window)==this.$ && (obj=window);
			useCapture=useCapture?useCapture:false;
			this.isEmpty(obj.id) && (obj.id=obj.localName+Math.random()*100000);
			this.eventEl[obj.id+"_"+event]=call;
			window.attachEvent?(obj.attachEvent("on"+event,this.eventEl[obj.id+"_"+event])):(obj.addEventListener(event,this.eventEl[obj.id+"_"+event],useCapture)); 
		},
		unbind:function(event,call,obj,useCapture){
			(obj=obj?obj:window)==this.$ && (obj=window);
			useCapture=useCapture?useCapture:false;
			this.eventEl[obj.id+"_"+event] && window.detachEvent?(obj.detachEvent("on"+event,this.eventEl[obj.id+"_"+event])):(obj.removeEventListener(event,this.eventEl[obj.id+"_"+event],useCapture));
		},
		isEmpty:function(s){
			return isNull(obj) || (this.isString(typeof(s)) && s.replace(/\s+/g,'')==="");
		},
		isNull:function(obj){
			return !obj;
		},
		extend:function(obj,targ){
			for(var o in obj){
				!targ?this[o]=obj[o]:targ[o]=obj[o];
			}
		}
	};
	window.soul=soul;
	//********scroll begin********
	//asynchronous add contents when trigger scroll event.
	soul.extend({scrollAsyn:{
		callback:null,
		hadBar:function(){
			var e=soul.$.documentElement,
			b=soul.$.body;
			return !(e.scrollTop?e.clientHeight==e.scrollHeight:b.clientHeight==b.scrollHeight);
		},
		isfooter:function(){
			var e=soul.$.documentElement,
			b=soul.$.body;
			return e.scrollTop?e.clientHeight+e.scrollTop==e.scrollHeight:b.clientHeight+b.scrollTop==b.scrollHeight;
			//return (e.scrollTop || b.clientHeight)+(e.scrollTop || b.scrollTop)==(e.scrollTop || b.scrollHeight) this code's used equal next.[error]
		},
		load:function(callback){
			soul.isObject(callback) && soul.oAtts(callback);
			soul.isFunction(callback) && (this.callback=callback);
			var that=this;
			window.onscroll=function(){that.isfooter() && soul.isFunction(callback) && that.callback();};
			return soul;
		}
	}});
	//********scroll end********
	
	//********ajax begin********
	soul.extend({ajax:{
		src:"",
		method:"GET",
		sysn:true,
		callback:function(){},
		response:"",
		request:"responseText",
		headName:null,
		headValue:null,
		xmlhttp:null,
		data:null,
		createHTTP:function(){
			var xmlhttp=function(){
				try{
					return new XMLHttpRequest();
				}catch(e){
					try{
						return new ActiveXobject("Msxml2.XMLHTTP");
					}catch(e){
						return new ActiveXObject("Microsoft.XMLHTTP");
					}
				}
			};
			this.xmlhttp=xmlhttp();
			return this.xmlhttp;
		},
		open:function(src,callback,method,sysn,request){
			this.createHTTP();
			this.src=src?src:"";
			this.method=method?method:"GET";
			this.sysn=sysn?sysn:true;
			this.callback=callback?callback:function(){};
			this.setHeader();
			this.xmlhttp.open(this.method,this.src,this.sysn);
			this.onreadystatechange(this.callback,request);
			return this;
		},
		getResponse:function(request){
			var data="";
			var xml=/xml/,
			json=/json/;
			this.request=request?request:"responseText";
			if(xml.test(this.request.toLowerCase())){
				data=this.xmlhttp.responseXML;
			}else if(json.test(this.request.toLowerCase())){
				eval(data+"="+this.xmlhttp.responseText);
			}else{
				data=this.xmlhttp.responseText;
			}
			this.response=data;
			return this;
		},
		setHeader:function(header,value){
			header && value && this.setRequestHeader(header,value);
			return this;
		},
		send:function(data){
			this.data=data?data:null;
			this.xmlhttp.send(this.data);
			return this;
		},
		onreadystatechange:function(callback,response){
			if(this.sysn){
				var that=this;
				this.xmlhttp.onreadystatechange=function(data){
					//here status value equal to 0 when the file is request from to local service.
					if(that.xmlhttp.readyState==4 && (that.xmlhttp.status==200 || that.xmlhttp.status==0))
					{
						that.getResponse(response);
						data=that.response;
						callback(data);
					}
				}
			}
			return this;
		},
		setAttribute:function(obj){
			for(var o in this){
				obj[o] && (obj[o]="this."+o+(soul.isString(obj[o])?"=\'"+obj[o]+"\'":"="+obj[o])) && eval(obj[o]);
			}
			return this;
		},
		get:function(obj){
			this.setAttribute(obj);
			this.open(this.src,this.callback,"GET",this.sysn,this.request);
			this.send(this.data);
			return this;
		},
		post:function(obj){
			this.setAttribute(obj);
			this.open(this.src,this.callback,"POST",this.sysn,this.request);
			this.send(this.data);
			return this;
		}
	}});
	//********ajax end********
	/**ajax example:
	soul.ajax.open("ajax.html");
	soul.ajax.send();
	soul.ajax.getResponse()
	soul.ajax.response
	soul.ajax.get({src:"ajax.html",mehod:"GET",sysn:false,callback:function(a){console.log(a);}})**/
	
	//********enlargeIMG begin********
	soul.extend({enlargeIMG:{
		img:null,
		targ:null,
		floorDiv:null,
		loadImg:function(img,targ){//load function.
			this.img=img;
			if(this.isImg(targ)){
				this.targ=targ;
			}else{
				if(targ.children && this.isImg(targ.children[0])){
					this.targ=targ.children[0];
				}else{
					this.targ=soul.createEl('img');
					targ.appendChild(this.targ);
				}
			}
			this.targ.style.position="absolute";
			this.targ.parentElement.overflow="hidden";
			this.targ.src=img.src;
			this.floorDiv=soul.createEl('div');
			var that=this;
			img.onmousemove=img.onmousewheel=function(){
				var e=event || window.event;
				that.trajectory(e,that.img,that.targ,that.floorDiv);
			};
		},
		trajectory:function(e,img,targ,floorDiv){//trajectory from this mouse over image.
				var iw=img.offsetWidth,ih=img.offsetHeight,tw=targ.offsetWidth,th=targ.offsetHeight;
				var e=event || window.event;
				
				var ttw=targ.parentElement.offsetWidth*iw/tw,
				tth=targ.parentElement.offsetHeight*ih/th;
				
				floorDiv.style.display="";
				floorDiv.style.backgroundColor='#abc';
				floorDiv.style.width=ttw+"px";
				floorDiv.style.height=tth+"px";
				floorDiv.style.position="absolute";
				document.body.appendChild(floorDiv);
				
				var x=e.offsetX<=ttw/2?0:((e.offsetX+ttw/2)>iw?(iw-ttw):(e.offsetX-ttw/2)),
				y=e.offsetY<=tth/2?0:((e.offsetY+tth/2)>ih?(ih-tth):(e.offsetY-tth/2));
				
				var ww=x*tw/iw,hh=y*th/ih;
				targ.style.left=-ww+"px";
				targ.style.top=-hh+"px";
					
				floorDiv.style.left=img.offsetLeft+(e.offsetX<=ttw/2?0:((e.offsetX+ttw/2)>iw?(iw-ttw):(e.offsetX-tth/2)))+"px";
				floorDiv.style.top=img.offsetTop+(e.offsetY<=tth/2?0:((e.offsetY+tth/2)>ih?(ih-tth):(e.offsetY-tth/2)))+"px";
				floorDiv.style.opacity=0.5;
				floorDiv.style.filter="alpha(opacity=50)";//fixed ie opaccity bug.
				//fixed can't always move this picture when move 1px not tiger the floor under object events.
				floorDiv.onmousemove=floorDiv.onmousewheel=function(){
					floorDiv.style.display="none";
					//here fixed "none" display when move 1px not tiger image events.
					var timeId=window.setTimeout(function(){
						floorDiv.style.display="";
						window.clearTimeout(timeId);
					},10);
				};
		},
		isImg:function(obj){
			return this.isElement(obj)?this.Lower(obj.tagName)==="img":false;
		},
		isElement:function(obj){
			return this.Lower(typeof(obj))==="object"?obj.nodeType==1:false;
		},
		Lower:function(string){
			return string.toLowerCase();
		}
	}});
	//********enlargeIMG end********
	/**example:
	var i=soul.enlargeIMG.createEl('img');
	i.style.position="absolute";
	var d=soul.enlargeIMG.createEl('div');
	d.style.width="200px";
	d.style.height='200px';
	d.style.left="300px";
	d.style.top="200px";
	d.style.position="absolute";
	d.style.overflow="hifloorDiven";
	d.appendChild(i);
	document.body.appendChild(d);
	soul.enlargeIMG.loadImg(document.getElementById('largeImg'),i);
	**/
	
	//********enlargeIMG begin********
	soul.extend({floor:{
		b:null,
		targ:null,
		createFloor:function(contents,btnText,el)
		{
			this.b=soul.$.body;
			this.targ=el?soul.getEl(el):soul.$.body;
			el=soul.createEl("div");
			soul.elAttr(el,"class","floorDiv");
			soul.elAttr(el,"id","floorDiv_id406");
			soul.elAttr(el,"style","width:"+this.targ.offsetWidth+"px;height:"+this.targ.offsetHeight+"px;left:"+this.targ.offsetLeft+"px;top:"+this.targ.offsetTop+"px;position:absolute;background: #abc;z-index: 999;opacity: 0.5;fill-opacity: 0;filter: alpha(opacity=50);");
			//can not load css file in ie.
			//var c=soul.createEl("link");
			//soul.elAttr(c,"type","text/css");
			//soul.elAttr(c,"rel","stylesheet");
			//soul.elAttr(c,"href","css.css");
			//soul.$.getElementsByTagName("head")[0].appendChild(c);
			if(soul.getEl("floorDiv_id406"))return;
			this.b.appendChild(el);
			this.createContent(el,contents,btnText);
		},
		closeFloor:function(el){
			el=typeof(el)==="Object" || typeof(el)==="object"?el:soul.getEl(el);
			this.b.removeChild(el);
		},
		createContent:function(el,contents,btnText){
			var content=soul.createEl("div");
			//soul.elAttr(content,"type","button");
			var text=soul.createEl("p");
			//soul.elAttr(text,"style","")
			text.innerHTML=contents?contents:"";
			var i=soul.createEl("input");
			soul.elAttr(i,"type","button");
			soul.elAttr(i,"value",btnText && btnText!=""?btnText:"Close");
			//this.elAttr(i,"onclick","floor.closeFloor('floorDiv_id406')");//ie can not work.
			i.onclick=function(){soul.floor.closeFloor('floorDiv_id406')};
			content.appendChild(text);
			content.appendChild(i);
			el.appendChild(content);//left:"+((this.targ.offsetWidth-content.offsetWidth)/2)+"px; defualt here contentdiv width equal with the targ.
			//soul.elAttr(content,"style","width:"+(this.targ.offsetWidth*2/5)+"px;left:"+((this.targ.offsetWidth-content.offsetWidth*2/5)/2)+"px;top:"+((this.targ.offsetHeight-content.offsetHeight)/2)+"px;position:relative;z-index:1000;dispaly:block;margin:0 auto;text-align:center;");//内容居中
			soul.elAttr(content,"style","width:"+(this.targ.offsetWidth*2/5)+"px;left:"+((this.targ.offsetWidth-content.offsetWidth*2/5)/2)+"px;top:"+((window.screen.height-content.offsetHeight)/2)+"px;position:relative;z-index:1000;dispaly:block;margin:0 auto;text-align:center;");//屏幕居中
		}
	}});
	
	//********enlargeIMG end********
	soul.extend({a:{b:{c:{d:function(){alert(1);}}}}});
	soul.extend({a:{d:{c:{d:function(){alert(2);}}}}});
	
})(window)
