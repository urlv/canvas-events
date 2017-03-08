var CanvasEvents = (function(canvasElem){
  'use strict'

  if(!(canvasElem instanceof window.HTMLCanvasElement)){
    throw 'the argumant must be a canvas element';
  }

  var self = {};
  self.ctx = canvasElem.getContext('2d');
  self.svg = null;
  self.lineWidth = 1;
  self.scale = {x: 1,y: 1};
  self.rotate = 0;
  self.translate = {x: 0, y: 0};

  // make sure the layer events will be always above the canvas(e.g. when canvas position changed)
  setInterval(function(){
    self.placeLayer();
  },100);

  // set layer events above the canvas
  self.placeLayer = function(){
    var canvasComputedStyle = getComputedStyle(self.ctx.canvas);
    var svgStyle = self.svg.style;
    svgStyle.position = 'absolute';
    svgStyle.border = canvasComputedStyle.border;
    svgStyle.left = self.ctx.canvas.offsetLeft + 'px';
    svgStyle.top = self.ctx.canvas.offsetTop + 'px';
    self.svg.setAttribute('width',self.ctx.canvas.width);
    self.svg.setAttribute('height',self.ctx.canvas.height);
  }

  // create layer for handling events
  self.createEventHandlerLayer = function(){
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    self.svg = svg;
    document.querySelector('body').appendChild(svg);
  }();

  // expose events method for the elements into the canvas
  self.eventObject = function(svgShape){
    // supported only mouse envets
    var validEvents = ['click','contextmenu','dbclick','mousedown','mouseenter','mouseleave','mousemove','mouseover','mouseout','mouseup'];

    return {
      on: function(eventName, func){
        if(validEvents.indexOf(eventName) == -1){
          throw 'unsupport "' + eventName + '" event';
        }
        svgShape.addEventListener(eventName, func);
        return this;
      },
      off: function(eventName, func){
        // remove specific event function
        if(arguments.length === 2){
          if(validEvents.indexOf(eventName) == -1){
            throw 'unsupport "' + eventName + '" event';
          }
          svgShape.removeEventListener(eventName, func);
        }else{
          // remove all events
          var svgShapeWithoutEvents = svgShape.cloneNode();
          svgShape.parentNode.replaceChild(svgShapeWithoutEvents, svgShape);
        }
        return this;
      }
    }
  }

  // add shape on layer events for object in canvas
  self.appendShape = function(shape,arg){
    var svgShape = null;
    var x = arg.x * self.scale.x;
    var y = arg.y * self.scale.y;

    if(shape === 'rect'){
      svgShape = document.createElementNS(self.svg.namespaceURI, 'rect');
      svgShape.setAttribute('x',x);
      svgShape.setAttribute('y',y);
      svgShape.setAttribute('width',arg.w * self.scale.x);
      svgShape.setAttribute('height',arg.h * self.scale.y);
    }else if(shape === 'circle'){
      svgShape = document.createElementNS(self.svg.namespaceURI, 'ellipse');
      svgShape.setAttribute('cx',x);
      svgShape.setAttribute('cy',y);
      svgShape.setAttribute('rx',arg.r * self.scale.x);
      svgShape.setAttribute('ry',arg.r * self.scale.y);
    }
    svgShape.setAttribute('fill','transparent');
    svgShape.setAttribute('stroke','transparent');
    svgShape.setAttribute('stroke-width',self.lineWidth);
    svgShape.setAttribute('transform','rotate(' + self.rotate / (Math.PI/180) + ') ' +
    'translate(' + self.translate.x + ',' + self.translate.y + ')');

    self.svg.appendChild(svgShape);

    return self.eventObject(svgShape);
  }

  // expose all the original canvas method with the implementation for events
  var api = {
    rect: function(x,y,width,height){
      self.ctx.rect(x,y,width,height);
      return self.appendShape('rect',{x:x,y:y,w:width,h:height});
    },
    fillRect: function(x,y,width,height){
      self.ctx.fillRect(x,y,width,height);
      return self.appendShape('rect',{x:x,y:y,w:width,h:height});
    },
    strokeRect: function(x,y,width,height){
      self.ctx.strokeRect(x,y,width,height);
      return self.appendShape('rect',{x:x,y:y,w:width,h:height});
    },
    clearRect: function(x,y,width,height){
      self.ctx.clearRect(x,y,width,height);
      return self.appendShape('rect',{x:x,y:y,w:width,h:height});
    },
    arc: function(x,y,r,height,sAngle,eAngle,counterclockwise){
      self.ctx.arc(x,y,r,sAngle,eAngle,counterclockwise);
      return self.appendShape('circle',{x:x,y:y,r:r});
    },
    createLinearGradient: function(x0,y0,x1,y1){
      return self.ctx.createLinearGradient(x0,y0,x1,y1);
    },
    createPattern: function(img, repeatMode){
      return self.ctx.createPattern(img, repeatMode);
    },
    createRadialGradient: function(x0,y0,r0,x1,y1,r1){
      return self.ctx.createRadialGradient(x0,y0,r0,x1,y1,r1);
    },
    fill: function(){
      return self.ctx.fill();
    },
    stroke: function(){
      return self.ctx.stroke();
    },
    beginPath: function(){
      return self.ctx.beginPath();
    },
    moveTo: function(x,y){
      return self.ctx.moveTo(x,y);
    },
    closePath: function(){
      return self.ctx.closePath();
    },
    lineTo: function(x,y){
      return self.ctx.lineTo(x,y);
    },
    clip: function(){
      return self.ctx.clip();
    },
    quadraticCurveTo: function(cpx,cpy,x,y){
      return self.ctx.quadraticCurveTo(cpx,cpy,x,y);
    },
    bezierCurveTo: function(cp1x,cp1y,cp2x,cp2y,x,y){
      return self.ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y);
    },
    arcTo: function(x1,y1,x2,y2,r){
      return self.ctx.arcTo(x1,y1,x2,y2,r);
    },
    isPointInPath: function(x,y){
      return self.ctx.isPointInPath(x,y);
    },
    scale: function(scalewidth,scaleheight){
      self.scale.x = scalewidth;
      self.scale.y = scaleheight;
      return self.ctx.scale(scalewidth,scaleheight);
    },
    rotate: function(angle){
      self.rotate = angle;
      return self.ctx.rotate(angle);
    },
    translate: function(x,y){
      self.translate.x = x;
      self.translate.y = y;
      return self.ctx.translate(x,y);
    },
    transform: function(a,b,c,d,e,f){
      self.matrix.a = a;
      self.matrix.b = b;
      self.matrix.c = c;
      self.matrix.d = d;
      self.matrix.e = e;
      self.matrix.f = f;
      return self.ctx.transform(a,b,c,d,e,f);
    },
    setTransform: function(a,b,c,d,e,f){
      return self.ctx.setTransform(a,b,c,d,e,f);
    },
    fillText: function(text,x,y,maxWidth){
      self.ctx.fillText(text,x,y,maxWidth);
      var heigh = parseInt(self.ctx.font);
      return self.appendShape('rect', {x:x,y:y-heigh,w:self.ctx.measureText(text).width,h:heigh});
    },
    strokeText: function(text,x,y,maxWidth){
      self.ctx.strokeText(text,x,y,maxWidth);
      var heigh = parseInt(self.ctx.font);
      return self.appendShape('rect', {x:x,y:y-heigh,w:self.ctx.measureText(text).width,h:heigh});
    },
    measureText: function(text){
      return self.ctx.measureText(text);
    },
    drawImage: function(img,a,b,c,d,e,f,g,h){
      if(arguments.length === 3){
        self.ctx.drawImage(img,a,b);
        return self.appendShape('rect',{x:a,y:b,w:img.width,h:img.height});
      }else if(arguments.length === 5){
        self.ctx.drawImage(img,a,b,c,d);
        return self.appendShape('rect',{x:a,y:b,w:c,h:d});
      }else if(arguments.length === 9){
        self.ctx.drawImage(img,a,b,c,d,e,f,g,h);
        return self.appendShape('rect',{x:e,y:f,w:g,h:h});
      }else{
        throw 'Unkonwn function "drawImage" with ' + arguments.length + ' arguments';
      }
    },
    createImageData: function(a,b){
      if(arguments.length === 1){
        return self.ctx.createImageData(a);
      }else if(arguments.length === 2){
        return self.ctx.createImageData(a,b);
      }else{
        throw 'Unkonwn function "createImageData" with ' + arguments.length + ' arguments';
      }
    },
    getImageData: function(x,y,width,height){
      return self.ctx.getImageData(x,y,width,height);
    },
    putImageData: function(img,a,b,c,d,e,f){
      if(arguments.length === 3){
        self.ctx.putImageData(img,a,b);
        return self.appendShape('rect',{x:a,y:b,w:img.width,h:img.height});
      }else if(arguments.length === 7){
        self.ctx.putImageData(img,a,b,c,d,e,f);
        return self.appendShape('rect',{x:a+c,y:b+d,w:e-c,h:f-d});
      }else{
        throw 'Unkonwn function "putImageData" with ' + arguments.length + ' arguments';
      };
    },
    save: function(){
      return self.ctx.save();
    },
    restore: function(){
      return self.ctx.restore();
    },
    getContext: function(contextType,contextAttributes){
      return self.ctx.getContext(contextType, contextAttributes);
    },
    toDataURL: function(type, encoderOptions){
      if(arguments.length === 0){
        return self.ctx.toDataURL();
      }else if(arguments.length === 2){
        return self.ctx.toDataURL(type, encoderOptions);
      }else{
        throw 'Unkonwn function "toDataURL" with ' + arguments.length + ' arguments';
      };
    }
  }

  // original canvas properties
  Object.defineProperty(api, 'fillStyle', {
    get : function(){ return self.ctx.fillStyle;},
    set: function(val){self.ctx.fillStyle = val;}
  });
  Object.defineProperty(api, 'strokeStyle', {
    get : function(){ return self.ctx.strokeStyle;},
    set: function(val){self.ctx.strokeStyle = val;}
  });
  Object.defineProperty(api, 'shadowColor', {
    get : function(){ return self.ctx.shadowColor;},
    set: function(val){self.ctx.shadowColor = val;}
  });
  Object.defineProperty(api, 'shadowBlur', {
    get : function(){ return self.ctx.shadowBlur;},
    set: function(val){self.ctx.shadowBlur = val;}
  });
  Object.defineProperty(api, 'shadowOffsetX', {
    get : function(){ return self.ctx.shadowOffsetX;},
    set: function(val){self.ctx.shadowOffsetX = val;}
  });
  Object.defineProperty(api, 'shadowOffsetY', {
    get : function(){ return self.ctx.shadowOffsetY;},
    set: function(val){self.ctx.shadowOffsetY = val;}
  });
  Object.defineProperty(api, 'lineCap', {
    get : function(){ return self.ctx.lineCap;},
    set: function(val){self.ctx.lineCap = val;}
  });
  Object.defineProperty(api, 'lineJoin', {
    get : function(){ return self.ctx.lineJoin;},
    set: function(val){self.ctx.lineJoin = val;}
  });
  Object.defineProperty(api, 'lineWidth', {
    get : function(){ return self.ctx.lineWidth;},
    set: function(val){
      self.ctx.lineWidth = val;
      self.lineWidth = val;
    }
  });
  Object.defineProperty(api, 'miterLimit', {
    get : function(){ return self.ctx.miterLimit;},
    set: function(val){self.ctx.miterLimit = val;}
  });
  Object.defineProperty(api, 'font', {
    get : function(){ return self.ctx.font;},
    set: function(val){self.ctx.font = val;}
  });
  Object.defineProperty(api, 'textAlign', {
    get : function(){ return self.ctx.textAlign;},
    set: function(val){self.ctx.textAlign = val;}
  });
  Object.defineProperty(api, 'textBaseline', {
    get : function(){ return self.ctx.textBaseline;},
    set: function(val){self.ctx.textBaseline = val;}
  });
  Object.defineProperty(api, 'globalAlpha', {
    get : function(){ return self.ctx.globalAlpha;},
    set: function(val){self.ctx.globalAlpha = val;}
  });
  Object.defineProperty(api, 'globalCompositeOperation', {
    get : function(){ return self.ctx.globalCompositeOperation;},
    set: function(val){self.ctx.globalCompositeOperation = val;}
  });

  return api;
});
