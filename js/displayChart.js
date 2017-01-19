var loc = window.location.href + '';
if (loc.indexOf('https://') == 0) {
    window.location.href = loc.replace('https://', 'http://');
}

var green = "#84b761";
var yellow = "#fdd400";
var red = "#CD4859";
var navy = "#2b3e50";
var gray = "#A9ADB7";
var lightGray = "#DDDDDD";
var lightBlue = "#6CDDFF";

// below datas are samples
var overview = [{
    "score": 1,
    "gaze": 1.5,
    "smile": 1.5,
    "speed": 1.5,
    "length": 1
}];

var volume = [2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

var pitch = [null, null, null, null, null, null, null, null, null, null, null, null, 1423, 423, 383, 347, 311, null];

var min = 0;
var max = 0;

var transcription = ["hello ", "I'm ", "here. ", "And ", "today ", "I ", "will "];

var emotion = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10];

var direction = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0];

var fillerWords = ["absolutely ", "actual ", "actually ", "amazing ", "anyway ", "apparently ", "approximately ", "badly ", "basically ", "begin ", "certainly ", "clearly ", "completely ", "definitely ", "easily ", "effectively ", "entirely ", "especially ", "essentially ", "exactly ", "extremely ", "fairly ", "frankly ", "frequently ", "fully ", "generally ", "hardly ", "heavily ", "highly ", "hopefully ", "just ", "largely ", "like ", "literally ", "maybe ", "might ", "most ", "mostly ", "much ", "necessarily ", "nicely ", "obviously ", "ok ", "okay ", "particularly ", "perhaps ", "possibly ", "practically ", "precisely ", "primarily ", "probably ", "quite ", "rather ", "real ", "really ", "relatively ", "right ", "seriously ", "significantly ", "simply ", "slightly ", "so ", "specifically ", "start ", "strongly ", "stuff ", "surely ", "things ", "too ", "totally ", "truly ", "try ", "typically ", "ultimately ", "usually ", "very ", "virtually ", "well ", "whatever ", "whenever ", "whereve r", "whoever ", "widely "];

var overallScoreArray = new Array();
var overallChartData = new Array();

// NEW
var directoryList = new Array();
var directoryLength;

var comments = new Array();

var videoLength;
var pastVideoLength;


/******  FOR FILLER CHECK  *******/
var fillers = new Array();

function checkFillerWords(trans, filler) {
    var count = 0;
    for (var i = 0; i < trans.length - 1; i++) {
        for (var n = 0; n < filler.length - 1; n++) {
            if (trans[i] == filler[n]) {
                fillers.push(filler[n]);
                count++;
            }
        }
    }
    return count;
}

function getFillerWordScore(count) {
    if (count >= 20) {
        return 0;
    } else if (count >= 15) {
        return 2.5;
    } else if (count >= 10) {
        return 5;
    } else if (count >= 5) {
        return 7.5;
    } else {
        return 10;
    }
}

function deleteNullFromArray(data) {
    var temp_array = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i] == null) {} else {
            temp_array.push(data[i]);
        }
    }
    return temp_array;
}

/******  *******/

var spokenFillerWordCount;
var fillerWordScore;

