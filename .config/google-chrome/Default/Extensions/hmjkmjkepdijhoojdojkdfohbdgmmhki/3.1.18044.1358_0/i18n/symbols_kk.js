var a=this,b=function(f,k){f=f.split(".");var e=a;f[0]in e||!e.execScript||e.execScript("var "+f[0]);for(var g;f.length&&(g=f.shift());)f.length||void 0===k?e=e[g]&&e[g]!==Object.prototype[g]?e[g]:e[g]={}:e[g]=k};var c={c:{1E3:{other:"0K"},1E4:{other:"00K"},1E5:{other:"000K"},1E6:{other:"0M"},1E7:{other:"00M"},1E8:{other:"000M"},1E9:{other:"0B"},1E10:{other:"00B"},1E11:{other:"000B"},1E12:{other:"0T"},1E13:{other:"00T"},1E14:{other:"000T"}},b:{1E3:{other:"0 thousand"},1E4:{other:"00 thousand"},1E5:{other:"000 thousand"},1E6:{other:"0 million"},1E7:{other:"00 million"},1E8:{other:"000 million"},1E9:{other:"0 billion"},1E10:{other:"00 billion"},1E11:{other:"000 billion"},1E12:{other:"0 trillion"},1E13:{other:"00 trillion"},
1E14:{other:"000 trillion"}}};
c={c:{1E3:{other:"0\u00a0\u043c\u044b\u04a3"},1E4:{other:"00\u00a0\u043c\u044b\u04a3"},1E5:{other:"000\u00a0\u043c."},1E6:{other:"0\u00a0\u043c\u043b\u043d"},1E7:{other:"00\u00a0\u043c\u043b\u043d"},1E8:{other:"000\u00a0\u043c\u043b\u043d"},1E9:{other:"0\u00a0\u043c\u043b\u0440\u0434"},1E10:{other:"00\u00a0\u043c\u043b\u0440\u0434"},1E11:{other:"000\u00a0\u043c\u043b\u0440\u0434"},1E12:{other:"0\u00a0\u0442\u0440\u043b\u043d"},1E13:{other:"00\u00a0\u0442\u0440\u043b\u043d"},1E14:{other:"000\u00a0\u0442\u0440\u043b\u043d"}},
b:{1E3:{other:"0 \u043c\u044b\u04a3"},1E4:{other:"00 \u043c\u044b\u04a3"},1E5:{other:"000 \u043c\u044b\u04a3"},1E6:{other:"0 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"},1E7:{other:"00 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"},1E8:{other:"000 \u043c\u0438\u043b\u043b\u0438\u043e\u043d"},1E9:{other:"0 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"},1E10:{other:"00 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"},1E11:{other:"000 \u043c\u0438\u043b\u043b\u0438\u0430\u0440\u0434"},1E12:{other:"0 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"},
1E13:{other:"00 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"},1E14:{other:"000 \u0442\u0440\u0438\u043b\u043b\u0438\u043e\u043d"}}};var d={fa:"y",la:"y G",ga:"MMM y",ha:"MMMM y",F:"MMM d",G:"MMMM dd",I:"M/d",H:"MMMM d",ja:"MMM d, y",da:"EEE, MMM d",ka:"EEE, MMM d, y",i:"d"};d={fa:"y",la:"G y '\u0436'.",ga:"y '\u0436'. MMM",ha:"y '\u0436'. MMMM",F:"d MMM",G:"dd MMMM",I:"dd.MM",H:"d MMMM",ja:"y '\u0436'. d MMM",da:"d MMM, EEE",ka:"y '\u0436'. d MMM, EEE",i:"d"};var h={s:["BC","AD"],o:["Before Christ","Anno Domini"],K:"JFMAMJJASOND".split(""),X:"JFMAMJJASOND".split(""),D:"January February March April May June July August September October November December".split(" "),W:"January February March April May June July August September October November December".split(" "),T:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),Z:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),ca:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
aa:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),V:"Sun Mon Tue Wed Thu Fri Sat".split(" "),$:"Sun Mon Tue Wed Thu Fri Sat".split(" "),L:"SMTWTFS".split(""),Y:"SMTWTFS".split(""),U:["Q1","Q2","Q3","Q4"],R:["1st quarter","2nd quarter","3rd quarter","4th quarter"],a:["AM","PM"],g:["EEEE, MMMM d, y","MMMM d, y","MMM d, y","M/d/yy"],ba:["h:mm:ss a zzzz","h:mm:ss a z","h:mm:ss a","h:mm a"],h:["{1} 'at' {0}","{1} 'at' {0}","{1}, {0}","{1}, {0}"],v:6,ea:[5,6],w:5};
h={s:["\u0431.\u0437.\u0434.","\u0431.\u0437."],o:["\u0411\u0456\u0437\u0434\u0456\u04a3 \u0437\u0430\u043c\u0430\u043d\u044b\u043c\u044b\u0437\u0493\u0430 \u0434\u0435\u0439\u0456\u043d","\u0431\u0456\u0437\u0434\u0456\u04a3 \u0437\u0430\u043c\u0430\u043d\u044b\u043c\u044b\u0437"],K:"\u049a\u0410\u041d\u0421\u041c\u041c\u0428\u0422\u049a\u049a\u049a\u0416".split(""),X:"\u049a\u0410\u041d\u0421\u041c\u041c\u0428\u0422\u049a\u049a\u049a\u0416".split(""),D:"\u049b\u0430\u04a3\u0442\u0430\u0440 \u0430\u049b\u043f\u0430\u043d \u043d\u0430\u0443\u0440\u044b\u0437 \u0441\u04d9\u0443\u0456\u0440 \u043c\u0430\u043c\u044b\u0440 \u043c\u0430\u0443\u0441\u044b\u043c \u0448\u0456\u043b\u0434\u0435 \u0442\u0430\u043c\u044b\u0437 \u049b\u044b\u0440\u043a\u04af\u0439\u0435\u043a \u049b\u0430\u0437\u0430\u043d \u049b\u0430\u0440\u0430\u0448\u0430 \u0436\u0435\u043b\u0442\u043e\u049b\u0441\u0430\u043d".split(" "),
W:"\u049a\u0430\u04a3\u0442\u0430\u0440 \u0410\u049b\u043f\u0430\u043d \u041d\u0430\u0443\u0440\u044b\u0437 \u0421\u04d9\u0443\u0456\u0440 \u041c\u0430\u043c\u044b\u0440 \u041c\u0430\u0443\u0441\u044b\u043c \u0428\u0456\u043b\u0434\u0435 \u0422\u0430\u043c\u044b\u0437 \u049a\u044b\u0440\u043a\u04af\u0439\u0435\u043a \u049a\u0430\u0437\u0430\u043d \u049a\u0430\u0440\u0430\u0448\u0430 \u0416\u0435\u043b\u0442\u043e\u049b\u0441\u0430\u043d".split(" "),T:"\u049b\u0430\u04a3. \u0430\u049b\u043f. \u043d\u0430\u0443. \u0441\u04d9\u0443. \u043c\u0430\u043c. \u043c\u0430\u0443. \u0448\u0456\u043b. \u0442\u0430\u043c. \u049b\u044b\u0440. \u049b\u0430\u0437. \u049b\u0430\u0440. \u0436\u0435\u043b.".split(" "),
Z:"\u049a\u0430\u04a3. \u0410\u049b\u043f. \u041d\u0430\u0443. \u0421\u04d9\u0443. \u041c\u0430\u043c. \u041c\u0430\u0443. \u0428\u0456\u043b. \u0422\u0430\u043c. \u049a\u044b\u0440. \u049a\u0430\u0437. \u049a\u0430\u0440. \u0416\u0435\u043b.".split(" "),ca:"\u0436\u0435\u043a\u0441\u0435\u043d\u0431\u0456 \u0434\u04af\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0441\u04d9\u0440\u0441\u0435\u043d\u0431\u0456 \u0431\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0436\u04b1\u043c\u0430 \u0441\u0435\u043d\u0431\u0456".split(" "),
aa:"\u0416\u0435\u043a\u0441\u0435\u043d\u0431\u0456 \u0414\u04af\u0439\u0441\u0435\u043d\u0431\u0456 \u0421\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0421\u04d9\u0440\u0441\u0435\u043d\u0431\u0456 \u0411\u0435\u0439\u0441\u0435\u043d\u0431\u0456 \u0416\u04b1\u043c\u0430 \u0421\u0435\u043d\u0431\u0456".split(" "),V:"\u0416\u0441 \u0414\u0441 \u0421\u0441 \u0421\u0440 \u0411\u0441 \u0416\u043c \u0421\u0431".split(" "),$:"\u0416\u0441 \u0414\u0441 \u0421\u0441 \u0421\u0440 \u0411\u0441 \u0416\u043c \u0421\u0431".split(" "),
L:"\u0416\u0414\u0421\u0421\u0411\u0416\u0421".split(""),Y:"\u0416\u0414\u0421\u0421\u0411\u0416\u0421".split(""),U:["\u0406 \u0442\u049b\u0441.","\u0406\u0406 \u0442\u049b\u0441.","\u0406\u0406\u0406 \u0442\u049b\u0441.","IV \u0442\u049b\u0441."],R:["\u0406 \u0442\u043e\u049b\u0441\u0430\u043d","\u0406\u0406 \u0442\u043e\u049b\u0441\u0430\u043d","\u0406\u0406\u0406 \u0442\u043e\u049b\u0441\u0430\u043d","IV \u0442\u043e\u049b\u0441\u0430\u043d"],a:["AM","PM"],g:["y '\u0436'. d MMMM, EEEE","y '\u0436'. d MMMM",
"y '\u0436'. dd MMM","dd.MM.yy"],ba:["HH:mm:ss zzzz","HH:mm:ss z","HH:mm:ss","HH:mm"],h:["{1}, {0}","{1}, {0}","{1}, {0}","{1}, {0}"],v:0,ea:[5,6],w:6};var l={l:".",A:",",M:"%",ia:"0",P:"+",C:"-",u:"E",O:"\u2030",B:"\u221e",J:"NaN",j:"#,##0.###",S:"#E0",N:"#,##0%",f:"\u00a4#,##0.00",m:"USD"};l={l:",",A:"\u00a0",M:"%",ia:"0",P:"+",C:"-",u:"E",O:"\u2030",B:"\u221e",J:"\u0441\u0430\u043d\u00a0\u0435\u043c\u0435\u0441",j:"#,##0.###",S:"#E0",N:"#,##0%",f:"#,##0.00\u00a0\u00a4",m:"KZT"};b("I18N_DATETIMESYMBOLS_ERAS",h.s);b("I18N_DATETIMESYMBOLS_ERANAMES",h.o);b("I18N_DATETIMESYMBOLS_NARROWMONTHS",h.K);b("I18N_DATETIMESYMBOLS_STANDALONENARROWMONTHS",h.X);b("I18N_DATETIMESYMBOLS_MONTHS",h.D);b("I18N_DATETIMESYMBOLS_STANDALONEMONTHS",h.W);b("I18N_DATETIMESYMBOLS_SHORTMONTHS",h.T);b("I18N_DATETIMESYMBOLS_STANDALONESHORTMONTHS",h.Z);b("I18N_DATETIMESYMBOLS_WEEKDAYS",h.ca);b("I18N_DATETIMESYMBOLS_STANDALONEWEEKDAYS",h.aa);b("I18N_DATETIMESYMBOLS_SHORTWEEKDAYS",h.V);
b("I18N_DATETIMESYMBOLS_STANDALONESHORTWEEKDAYS",h.$);b("I18N_DATETIMESYMBOLS_NARROWWEEKDAYS",h.L);b("I18N_DATETIMESYMBOLS_STANDALONENARROWWEEKDAYS",h.Y);b("I18N_DATETIMESYMBOLS_SHORTQUARTERS",h.U);b("I18N_DATETIMESYMBOLS_QUARTERS",h.R);b("I18N_DATETIMESYMBOLS_AMPMS",h.a);b("I18N_DATETIMESYMBOLS_DATEFORMATS",h.g);b("I18N_DATETIMESYMBOLS_TIMEFORMATS",h.ba);b("I18N_DATETIMESYMBOLS_DATETIMEFORMATS",h.h);b("I18N_DATETIMESYMBOLS_FIRSTDAYOFWEEK",h.v);b("I18N_DATETIMESYMBOLS_WEEKENDRANGE",h.ea);
b("I18N_DATETIMESYMBOLS_FIRSTWEEKCUTOFFDAY",h.w);b("I18N_DATETIMEPATTERNS_YEAR_FULL",d.fa);b("I18N_DATETIMEPATTERNS_YEAR_MONTH_ABBR",d.ga);b("I18N_DATETIMEPATTERNS_YEAR_MONTH_FULL",d.ha);b("I18N_DATETIMEPATTERNS_MONTH_DAY_ABBR",d.F);b("I18N_DATETIMEPATTERNS_MONTH_DAY_FULL",d.G);b("I18N_DATETIMEPATTERNS_MONTH_DAY_SHORT",d.I);b("I18N_DATETIMEPATTERNS_MONTH_DAY_MEDIUM",d.H);b("I18N_DATETIMEPATTERNS_WEEKDAY_MONTH_DAY_MEDIUM",d.da);b("I18N_DATETIMEPATTERNS_DAY_ABBR",d.i);
void 0!==h.ma&&b("I18N_DATETIMESYMBOLS_ZERODIGIT",h.ma);b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_SEP",l.l);b("I18N_NUMBERFORMATSYMBOLS_GROUP_SEP",l.A);b("I18N_NUMBERFORMATSYMBOLS_PERCENT",l.M);b("I18N_NUMBERFORMATSYMBOLS_ZERO_DIGIT",l.ia);b("I18N_NUMBERFORMATSYMBOLS_PLUS_SIGN",l.P);b("I18N_NUMBERFORMATSYMBOLS_MINUS_SIGN",l.C);b("I18N_NUMBERFORMATSYMBOLS_EXP_SYMBOL",l.u);b("I18N_NUMBERFORMATSYMBOLS_PERMILL",l.O);b("I18N_NUMBERFORMATSYMBOLS_INFINITY",l.B);b("I18N_NUMBERFORMATSYMBOLS_NAN",l.J);
b("I18N_NUMBERFORMATSYMBOLS_DECIMAL_PATTERN",l.j);b("I18N_NUMBERFORMATSYMBOLS_SCIENTIFIC_PATTERN",l.S);b("I18N_NUMBERFORMATSYMBOLS_PERCENT_PATTERN",l.N);b("I18N_NUMBERFORMATSYMBOLS_CURRENCY_PATTERN",l.f);b("I18N_NUMBERFORMATSYMBOLS_DEF_CURRENCY_CODE",l.m);b("I18N_COMPACT_DECIMAL_SHORT_PATTERN",c.c);b("I18N_COMPACT_DECIMAL_LONG_PATTERN",c.b);