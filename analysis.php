<!DOCTYPE html>
<html>

<head>
    <title>Presentation Upgrader | Analysis</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!--    <link href="css/bootstrap.min.css" rel="stylesheet">-->
    <link href="https://bootswatch.com/superhero/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="http://www.amcharts.com/lib/3/amcharts.js" type="text/javascript"></script>
    <script src="http://www.amcharts.com/lib/3/serial.js" type="text/javascript"></script>
    <script src="http://www.amcharts.com/lib/3/radar.js" type="text/javascript"></script>
    <script src="https://www.amcharts.com/lib/3/gauge.js"></script>
    <script src="js/displayChart.js"></script>
    <link rel="shortcut icon" href="">
    <style>
        .mini-box {
            height: 250px;
            width: 100%;
        }
        
        .big-box {
            height: 340px;
            width: 100%;
        }
        
        @media screen and (min-width: 992px) {
            .originalBorderRight {
                border-right: solid 15px #2c3e50;
            }
            .originalBorderLeft {
                border-left: solid 15px #2c3e50;
            }
        }
        
        .addMarginLeft {
            margin-left: 10px;
        }
        
        .addSmallMarginBottom {
            margin-bottom: 33px;
        }
        
        #moodMeter {
            text-align: center;
            display: table-cell;
            vertical-align: middle;
        }
        
        #moodMeterBefore {
            text-align: right;
            width: 100%;
            height: 20px;
            padding-right: 10px;
            margin-bottom: 0;
            margin-top: 5px;
            opacity: 0.7;
        }
        
        .centerMiddle {
            text-align: center;
            display: table;
            height: 225px;
            width: 100%;
        }
        
        .smallText {
            margin-left: 10px;
            font-size: 25px;
        }
        
        .bigText {
            font-size: 40px;
        }
        
        .bottomText {
            width: 100%;
            margin-left: 15px;
        }
    </style>
</head>

