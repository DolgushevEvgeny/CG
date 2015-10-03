var shift = 0;
var eps = 10;
var isUp = false;
var colors = [];
var angleShift = 1;

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
      //alert(cell);
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
    //alert(cell['brand']);
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
  //alert(string);
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
  this.fill();
}

function DrawPieChart()
{
  var storageLength = localStorage.length;
  var brands = [];
  var carsCount = [];

  for (var i = 0; i < storageLength; ++i)
  {
    var data = localStorage.getItem(i + '');
    var cell = JSON.parse(data);

    CompareArray(cell['brand'], brands, carsCount)
  }

  var totalCars = 0;
  for (var i = 0; i < carsCount.length; ++i)
  {
    totalCars += carsCount[i];
    colors.push(GetRandomColor());
  }

  var canvas = document.getElementById('pieChart');
  var context = canvas.getContext('2d');
  canvas.height = 600;
  canvas.width = 600;
  var initialAngle = 0;
  var centerX = Math.floor(canvas.width / 2);
  var centerY = Math.floor(canvas.height / 2);
  var radius = Math.floor((canvas.width - 400) / 2);
  for (var j = 0; j < 20; ++j)
  {
    for (var i = 0; i < brands.length; ++i)
    {
      context.save();
      var startingAngle = degreesToRadians(carsCount[i] / totalCars);
      var wedge = 2 * Math.PI * startingAngle * 57.3 + angleShift;
      var Newangle = initialAngle + wedge;
      //var arcSize = degreesToRadians(carsCount[i]);
      //var endingAngle = startingAngle + arcSize;

      context.beginPath();
      context.moveTo(centerX, centerY);
      context.DrawSector(centerX, centerY, 160, radius, initialAngle, Newangle);
      //context.arc(centerX, centerY, radius, initialAngle, Newangle, false);
      context.closePath();
      context.strokeStyle = ColorLuminance(colors[i], -0.5);
      context.lineWidth = 2;
      //context.fillStyle = colors[i];
      //context.fill();
      context.stroke();
      context.restore();
      initialAngle = initialAngle + wedge;
    }

    centerY -= 1;
  }

  for (var i = 0; i < brands.length; ++i)
  {
    context.save();
    var startingAngle = degreesToRadians(carsCount[i] / totalCars);
    var wedge = 2 * Math.PI * startingAngle * 57.3;
    var Newangle = initialAngle + wedge;
    //var arcSize = degreesToRadians(carsCount[i]);
    //var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.DrawSector(centerX, centerY, 160, radius, initialAngle, Newangle);
    context.closePath();
    context.strokeStyle = ColorLuminance(colors[i], -0.5);
    context.lineWidth = 2;
    context.fillStyle = colors[i];
    context.fill();
    context.stroke();
    context.restore();
    initialAngle = initialAngle + wedge;
  }
  ++angleShift;

  setTimeout("DrawPieChart()", 400);
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

function degreesToRadians(degrees)
{
    return (degrees * Math.PI)/180;
}

function sumTo(carsCount, i)
{
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += carsCount[j];
    }
    return sum;
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
})
