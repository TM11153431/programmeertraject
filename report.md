# App: AirBNB in Amsterdam

## Inleiding

De app geeft een beter inzicht in hoe AirBNB zich in Amsterdam heeft geplaatst. Als basis voor de informatievisualisatie heb ik een dataset gedownload met circa 15000 listings uit het jaar 2017 in de maand juni. Deze 15000 listings zijn geaggregreerd naar buurtcombinaties in Amsterdam. In totaal waren er 92 verschillende buurtcombinaties aangegeven met de eerste 4 cijfers van een postcode. Data wordt weergegeven door middel van een Choropleth map en histogram. Diepere statistieken zoals informatie over het type woning dat wordt verhuurd of het type leegstand vind je in de piechart. 

Leegstand? Ik heb gekozen om een willekeurige andere dataset toe te voegen aan de visualisatie. Waar je eerst enkel informatie over AirBNB krijgt zie je nu ook informatie over de leegstand in Amsterdam. Dit is niet de leegstand van de kamers maar leegstand in het algemeen. 

![alt](images/inleiding.jpg)

## Design

Over het algemeen is alle functionaliteit in main.js te vinden. Die is als volgt ingedeeld:

- Globale variabelen
- Aanmaken globale svg elementen
- Functies die de data tekenen
- Callbacks waarin de functies worden aangeroepen voornamelijk door events

Functies zijn enkel gebruikt voor het tekenen van de data en een enkele keer voor het aanmaken van een scale. De functies voor het tekenen roepen in principe geen andere functies aan. Hierdoor zijn ze redelijk lang, maar hiervoor heb ik gekozen omdat A) alle informatie over d3 op het internet op dezelfde wijze is geschreven en B) deze informatie op deze manier duidelijk en overzichtelijk van aard is.

### Globale varibelen in main.js zijn:

$data_type --> welke type_data er op dat moment wordt gezien. Bijvoorbeeld number_of_reviews of prijs van woningen in Amsterdam.
$selected --> geeft aan welke gebied geselecteerd is. Default status is 0
$scale: --> scale van de mercator map.

### Functies die je in main.js vind zijn:

- function: kaart --> tekent kaart
- function: teken_leegstand --> tekent leegstand
- function: histogram --> tekent histogram
- function: piechart --> tekent piechart
- function: bereken_scale --> berekent een d3.scale

## Callbacks en datafiles in main.js

Dit is de structuur die gebruikt wordt binnen main.js en met een korte uitleg wat je in de file vind:

- 'buurten_amsterdam_wsg84_stadsdelen_zip.geojson'
---> 'price_reviews.json'
-------> 'property_types.json'
------------> 'leegstand.json'
-----------------> 'leegstand_per_postcode.json' 

'buurten_amsterdam_wsg84_stadsdelen_zip.geojson': data die verantwoordelijk is voor de omlijning en de kaart zelf in d3. 
'price_reviews.json': hierin staat alle globale informatie per stadsdeel. Hoofddatafile en bekend als data_buurten in main.js.
'property_types.json': dit zijn de type woningen die verhuurt worden onderverdeeld per buurtcombinatie. 
'leegstand.json': dit is data over de leegstand met de exacte locaties aangegeven meet LNG en LAT coordinaten
'leegstand_per_postcode.json': leegstand informatie per buurtcombinatie(postcode)

Vervolgens, na het definiëren van de globals, functions en callbacks, roepen we de functionaliteit aan door middel van events en een standaard default load. 

De volgende events zijn actief in chronologische volgorde in main.js: 

- dropdown
- checkbox
- mouseover buurtcombinaties
- muisklik voor selectie

De dropdown veranderd de globale variabele data_type en roept opnieuw de functie van het tekenen van de kaart aan. Hierdoor wordt die kaart weer opnieuw getekend maar dan met andere data. Deze data komt het dezelfde file maar is nu anders omdat die met een andere key wordt aangeroepen. De indeling van de file --> {postcode: {type: data}}

De checkbox showed of hided de data van de leegstand. Dit is een muisklik event. 

Mouseover buurtcombinaties laat de data van de betreffende buurt zien en kleurt daarnaast ook de gebieden rood of terug naar hun normale staat bij een mouseout. Bij de mouseout moet weer opnieuw gebruik gemaakt worden van de scale van de kaart. Om niet weer de kaart opnieuw te tekenen is een functie geschreven voor de scale. 

Muisklik voor selectie is dat een gebied blauw wordt gekleurd wanneer erop gedrukt wordt. 

Vervolgens op het einde vind je de default load waarin alle functies verantwoordelijk voor het tekenen van de standaard visualisatie een keer worden aangeroepen. 

## Graphical design decision

### kaart Amsterdam

![alt](close-upmap)

Hier heb ik gekozen voor een simpele choropleth. Een kleurenscale met de kleur blauw aangezien airBNB ook voor deze stijl heeft gekozen bij hun eigen design waaronder bijvoorbeeld hun logo. Edit: blijkt dus niet zo te zijn, dacht van wel. Verder heb ik ervoor gekozen om de mouseover data linksboven en rechtsboven te laten zien. Ik had ook kunnen kiezen voor een mouseover in de buurt van de muis zelf met beide data soorten bij elkaar.

Ik heb gekozen voor de huidige situatie omdat ik vooral de gebruiker een inzich wil geven in de verdeling van de data over de map van Amsterdam en niet zozeer exacte details over buurten. Wellicht wel handig om natuurlijk iets van context te bieden mocht je behoefte eraan hebben om te weten waar wat ligt, maar daarom is die dan linksboven van de kaart aangegeven en valt die in eerste instantie niet zozeer op, dat was ook de bedoeling. De data rechtsboven valt wel op en hopelijk geeft de gebruiker meer initiatief om te interacteren met de kaart, omdat de informatie wat duidelijker naar voren komt. 

Verbeterpunt: ik heb gekozen voor de kleur wit om te laten zien dat er geen data is, echter dit moet een andere kleur zijn want nu denk je dat er gewoon weinig data is i.p.v. geen. Daarnaast loopt de kleurenscale ook niet tot wit maar door de witte kleur zou je denken van wel. 

### histogram

![alt](histogram)

Zelfde als de kaart. Waar de kaart zich vooral richt op de plaats geeft de histogram een duidelijke weergave tussen het verloop van laag en hoog. Interessante details die naar voren komen die in de kaart minder goed te zien zijn is bijvoorbeeld dat wanneer je kijkt naar het aantal reviews per buurtcombinatie, de buurt met de meeste reviews een aantal heeft van in de 16 000 en een buurt met de minste er maar 3 heeft. Ik denk een duidelijke conclusie die je hieruit kan trekken aan de hand van ook de kaart is dat a) veel activiteit is binnen het centrum oftewel hier dichter bij het centrum hoe drukker b) de verschillen de tussen de twee uiterste heel erg hoog is. 

### leegstand

![alt](leegstand)

Gekozen hiervoor is om gebruikt te maken van een sqrt scale, voor een betere weergave van de data. Eerst had ik hier een normale radius scale maar dat was onduidelijk.


### piechart

![alt](piechart)

Piecharts hebeen kleuren met veel contrast. Daarnaast wordt elke kleur aangegeven met wat het is door middel van een pijl. Helaas gaat dit vaker goed dan fout en is niet alle data duidelijk te lezen. Dit had ik kunnen oplossen door middel van een legenda. 






