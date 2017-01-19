var loc = window.location.href + '';
if (loc.indexOf('https://') == 0) {
    window.location.href = loc.replace('https://', 'http://');
}

var green = "#AEC866"; // volume
var yellow = "#EFC94C"; // speed
var orange = "#E27A3F"; // mood;
var navy = "#2b3e50";
var gray = "#A9ADB7";
var lightGray = "#DDDDDD";
var lightBlue = "#45B29D"; // pause
var pink = "#D6607B"; // gaze
var purple = "#6F8FBE"; // filler
var darkWhite = "#EBEBEB";
var red = "#CD4859";



var overview = [{
    "score": 1,
    "gaze": 1.5,
    "smile": 1.5,
    "speed": 1.5,
    "length": 1
}];

var overallScoreArray = new Array();
var overallChartData = new Array();

// NEW
var directoryList = new Array();
var directoryLength;

/******  *******/

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

    function getOverview() {
        var d1 = new $.Deferred();
        $.getJSON('./data/overview.json',
            function (data) {
                overview = data;
                d1.resolve();
            });
        return d1.promise();
    }

    function showResult() {
        drawChart1();
        drawChart2();
        drawChart3();
        drawChart4();
        drawChart5();
        drawChart6();
        drawChart7();
        drawChart8();
        drawChart9();
        //drawAverageChart();
        drawImprovementGauge();
        displayAdvice();

    }

    d.promise().then(getOverview).then(showResult);


    function drawChart1() {
        var kari = 0;

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
        chart.color = lightGray;
        makeNoBorder(chart);

        chart.categoryField = "try";

        var valueA = new AmCharts.ValueAxis();
        valueA.maximum = 10;
        valueA.minimum = 0;
        valueA.autoGridCount = false;
        valueA.gridColor = "#EBEBEB";
        valueA.axisColor = "#EBEBEB";
        valueA.gridCount = 10;
        valueA.labelFrequency = 2;
        chart.addValueAxis(valueA);

        chart.categoryAxis.startOnAxis = true;
        chart.categoryAxis.gridColor = "#EBEBEB";
        chart.categoryAxis.axisColor = "#EBEBEB";

        var graph = new AmCharts.AmGraph();
        graph.valueField = "score";
        graph.type = "line";
        graph.lineColor = "#ffbf63";
        graph.bulletSize = "14";
        graph.bullet = "round";
        graph.balloonText = "Overall Rating: [[value]]";
        graph.showBullets = true;
        chart.addGraph(graph);
        chart.write("overviewDiv");

    }

    function makeNoBorder(chart) {
        chart.balloon.borderThickness = 0;
        chart.balloon.fillColor = "#FFF";
    }

    function getGrowthRate(pastVal, presentVal) {
        return cutDecimal((presentVal - pastVal) / pastVal);
    }

    function drawImprovementGauge() {

        var overallGrowthRate = null;
        if (overview[overview.length - 1]) {
            overallGrowthRate = getGrowthRate(overview[0]['score'], overview[overview.length - 1]['score']);
        }

        // color and text and converted growth rate
        var gaugeColor = null;
        var growthText = null;
        if (overallGrowthRate != null) {
            if (overallGrowthRate >= 0.2) {
                gaugeColor = green;
                growthText = "Great!";
            } else if (overallGrowthRate >= 0) {
                gaugeColor = green;
                growthText = "Good!";
            } else if (overallGrowthRate >= -0.3) {
                gaugeColor = yellow;
                growthText = "!";
            } else {
                gaugeColor = red;
                growthText = "Bad...";
            }
            console.log(growthText);
        }

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


        var valueGauge;
        if (overallGrowthRate != null) {
            console.log(growthText);
            valueGauge = createNewGaugeBand(gaugeColor, 0, 100, "70%", "67%");
            arr[1] = valueGauge;
            gaugeChart.addLabel("50%", "50%", growthText, "middle", 30, gaugeColor);

            console.log("color: " + gaugeColor);
            gaugeChart.addLabel("50%", "58%", "IMPROVEMENT RATE", "middle", 11, darkWhite, 0, 0.8);
        }

        gaugeAxis.bands = arr;

        gaugeChart.write("improvementRate");

    }


    function drawChart2() {
        var speedScore = 0;
        var volumeScore = 0;
        var pauseScore = 0;
        var fillerScore = 0;
        var gazeScore = 0;

        for (var i = 0; i < overview.length; i++) {
            speedScore += overview[i]['speed score'];
            volumeScore += overview[i]['volume score'];
            pauseScore += overview[i]['pause score'];
            fillerScore += overview[i]['filler score'];
            gazeScore += overview[i]['gaze score'];
        }

        speedScore = Math.floor(speedScore / overview.length);
        volumeScore = Math.floor(volumeScore / overview.length);
        pauseScore = Math.floor(pauseScore / overview.length);
        fillerScore = Math.floor(fillerScore / overview.length);
        gazeScore = Math.floor(gazeScore / overview.length);

        var characterData = [];
        characterData["speed"] = speedScore;
        characterData["pause"] = pauseScore;
        characterData["volume"] = volumeScore;
        characterData["filler"] = fillerScore;
        characterData["gaze"] = gazeScore;

        var averageData = [];
        for (var key in characterData) {
            var data = {
                category: key,
                grade: characterData[key]
            };
            averageData.push(data);
        }
        console.log(averageData);

        var radarChart = new AmCharts.AmRadarChart();

        radarChart.dataProvider = averageData;
        radarChart.color = "#d2d2d2";
        radarChart.plotAreaBorderColor = lightBlue;
        radarChart.plotAreaFillColors = lightBlue;
        radarChart.plotAreaFillAlphas = 1;
        radarChart.categoryField = "category";
        radarChart.startDuration = 0;
        radarChart.creditsPosition = "top-right";
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
        radarChart.addLabel("50%", "80%", "AVERAGE", "middle", 20, darkWhite, 0, 0.8);


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
        radarChart.write("radarchartDiv");
    }

    function getTimeSeriesDataArray(name) {
        var temp_array = [];
        for (var i = 0; i < overview.length; i++) {
            var data = {
                practice: i + 1,
                score: overview[i][name]
            };
            temp_array.push(data);
        }
    }

    function drawChart3() {
        var categoryData = [];
        for (var i = 0; i < overview.length; i++) {
            var data = {
                time: i + 1,
                speedScore: overview[i]['speed score'],
                volumeScore: overview[i]['volume score'],
                pauseScore: overview[i]['pause score'],
                fillerScore: overview[i]['filler score'],
                gazeScore: overview[i]['gaze score']
            };
            categoryData.push(data);
        }


        console.log(categoryData);

        var chart3 = new AmCharts.AmSerialChart();
        chart3.dataProvider = categoryData;;

        chart3.categoryField = "time";
        chart3.color = lightGray;

        var valueA3 = new AmCharts.ValueAxis();
        valueA3.maximum = 10;
        valueA3.minimum = 0;
        valueA3.gridColor = "#EBEBEB";
        valueA3.axisColor = "#EBEBEB";
        valueA3.labelFrequency = 2;
        chart3.addValueAxis(valueA3);

        chart3.categoryAxis.gridColor = "#EBEBEB";
        chart3.categoryAxis.axisColor = "#EBEBEB";
        chart3.categoryAxis.startOnAxis = true;

        var graph1 = new AmCharts.AmGraph();
        graph1.valueField = "speedScore";
        graph1.type = "line";
        graph1.lineColor = yellow;
        graph1.bulletSize = "13";
        graph1.bullet = "round";
        graph1.balloonText = "speed: [[value]]";
        //graph1.showBullets = true;
        chart3.addGraph(graph1);

        var graph2 = new AmCharts.AmGraph();
        graph2.valueField = "volumeScore";
        graph2.type = "line";
        graph2.lineColor = green;
        graph2.bulletSize = "10";
        graph2.bullet = "round";
        graph2.balloonText = "volume: [[value]]";
        //graph2.showBullets = true;
        chart3.addGraph(graph2);

        var graph3 = new AmCharts.AmGraph();
        graph3.valueField = "pauseScore";
        graph3.type = "line";
        graph3.lineColor = lightBlue;
        graph3.bulletSize = "10";
        graph3.bullet = "round";
        graph3.balloonText = "pause: [[value]]";
        //graph3.showBullets = true;
        chart3.addGraph(graph3);

        var graph4 = new AmCharts.AmGraph();
        graph4.valueField = "fillerScore";
        graph4.type = "line";
        graph4.lineColor = purple;
        graph4.bulletSize = "10";
        graph4.bullet = "round";
        graph4.balloonText = "filler: [[value]]";
        //graph4.showBullets = true;
        chart3.addGraph(graph4);

        var graph5 = new AmCharts.AmGraph();
        graph5.valueField = "gazeScore";
        graph5.type = "line";
        graph5.lineColor = pink;
        graph5.bulletSize = "8";
        graph5.bullet = "round";
        graph5.balloonText = "gaze: [[value]]";
        //graph5.showBullets = true;
        chart3.addGraph(graph5);


        chart3.write("categoryDiv");

    }

    function drawChart4() {
        var speedArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var data = {
                time: i + 1,
                score: overview[i]['speed']
            };
            speedArray.push(data);
        }

        var chart4 = new AmCharts.AmSerialChart();
        chart4.dataProvider = speedArray;
        makeNoBorder(chart4);

        chart4.categoryField = "time";
        chart4.color = gray;

        var valueA4 = new AmCharts.ValueAxis();
        valueA4.minimum = 0;
        valueA4.gridColor = "#EBEBEB";
        valueA4.axisColor = "#EBEBEB";
        chart4.addValueAxis(valueA4);

        chart4.categoryAxis.gridColor = "#EBEBEB";
        chart4.categoryAxis.axisColor = "#EBEBEB";
        chart4.categoryAxis.startOnAxis = true;

        var graph4 = new AmCharts.AmGraph();
        graph4.valueField = "score";
        graph4.type = "line";
        graph4.lineColor = yellow;
        graph4.bulletSize = "8";
        graph4.bullet = "round";
        graph4.balloonText = "[[value]] wpm";
        graph4.showBullets = true;
        chart4.addGraph(graph4);


        chart4.write("speedDevelopDiv");

    }

    function drawChart5() {
        var volumeArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var data = {
                time: i + 1,
                score: overview[i]['volume']
            };
            volumeArray.push(data);
        }
        console.log(volumeArray);

        var chart5 = new AmCharts.AmSerialChart();
        chart5.dataProvider = volumeArray;
        makeNoBorder(chart5);

        chart5.categoryField = "time";
        chart5.color = gray;

        var valueA5 = new AmCharts.ValueAxis();
        valueA5.gridColor = "#EBEBEB";
        valueA5.axisColor = "#EBEBEB";
        valueA5.maximum = 200;
        valueA5.labelFunction = formatValue;
        chart5.categoryAxis.gridColor = "#EBEBEB";
        chart5.categoryAxis.axisColor = "#EBEBEB";
        chart5.categoryAxis.startOnAxis = true;

        var guide = new AmCharts.Guide();
        guide.value = 100;
        guide.lineAlpha = 0.2;
        guide.lineThickness = 2;
        guide.lineColor = guide.color = orange;
        valueA5.addGuide(guide);
        chart5.addValueAxis(valueA5);

        var graph5 = new AmCharts.AmGraph();
        graph5.valueField = "score";
        graph5.type = "line";
        graph5.lineColor = green;
        graph5.bulletSize = "8";
        graph5.bullet = "round";
        //graph5.balloonText = "[[value]]";
        graph5.showBalloon = false;
        graph5.showBullets = true;
        chart5.addGraph(graph5);

        chart5.write("volumeDevelpDiv");

        function formatValue(value, formattedValue, valueAxis) {
            if (value == 0) {
                return "quiet";
            } else if (value == 100) {
                return "Minimum";
            } else {
                return "";
            }
        }
    }

    function drawChart6() {
        var pauseArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var data = {
                time: i + 1,
                score: overview[i]['pause']
            };
            pauseArray.push(data);
        }

        var chart6 = new AmCharts.AmSerialChart();
        chart6.dataProvider = pauseArray;
        makeNoBorder(chart6);

        chart6.categoryField = "time";
        chart6.color = gray;

        var valueA6 = new AmCharts.ValueAxis();
        valueA6.gridColor = "#EBEBEB";
        valueA6.axisColor = "#EBEBEB";
        valueA6.maximum = 3;
        chart6.categoryAxis.gridColor = "#EBEBEB";
        chart6.categoryAxis.axisColor = "#EBEBEB";
        chart6.categoryAxis.startOnAxis = true;
        chart6.addValueAxis(valueA6);


        var graph6 = new AmCharts.AmGraph();
        graph6.valueField = "score";
        graph6.type = "line";
        graph6.lineColor = lightBlue;
        graph6.bulletSize = "8";
        graph6.bullet = "round";
        graph6.balloonText = "[[value]] sec";
        graph6.showBullets = true;
        chart6.addGraph(graph6);

        chart6.write("pauseDevelopDiv");
    }


    function drawChart7() {
        var fillerArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var vidLength = overview[i]['length'];
            var temp_data = overview[i]['filler'] / vidLength;
            temp_data = cutDecimal(temp_data * 60); // average for 60 sec
            var data = {
                time: i + 1,
                score: temp_data
            };
            fillerArray.push(data);
        }
        console.log(fillerArray);

        var chart7 = new AmCharts.AmSerialChart();
        chart7.dataProvider = fillerArray;
        makeNoBorder(chart7);

        chart7.categoryField = "time";
        chart7.color = gray;

        var valueA7 = new AmCharts.ValueAxis();
        valueA7.gridColor = "#EBEBEB";
        valueA7.axisColor = "#EBEBEB";
        valueA7.maximum = 3;
        chart7.categoryAxis.gridColor = "#EBEBEB";
        chart7.categoryAxis.axisColor = "#EBEBEB";
        chart7.categoryAxis.startOnAxis = true;
        chart7.addValueAxis(valueA7);


        var graph7 = new AmCharts.AmGraph();
        graph7.valueField = "score";
        graph7.type = "line";
        graph7.lineColor = purple;
        graph7.bulletSize = "8";
        graph7.bullet = "round";
        graph7.balloonText = "[[value]] words / min";
        graph7.showBullets = true;
        chart7.addGraph(graph7);

        chart7.write("fillerDevelopDiv");
    }

    function drawChart8() {
        var moodArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var data = {
                time: i + 1,
                score: overview[i]['mood']
            };
            moodArray.push(data);
        }

        var chart8 = new AmCharts.AmSerialChart();
        chart8.dataProvider = moodArray;
        makeNoBorder(chart8);

        chart8.categoryField = "time";
        chart8.color = gray;

        var valueA8 = new AmCharts.ValueAxis();
        valueA8.gridColor = "#EBEBEB";
        valueA8.axisColor = "#EBEBEB";
        valueA8.labelFunction = formatValue;
        valueA8.maximum = 2;
        valueA8.minimum = 0;
        chart8.categoryAxis.gridColor = "#EBEBEB";
        chart8.categoryAxis.axisColor = "#EBEBEB";
        chart8.categoryAxis.startOnAxis = true;
        chart8.addValueAxis(valueA8);


        var graph8 = new AmCharts.AmGraph();
        graph8.valueField = "score";
        graph8.type = "line";
        graph8.lineColor = orange;
        graph8.bulletSize = "8";
        graph8.bullet = "round";
        graph8.balloonText = "[[value]]";
        graph8.showBullets = true;
        chart8.addGraph(graph8);

        chart8.write("moodDevelopDiv");

        function formatValue(value, formattedValue, valueAxis) {
            if (value == 0) {
                return "Serious";
            } else if (value == 1) {
                return "Normal";
            } else if (value == 2) {
                return "Friendly";
            } else {
                return "";
            }
        }
    }


    function drawChart9() {
        var gazeArray = new Array();

        for (var i = 0; i < overview.length; i++) {
            var vidLength = overview[i]['length'];
            var temp_data = overview[i]['gaze'] / vidLength;
            temp_data = cutDecimal(temp_data * 60); // average for 60 sec
            var data = {
                time: i + 1,
                score: temp_data
            };
            gazeArray.push(data);
        }

        var chart9 = new AmCharts.AmSerialChart();
        chart9.dataProvider = gazeArray;
        makeNoBorder(chart9);

        chart9.categoryField = "time";
        chart9.color = gray;

        var valueA9 = new AmCharts.ValueAxis();
        valueA9.gridColor = "#EBEBEB";
        valueA9.axisColor = "#EBEBEB";
        chart9.categoryAxis.gridColor = "#EBEBEB";
        chart9.categoryAxis.axisColor = "#EBEBEB";
        chart9.categoryAxis.startOnAxis = true;
        chart9.addValueAxis(valueA9);


        var graph9 = new AmCharts.AmGraph();
        graph9.valueField = "score";
        graph9.type = "line";
        graph9.lineColor = pink;
        graph9.bulletSize = "8";
        graph9.bullet = "round";
        graph9.balloonText = "[[value]] times / min";
        graph9.showBullets = true;
        chart9.addGraph(graph9);

        chart9.write("gazeDevelopDiv");
    }

    function displayAdvice() {
        var speedGrowthRate = null;
        var pauseGrowthRate = null;
        var volumeGrowthRate = null;
        var fillerGrowthRate = null;
        var gazeGrowthRate = null;

        if (overview[overview.length - 1]) {
            speedGrowthRate = getGrowthRate(overview[0]['speed score'], overview[overview.length - 1]['speed score']);
            pauseGrowthRate = getGrowthRate(overview[0]['pause score'], overview[overview.length - 1]['pause score']);
            volumeGrowthRate = getGrowthRate(overview[0]['volume score'], overview[overview.length - 1]['volume score']);
            fillerGrowthRate = getGrowthRate(overview[0]['filler score'], overview[overview.length - 1]['filler score']);
            gazeGrowthRate = getGrowthRate(overview[0]['gaze score'], overview[overview.length - 1]['gaze score']);
        }
        console.log(speedGrowthRate + " : " + pauseGrowthRate + " : " + volumeGrowthRate + " : " + fillerGrowthRate + " : " + gazeGrowthRate);

        var smallest = Math.min(speedGrowthRate, pauseGrowthRate, volumeGrowthRate, fillerGrowthRate, gazeGrowthRate);
        var title;
        var text;
        switch (smallest) {
        case speedGrowthRate:
            var wpm = overview[overview.length - 1]['speed'];
            title = "SPEED";
            text = "Right now your speaking rate is at <strong style='color:#D6607B'>" + wpm + "</strong> words per minute.<br><br>The ideal speed for presentation is around <strong style='color:#D6607B'>125</strong> wpm. One of the public speaking champion speaks in 114 wpm too. English native speakers in America speak at around <strong>150</strong> words, so its best to speak in slower tone then you usually speak.<br><br> If you think the computer didn't catch it well, then you might have been speaking way too fast.<br><br>If you think you spoke too slowly, check back on your script and adjust what you have to say."
            break;
        case pauseGrowthRate:
            var pause = overview[overview.length - 1]['pause'];
            title = "PAUSE";
            text = "Right now you are pausing at <strong style='color:#D6607B'>"+ pause + "</strong> seconds on average. The best pause length is <strong style='color:#D6607B'>1 ~ 2</strong> seconds inbetween the sentences. <strong style='color:#D6607B'>Long intentional</strong> pauses can catch listeners attention as well. Pause allows listeners to fully understand the context of your speech, so it is very important that you pause for a appropriate length for a appropriate amount. <br><br> Its better to pause rather then to speak filler words too!"
            break;
        case volumeGrowthRate:
            var volume = overview[overview.length - 1]['volume'];
            if (volume < 50) volume = "very low";
            else if(volume < 100) volume = "rather low";
            else volume = "good"
                
            title = "VOLUME";
            text = "Right now you are speaking at a <strong style='color:#D6607B'>" + volume + " volume.</strong> You can improve it more by doing the following.<br><br><strong style='color:#D6607B'>1) SPEAK UP</strong> You might be speaking in a weaker voice. If the computer can't hear you well, the actual human listner won't be able to hear you well too.<br><br><strong style='color:#D6607B'>2) VOICE CONTROL</strong> - the change in voice level will attract the listners more.<br><br><strong style='color:#D6607B'>3) MIC PROBLEM</strong> - yes it might be the problem. Please check your device or the environment you are recording at."
            break;
        case fillerGrowthRate:
                
            var vidLength = overview[overview.length - 1]['length'];
            var temp_data = overview[overview.length - 1]['filler'] / vidLength;
            temp_data = cutDecimal(temp_data * 60); // average for 60 sec
                
            title="FILLER WORDS";
            text = "Right now you are speaking <strong style='color:#D6607B'>" + temp_data + "</strong> filler words per second on average.<br><br>Its always better to cut down on the filler words. Instead of saying 'um' or 'so', try pausing. Filler words make you seem <strong style='color:#D6607B'>less confident</strong> and <strong style='color:#D6607B'>unprepared</strong>. Pausing gives people a time to fully understand what you say, so its much better by comparison. <br><br> Try cutting down on Fillers! "
            break;
        case gazeGrowthRate:
            var headMovement = overview[overview.length - 1]['gaze'];
            title = "EYE CONTACT";
            text = "Right now you are changing your eye contact at every <strong style='color:#D6607B'>" + headMovement + "</strong> seconds. Effective speakers make eye contact for <strong style='color:#D6607B'>3 ~ 5 </strong>seconds per listener (or blocks if there is too many people). <br><br>Imagine that there are people sitting around your computer, listening to your speech. Try to change your gaze every <strong style='color:#D6607B'>1 or 2 </strong>sentence. Its so much better looking then just staring into the computer - this is a presentation practice! not video recording!"
            break;
        }
        
        var adviceTitle = document.getElementById('adviceTitle');
        var adviceDiv = document.getElementById('adviceDiv');
        $(adviceTitle).append(title);
        $(adviceDiv).append(text);


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

});