<body>

    <!-- Navigation -->
    <nav class="nav navbar navbar-default navbar-static-top" role="navigation">
        <div class="container">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">

                <a class="navbar-brand" href="index.html">Presentation Upgrader</a>

                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

            </div>
            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav navbar-right">
                    <li>
                        <a href="dashboard.html">Dashboard</a>
                    </li>
                    <li>
                        <a href="upload.html">Record</a>
                    </li>
                    <li>
                        <a href="analysis.php">Analysis</a>
                    </li>
                    <li>
                        <a href="http://web.sfc.keio.ac.jp/~t13779yh/FAQ/">FAQ</a>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container -->
    </nav>


    <div class="container addMarginTop">
        <div class="row">
            <div class="col-md-4 addMarginBottom">
                <div class="embed-responsive embed-responsive-4by3 addMarginBottom">
                    <video id="myVideoTag" class="embed-responsive-item" controls>
                        <source src="uploads/FileName.webm" type="video/webm">
                    </video>
                </div>
                <div class="addMarginBottom">
                    <h3 class="resetMargin addMarginBottom"><i class="material-icons md-32 verticalMiddle">assessment</i> Current Ratings</h3>

                    <div class="panel panel-default panel-body">

                        <div id="radarchartdiv" style="width: 100%; height: 250px;"></div>
                    </div>
                </div>

                <div class="addMarginBottom">
                    <h3 class="resetMargin addMarginBottom"><i class="material-icons md-32 verticalMiddle">chat</i> Comments</h3>

                    <!--POSTING COMMENT-->
                    <div class="panel panel-default panel-body">
                        <p>Add comment!</p>
                        <form action="" method="POST" id="commentForm">

                            <div class="rating">
                                <span><input type="radio" name="rating" id="str5" value="5"><label for="str5"></label></span>
                                <span><input type="radio" name="rating" id="str4" value="4"><label for="str4"></label></span>
                                <span><input type="radio" name="rating" id="str3" value="3"><label for="str3"></label></span>
                                <span><input type="radio" name="rating" id="str2" value="2"><label for="str2"></label></span>
                                <span><input type="radio" name="rating" id="str1" value="1"><label for="str1"></label></span>
                            </div>

                            <textarea name="comment" class="Input" style="width: 100%; height: 100px;" required></textarea>

                            <br>
                            <br>
                            <input type="submit" class="btn btn-success Submit" name="Submit" id="Submit" value="Submit">
                        </form>
                    </div>

                    <?php
                    date_default_timezone_set('JST');
                    $filename = 'comments.txt';
                    
                       if($_POST['Submit']){
                           print '<p style="color:red">'.'Your comment has been submitted</p>';
                           $Comment = $_POST['comment'];
                           $Rating = $_POST['rating'];
                           
                           $RatingString;
                           $h4Tag = '<span>';
                           $filledStar = '<i class='.'"material-icons text-warning md-22 verticalMiddle"'.'>star</i>';
                           $borderStar = '<i class='.'"material-icons text-warning md-22 verticalMiddle"'.'>star_border</i>';
                           
                           $dateTag = '<p style="float:right; opacity:0.7">';
                           
                           #Get string for the rating
                           switch ($Rating) {
                               case 1:
                                   $RatingString = $h4Tag.$filledStar.$borderStar.$borderStar.$borderStar.$borderStar.'</span>';
                                   break;
                               case 2:
                                   $RatingString = $h4Tag.$filledStar.$filledStar.$borderStar.$borderStar.$borderStar.'</span>';
                                   break;
                               case 3:
                                   $RatingString = $h4Tag.$filledStar.$filledStar.$filledStar.$borderStar.$borderStar.'</span>';
                                   break;
                               case 4:
                                   $RatingString = $h4Tag.$filledStar.$filledStar.$filledStar.$filledStar.$borderStar.'</span>';
                                   break;
                               case 5:
                                   $RatingString = $h4Tag.$filledStar.$filledStar.$filledStar.$filledStar.$filledStar.'</span>';
                                   break;    
                           }
                           
                           #Get old comments
                           $old = fopen($filename, "r+t");
                           $old_comments = fread($old, filesize($filename));
                           
                           #Delete everything, write down new and old comments
                           $write = fopen("comments.txt", "w+");
                           $string = '<li class="list-group-item">'.$RatingString.$dateTag.date("Y/m/d").'</p>'.'<br>'.'<p style="color:#F5F5F5; margin-top:10px;">'.$Comment.'</p>'.'</li>'.$old_comments;
                           fwrite($write, $string);
                           fclose($write);
                           fclose($old);
                       }
                    
                    #Read comments
                    $read = fopen($filename, "r+t");
                    echo '<ul class="list-group">';
                    echo fread($read, filesize($filename));
                    echo '</ul>';
                    fclose($read);
                    ?>

                </div>
                <br>
                <br>
            </div>

            <div class="col-md-8 addMarginBottom">

                <div class="addMarginBottom">
                    <h3 class="resetMargin addMarginBottom"><i class="material-icons md-32 verticalMiddle">network_check</i> Audio Analysis</h3>
                    <div class="col-md-6 panel panel-default panel-body originalBorderRight addSmallMarginBottom">
                        <div class="big-box">
                            <div class="mini-box" id="speedMeter"></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentSpeed"></span>
                                <span class="smallText">w/m</span>
                            </div>
                            <span class="bottomText"> SPEED</span>
                        </div>
                    </div>
                    <div class="col-md-6 panel panel-default panel-body originalBorderLeft addSmallMarginBottom">
                        <div class="big-box">
                            <div class="mini-box" id="volumeMeter"></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentVolume"></span>
                                <span class="smallText">%</span>
                            </div>
                            <span class="bottomText"> VOLUME</span>
                        </div>
                    </div>
                    <div class="col-md-6 panel panel-default panel-body originalBorderRight addSmallMarginBottom">
                        <div class="big-box">
                            <div class="mini-box" id="pauseMeter"></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentPause"></span>
                                <span class="smallText">secs</span>
                            </div>
                            <span class="bottomText"> AVERAGE PAUSE</span>
                        </div>
                    </div>
                    <div class="col-md-6 panel panel-default panel-body originalBorderLeft addMarginBottom">
                        <div class="big-box">
                            <div class="mini-box" id="fillerMeter"></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentFiller"></span>
                                <span class="smallText">words</span>
                            </div>
                            <span class="bottomText"> FILLER WORDS</span>
                        </div>
                    </div>
                </div>

                <div class="addMarginBottom">
                    <h3 class="resetMargin addMarginBottom"><i class="material-icons md-32 verticalMiddle">network_check</i> Non Verbal Analysis</h3>


                    <div class="col-md-6 panel panel-default panel-body originalBorderRight">
                        <div class="big-box">
                            <div class="mini-box" id="gazeMeter"></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentGaze"></span>
                                <span class="smallText">face movement</span>
                            </div>
                            <span class="bottomText"> EYE CONTACT</span>
                        </div>
                    </div>
                    <div class="col-md-6 panel panel-default panel-body originalBorderLeft addMarginBottom">
                        <div class="big-box">
                            <h5 id="moodMeterBefore">Before: </h5>
                            <div class="centerMiddle">
                                <h1 id="moodMeter"></h1></div>
                            <div class="addMarginLeft">
                                <span class="bigText" id="currentMood"></span>
                                <span class="smallText"></span>
                            </div>
                            <span class="bottomText"> Facial Expression</span>
                        </div>
                    </div>
                </div>


                <div class="addMarginBottom">
                    <h3 class="resetMargin addMarginBottom"><i class="material-icons md-32 verticalMiddle">assignment</i> Detailed Data</h3>
<!--                    <span style="float:right">@</span>-->



                    <div class="modal">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    <h4 class="modal-title">Modal title</h4>
                                </div>
                                <div class="modal-body">
                                    <p>One fine body…</p>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Changes in Facial Expression</h3>
                        </div>
                        <div class="panel-body">
                            <div id="friendlinesschartdiv" style="width: 100%; height: 150px;"></div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Eye Contact / Face Movement</h3>
                        </div>
                        <div class="panel-body">
                            <div id="gazechartdiv" style="width: 100%; height: 150px;"></div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Volume</h3>
                        </div>
                        <div class="panel-body">
                            <div id="volumechartdiv" style="width: 100%; height: 150px;"></div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Pitch</h3>
                        </div>
                        <div class="panel-body">
                            <div id="pitchchartdiv" style="width: 100%; height: 150px;"></div>
                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <h3 class="panel-title">Transcript</h3>
                        </div>
                        <div class="panel-body">
                            <div>
                                <p id="transcript" style="font-size: 20px; width: 100%;"></p>
                                <br>
                                <br>
                                <p id="fillercount" style="font-size: 20px; color: orange"></p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </div>


    <div class="navbar navbar-default navbar-static-bottom footer">
        <div class="container">
            <p class="navbar-text pull-right">website built by Yuka Hirose</p>
        </div>

    </div>


</body>

</html>