[![Build Status](https://travis-ci.org/solsort/visualisering-af-relationer.svg?branch=master)](https://travis-ci.org/solsort/visualisering-af-relationer)

# Visualisering af relationer - HTML5 visual relationsbrowser

Dette repositorie indeholder kode i forbindelse med projektet `visualisering af relationer`, og kommer til at indeholde en html5 visuel relationsbrowser til de danske biblioteker.

Projektet drives af Vejle og Herning biblioteker med støtte fra DDB-puljen.


# Udviklingsstatus / task board for nuværende sprint

Udviklingen foregår agilt/scrum-inspireret gennem 7 sprints á 2 uger. 
Hvert sprint afsluttes med en ny release, demo og retrospektiv.
Datoerne for sprintafslutningerne 26/9, 10/10, 24/10, 7/11, 21/11, 5/12 og 19/12.

Herunder er igangværende opgaver i nuværende sprint, - opdateres løbende som de bliver løst.

## DONE

- infrastruktur: oprettelse af github repositorie, og basale filer i dette

## In progress

- infrastruktur: integrationsserver - automatisk kørsel af test ved commit til github, ie.: travis-ci, browserling etc.

## TODO

- Infrastruktur - værktøj og rammer for projektet skal på plads og op at køre
  - infrastruktur: automatisk løbende publicering af kørende demo af visualiseringen ved github-commits
  - infrastruktur: automatisk lint/indent/... af javascriptkode
  - infrastruktur: eksempeldata som kan anvendes til udviklingen prototypen indtil vi har en webservice, ie. eksempel på hvilke data webservicen vil levere
- Afklaring - dokumentation af designvalg og årsager til disse
  - afklaring: overordnet applikationsarkitektur
  - afklaring: kodestandard - NB: check for standard fra ting.dk
  - afklaring: teknologivalg - understøttede browsere, anvendte teknologier
  - afklaring: release og test-strategi
  - afklaring: hvilke relationstyper/data har vi tilgængelige fra brønd etc.
- Prototype - kørende minimal relationsvisualisering oppe at køre så der er noget at tage udgangspunkt i - til at starte med sandsynligvist visualisering af ADDI-relationer(da disse nok er lettest tilgængelige) som ville kunne komme op på side med enkelt materiale
  - prototype: graf-layout via d3.js
  - prototype: overlay med visualisering ved tryk på knap, og indlejring af dette i html
  - prototype: visualisering af materiale (forside + tekst) på visualiseringsoverlay
  - prototype: visualisering af ADDI-relationer på visualiseringsoverlay

# Release-log og changelog

Ved afslutningen af hvert sprint laves en ny release, med beskrivelse herunder.


# Backlog for hele projektet

Backloggen indeholder de idéer/emner/ting der kan laves i projektet.
Kan med fordel formuleres som deciderede user-stories, og prioriteres.
Herunder nogle mulige emner, som senere kan brydes op i opgaver og placeres i TODO i task-board'et. 

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

*nedenstående er mine(rasmuserik) umiddelbare noter, gennemlæs gerne og sikre at de er korrekte, og fjern så denne kommentar :)*

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
