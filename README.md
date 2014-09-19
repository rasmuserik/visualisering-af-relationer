[![Build Status](https://travis-ci.org/solsort/visualisering-af-relationer.svg?branch=master)](https://travis-ci.org/solsort/visualisering-af-relationer)
[![Code Climate](https://codeclimate.com/github/solsort/visualisering-af-relationer/badges/gpa.svg)](https://codeclimate.com/github/solsort/visualisering-af-relationer)

# Visualisering af relationer - HTML5 visual relationsbrowser

Dette repositorie indeholder kode i forbindelse med projektet `visualisering af relationer`, og kommer til at indeholde en html5 visuel relationsbrowser til de danske biblioteker.

Projektet drives af Vejle og Herning biblioteker med støtte fra DDB-puljen.

Udviklingen foregår agilt/scrum-inspireret gennem 7 sprints á 2 uger. 
Hvert sprint afsluttes med en ny release, demo og retrospektiv.
Datoerne for sprintafslutningerne 26/9, 10/10, 24/10, 7/11, 21/11, 5/12 og 19/12.

Vi bruger scrumdo til at holde styr på opgaverne. Taskboard etc. er på http://www.scrumdo.com/projects/project/visualisering-af-relationer

## Installation/kørsel

- installer _npm_, _bower_ `npm install -g bower` og _grunt_ `npm install -g grunt-cli`
- hent projekt-afhængigheder `npm install`, `bower install`, `cd test; bower install`
- kør `grunt build` for at bygge minifiseret/optimeret udgave af kode i `dist/`. Se også de øvrige grunt-kommandoer med `grunt --help`

## Kodestandard

Vi følger Ding coding standard for javascript  http://ting.dk/wiki/ding-code-guidelines/.
Og tilføjer mere stringens ifht. eksempelvis jshint.

Se `.jshintrc`, samt `jsbeautifier: {...}` afsnittet i `Gruntfile.js` for konkrete valg om formattering og valg af tilgang.

Kommentarer indeholder desuden fold markers til at navigere i filen med editorer der understøtter det: `{{{1`, `{{{2`, ...

# done/releaselog


Indeværende sprint:
version 0.1.0, release 26/9

- infrastruktur: oprettelse af github repositorie, og basale filer i dette
- infrastruktur: opsætning af grunt, bower etc.
- infrastruktur: integrationsserver - automatisk kørsel af test ved commit til github, ie.: travis-ci
- infrastruktur: codeclimate/lint/indent/... af javascriptkode
- afklaring: kodestandard
- prototype: sample/dummy data structure for graph
- prototype: overlay med visualisering
- prototype: basic d3 layout for graf
- prototype: klynge af relationer efter type
- prototype: calculation of size of nodes in graph

# todo/backlog

Dette sprint:

- prototype: different coordinate systems - graph-calculation, visual layout, screen
- infrastruktur: automatisk deploy løbende publicering af kørende demo af visualiseringen ved github-commits
- prototype: tegning af dummy brøndobjekt - visualisering af materiale (forside + tekst) på visualiseringsoverlay
- prototype: tegning af graf til enkelte relationer
- prototype: tegning af klynge/sky
- afklaring: overordnet applikationsarkitektur
- afklaring: release og test-strategi, inkl workflow og understøttede platforme
- (infrastruktur: sample data til udvikling - holt)

## Later

- afklaring: hvilke relationstyper/data har vi tilgængelige fra brønd etc.
- Visualiserings-view: addi/eksterne relationer - relationer der vender ind ad
- Visualiserings-view: strukturelle relationer
- Visualiserings-view: cirkulære relationer - relationer der vender ud ad
- evt. sky/graf-agtig
- evt. tile/mesh-visualisering
- træstruktur-visualisering rettet mod små skærme
- Sikre at visualiseringsoverlayet tilpasser sig zoom og scroll på skærmen.
- Mulighed for at dele link til visualisering, samt virkende tilbageknap til visualisering i browseren. Teknisk: indkodning af visualiseringen i #-fragment i urlen, og brug af history-apiet.
- Storskærmsapplikation (evt. via node-webkit)
- opsamling af statistik / måling af anvendelse
- forbedring/optimering ud fra indsamlet statistik

----

# Projektnoter

## Follow-up status message

- workflow for release/test, og testplan
  - choice of test platforms
- teknologivalg
- næste udviklermøde
- status på kode, link til github-repositoier https://github.com/solsort/visualisering-af-relationer og nævn commits-side for live opdatering :)
- bortrejst næste uge
- ikke sikker på om der når at være noget oppe at køre i næste uge, men arbejder hårdt på det ;)
- arbejdssprog i dokumentation dansk eller engelsk, - http://ting.dk/wiki/ding-code-guidelines engelsk for comments?

## Diverse
_nedenstående er mine(rasmuserik) umiddelbare noter, gennemlæs gerne og sikre at de er korrekte, og fjern så denne kommentar :)_

- Use cases
  - DDB-CMS - mobil - tablet - pc 
    - eksempelvis knap/overlay på værkvisning object/collection
    - eksempelvis knap/overlay ved hvert værk i søgeresultat
  - storskærme med touch - dog kun én bruger per skærm (ikke flere samtidige brugere af samme skærm)
- Platform: chrome/firefox/safari7+/opera/ie10+/android4+, og evt. ie9+/android2.2+ hvis muligt/overkommeligt
- Formål: udforskning af biblioteksmaterialer, evt. lappe på værkvisning, præsentere relationer bedre
- Inspiration:
  - kig på spotify ui
  - tiles/mesh
  - komplekse strukturelle relationer i klassiske musikværker


## Møder og arrangementer

- næste udviklernetværksmøde i Herning - med præsentation/status på projekt

- indledende møde vejle 2014-08-06
- arbejdsmøde vejle 2014-09-10
