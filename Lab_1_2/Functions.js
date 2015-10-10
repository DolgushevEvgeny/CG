var shift = 0;
var eps = 10;
var isUp = false;
var colors = [];
var angleShift = 0;
var cursorPosition = {};
var brands = [];
var carsCount = [];
var totalCars = 0;
var colorIndex = -1;
var autoRotation = true;
var innerRad = 50;
var curPosition = {};
var nextPosition = {};

function AddRow(id, brand, model, year, mileage, engineCapacity)
{
  if ((id == undefined) || (brand == undefined) || (model == undefined)
   || (year == undefined) || (mileage == undefined) || (engineCapacity == undefined))
  {
    id = 'new';
    brand = 'new';
    model = 'new';
    year = '0';
    mileage = '0';
    engineCapacity = '0';
  }
  var table = document.getElementById('mainTable').getElementsByTagName('tbody')[0];
  var tr = document.createElement('tr');
  tr.innerHTML = '<td contenteditable = "true">' + id + '</td>\n\
  <td contenteditable = "true">' + brand + '</td>\n\
  <td contenteditable = "true">' + model + '</td>\n\
  <td contenteditable = "true">' + year + '</td>\n\
  <td contenteditable = "true">' + mileage + '</td>\n\
  <td contenteditable = "true">' + engineCapacity + '</td>';
  table.appendChild(tr);
}

function SaveToLocalStorage()
{
  localStorage.clear();
  var table = document.getElementById('mainTable').getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; ++i)
  {
    var row = rows[i].getElementsByTagName('td');
    var cell = {};

    cell['car_id'] = row[0].innerHTML;
    cell['brand'] = row[1].innerHTML;
    cell['model'] = row[2].innerHTML;
    cell['year'] = row[3].innerHTML;
    cell['mileage'] = row[4].innerHTML;
    cell['engineCapacity'] = row[5].innerHTML;

    var data = JSON.stringify(cell);
    localStorage.setItem(i + '', data);
  }
}

function GetFromLocalStorage()
{
    var storageLength = localStorage.length;

    for (var i = 0; i < storageLength; ++i)
    {
      var data = localStorage.getItem(i + '');
      var cell = JSON.parse(data);
      AddRow(cell['car_id'], cell['brand'], cell['model'], cell['year'], cell['mileage'], cell['engineCapacity']);
    }
}

function ConvertToJSON()
{
  var tableData = {};
  var rowsArr = [];

  var table = document.getElementById('mainTable').getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++)
  {
    var row = rows[i].getElementsByTagName('td');
    var cell = {};

    cell['car_id'] = row[0].innerHTML;
    cell['brand'] = row[1].innerHTML;
    cell['model'] = row[2].innerHTML;
    cell['year'] = row[3].innerHTML;
    cell['mileage'] = row[4].innerHTML;
    cell['engineCapacity'] = row[5].innerHTML;
    rowsArr.push(cell);
  }
  tableData['table'] = rowsArr;

  alert(JSON.stringify(tableData));
}

function DrawOnCanvas()
{
  var canvas;

  if (140 + shift > 400)
  {
    isUp = true;
  }
  else if (0 + shift < 0)
  {
    isUp = false;
  }
  if (isUp)
  {
    shift = shift - eps;
  }
  else
  {
    shift = shift + eps;
  }

  canvas = document.getElementById('canvas');
  canvas.height = 400;
  canvas.width = 400;
  ctx = canvas.getContext('2d');

  ctx.fillStyle = "red";
  ctx.fillRect(20, 0 + shift, 80, 15);
  ctx.fillRect(20, 0 + shift, 15, 120);
  ctx.fillRect(90, 0 + shift, 15, 120);
  ctx.fillRect(0, 110 + shift, 125, 15);
  ctx.fillRect(0, 110 + shift, 15, 30);
  ctx.fillRect(110, 110 + shift, 15, 30);

  ctx.fillStyle = "green";
  ctx.fillRect(130, 0 + shift, 15, 125);
  ctx.fillRect(130, 0 + shift, 80, 15);
  ctx.fillRect(130, 55 + shift, 80, 15);
  ctx.fillRect(130, 110 + shift, 80, 15);

  ctx.fillStyle = "blue";
  ctx.fillRect(240, 0 + shift, 80, 15);
  ctx.fillRect(240, 0 + shift, 15, 120);
  ctx.fillRect(310, 0 + shift, 15, 120);
  ctx.fillRect(220, 110 + shift, 125, 15);
  ctx.fillRect(220, 110 + shift, 15, 30);
  ctx.fillRect(330, 110 + shift, 15, 30);

  setTimeout("DrawOnCanvas()", 20);
}

function DeleteUselessLetters(string)
{
  var i;
  for (i = string.length; i > 0; --i)
  {
    if (string[i] == '<')
    {
        break;
    }
  }

  if (i != 0)
  {
    string = string.substring(0,i);
  }
  return string;
}

