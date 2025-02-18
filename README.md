# Airtable-merkelappgenerator

Kjør plugin "QR Code Maker" i Airtable for å generere QR-koder først.  
Merkelappgeneratoren setter sammen to felter (bilde og tekst) fra en airtable-base til en PNG, og lar deg laste ned en og en, eller en zip med alle.


Bruker Airtable Block CLI   
[@airtable/blocks-cli](https://www.npmjs.com/package/@airtable/blocks-cli)

Kjør:  
`$ block run`

**Husk å oppdatere `index.js` med rett veiw for kunde.**

Kan være problemer med å koble Airtable sitt dev-miljø til Chrome-baserte nettlesere.
FireFox fungerer utmerket.
Fish er også ikke verdens beste på å kjøre block sitt cli.