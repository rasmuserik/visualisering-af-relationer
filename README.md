[![Build Status](https://travis-ci.org/solsort/visualisering-af-relationer.svg?branch=master)](https://travis-ci.org/solsort/visualisering-af-relationer)
[![Code Climate](https://codeclimate.com/github/solsort/visualisering-af-relationer/badges/gpa.svg)](https://codeclimate.com/github/solsort/visualisering-af-relationer)

Contents:
- About / Features
- User and Embedding Guide
- Code Architechture
- Coding Guidelines
- Release Log

# About / Features (rewrite progress)

Dette repositorie indeholder kode i forbindelse med projektet `visualisering af relationer`, og kommer til at indeholde en html5 visuel relationsbrowser til de danske biblioteker.

Projektet drives af Vejle og Herning biblioteker med støtte fra DDB-puljen.


# User and Embedding Guide (rewrite in progress)

Build:

- installer _npm_, _bower_ `npm install -g bower` og _grunt_ `npm install -g grunt-cli`
- hent projekt-afhængigheder `npm install`, `bower install`, `cd test; bower install`
- kør `grunt build` for at bygge minifiseret/optimeret udgave af kode i `dist/`. Se også de øvrige grunt-kommandoer med `grunt --help`

## File structure and utilities

File structure
- `app/` - selve kildekoden, javascript koden ligger i `app/scripts`
- `test/` - kildekode testcases
- `dist/` - den minificerede optimerede app havner her når `grunt build køres`
- `node_modules/`, `bower_components/`, `.tmp/` - autogenerede og installerede dependencies og temporære filer
- `bower.json`, `.gitignore`, `package.json`, `.yo-rc.json`, `.travis.yml`, `Gruntfile.js`, `.editorconfig`, `.gitattributes`, `COPYING`, `.jshintrc`  - konfigurationsfiler og metainformationer
- `README.md` denne fil/dokumentation

Utilities
- jquery - abstraktion over browserforskelligheder, vælges da den allerede anvendes på DDB-CMS hvilket er det primære sted hvor relationsbrowseren skal indlejres
- d3js - bruges til graf-layout og forskellig geometrisk funktionalitet
- grunt - byggeværktøj
- bower - styring af afhængigheder ifht. browserafhængigheder
- npm - bruges primært til installation af øvrige værktøj
- travis-ci - service for continous integration - automatisk kørsel af test
- jshint, jsbeautifier - værktøj til at understøtte best practices og formattering af kode


## Indlejring/API

Tilføj css-klassen `relvis-request` til de elementer der skal få relationsbrowseren til at poppe op. Tilføj derudover dataproperty'en `data-relvis-id` med et eller flere ting-id'er for det/de pågældende element, og optional `data-relvis-type` der angiver hvilken type view det skal referere til, eksempelvis:

    <button class="relvis-request" data-relvis-type="external"
        data-relvis-id="870970-basis:22331892,870970-basis%3A06520561,870970-basis%3A50588378"> 
      click me
    </button>

Når siden loades, eller ændres skal `relvis.init({...});` kaldes. 
Denne gør at elementer ændre klasse fra `relvis-request` til enten `relvis-enabled` eller `relvis-disabled` afhængigt af om klient-browseren understøtter relationsvisualiseringen. Samtidigt vil `relvis.init` også bind'e events til `relvis-enabled` elementer så relationsbrowseren popper op ved klik/touch af elementet.

`relvis.init` tager et objekt med forskellige parametre som argument. Eksempler på parametre kan være `apiUrl` for url'en på det API widget'en skal tale med, eller `searchQuery`, hvis den nuværende side er en søgning.

Et mere komplet eksempel er:

    <style>
      .relvis-request {
        display: none;
      }
      .relvis-disabled {
        display: none;
      }
      .relvis-enabled {
      }
    </style>
    <button class="relvis-request" 
        data-relvis-id="870970-basis:22331892"> 
      click me
    </button>
    <script>
    $(function() {
      relvis.init({
        apiUrl: '//api.vejlebib.dk/'
      });
    });
    </script>

# Code Architechture: Components and Cross-component Functions

`main.js` - entry point, and handle/dispatch visualisation through `location.hash`, create visualisation-links on page, and initialises all other components.
- `getType()`, `getIds()`, `setIds(..)` which visualisation is running, and on which ting-objects
- `close()`, `open(..)` user-callable function to open and close visualisation
- `init()` initialise the system, must be called first

----

`data-model.js` is responsible for loading data from the webservice, it also include an internal in-memory triple-store:
- `getValues(..)` returns a list of available values given an object+property-name. It also schedules loading the data from the webservice asynchronously.
- event `data-update` is emitted when data available is updated
- `apiUrl`, `relatedApiUrl` - configuration, set in main.js, that tells where data-model should load its data from
- `initData()` initialise data model

----

`graph-model.js` listens on `data-updates`, and generate graph based on `getIds()`. Can generate either graph of circular relations, external relations og structural relations based on `getType()`:
- `nodes` `edges` contains the graph itself

----

`graph-layout.js` calls d3 for graph layout.
- `layoutGraph()` create force graph lay out the graph
- `d3force` d3 object for the layout

----

`ui.js` all user interaction, including interaction with different visualisations.
- `initUI()` initialise
- `closeHandle`, `clickHandle` functions called when the user clicks on node, or outside of node.

----

`graph-canvas.js` draw the graph-visualisation onto the canvas:
- `toCanvasCoord(..)`, `toGraphCoord(..)` mapping between coordinate systems for canvas and for graph-layout
- `fixedViewport` whether the viewport should adjust to fit graph, settable
- `renderTime` information about how long last drawing of visualisation took
- `nodeAt(..)` locate node at given canvas coordinates
- event `redraw` is emitted when the graph is redrawn
- `topMargin`, `bottomMargin` margin of where to draw upon the canvas. Not clipping, so parts of nodes may be ouside of this. Settable.
- `requestRedraw()` schedule a redraw.

----

`canvas-overlay.js` is browser abstractions for a full screen hdpi canvas that will resize with browser window:
- `initCanvas()` `showCanvasOverlay()` `hideCanvasOverlay()`
- events `tapstart` `tapmove` `tapend` `drag` `tapclick` abstracts mouse and touch interaction
- `unit` the number of canvas pixels per "screen unit" (screen unit is approx the height of an 12pt letter)
- `canvas` the canvas itself

----

`item-view.js` is responsible for drawing the visualisation:
- `drawBackground(..)` draw static elements of visualisation
- `drawNode(..)` draw a node element
- `drawEdge(..)` draw an edge element
- `visualObjectRatio` tells the desired width/height ratio of the nodes

----

`canvas-util.js` has utility functions for drawing to canvas - only used by item-view:
- `writeBox(..)` draw text to canvas, fitted to certain dimensions

----

`util.js` contains general utility functions:
- `xy.*` simple 2d math
- `log(..)` send log information to server
- `logUrl` set in main.js, that tells where logging information should be sent to
- `addEventListener`, `dispatchEvent` simple event system, allowing components to subscribe to events similar to how you do it in the DOM
- `nearestPoints(..)` find the nearest point, it is weighted by the `visualObjectRatio` and thus very strongly linked to this application
- `findBoundaries(..)` find bounding box and create normalization-code for af set of 2d-points
- `nextTick(..)` execute function next tick
- `throttle(..)` limit rate of execution of function, so it is called at most once per n ms.

# Coding Guidelines (rewrite in progress)

Som udgangspunkt anvendes Ding coding standard for javascript http://ting.dk/wiki/ding-code-guidelines/.

Se `.jshintrc`, samt `jsbeautifier: {...}` afsnittet i `Gruntfile.js` for konkrete valg om formattering og valg af tilgang.
I forhold til jshint, er der truffet en del valg om at være mere stringent end ding-code-guidelines kræver. 
Nuværende eneste undtagelse hvor vi er mindre stringente, er at vi tillader brug af bitwise operatorer da disse skal bruges til geometriske beregninger.

Kommentarer indeholder desuden fold markers til at navigere i filen med editorer der understøtter dette, ie.: `{{{1`, `{{{2`, ...

- Release strategi html5-applikationen
  - Vi bruger semantisk versionering(http://semver.org), og laver typisk en ny release efter hvert sprint.
  - Minifiseret udgave (`grunt build`) af seneste release bliver lagt online på http://ssl.solsort.com/visualisering-af-relationer
  - Releases bliver tagget i git `git tag v0.?.?; git push --tags`, og også opdateret i `package.json`, og i releaseloggen i `README.md`
  - Email sendes herefter ud til arbejdsgruppen om ny udviklingsrelease, så yderligere manuel test og inkludering i drupal-modulet kan udføres.
- Teststrategi for manuel afprøvning: eksisterende, samt nyudviklede features i releaset testes:
  - På desktop browsere: IE10, IE11, Chrome, Safari, og Firefox
  - På Android og iOS enheder, både tablet og telefon.
  - Bugs, ændringer etc. tilføjes på https://github.com/solsort/visualisering-af-relationer/issues/new
- Efter test kan den minifiserede udgave inkluderes i https://github.com/vejlebib/ting_visual_relation og https://github.com/vejlebib/visual_relation

# Release Log

Backlog - todo and progress:
- publish production-ready related-service

Sprint 7:
- update README.md
- evt more code polish

## Version 0.7 sprint 7
### Version 0.7.1, released 18/12
- funktion til manuel aktivering af visualisering - relvis.open(ids)
- closeHandle funktion til lukning af relationsbrowser
- relvis.close()
- topMargin/bottomMargin
- example with different background
- cover, titel, defaultCover, abstract med ved 'click'-event
- polish code / code-climate-fixes
- location-fragment: "#relvis/cir" instead of "#relviscir" etc.
- highlight links to currently dragged edges

### Version 0.7.0, released 16/12
- fix interaction bug on android
- reduce graphics quality if rendering takes too long - for better performance on slow devices
- opsamling af statistik / måling af anvendelse
- make sure it works on all platforms, including √IE10, check √IE9, √webkit-mobile, √blink-mobile, √firefox-mobile
- erstat "Anmeldelse" med mere sigende tekst
- default-covers

## Version 0.6 sprint 6
### Version 0.6.2, released 5/12

- bedre håndtering af visualisering med 1,2,3 eller 4 objekter
- cirkulære relationer - interaktion træk til/fra centersky tilføjer/fjerner til/fra sky, klik medfører åben element, fjern ikke det sidste element fra skyen
- only query requested/available info, ie. no requests on subjects etc., only related if related-expand, ...
- luk-'knap'
- warmup - precache - vis kun link for objekter med data
- visual-relation-server-data

### Version 0.6.1, released 29/11

- strukturelle relationer indenfor samling af relationer - demo baseret på søgning
- snak med søgeapi; objekt-id kan både være søgning, ting-objekt, collection. 
- eksterne relationer - tekst på overlay forfatter/anmeldelser/emne/struktur

## Version 0.5 sprint 5
### Version 0.5.1, released 22/11
- Forbedr af interaktion på touch-devices
- request-redraw on image-load
- forbedret visualisering - objekter tegnes som forside, evt. hvid m. titel 

### Version 0.5.0, released 12/11
- Anvendelse af DDB-CMS recommendations webservice, som alternativ til udviklingswebservice
  - demo DDB-CMS: http://relvis.solsort.com/visualisering-af-relationer/#relviscir870970-basis:29970874 http://relvis.solsort.com/visualisering-af-relationer/#relviscir870970-basis:29847193
  - demo udvilingswebservice: http://relvis.solsort.com/visualisering-af-relationer/solsort-related.html#relviscir870970-basis:29970874 http://relvis.solsort.com/visualisering-af-relationer/solsort-related.html#relviscir870970-basis:29847193

## Version 0.4 sprint 4
### Version 0.4.1, released 7/11
- interaction
  - add click-detection/support to tap-handler abstraction
  - close relation browser on click on background
  - handle click on ting-object
    - optional handling function as parameter (clickHandle on init object)
  - document
  - click adds/remove to klynge in circular relation visualisation
- circular relation breadth first instead of depth first + async

### Version 0.4.0, released 31/10
- visualisering af cirkulære relationer 
  - indhentning af data fra api-server
  - graph-walk, og identifikation af hvilke nodes der skal vises
  - tegning af relationer
  - knap til aktivering
  - jsonp in adhl-server
  - adhl-server pre-calculate related elements
- visualisations on ting-collections
  - generate+visualise graph for collections
  - hidden edges between elements in collection

## Version 0.3 sprint 3
### Version 0.3.3, released 24/10

- sample server for cirkulære relationer (baseret på ADHL)
  - undersøg om det kan lade sig gøre, ie. korrespondans mellem ting-id og adhl-data
  - script der skaber database
  - api-server
- handling of relation types listed on http://oss.dbc.dk/services/open-search-web-service

### Version 0.3.2, released 21/10

- visualisation polish
  - fixed zoom/dpi-bug when interacting
  - margin fit size of objects
  - handle different relation types from api, inkl. cover
  - better handling of graphs with single element
  - more sample queries in demo page
  - hashchange support, ie. forward/back button moves to and from visualisation

### Version 0.3.1, released 19/10

- kommunikation med APIet
  - make sure we use the supplied api-url instead of the hard-coded one during development

### Version 0.3.0, released 18/10

- klarere data model
  - triple-store: `addTriple(obj, prop, val)`, `removeTriple(obj, prop, val)`, `getTripleValues(obj, prop)`
  - generering af graf-data fra triple-store-data
  - data-model som separat komponent
  - events for requests
  - data-update event, og regenerer-graf on event
  - throttled function
- kommunikation med APIet
  - get the data from the API
  - sample api-button
  - better scaling of viewport realised needed when having elements with few data
- interaktion - træk elementer rundt på skærmen
  - pinned option på node
  - lock view during interaction
  - handle tap-down
  - handle move
  - handle release
- sikr den kan køre rent asynkront, ie. ikke anvender jquery og d3 før init kaldes

## Version 0.2.0, released 10/10, sprint 2

- API for embedning
  - afklar api for embedning
  - implementér
  - dokumentér
- refaktorér - gå mere i retning af arkitekturplan
  - item-view som separat komponent
  - util som separat komponent
  - fælles relvis scope
  - graph-layout som separat komponent
  - graph-model som separat komponent, både kant-liste og også pseudo-nodes for forfatter/anmeldels/struktur/cirkulær
  - graph-canvas som separat komponent
  - mere dokumentation 
  - mere test
- graph-canvas
  - to-vejs transformation mellem canvas-koordinater og graf-koordinater
  - klik/touch element afklar hvilket
- visualisering
  - forside som del af visning hvis tilgængelig
  - kanter/linjer mellem relationer
- canvas-overlay
  - korrekt placering af canvas i Internet Explorer
  - opdater position ved scroll/zoom/skærm-rotation
  - abstraher touch/mouse-events
  - skala/unit-information
  - håndtér unsupported browsers
  - Undersøg om vi kan køre på android 2, eller er bundet til android 4+ pga. canvas bugs.
    - android 2.1 virker ikke pga. https://code.google.com/p/android/issues/detail?id=5141
    - android 2.2 ser ud til at virke

## Version 0.1.0, released 27/9, sprint 1

- Infrastruktur udvikling af HTML5 relationsbrowseren
  - oprettelse af github-repositorie http://github.com/solsort/visualisering-af-relationer så der er åbenhed om udviklingsprocessen, og muligt løbende at følge med
  - application skeleton
  - build environment: grunt, bower, npm, jshint, jsbeautifier, codeclimate
  - continous integration server
  - online udgave af seneste release på http://ssl.solsort.com/visualisering-af-relationer
- Start på første prototype af den eksterne relationsbrowser
  - sample/dummy data for development
  - overlay for visualisering
  - layout af elementer via d3 force graph
  - automatisk skalering af elementer
  - linjeskift og automatisk skalering af tekst
  - tegning af klynge/sky
- Afklaring og dokumentation
  - kodestandard
  - applikationsarkitektur
  - udkast til release og test-strategi
  - udkast til produktmål


# old notes (refactoring/removal in progress)
## Visualisering af relationer - HTML5 visual relationsbrowser

Dette repositorie indeholder kode i forbindelse med projektet `visualisering af relationer`, og kommer til at indeholde en html5 visuel relationsbrowser til de danske biblioteker.

Projektet drives af Vejle og Herning biblioteker med støtte fra DDB-puljen.

Udviklingen foregår agilt/scrum-inspireret gennem 7 sprints á 2 uger. 
Hvert sprint afsluttes med en ny release, demo og retrospektiv.
Datoerne for sprintafslutningerne 26/9, 10/10, 24/10, 7/11, 21/11, 5/12 og 19/12.

Vi bruger scrumdo til at holde styr på opgaverne. Taskboard etc. er på http://www.scrumdo.com/projects/project/visualisering-af-relationer

## Successkriterier og produktmål for HTML5 relationsbrowseren

- Relationsbrowseren skal fungere uanset hvilket system den implementeres i:
  - Skal kunne indlejres på hjemmesider, herunder særligt DDB
  - Skal kunne indlejres i applikation til storskærm (dog kun med en interagerende bruger ad gangen)
- Resultatet skal være en enkeltstående minifiseret javascript-fil, der kun afhænger af jquery og d3js
  - Skal have sit eget JavaScript scope, og ikke kollidere med globale objekter
  - Skal kunne initialiseres og styres med et enkelt api
- Relationsbrowseren skad mindst have tre "views":
  - Eksterne relationer: Fokus på et enkelt materiale, med visning tilhørende relationer (anmeldelser, forfatterinfo, værkstruktur og emner/cirkulære-relationer)
  - Strukturelle relationer: En samling af materialer og deres indbyrdes struktur, ie. bind i serie, eller et tidskrift med artikler
  - Cirkulære relationer: Relationer mellem forskellige værker eksempelvis på baggrund af emne, forfatter eller ADHL(andre der har lånt)
- Målplatform er efgrænset til nyere browsere der har features til at understøtte en visuel dynamisk relationsbrowser 
  - Webbrowsere: IE10+, Chrome, Safari, Firefox, iOS browser, Android 4+ browser
  - Skal fungere på mobil, tablet, computer og storskærm (dog kun med én interagerende bruger ad gangen)
- Teknologi og kode
  - Der kan frit vælges teknologi der gør det mest effektivt at udvikle modulet
  - Arkitektur og valg skal dokumenteres
  - Koden skal overholde best practices

