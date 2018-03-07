var canvas = document.getElementById("canvas");
var processing = new Processing(canvas, function(processing) {
    processing.size(400, 400);
    processing.background(0xFFF);

    var mouseIsPressed = false;
    processing.mousePressed = function () { mouseIsPressed = true; };
    processing.mouseReleased = function () { mouseIsPressed = false; };

    var keyIsPressed = false;
    processing.keyPressed = function () { keyIsPressed = true; };
    processing.keyReleased = function () { keyIsPressed = false; };

    function getImage(s) {
        var url = "https://www.kasandbox.org/programming-images/" + s + ".png";
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    function getLocalImage(url) {
        processing.externals.sketch.imageCache.add(url);
        return processing.loadImage(url);
    }

    // use degrees rather tshan radians in rotate function
    var rotateFn = processing.rotate;
    processing.rotate = function (angle) {
        rotateFn(processing.radians(angle));
    };
    with (processing) {
        var Polygon = function(xPos, yPos, points, Color)
        {  
            this.xPos = xPos;
            this.yPos = yPos;
            this.points = points;
            this.color = Color;
            
            this.points.push([this.points[0][0], this.points[0][1]]); //?
            
            this.draw = function()
            {
                beginShape();
                fill(this.color);
                for(var i = 0; i < this.points.length; i++)
                {
                    vertex(this.xPos + this.points[i][0], this.yPos + this.points[i][1]);
                }
                endShape();
            };
        };
        var triPolygon = new Polygon(200, 140, [[30, 3], [4, 60], [60, 60]], 255);
        var rectPolygon = new Polygon(100, 180, [[0, 0], [50, 0], [50, 50], [0, 50]], 255);
        
        var crossProduct = function(point1, point2, point3)
        {
            return  (point1.xPos - point3.xPos) * (point2.yPos - point3.yPos) - 
                    (point2.xPos - point3.xPos) * (point1.yPos - point3.yPos);
        };
        var pointObserver = {
            colliding : function(point1, polygon1)
            { 
                var bools = [];
                var v1, v2;
                for(var i = 0; i < polygon1.points.length - 1; i++)
                {
                    var b1 = (crossProduct(point1, {
                        xPos : polygon1.xPos + polygon1.points[i][1], 
                        yPos : polygon1.yPos + polygon1.points[i][0],
                    }, {
                        xPos : polygon1.xPos + polygon1.points[i + 1][1], 
                        yPos : polygon1.yPos + polygon1.points[i + 1][0],
                    }) < 0.0);
                    bools.push(b1);
                }
                
                var facing = true;
                for(var i = 0; i < bools.length - 1; i++)
                {
                    facing &= (bools[i] === bools[i + 1]);
                    if(!facing)
                    {
                        return false;
                    }
                }
                return true;
            }
        };
        
        var draw = function()
        {
            background(255, 255, 255);
            triPolygon.draw();
            rectPolygon.draw();
            
            var point1 = {
                xPos : mouseX,
                yPos : mouseY,
            };
            triPolygon.color = (pointObserver.colliding(point1, triPolygon)) ? 0 : 255;
            rectPolygon.color = (pointObserver.colliding(point1, rectPolygon)) ? 0 : 255;
        };
    }
    if (typeof draw !== 'undefined') processing.draw = draw;
});

























