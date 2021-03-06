$('head').append('<style type="text/css">\
.scrappy_sidebar p {\
	margin:0px 0 10px 0;\
}\
.scrappy_hl{\
	transition: background-color .1s linear\
	transition: border-color .1s linear\
}\
.scrappy_highlight_good, .scrappy_highlight_suggest\
{\
	border-radius:6px;\
	border-width: 3px;\
	border-style: solid;\
}\
.scrappy_sidebar .scr_forward, .scrappy_sidebar .scr_back{\
	position:absolute;\
	text-decoration:none;\
	color:black;\
}\
.scrappy_sidebar .scr_navigation{\
	height: 20px;\
	position:relative;\
}\
.scrappy_sidebar .scr_forward{\
	right:5px;\
}\
.scrappy_sidebar .scr_back{\
	left:5px;\
}\
.scrappy_sidebar .toggle_button{\
	color:#C0C0C0;\
	display:inline;\
	cursor:pointer;\
}\
#scrappySB\
{\
	position:fixed;\
	color: #585858;\
	left:0px;\
	border-radius: 3px;\
	top:0px;\
	width:190px;\
	z-index:2147483640;\
	x-overflow:hidden;\
	background-color:grey;\
	font-color:black;\
	font-weght:normal;\
}\
.scrappy_sidebar .scr_step{\
	font-size:11px;\
	text-shadow: 0.09em 0.09em #AAA;\
	font-weight: bold;\
}\
.scrappy_sidebar a:hover, .scrappy_sidebar a:active {\
    color: #447BC4;\
    text-decoration: underline;\
}\
.scrappy_selected\
{\
	border-radius: 6px;\
	padding:2px 4px 2px 4px;\
	background-color:#009933;\
	color: white;\
}\
.scrappy_sidebar .scr_slide{\
	text-align:left;\
	border-radius:5px;\
	background:	#D8D8D8;\
}\
.scrappy_sidebar .scr_slide .scr_content{\
	padding:8px;\
	position:relative;\
}\
.scrappy_sidebar .scr_small_text{\
	font-size:8px;\
}\
.scrappy_sidebar #scrappyMenu{\
	padding:8px;\
}\
.scrappy_sidebar #scrappyMenu ol{\
	padding-left:20px;\
}\
.scrappy_sidebar #scrappyTitleBar \
{\
	text-align:left;\
	background-color:#585858;\
	font:11px arial,sans-serif;\
	color: #C0C0C0;\
	margin:0px;\
	padding: 4px;\
}\
.scrappy_sidebar #scrappyMinDiv{\
	position:fixed;\
	color: #585858;\
	left:0px;\
	border-radius: 3px;\
	top:0px;\
	width:190px;\
	z-index:2147483640;\
}\
.scrappy_sidebar #scrappyMin, .scrappy_sidebar #scrappyClose{\
	float:right;\
}\
.scrappy_highlight_good\
{\
	background-color:#88f975;\
	border-color: #01920b;\
}\
.scrappy_highlight_suggest\
{\
	background-color:#FFE066;\
	border-color:  #FF9900;\
}\
.scrappy_sidebar\
{\
	font:11px arial,sans-serif;\
}\
\
.scrappy_transparent\
{\
	filter: alpha(opacity=40);\
	opacity: 0.4;\
}\
a.scr_button\
{\
	background:#E8E8E8;\
	display:inline;\
	padding:5px;\
	text-decoration:none;\
	border-radius:3px;\
	width:60px;\
	text-align:center;\
	cursor: pointer;\
}\
a.scr_button:hover\
{\
	background-color:#383838;\
	box-shadow: 1px 2px 2px #000;\
	color: #FFF;\
	text-decoration:none;\
}\
a.scr_scrape:hover\
{\
	background-color:#00FF66;\
	color: #333;\
}\
.scrappy_opaque\
{\
	filter: alpha(opacity=100);\
	opacity: 1;\
}\
input, select, button {\
    border: 1px solid #999999;\
}\
\
.toggle_button:hover\
{\
	color:#FFF;\
}\
.heading{\
	color: #222;\
	text-shadow: white 0.1em 0.1em 0.1em;\
}\
.bold\
{\
	font-size:12px;\
	font-weight:bold;\
}\
.scrappy_hover\
{\
	border-radius: 6px;\
}\
\
.scr_disabled{\
	opacity:.3;\
}\
.scr_disabled:hover{\
	background-color:auto;\
}\
/*Background blackout*/\
#scrape_blackout{\
	top: 0px;\
	left: 0px;\
	width: 100%;\
	height: 100%;\
	background-color: black;\
	opacity: 0.7;\
	position: fixed;\
	margin: 0px;\
	zIndex: 2147483645;\
}\
#scrappy_progressbar{\
	margin:auto;\
	height:40px;\
	width:400px;\
	position:relative;\
	zIndex:2147483647;\
}\
#scrape_progress{\
	position: fixed;\
	top: 100px;\
	left: 300px;\
	height: 80px;\
	width: 500px;\
	zIndex: 2147483646;\
	background-color:#FFF;\
	text-align: center;\
	border: 1px solid black;\
	border-radius: 3px;\
	padding: 10px;\
}\
\
#progress_text{\
	color:red;\
	padding:10px;\
	font:18px arial,sans-serif;\
	text-shadow: 0.04em 0.04em #AAA;\
	-moz-transition: opacity 1.5s linear;\
}\
/*Slider CSS*/\
.scr_slider{\
	width:500%;\
	overflow:auto;\
	overflow-x:hidden;\
	-moz-transition: margin .2s ease-out;\
}\
.scr_slider.scr_s1 .scr_slide.scr_s1, .scr_slider.scr_s2 .scr_slide.scr_s2,\
.scr_slider.scr_s3 .scr_slide.scr_s3, .scr_slider.scr_s4 .scr_slide.scr_s4,\
.scr_slider.scr_s5 .scr_slide.scr_s5 {\
	opacity:1;\
	filter: alpha(opacity=100);\
}\
.scr_slider .scr_slide{\
	width:20%;\
	overflow:auto;\
	overflow-x:hidden;\
	opacity:0;\
	filter: alpha(opacity=0);\
	float:left;\
	-moz-transition: opacity .5s ease-out;\
}\
\
.scr_slider.scr_s2{\
	margin: 0 0 0 -100% !important;\
}\
.scr_slider.scr_s3{\
	margin: 0 0 0 -200% !important;\
}\
.scr_slider.scr_s4{\
	margin: 0 0 0 -300% !important;\
}\
.scr_slider.scr_s5{\
	margin: 0 0 0 -400% !important;\
}</style>');