AmCharts.ready(function () {

    var d = new $.Deferred();

    $.ajax({
        url: "./data/",
        success: function (data) {
            $(data).find("a:contains(practice)").each(function () {
                directoryList.push($(this).attr("href"));
            });
            directoryLength = directoryList.length;
            latestData = directoryList[directoryLength - 1];
            d.resolve();
        }
    });

    function changeVideoSrc() {
        $("#myVideoTag > source").attr("src", "data/" + latestData + "FileName.webm");

        var video = document.getElementById('myVideoTag');
        video.src = "data/" + latestData + "practiceVideo.webm";
        video.load();
    }

    function getOverview() {
        var d1 = new $.Deferred();
        $.getJSON('./data/overview.json',
            function (data) {
                overview = data;
                videoLength = data[data.length - 1].length;
                if(data[data.length - 2]){
                  pastVideoLength = data[data.length - 2].length;  
                }
                d1.resolve();
            });
        return d1.promise();
    }

    function getEmotion() {
        var d2 = new $.Deferred();
        $.getJSON('./data/' + latestData + 'emotion.json',
            function (data) {
                emotion = data;
                d2.resolve();
            });
        return d2.promise();
    }

    function getDirection() {
        var d3 = new $.Deferred();
        $.getJSON('./data/' + latestData + 'direction.json',
            function (data) {
                direction = data;
                d3.resolve();
            });
        return d3.promise();
    }

    function getVolume() {
        var d4 = new $.Deferred();
        $.getJSON('./data/' + latestData + 'volume.json',
            function (data) {
                volume = data;
                d4.resolve();
            });
        return d4.promise();
    }

    function getPitch() {
        var d5 = new $.Deferred();
        $.getJSON('./data/' + latestData + 'pitch.json',
            function (data) {
                pitch = data;
                d5.resolve();
            });
        return d5.promise();
    }

    function getTranscript() {
        var d6 = new $.Deferred();
        $.getJSON('./data/' + latestData + 'transcription.json',
            function (data) {
                transcription = data;
                d6.resolve();
            });
        return d6.promise();
    }

    function showResult() {
        spokenFillerWordCount = checkFillerWords(transcription, fillerWords);

        changeVideoSrc();
        drawSpeedGauge();
        drawVolumeMeter();
        drawPauseGauge();
        drawFillerGauge();
        drawGazeGauge();
        drawMood();
        //drawChart1();
        drawChart2();
        drawChart3();
        drawChart4();
        drawChart5();
        drawChart6();
        displayTranscript();
        console.log("pitch: " + pitch.length);
        console.log("emotion : " + emotion.length);
        console.log("direction : " + direction.length);
        console.log("volume : " + volume.length);
        console.log(" ");

    }

    d.promise().then(getOverview).then(getEmotion).then(getDirection).then(getVolume).then(getPitch).then(getTranscript).then(showResult);


    function drawChart1() {
        var kari = 0;
        //        spokenFillerWordCount = checkFillerWords(transcription, fillerWords);
        //        fillerWordScore = getFillerWordScore(spokenFillerWordCount);

        for (var i = 0; i < overview.length; i++) {
            overallScoreArray.push(overview[i]['score']);
        }

        for (var i = 0; i < overallScoreArray.length; i++) {
            var data = {
                try: i + 1,
                score: overallScoreArray[i]
            };
            overallChartData.push(data);
        }

        var chart = new AmCharts.AmSerialChart();
        chart.dataProvider = overallChartData;

        chart.categoryField = "try";

        var valueA = new AmCharts.ValueAxis();
        valueA.maximum = 10;
        valueA.minimum = 0;
        valueA.autoGridCount = false;
        valueA.gridCount = 10;
        valueA.labelFrequency = 2;
        chart.addValueAxis(valueA);

        var categoryAxis = chart.categoryAxis;
        categoryAxis.startOnAxis = true;

        var graph = new AmCharts.AmGraph();
        graph.valueField = "score";
        graph.type = "line";
        graph.lineColor = "#ffbf63";
        graph.bulletSize = "14";
        graph.bullet = "round";
        graph.balloonText = "Overall Rating: [[value]]";
        graph.showBullets = true;
        chart.addGraph(graph);

        chart.write("chartdiv");

    }


    function drawSpeedGauge() {
        var currentVal = overview[overview.length - 1]['speed'];
        var pastVal = null;
        if (overview[overview.length - 2]) pastVal = overview[overview.length - 2]['speed'];

        var gaugeChart = new AmCharts.AmAngularGauge();

        gaugeChart.autoMargins = false;
        gaugeChart.marginLeft = 20;
        gaugeChart.marginBottom = -150;
        gaugeChart.marginRight = 20;
        gaugeChart.creditsPosition = "top-right";
        gaugeChart.color = gray;

        var gaugeAxis = new AmCharts.GaugeAxis();
        gaugeAxis.axisThickness = 1;
        gaugeAxis.axisAlpha = 0;
        gaugeAxis.tickAlpha = 0;
        gaugeAxis.valueInterval = 50;
        gaugeAxis.startValue = 0;
        gaugeAxis.endValue = 100;
        gaugeAxis.startAngle = -90;
        gaugeAxis.endAngle = 90;
        gaugeAxis.labelFunction = formatValue;
        gaugeChart.addAxis(gaugeAxis);
        gaugeChart.fontSize = 12;

        var arr = [];
        for (var i = 0; i < 5; i++) {
            var color;

            if (i == 0 || i == 4) color = red;
            else if (i == 1 || i == 3) color = yellow;
            else color = green;

            var newBand;
            newBand = createNewGaugeBand(color, i * 20, (i + 1) * 20, "100%", "97%");
            arr[i] = newBand;
        }
        gaugeAxis.bands = arr;
        gaugeChart.addAxis(gaugeAxis);

        // past gauge arrow
        var pastArrow = new AmCharts.GaugeArrow();
        pastArrow.radius = "75%";
        pastArrow.innerRadius = 10;
        pastArrow.value = 50;
        pastArrow.nailAlpha = 0;
        pastArrow.startWidth = 0.5;
        pastArrow.color = "#2b3e50";

        if (pastVal != null) {
            gaugeChart.addArrow(pastArrow);
            pastVal = map_range(pastVal, 50, 200, 0, 100);
            if (pastVal < 0) pastVal = 0;
            else if (pastVal > 200) pastVal = 100;
        }

        // current gauge arrow
        var currentArrow = new AmCharts.GaugeArrow();
        currentArrow.radius = "75%";
        currentArrow.innerRadius = 10;
        currentArrow.value = 50;
        currentArrow.nailRadius = 9;
        currentArrow.startWidth = 3;
        currentArrow.nailAlpha = 0;
        currentArrow.color = "#FFF";
        gaugeChart.addArrow(currentArrow);

        currentVal = map_range(currentVal, 50, 200, 0, 100);
        if (currentVal < 0) currentVal = 0;
        else if (currentVal > 100) currentVal = 100;

        makeNoBorder(gaugeChart);
        gaugeChart.addListener("rendered", displaySpeedGaugeBalloon);

        gaugeChart.write("speedMeter");
        currentArrow.setValue(currentVal);
        if (pastVal != null) pastArrow.setValue(pastVal);

        function formatValue(value, formattedValue, valueAxis) {
            if (value === 0) {
                return "slow";
            } else if (value == 50) {
                return "best";
            } else if (value == 100) {
                return "fast";
            } else {
                return "";
            }
        }

        function displaySpeedGaugeBalloon(event) {
            var chart = event.chart;
            var text = "";
            var word = "";
            if (overview[overview.length - 2]) word = overview[overview.length - 2]['speed'];

            for (var i = 0; i < chart.arrows.length; i++) {
                var arrow = chart.arrows[i];
                text = "Before: " + "<br />" + word + " wpm";
            }
            for (var i = 0; i < chart.axes[0].bands.length; i++) {
                chart.axes[0].bands[i].balloonText = text;
            }
        }

        function displaySpeedText() {
            var speedText = overview[overview.length - 1]['speed'];
            var speedTextDiv = document.getElementById('currentSpeed');
            $(speedTextDiv).html(speedText);
        }
        displaySpeedText();
    }

    function drawPauseGauge() {
        var currentVal = overview[overview.length - 1]['pause'];
        var pastVal = null;
        if (overview[overview.length - 2]) pastVal = overview[overview.length - 2]['pause'];

        var gaugeChart = new AmCharts.AmAngularGauge();

        gaugeChart.autoMargins = false;
        gaugeChart.marginLeft = 20;
        gaugeChart.marginBottom = -150;
        gaugeChart.marginRight = 20;
        gaugeChart.creditsPosition = "top-right";
        gaugeChart.color = gray;

        var gaugeAxis = new AmCharts.GaugeAxis();
        gaugeAxis.axisThickness = 1;
        gaugeAxis.axisAlpha = 0;
        gaugeAxis.tickAlpha = 0;
        gaugeAxis.valueInterval = 50;
        gaugeAxis.startValue = 0;
        gaugeAxis.endValue = 100;
        gaugeAxis.startAngle = -90;
        gaugeAxis.endAngle = 90;
        gaugeAxis.labelFunction = formatValue;
        gaugeChart.addAxis(gaugeAxis);
        gaugeChart.fontSize = 12;

        var arr = [];
        for (var i = 0; i < 5; i++) {
            var color;

            if (i == 0 || i == 4) color = red;
            else if (i == 1 || i == 3) color = yellow;
            else color = green;

            var newBand;
            newBand = createNewGaugeBand(color, i * 20, (i + 1) * 20, "100%", "97%");
            arr[i] = newBand;
        }
        gaugeAxis.bands = arr;

        // past gauge arrow
        var pastArrow = new AmCharts.GaugeArrow();
        pastArrow.radius = "75%";
        pastArrow.innerRadius = 10;
        pastArrow.value = 50;
        pastArrow.nailAlpha = 0;
        pastArrow.startWidth = 0.5;
        pastArrow.color = "#2b3e50";

        if (pastVal != null) {
            gaugeChart.addArrow(pastArrow);
            pastVal = map_range(pastVal, 0, 3, 0, 100);
            if (pastVal < 0) pastVal = 0;
            else if (pastVal > 100) pastVal = 100;
        }
        console.log(pastVal);

        // current gauge arrow
        var currentArrow = new AmCharts.GaugeArrow();
        currentArrow.radius = "75%";
        currentArrow.innerRadius = 10;
        currentArrow.value = 50;
        currentArrow.nailRadius = 9;
        currentArrow.startWidth = 3;
        currentArrow.color = "#FFF";
        currentArrow.nailAlpha = 0;
        gaugeChart.addArrow(currentArrow);

        currentVal = map_range(currentVal, 0, 3, 0, 100);
        if (currentVal < 0) currentVal = 0;
        else if (currentVal > 100) currentVal = 100;


        makeNoBorder(gaugeChart);
        gaugeChart.addListener("rendered", displayPauseGaugeBalloon);

        gaugeChart.write("pauseMeter");
        currentArrow.setValue(currentVal);
        if (pastVal != null) pastArrow.setValue(pastVal);

        function formatValue(value, formattedValue, valueAxis) {
            if (value === 0) {
                return "short";
            } else if (value == 50) {
                return "best";
            } else if (value == 100) {
                return "long";
            } else {
                return "";
            }
        }

        function displayPauseGaugeBalloon(event) {
            var chart = event.chart;
            var text = "";
            var word = "";
            if (overview[overview.length - 2]) word = overview[overview.length - 2]['pause'];

            for (var i = 0; i < chart.arrows.length; i++) {
                var arrow = chart.arrows[i];
                text = "Before: " + "<br />" + word + " sec";
            }
            for (var i = 0; i < chart.axes[0].bands.length; i++) {
                chart.axes[0].bands[i].balloonText = text;
            }
        }
        
        function displayPauseText() {
            var pauseText = overview[overview.length - 1]['pause'];
            var pauseTextDiv = document.getElementById('currentPause');
            $(pauseTextDiv).html(pauseText);
        }
        displayPauseText();
    }

    function drawVolumeMeter() {
        var currentVal = overview[overview.length - 1]['volume'];
        var pastVal = null;
        var volCol;

        if (overview[overview.length - 2]) pastVal = overview[overview.length - 2]['volume'];


        if (currentVal >= 100) {
            volCol = "#84b761";
            currentVal = 100;
        } else if (currentVal < 100) {
            if (currentVal > 90) volCol = green;
            else if (currentVal > 60) volCol = yellow;
            else volCol = red;
        }

        if (pastVal > 100) pastVal = 99;

        var chart = new AmCharts.AmSerialChart();
        chart.category = "evaluation";

        chart.autoMargins = false;
        chart.marginTop = 80;
        chart.marginLeft = 23;
        chart.marginBottom = 80;
        chart.marginRight = 28;
        chart.creditsPosition = "top-right";
        chart.color = gray;
        makeNoBorder(chart);

        chart.dataProvider = [{
            "category": "Evaluation",
            "background": 100,
            "bullet": currentVal,
            "last": pastVal
        }];

        var va = new AmCharts.ValueAxis();
        va.maximum = 100;
        va.stackType = "100%";
        va.gridAlpha = 0;
        va.autoGridCount = false;
        va.gridCount = 3;
        va.labelFunction = formatValue;
        va.axisThickness = 0;
        va.axisAlpha = 0;

        //va.labelOffset = ;
        va.position = "bottom";
        va.inside = false;

        chart.addValueAxis(va);

        chart.categoryAxis.labelsEnabled = false;
        chart.categoryAxis.showFirstLabel = false;
        chart.categoryAxis.axisAlpha = 0;

        var createNewColorGraph = function (col, valFie) {
            var newGraph = new AmCharts.AmGraph();
            newGraph.fillAlphas = 0.6;
            newGraph.lineThickness = 0;
            newGraph.lineColor = col;
            newGraph.showBalloon = false;
            newGraph.type = "column";
            newGraph.valueField = valFie;
            return newGraph;
        }

        var createNewPracticeDataGraph = function (valFie) {
            var practiceGraph = new AmCharts.AmGraph();
            practiceGraph.clustered = false;
            practiceGraph.columnWidth = 1;
            practiceGraph.fillAlphas = 1;
            practiceGraph.fillColors = volCol;
            practiceGraph.lineThickness = 0;
            practiceGraph.stackable = false;
            practiceGraph.balloonText = "Now";
            //practiceGraph.showBalloon = false;
            practiceGraph.type = "column";
            practiceGraph.valueField = valFie;
            return practiceGraph;
        }

        var createNewLastDataGraph = function (valFie) {
            var lastGraph = new AmCharts.AmGraph();
            lastGraph.columnWidth = 0.5;
            lastGraph.lineThickness = 5;
            lastGraph.lineColor = "#2b3e50";
            lastGraph.noStepRisers = true;
            //lastGraph.showBalloon = false;
            lastGraph.bullet = "square";
            lastGraph.bulletAlpha = 0;
            lastGraph.balloonText = "Before";
            lastGraph.stackable = false;
            lastGraph.type = "step";
            lastGraph.valueField = valFie;
            return lastGraph;
        }

        function formatValue(value, formattedValue, valueAxis) {
            if (value === 0) {
                return "silent";
            } else if (value == 100) {
                return "best";
            } else {
                return "";
            }
        }

        chart.addGraph(createNewColorGraph(lightGray, "background"));
        chart.addGraph(createNewPracticeDataGraph("bullet"));
        chart.addGraph(createNewLastDataGraph("last"));

        chart.rotate = true;
        chart.columnWidth = 1;
        chart.categoryField = "category";
        chart.categoryAxis.gridAlpha = 0;
        chart.categoryAxis.position = "left";

        chart.write("volumeMeter");
        
        function displayVolumeText() {
            var volumeText = Math.round(overview[overview.length - 1]['volume']);
            var volumeTextDiv = document.getElementById('currentVolume');
            $(volumeTextDiv).html(volumeText);
        }
        displayVolumeText();

    }


    function drawFillerGauge() {
        // current
        var maxFillerCount = Math.floor(transcription.length * 0.1); // once in 10 words
        var fillerRate = overview[overview.length - 1]['filler'];

        if (fillerRate > maxFillerCount) fillerRate = maxFillerCount;
        fillerRate = map_range(fillerRate, 0, maxFillerCount, 0, 100);


        // past
        var pastMaxFillerCount = null;
        var pastFillerRate = null;

        if (overview[overview.length - 2]) {
            pastMaxFillerCount = Math.floor(overview[overview.length - 2]['transcript length'] * 0.1);
            pastFillerRate = overview[overview.length - 2]['filler'];
            if (pastFillerRate > pastMaxFillerCount) pastFillerRate = pastMaxFillerCount;
            pastFillerRate = map_range(pastFillerRate, 0, pastMaxFillerCount, 0, 100);
        }

        // color
        var gaugeColor;
        if (fillerRate < 33.33) gaugeColor = green;
        else if (fillerRate < 66.66) gaugeColor = yellow;
        else gaugeColor = red;
        console.log(gaugeColor);


        var arr = [];
        var gaugeChart = new AmCharts.AmAngularGauge();
        gaugeChart.creditsPosition = "top-right";
        gaugeChart.color = gray;
        makeNoBorder(gaugeChart);

        gaugeChart.autoMargins = false;
        gaugeChart.marginTop = 45;
        gaugeChart.marginLeft = 20;
        gaugeChart.marginBottom = 0;
        gaugeChart.marginRight = 20;

        var gaugeAxis = new AmCharts.GaugeAxis();
        gaugeAxis.axisAlpha = 0;
        gaugeAxis.tickAlpha = 0;
        gaugeAxis.labelsEnabled = false;
        gaugeAxis.startValue = 0;
        gaugeAxis.endValue = 100;
        gaugeAxis.startAngle = 0;
        gaugeAxis.endAngle = 360;
        gaugeChart.addAxis(gaugeAxis);

        var newGauge = createNewGaugeBand(lightGray, 0, 100, "70%", "67%");
        newGauge.alpha = 0.4;
        arr[0] = newGauge;

        var valueGauge = createNewGaugeBand(green, 0, fillerRate, "70%", "67%");
        valueGauge.balloonText = "Now: " + overview[overview.length - 1]['filler'] + " words";

        var pastValueGauge;
        if (pastFillerRate != null) {
            pastValueGauge = createNewGaugeBand(lightGray, 0, pastFillerRate, "70%", "67%");
            pastValueGauge.alpha = 0.6;
            pastValueGauge.balloonText = "Before: " + overview[overview.length - 2]['filler'] + " words";
            if (fillerRate >= pastFillerRate) {
                arr[1] = valueGauge;
                arr[2] = pastValueGauge;
            } else {
                arr[1] = pastValueGauge;
                arr[2] = valueGauge;
            }
        } else {
            arr[1] = valueGauge;
        }
        console.log("fillpast" + pastFillerRate);
        console.log("fillnow" + fillerRate);

        gaugeAxis.bands = arr;

        gaugeChart.addLabel("50%", "45%", spokenFillerWordCount, "middle", 60, "#84b761");

        gaugeChart.write("fillerMeter");
        
        function displayFillerText() {
            var fillerText = overview[overview.length - 1]['filler'];
            var fillerTextDiv = document.getElementById('currentFiller');
            $(fillerTextDiv).html(fillerText);
        }
        displayFillerText();

    }

    function drawGazeGauge() {
        var currentVal = overview[overview.length - 1]['gaze'];
        var pastVal = null;
        if (overview[overview.length - 2]) pastVal = overview[overview.length - 2]['gaze'];

        var gaugeChart = new AmCharts.AmAngularGauge();

        gaugeChart.autoMargins = false;
        gaugeChart.marginLeft = 20;
        gaugeChart.marginBottom = -170;
        gaugeChart.marginRight = 20;
        gaugeChart.creditsPosition = "top-right";
        gaugeChart.color = gray;

        var gaugeAxis = new AmCharts.GaugeAxis();
        gaugeAxis.axisThickness = 1;
        gaugeAxis.axisAlpha = 0;
        gaugeAxis.tickAlpha = 0;
        gaugeAxis.valueInterval = 50;
        gaugeAxis.startValue = 0;
        gaugeAxis.endValue = 100;
        gaugeAxis.startAngle = -90;
        gaugeAxis.endAngle = 90;
        gaugeAxis.labelFunction = formatValue;
        gaugeChart.addAxis(gaugeAxis);
        gaugeChart.fontSize = 12;

        var arr = [];
        for (var i = 0; i < 5; i++) {
            var color;

            if (i == 0 || i == 4) color = red;
            else if (i == 1 || i == 3) color = yellow;
            else color = green;

            var newBand;
            newBand = createNewGaugeBand(color, i * 20, (i + 1) * 20, "100%", "97%");
            arr[i] = newBand;
        }
        gaugeAxis.bands = arr;

        // past gauge arrow
        var pastArrow = new AmCharts.GaugeArrow();
        pastArrow.radius = "75%";
        pastArrow.innerRadius = 10;
        pastArrow.value = 50;
        pastArrow.nailAlpha = 0;
        pastArrow.startWidth = 0.5;
        pastArrow.color = "#2b3e50";

        if (pastVal != null) {
            gaugeChart.addArrow(pastArrow);
            pastVal = mapGazeData(pastVal, pastVideoLength);
        }
        console.log(pastVal);

        // current gauge arrow
        var currentArrow = new AmCharts.GaugeArrow();
        currentArrow.radius = "75%";
        currentArrow.innerRadius = 10;
        currentArrow.value = 50;
        currentArrow.nailRadius = 9;
        currentArrow.startWidth = 3;
        currentArrow.color = "#FFF";
        currentArrow.nailAlpha = 0;
        gaugeChart.addArrow(currentArrow);

        currentVal = mapGazeData(currentVal, videoLength);

        makeNoBorder(gaugeChart);
        gaugeChart.addListener("rendered", displayGazeGaugeBalloon);

        gaugeChart.write("gazeMeter");
        currentArrow.setValue(currentVal);
        if (pastVal != null) pastArrow.setValue(pastVal);

        function formatValue(value, formattedValue, valueAxis) {
            if (value === 0) {
                return "few";
            } else if (value == 50) {
                return "best";
            } else if (value == 100) {
                return "frequent";
            } else {
                return "";
            }
        }

        function mapGazeData(data, vidLength) {
            // 3 ~ 5 second is the best;
            // frequency with deletion of the movement = 1sec -> x=(vidlength-x)/5
            var idealFrequency = vidLength / (4 + 1.5); // between 3-5 = +1.5 as head movement time
            var maxFrequency = vidLength / 2; // if 30sec = 15 times
            var answer = 0;

            if (data > maxFrequency) answer = maxFrequency;

            if (data < idealFrequency) {
                answer = map_range(data, 0, idealFrequency, 0, 50);
            } else if (data >= idealFrequency) {
                answer = map_range(data, idealFrequency, maxFrequency, 50, 100);
            }
            // flip: because long gaze = less frequency. short gazes = more frequency
            //answer = 100 - answer; //decided not to do it.

            return answer;
        }

        function displayGazeGaugeBalloon(event) {
            var chart = event.chart;
            var text = "";
            var word = "";
            if (overview[overview.length - 2]) word = overview[overview.length - 2]['gaze'];

            for (var i = 0; i < chart.arrows.length; i++) {
                var arrow = chart.arrows[i];
                text = "Before: " + "<br />" + word + " counted";
            }
            for (var i = 0; i < chart.axes[0].bands.length; i++) {
                chart.axes[0].bands[i].balloonText = text;
            }
        }
        
        function displayGazeText() {
            var gazeText = overview[overview.length - 1]['gaze'];
            var gazeTextDiv = document.getElementById('currentGaze');
            $(gazeTextDiv).html(gazeText);
        }
        displayGazeText();
    }

    function drawMood() {
        // draw current
        var mood = overview[overview.length - 1]['mood'];
        var moodDiv = document.getElementById('moodMeter');
        var moodString = ["serious", "general", "friendly"];
        $(moodDiv).append('<img src="img/' + moodString[mood] + '.svg" width="150px" height="150px;x">');

        // draw past
        var prevMoodString = ["Serious", "Normal", "Friendly"];
        if (overview[overview.length - 2]) {
            var prevMood = overview[overview.length - 2]['mood'];
            var prevMoodDiv = document.getElementById('moodMeterBefore');
            $(prevMoodDiv).append('<span style="color:#6CDDFF">' + prevMoodString[prevMood] + '</span>');
        }
        
        function displayMoodText() {
            var moodText = prevMoodString[mood];
            var moodTextDiv = document.getElementById('currentMood');
            $(moodTextDiv).html(moodText);
        }
        displayMoodText();
    }


    var createNewGaugeBand = function (col, start, end, rad, innerRad) {
        var band = new AmCharts.GaugeBand();
        band.startValue = start;
        band.endValue = end;
        band.color = col;
        band.radius = rad;
        band.innerRadius = innerRad;
        return band;
    }

    function makeNoBorder(chart) {
        chart.balloon.borderThickness = 0;
        chart.balloon.fillColor = "#FFF";
    }


    function drawChart2() {
        var currentData = overview[overview.length - 1];
        var currentLength; //currentData[length]

        var currentRatings = new Array();
        for (var key in currentData) {
            var data = {
                category: key.replace(" score", ""),
                grade: currentData[key]
            };
            currentRatings.push(data);
        }

        currentRatings.shift();
        currentRatings.splice(5, 11);


        var radarChart = new AmCharts.AmRadarChart();

        radarChart.dataProvider = currentRatings;
        radarChart.color = "#d2d2d2";
        radarChart.plotAreaBorderColor = lightBlue;
        radarChart.plotAreaFillColors = lightBlue;
        radarChart.plotAreaFillAlphas = 1;
        radarChart.categoryField = "category";
        radarChart.startDuration = 0;
        makeNoBorder(radarChart);

        // VALUE AXIS
        var valueAxis = new AmCharts.ValueAxis();
        valueAxis.axisAlpha = 0.2;
        valueAxis.gridAlpha = 0.2;
        valueAxis.minimum = 0;
        valueAxis.maximum = 10;
        valueAxis.dashLength = 3;
        valueAxis.axisTitleOffset = 20;
        valueAxis.gridCount = 5;
        valueAxis.gridColor = "#EBEBEB";
        valueAxis.axisColor = "#EBEBEB";
        radarChart.addValueAxis(valueAxis);

        // GRAPH
        var radarGraph = new AmCharts.AmGraph();
        radarGraph.valueField = "grade";
        radarGraph.bullet = "round";
        radarGraph.balloonText = "[[grade]]";
        radarGraph.fillAlphas = 0.3;
        radarGraph.fillColors = "#0893cf";
        radarGraph.lineColor = "#0893cf";
        radarChart.addGraph(radarGraph);

        // WRITE
        radarChart.write("radarchartdiv");
    }

    function drawChart3() {
        var friendlinessArray = new Array();
        for (var i = 0; i < emotion.length; i++) {
            var data = {
                time: getSecond(i, emotion),
                score: emotion[i]
            };
            friendlinessArray.push(data);
        }

        var chart3 = new AmCharts.AmSerialChart();
        chart3.dataProvider = friendlinessArray;
        makeNoBorder(chart3);

        chart3.categoryField = "time";
        chart3.color = gray;

        var valueA3 = new AmCharts.ValueAxis();
        valueA3.maximum = 100;
        valueA3.gridColor = "#EBEBEB";
        valueA3.axisColor = "#EBEBEB";
        chart3.addValueAxis(valueA3);
        
        chart3.categoryAxis.gridColor = "#EBEBEB";
        chart3.categoryAxis.axisColor = "#EBEBEB";

        var graph3 = new AmCharts.AmGraph();
        graph3.valueField = "score";
        graph3.type = "line";
        graph3.lineColor = "#ffbf63";
        graph3.bulletSize = "1";
        graph3.bullet = "round";
        graph3.balloonText = "[[value]]";
        graph3.showBullets = true;
        chart3.addGraph(graph3);


        chart3.write("friendlinesschartdiv");
    }

    function drawChart4() {
        var gazeArray = new Array();

        for (var i = 0; i < direction.length; i++) {
            var data = {
                //                time: Math.round((i + 1) / 35),
                time: getSecond(i, direction),
                score: direction[i]
            };
            gazeArray.push(data);
        }

        var chart4 = new AmCharts.AmSerialChart();
        chart4.dataProvider = gazeArray;
        makeNoBorder(chart4);

        chart4.categoryField = "time";
        chart4.color = gray;

        var valueA4 = new AmCharts.ValueAxis();
        valueA4.maximum = 100;
        valueA4.minimum = 0;
        valueA4.labelFunction = formatValue;
        valueA4.gridColor = "#EBEBEB";
        valueA4.axisColor = "#EBEBEB";
        chart4.addValueAxis(valueA4);
        
        chart4.categoryAxis.gridColor = "#EBEBEB";
        chart4.categoryAxis.axisColor = "#EBEBEB";


        var graph4 = new AmCharts.AmGraph();
        graph4.valueField = "score";
        graph4.type = "line";
        graph4.lineColor = "#ffbf63";
        graph4.bulletSize = "1";
        graph4.bullet = "round";
        graph4.balloonText = "[[value]]";
        graph4.showBullets = true;
        chart4.addGraph(graph4);


        chart4.write("gazechartdiv");

        function formatValue(value, formattedValue, valueAxis) {
            if (value == 0) return "Right";
            else if (value == 50) return "Center";
            else if (value == 100) return "Left";
        }

    }

    function drawChart5() {
        var volumeArray = new Array();

        for (var i = 0; i < volume.length; i++) {
            var data = {
                //                time: Math.round((i + 1) / 35),
                time: getSecond(i, volume),
                score: volume[i]
            };
            volumeArray.push(data);
        }

        var chart5 = new AmCharts.AmSerialChart();
        chart5.dataProvider = volumeArray;
        makeNoBorder(chart5);

        chart5.categoryField = "time";
        chart5.color = gray;

        var valueA5 = new AmCharts.ValueAxis();
        valueA5.gridColor = "#EBEBEB";
        valueA5.axisColor = "#EBEBEB";
        chart5.addValueAxis(valueA5);
        chart5.categoryAxis.gridColor = "#EBEBEB";
        chart5.categoryAxis.axisColor = "#EBEBEB";


        var graph5 = new AmCharts.AmGraph();
        graph5.valueField = "score";
        graph5.type = "line";
        graph5.lineColor = "#ffbf63";
        graph5.bulletSize = "1";
        graph5.bullet = "round";
        graph5.balloonText = "[[value]]";
        graph5.showBullets = true;
        chart5.addGraph(graph5);

        chart5.write("volumechartdiv");
    }

    function drawChart6() {
        console.log("draw pitch graph");
        var pitchArray = new Array();

        for (var i = 0; i < pitch.length; i++) {
            var data = {
                //                time: Math.round((i + 1) / 35),
                time: getSecond(i, volume),
                score: pitch[i]
            };
            pitchArray.push(data);
        }

        var chart6 = new AmCharts.AmSerialChart();
        chart6.dataProvider = pitchArray;
        makeNoBorder(chart6);

        chart6.categoryField = "time";
        chart6.color = gray;

        var valueA6 = new AmCharts.ValueAxis();
        valueA6.gridColor = "#EBEBEB";
        valueA6.axisColor = "#EBEBEB";
        chart6.addValueAxis(valueA6);
        chart6.categoryAxis.gridColor = "#EBEBEB";
        chart6.categoryAxis.axisColor = "#EBEBEB";


        var graph6 = new AmCharts.AmGraph();
        graph6.valueField = "score";
        graph6.type = "line";
        graph6.lineColor = "#ffbf63";
        graph6.bulletSize = "1";
        graph6.bullet = "round";
        graph6.balloonText = "[[value]]";
        graph6.showBullets = true;
        chart6.addGraph(graph6);

        chart6.write("pitchchartdiv");
    }

    function displayTranscript() {
        // transcript
        var tr = document.getElementById('transcript');
        $(tr).html(transcription);


        // filler count
        var fc = document.getElementById('fillercount');
        $(fc).html('Number of Filler Words used : ' + spokenFillerWordCount + '<br><br>');
        $(fc).append('Filler Words used: ' + fillers);
    }

    function getSecond(num, arr) {
        var valPerSec = Math.round(arr.length / videoLength);
        var partition = num - (num % valPerSec);
        return partition / valPerSec;
    }

    function map_range(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    function cutDecimal(someNumber) {
        var temp_val = Math.round(someNumber * 1e2) / 1e2;
        return temp_val;
    }

    // commenting
    $(".rating input:radio").prop("required", true);
    $('.rating input').click(function () {
        $(".rating span").removeClass('checked');
        $(this).parent().addClass('checked');
    });

});