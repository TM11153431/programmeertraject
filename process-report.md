#Process report 

### 12 juni 2017
Data was tot nu toe enkel beschikbaar per buurt maar kon de koppeling niet leggen tussen de buurt in de data en de buurt op de kaart. Dat is nu wel gedaan door middel van de eerste 4 cijfers van een postcode. Op internet stond een tabel waar de postcodes per buurt worden gegeven. Vervolgens via python de Geojson file die verantwoordelijk is voor het tekenen van de kaart aangepast dat per buurt er nu ook een postcode bij zit waardoor ik dan alle data via de postcode kan linken aan de buurt. Veel tijd besteed om een manier te vinden hoe ik dit het beste kon doen. 

Voor morgen wil ik graag de data in de map laten zien, een layout maken, verschillende soorten data met een dropdown laten zien. 

### 13 juni 2017
Dropdown en het veranderen van de data op de kaart van Amsterdam werkt. Eventuele probleemgebieden waren de callbacks. Verder framework gemaakt met 3 lagen van 960 width. 

Morgen: 
 - histogram maken
 - interactiviteit tussen histogram & kaart?? 

 ### 14 juni 2017
Basis voor histogram gemaakt, nog over is het tekenen van de assen en de rectangles. Moest nog even goed kijken hoe je nu precies een rectangle goed tekend. Daarnaast een simpele layout gemaakt met 3 vlakken voor de kaart, de histogram en twee andere visualisaties aan de onderkant. Voor de volgende dag afmaken van de histogram!

### 14 juni 2017

Histogram afmaken ging moeizaam, weinig opgeschoten. De assen moeten nog getekend worden. Verder zijn de rectangles er wel maar komen ze nu vanaf de bovenste as i.p.v. de onderste. 

### 15 juni 2017

Histogram tekenen afgemaakt. Vandaag ging beter dan voorheen. Moest even goed kijken wat er nu berekend werd. Voor de volgende dag het maken van een indeling. 

### 16 juni 2017

Vandaag een nieuwe CSS layout gemaakt. Verder was er vandaag ook presentatie. Feedback gekregen op de opdracht. Het moest nog iets duidelijk en ik moest iets meer werk gaan verichten om nog mijn project af te krijgen. Daarom na de opdracht even gewerkt aan een nieuwe layout om basis te geven voor het project hoe het verder gaat. toen bne ik tot de conlusie gekomen dat het misschien handiger is om de histogram enkel als illustratie te laten zien om de kaart te verduidelijken. Verder stond nu nog alles onder elkaar en heb ik een nieuwe indeling gemaakt door alles naast elkaar te zetten waardoor alles op hetzelfde scherm te zien is. 

### 20 juni 2017

Nieuwe week, nieuwe dag, nieuwe kansen. Verder werken aan de histogram. Kleiner gemaakt. Ook nog de layout hier en daar afgemaakt. Niet heel erg lang gewerkt vandaag. 

### 21 juni 2017

Begonnen aan de piechart aan de hand van een tutorial op internet. Piechart afgemaakt en ervoor gezorgd dat er twee getekend worden. 

### 22 juni 2017

Basis voor de getekende elementen op de website staat. Deze dag heb ik gewerkt zover ik me kon herinneren aan de functionaltieit tussen de elementen. Dit was over het algemeen niet moeilijk, enige waar ik wel tegenaan liep was dat alles binnen een functie zoals variabelen binnen een functie blijven. Toen kwam ik erachter dat als je een variabelel aanmaakt zonder var je hem overal kan veranderen maar ook dat je dan dus informatie gewoon in de dom kan veranderen zoals het toevoegen van een class. Hierdoor onthoudt je dan welk element uiteindelijk geselecteerd was bij de vorige mouse-out. Dus iets handigd geleerd vandaag en weer een beetje perspectief in programmeren gekregen en javascript. Mouseover tussen de histogram werrkt en de mouseover waarmee je buurten hightlight werkt ook.  

### 23 juni 2017

probleem: nog geen data voor tweede piechart. Op zoek gegaan naar nieuwe data maar moeilijk om iets relevants te vinden binnen mijn eigen data dus uiteindelijk erover gekozen om data vanaf data open Amsterdam te halen over de leegstand. Hier waren alle gebouwen ook aangegeven maar een postcode. Uiteindelijk liep ik tegen een groot probleem aan om de data goed te aggregreren met pandas. Dus dit heb ik overgelaten tot het einde. Verder niet veel gedaan. 

### 26 juni 2017

Gewerkt aan het uiterlijk van de website en nog de staafjes die laten zien wat precies wat is in de donut charts. Dit was redelijk lastig te begrijpen dus hiervoor heb ik uiteindelijk gekozen om bestaande kozen te gebruiken uit een d3 visualisatie en uiteraard netjes de source erbij gezet !! :o 

Verder de scale etc. en alles aangepast van de layout dat alles beter past op het beeldscherm. Alle elementen juist gezet aan de hand van flexbox. 

### 27 juni 2017

Leegstand data gebruikt om niet alleen de piechart te maken maar ook de leegstand te laten zien op de kaart in Amsterdam. Ik had al eens eerder coordinaten gebruikt dus toen was het enkel een circle per datapunt maken en de circle plaatsen aan de hand van de mercatorsscale + c en y coordinaten en ze passne precies op de map. 

### 28 juni 2017

gewerkt aan het opschonen van de data. 

### 29 juni 2017

Gewerkt aan het report.

### 30 juni 2017

EINDE