function CompareArray(brand, brands, cars)
{
  brand = DeleteUselessLetters(brand)
  if (brands.length == 0)
  {
    brands.push(brand);
    cars.push(1);
    return;
  }

  var isInBrands = false;
  for (var i = 0; i < brands.length; ++i)
  {
    if (brands[i] == brand)
    {
      isInBrands = true;
      cars[i] += 1;
      break;
    }
  }

  if (!isInBrands)
  {
    brands.push(brand);
    cars.push(1);
  }
}

CanvasRenderingContext2D.prototype.DrawSector = function (x, y, radiusA, radiusB, angleFrom, angleTo)
{
  this.save();
  this.beginPath();
  this.translate(x, y);
  this.moveTo(0, 0);
  this.scale(radiusA / radiusB, 1);
  this.arc(0, 0, radiusB, angleFrom, angleTo, false);
  this.restore();
  this.closePath();
}

function FillData()
{
    var storageLength = localStorage.length;

    for (var i = 0; i < storageLength; ++i)
    {
        var data = localStorage.getItem(i + '');
        var cell = JSON.parse(data);

        CompareArray(cell['brand'], brands, carsCount)
    }

    for (var i = 0; i < carsCount.length; ++i)
    {
        totalCars += carsCount[i];
        colors.push(GetRandomColor());
    }
    AddColors();
    setInterval("DrawPieChart()", 20);
    setInterval("IncreaseShift()", 20);
}

function AddColors()
{
    var length = colors.length;
    for (var i = 0; i < length; ++i)
    {
        colors.push(ColorLuminance(colors[i], -0.5));
    }
    for (var i = 0; i < length; ++i)
    {
        colors.push(ColorLuminance(colors[i], 0.5));
    }
    for (var i = 0; i < length; ++i)
    {
        colors.push(ColorLuminance(colors[i], 0.8));
    }
}

function DrawPieChart()
{
    HelpClear();
    var canvas = document.getElementById('pieChart');
    var context = canvas.getContext('2d');
    canvas.height = 300;
    canvas.width = 400;
    var initialAngle = angleShift;
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    var radius = Math.floor((canvas.width - 200) / 2);

    for (var j = 0; j < 20; ++j)
    {
        for (var i = 0; i < brands.length; ++i)
        {
            var angle = carsCount[i] / totalCars * 360;
            var newAngle = initialAngle + angle;
            context.DrawSector(centerX, centerY, 160, radius, degreesToRadians(initialAngle), degreesToRadians(newAngle));
            context.strokeStyle = ColorLuminance(colors[i], -0.5);

            if (CheckColorInArray(i))
            {
                context.strokeStyle = ColorLuminance(colors[i], 0.5);
            }

            context.lineWidth = 2;
            context.stroke();
            initialAngle += angle;
        }
        centerY -= 1;
    }

    initialAngle = angleShift;
    for (var i = 0; i < brands.length; ++i)
    {
        var angle = carsCount[i] / totalCars * 360;
        var newAngle = initialAngle + angle;

        context.DrawSector(centerX, centerY + 1, 160, radius, degreesToRadians(initialAngle), degreesToRadians(newAngle));
        context.fillStyle = colors[i];
        if (CheckColorInArray(i))
        {
            context.fillStyle = ColorLuminance(colors[i], 0.8);
            ShowHelp(brands[i].toString() + '  :  ' + carsCount[i].toString(), ColorLuminance(colors[i], 0.8));
        }
        context.fill();
        initialAngle += angle;
    }
}

function CheckColorInArray(i)
{
    while (i < colors.length)
    {
        if (i == colorIndex)
        {
            return true;
        }
        else
        {
            i += carsCount.length;
        }
    }

    return false;
}

