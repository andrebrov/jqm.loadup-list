/**
 * LoadUp List plugin for jQuery Mobile v 1.0.1
 * 
 * Copyright (c) 2010 Rebrov Andrey  <andrebrov@gmail.com>
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details. 
 *
 */

var _target=null;
var _dragging=false;
var  _top=0, _yspeed=0;
var _upMoved = false;
var _startTop = 0;
var _diff = 30;
var _bottomBorder;
var _lastPageY = false;

jQuery.fn.loadup = function(onloadmove,onloadfinish) {	
	this.each(function(){		
		this.ontouchstart = touchstart;
		this.ontouchend = touchend;
		this.ontouchmove = touchmove;
		this.getfooter = getfooter; 
		this.onloadmove = onloadmove;
		this.onloadfinish = onloadfinish;
	});
};

function getfooter(){
	var footer;
	var n = $("#"+_target);		
	while (n && n.attr("data-role")!="page") {
		n = n.parent();
	}	
	n.find("div").each(function(){
		if ($(this).attr("data-role")=="footer") n = $(this);
	});
	_bottomBorder = n.offset().top;		
}
function touchstart(e){
	_target = this.id;
	_yspeed = 0;	
	$(e.changedTouches).each(function(){
		var curTop = ($('#'+_target).css("top") == 'auto') ? this.pageY : parseInt($('#'+_target).css("top"));		
		if(!_dragging){			
			_top = curTop;
			_dragging = true;
		}		
	});
};
function touchmove(e){	
	if(_dragging) {
		var _lasttop = (isNaN(parseInt($('#'+_target).css("top")))) ? 0:parseInt($('#'+_target).css("top"));
	}
	var action = this.onloadmove;
	$(e.changedTouches).each(function(){		
		e.preventDefault();				
		if (!_lastPageY){
			_lastPageY = this.pageY;
		}else{
			_top = _lasttop - (_lastPageY-this.pageY);
			_lastPageY = this.pageY;
			if(_dragging) {
				_yspeed = Math.round((_yspeed + Math.round( _top - _lasttop))/1.5);
				if (_yspeed<0 && !_upMoved) {
					_upMoved = true;
					var lastLiBottom = $('#'+_target).offset().top+$('#'+_target).height();								
					getfooter();									
					if ((lastLiBottom- _bottomBorder<0)&& Math.abs(lastLiBottom- _bottomBorder)>_diff){													
						action();
					}
				}
				$('#'+_target).css({ position: "relative" });			
				$('#'+_target).css({ top: _top+"px" });			
			}	
		}
	});	
};
function touchend(e){
	$(e.changedTouches).each(function(){
		if(!e.targetTouches.length){			
			_dragging = false;			
		}		
	});
	var action = this.onloadfinish;
	if (_upMoved){
		var lastLiBottom = $('#'+_target).offset().top+$('#'+_target).height();														
		getfooter();	
		if ((lastLiBottom- _bottomBorder<0)&& Math.abs(lastLiBottom- _bottomBorder)>_diff){
			action();
			$('#'+_target).animate({ top: 0}, "fast");
			dh=document.body.scrollHeight
			ch=document.body.clientHeight
			if(dh>ch){
				moveme=dh-ch
				window.scrollTo(0,moveme)
			}
		}
		_upMoved = false;
		_lastPageY = false;		
	}	
};