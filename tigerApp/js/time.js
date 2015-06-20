function footer(){	
	time_footer()
	client_footer()	
}

function time_footer(){
    var time = new Date();
    var hours = time.getHours()
    var minutes = time.getMinutes()
    minutes=((minutes < 10) ? "0" : "") + minutes
    var seconds = time.getSeconds()
    seconds=((seconds < 10) ? "0" : "") + seconds
    
    var day = time.getDate()
    var month = time.getMonth() + 1
    var year = time.getFullYear()  
               
    var str = "<br>" + day + "/" + month + "/" + year + " " + hours + ":" + minutes + ":" + seconds    
    
    document.getElementById('footer_time').innerHTML = str
    
    timer = setTimeout("time_footer()",1000)
}

function client_footer(){	
	var client = "Acquafert"
    var location = "Cicognolo"
    
    var str = client + " - " + location    
    
    document.getElementById('footer_client').innerHTML = str
}







var HTMLCode = "";
var DaysList = new Array("Jour_Vide", " Lun ", " Mar ", " Mer ", " Gio ", " Ven ", " Sab ", " Dom ");
var MonthsList = new Array("Mois_Vide", "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre");
var MonthLength = new Array("Mois_longueur_vide",31,29,31,30,31,30,31,31,30,31,30,31);

var QueryDate = 0; /* Jour demande (date)*/
var QueryMonth = 0; /* Mois demande*/
var QueryYear = 0; /* Annee demandee*/
var QueryDay = 0; /* Jour de la semaine du jour demande, inconnu*/
var FirstDay = 0; /* Jour de la semaine du 1er jour du mois*/
var WeekRef = 0; /* Numerotation des semaines*/
var WeekOne = 0; /* Numerotation des semaines*/

var Today = new Date();
var TodaysYear = Today.getYear();
var TodaysMonth = Today.getMonth() + 1;
var TodaysDate = Today.getDate();
var TodaysDay = Today.getDay() + 1;
if (TodaysYear < 2000) { TodaysYear += 1900; }

/* On commence par verifier les donnees fournies par l'utilisateur*/
function CheckData()
{
QueryDate = document.Cal.Date.selectedIndex + 1;
QueryMonth = document.Cal.Month.selectedIndex + 1;
QueryYear = (document.Cal.Century.selectedIndex + 15) * 100 + document.Cal.Year.selectedIndex;
MonthLength[2] = CheckLeap(QueryYear);

/* on teste si la date choisie est anterieure au lundi 20 decembre 1582*/
if ((QueryYear * 10000 + QueryMonth * 100 + QueryDate) < 15821220)
{
alert("Vous avez choisi une date antérieure au 20 décembre 1582, hors du calendrier Grégorien. \nVeuillez sélectionner une date plus récente.");
document.Cal.reset();
CheckData();
}
else if (MonthLength[QueryMonth] < QueryDate) /* on verifie si la date est coherente*/
{
alert("Il n'y a pas " + QueryDate + " jours en " + MonthsList[QueryMonth] + " " + QueryYear + " mais " + MonthLength[QueryMonth] + ". \nVeuillez choisir une autre date.");
document.Cal.reset();
CheckData();
}
else { DisplaySchedule(); }

}
/* Teste une annee pour determiner si elle est bissextile ou pas*/
function CheckLeap(yy)
{
if ((yy % 100 != 0 && yy % 4 == 0) || (yy % 400 == 0)) { return 29; }
else { return 28; }
}

/* Renvoie le numero de la semaine correspondant a la date requise*/
function DefWeekNum(dd)
{
numd = 0;
numw = 0;
for (n=1; n<QueryMonth; n++)
{
numd += MonthLength[n];
}
numd = numd + dd - (9 - DefDateDay(QueryYear,1,1));
numw = Math.floor(numd / 7) + 1;

if (DefDateDay(QueryYear,1,1) == 1) { numw++; }
return numw;
}

/* Renvoie le numero du jour de la semaine correspondant a la date requise */
function DefDateDay(yy,mm,dd)
{
return Math.floor((Date2Days(yy,mm,dd)-2) % 7) + 1;
}

/* Transforme la date en nb de jours theoriques */
function Date2Days(yy,mm,dd)
{
if (mm > 2)
{
var bis = Math.floor(yy/4) - Math.floor(yy/100) + Math.floor(yy/400);
var zy = Math.floor(yy * 365 + bis);
var zm = (mm-1) * 31 - Math.floor(mm * 0.4 + 2.3);
return (zy + zm + dd);
}
else
{
var bis = Math.floor((yy-1)/4) - Math.floor((yy-1)/100) + Math.floor((yy-1)/400);
var zy = Math.floor(yy * 365 + bis);
return (zy + (mm-1) * 31 + dd);
}
}

/* Produit le code HTML qui formera le calendrier */
function DisplaySchedule()
{
HTMLCode = "<table cellspacing=0 cellpadding=2 border=2 bordercolor=#000000>";
QueryDay = DefDateDay(QueryYear,QueryMonth,QueryDate);
WeekRef = DefWeekNum(QueryDate);
WeekOne = DefWeekNum(1);
HTMLCode += "<tr align=center><td colspan=8 class=TITRE><b>" + MonthsList[QueryMonth] + " " + QueryYear + "</b></td></tr><tr align=center>";

for (s=1; s<8; s++)
{
if (QueryDay == s) { HTMLCode += "<td><b><font color=#ff0000>&nbsp;" + DaysList[s] + "&nbsp;</font></b></td>"; }
else { HTMLCode += "<td><b>&nbsp;" + DaysList[s] + "&nbsp;</b></td>"; }
}

HTMLCode += "<td><b><font color=#888888><i>Sem</i></font></b></td></tr>";
a = 0;

for (i=(1-DefDateDay(QueryYear,QueryMonth,1)); i<MonthLength[QueryMonth]; i++)
{
HTMLCode += "<tr align=center>";
for (j=1; j<8; j++)
{
if ((i+j) <= 0) { HTMLCode += "<td> </td>"; }
else if ((i+j) == QueryDate) { HTMLCode += "<td><b><font color=#ff0000>" + (i+j) + "</font></b></td>"; }
else if ((i+j) > MonthLength[QueryMonth]) { HTMLCode += "<td> </td>"; }
else { HTMLCode += "<td>" + (i+j) + "</td>"; }
}

if ((WeekOne+a) == WeekRef) { HTMLCode += "<td><b><font color=#00aa00>" + WeekRef + "</font></b></td>"; }
else { HTMLCode += "<td><font color=#888888>" + (WeekOne+a) + "</font></td>"; }
HTMLCode += "</tr>";
a++;
i = i + 6;
}

Calendrier.innerHTML = HTMLCode + "</table>";
}