/*
function DrawPieChart()
{
  HelpClear();
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
  var cellsArr = tableInfo['table'];
  var radB = radiusX * Math.cos(GradToRadians(inclineAngle));
  var prevAngle = 0;
  var curAngle = 0;
  for (var j = 0; j < 40; ++j)
  {
    prevAngle = shiftAngle;
    curAngle = shiftAngle;
    for (var i = 0; i < cellsArr.length; ++i)
    {
      ctx.strokeStyle = darkColors[i];
      ctx.lineWidth = 2;
      curAngle = (curAngle + 360 *(parseInt(cellsArr[i]['height']) / sumNumbersOfTable)) % 360;
      if (choosenColor != undefined)
      {
        if (colors[i].toString() == choosenColor.toString())
        {
          ctx.strokeStyle = ColorLuminance(colors[i], 0.6);
        }
      }
      var x = 0.0;
      var y = 0.0;
      var angle = 0.0;
      if (curAngle < prevAngle)
      {
        angle = ((360 - prevAngle + curAngle)/ 2 + prevAngle) % 360;
        x = innerRad  Math.cos(angle  Math.PI / 180);
        y = innerRad  Math.sin(angle  Math.PI / 180);
      }
      else {
        angle = ((curAngle - prevAngle) / 2 + prevAngle) % 360;
        x = innerRad  Math.cos(angle  Math.PI / 180);
        y = innerRad  Math.sin(angle  Math.PI / 180);
      }
      ctx.DrawLines(zeroPoint + x , zeroPoint - j - y, radiusX, radB, GradToRadians(prevAngle), GradToRadians(curAngle));
      prevAngle = curAngle;
    }
  }
  prevAngle = shiftAngle;
  curAngle = shiftAngle;
  for (var i = 0; i < cellsArr.length; ++i)
  {
    ctx.fillStyle = colors[i];
    curAngle =  (curAngle + 360 *(parseInt(cellsArr[i]['height']) / sumNumbersOfTable)) % 360;
    if (choosenColor != undefined)
    {
      if (colors[i] == choosenColor)
      {
        ctx.fillStyle = ColorLuminance(colors[i], 0.8);
        ShowHelp(cellsArr[i]["top"], ColorLuminance(colors[i], 0.8));
      }
    }
    var x = 0.0;
    var y = 0.0;
    var angle = 0.0;
    if (curAngle < prevAngle)
    {
      angle = ((360 - prevAngle + curAngle)/ 2 + prevAngle) % 360;
      x = innerRad  Math.cos(angle  Math.PI / 180);
      y = innerRad  Math.sin(angle  Math.PI / 180);
    }
    else {
      angle = ((curAngle - prevAngle) / 2 + prevAngle) % 360;
      x = innerRad  Math.cos(angle  Math.PI / 180);
      y = innerRad  Math.sin(angle  Math.PI / 180);
    }
    ctx.DrawSector(zeroPoint + x, zeroPoint - j + 1 - y, radiusX, radB, GradToRadians(prevAngle), GradToRadians(curAngle));
    prevAngle = curAngle;
  }
}
*/

function IncreaseShift()
{
    if (autoRotation)
    {
        angleShift += 5;
    }
}

function degreesToRadians(degrees)
{
    return (degrees * Math.PI)/180;
}

function GetRandomColor()
{
    return '#' + Math.round((Math.random() * (999999 - 100000) + 100000));
}

function ColorLuminance(hex, lum)
{
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6)
    {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }

    lum = lum || 0;
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++)
    {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
}

function GetOffsetSum(elem)
{
  var top = 0, left = 0;
	while (elem)
  {
	   top = top + parseFloat(elem.offsetTop);
     left = left + parseFloat(elem.offsetLeft);
     elem = elem.offsetParent;
   }

   return {top: Math.round(top), left: Math.round(left)}
}

function ToHEX(r, g, b)
{
    return '#' + ((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1);
}

function CompareColor(color)
{
    for (var i = 0; i < colors.length; ++i)
    {
        if (colors[i] == color)
        {
            return i;
        }
    }

    return -1;
}

function ShowHelp(message, color)
{
    var canvas = document.getElementById("help");
    canvas.height = 50;
    canvas.width = 150;
    var ctx = canvas.getContext("2d");

    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(0,0, canvas.width, canvas.height);
    ctx.font = "italic 12pt Arial";
    ctx.strokeText(message, 10, 25);
}

function HelpClear()
{
    var canvas = document.getElementById("help");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function Update(xClick, yClick)
{
    cursorPositionOnCanvas = { left: xClick, top: yClick };

    var canvas = document.getElementById('pieChart');
    var context = canvas.getContext('2d');

    var pixel = context.getImageData(cursorPositionOnCanvas.left, cursorPositionOnCanvas.top, cursorPositionOnCanvas.left, cursorPositionOnCanvas.top);
    var pixelColor = { r: pixel.data[0], g: pixel.data[1], b: pixel.data[2], a: pixel.data[3] };
    var color = ToHEX(pixelColor.r, pixelColor.g, pixelColor.b);
    colorIndex = CompareColor(color);
}

$(function()
{
    $('#click-elem').click(function()
    {
        $('#overlay').fadeIn('fast',function()
        {
            $('#nonebox').animate({'top':'100px', 'width':'400px'},500);
        });
    });
    $('#box-close').click(function()
    {
        $('#nonebox').animate({'top':'-1000px'},500,function()
        {
            $('#overlay').fadeOut('fast');
        });
    });
    $("#pieChart").mousemove(function(e)
    {
        var xClick = e.pageX - $(this).offset().left;
        var yClick = e.pageY - $(this).offset().top;

        Update(xClick, yClick);
    });
    $("#pieChart").mouseenter(function(e)
    {
        autoRotation = false;
    });
    $("#pieChart").mouseleave(function(e)
    {
        autoRotation = true;
        colorIndex = -1;
    });
})
