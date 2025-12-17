<h2>1. Link(s) til den deployede løsning (backend og frontend)</h2>

<h2>2. Login-informationer til testbrugere (hvis relevant)</h2>
   Privat user:
   mail: testest@test.test
   pw: testtest

Business user:
mail: test@business.test
pw: business123

<h2>3. En kort teknisk beskrivelse af jeres arkitektur og valg af teknologier/frameworks</h2>
   Vi benytter client side rendering (CSR) i form af React Router med SSR slået fra til vores frontend SPA. Til vores backend server bruger vi Express.js (NodeJS), som styrer kommunikationen af API, endpoints og frontend. Databasen kører igennem supabase, med PostgreSQL - vi benytter supabases authentication system til auth håndtering (login, signup osv.).

<h2>4. En liste og kort beskrivelse af de features, I har implementeret, med angivelse af den primære ansvarlige udvikler for hver feature, hvor det er relevant</h2>
Conversations & messages: Bjørn
Mulighed for at kunne sende beskeder mellem brugere.
Gruppebeskeder kan oprettes.
Beskeder kan oprettes, læses. Samtaler kan slettes.

Business & servicess: Jesper
Business profile og mulighed for at kunen lave opslag som en business og de bliver alle vist under service fanen

User profile (WIP), collab requests & authentication (signup, login & onboarding): Monica
Musikker profiler (frontend WIP) med mulighed for at kunne lave collab requests som den bruger der er logget ind.
Onboarding flowet med oprettelse af bruger.

Feed, notes & comments: Nicolai
Dashboard med visning af notes af de folk man følger, samt kunne se kommentarer, like og selv lave notes

<h2>5. Eventuelle kendte issues eller manglende features</h2>
   Man kan ikke skrive kommentarer på nuværende tidspunkt eller slette dem/notes igen (backend og db funktionalitet findes, frontend mangler implementering).
   Ingen funktionalitet til at følge folk (db funktionalitet findes, frontend og backend (endpoints) mangler implementering).
   Bruger og business profil findes implementeret i db og backend, mangler frontend.
   Fuld db og backend implementeret til beskeder, enkelte funktionaliteter mangles i frontend (slettelse af enkelt besked, redigering osv.).
   Man kan ikke tilføje media eller tags.
   Søgefunktionalitet overordnet mangler (undtaget messages).
   Notifikationer mangler implementering.
   Bookmarks virker i frontend, men ingen db/backend håndtering.
   Intet collab-feed (collab requests findes).
   m.m. (det er et stort projekt ok 😭)

<h2>6. En liste og kort beskrivelse af eventuelle ekstra features eller innovationer, I har tilføjet ud over kravene</h2>
   Oprettelse af conversations (fandtes ikke i figma designet).
   Justering af onboarding flow - uanset bruger eller business, skal man give personlige oplysninger (navn, tlf nr m.m).
   Oprettelse og redigering af services - ikke del af figma design.
   Vi har været dygtige og fulgt vores kundes ønsker...

<h2>7. En liste og kort beskrivelse af de områder, hvor I har truffet design-beslutninger der supplerer (eller afviger fra) Figma-designet, og begrundelserne for disse beslutninger</h2>
   Vi har forbedret onboarding flow designet, for at databasen skulle gå op på en logisk måde. Dette indebærer at separare navn feltet i to, med et for- og efternavnsfelt, da dette er en mere sikker måde at håndtere forskellige typer af navne, uden at skulle arbitrært splitte stringen for at få et fuldt navn ud. Derudover har vi optimeret rækkefølgen, så at alle brugere fylder personlige oplysninger ud. Målet er at gøre "appen" fremtidssikker ved at have forskellige typer af brugere, med mulighed for flere brugere ansvarlige for en business og eventuelle andre services osv.
   Til collab requests har vi justeret især database værdier, så at der tilføjes både en lokation og "due date" - vi mener at denne type af indlæg bør indikere hvor og hvornår det finder sted. Samtidig var der uoverenstemmelser i forhold til "preview" card og "read more" detail view, som vi har valgt at inkludere i begge views (nok en figma fejl, men en beslutning vi skulle tage uanset).

<h2>8. Et fungerende link til jeres primære project board (eller et screenshot, hvis ikke det er offentligt tilgængeligt)</h2>
   https://github.com/orgs/eaaa-dob-wu-e25a/projects/15/views/7
   (projektet er private, men det ligger i classroomet - i bør have adgang)

<h2>9. Fungerende links til:</h2>
9.1 Et eksempel på et af jeres GitHub issues, der illustrerer analyse og planlægning af en feature eller user story

- https://github.com/eaaa-dob-wu-e25a/sem-proj-bonjomi/issues/8

  9.2 Et eksempel på et af jeres pull requests, der viser konstruktiv feedback og forbedringer på en feature

- https://github.com/eaaa-dob-wu-e25a/sem-proj-bonjomi/pull/144

<h2>10. Et diagram over jeres databasestruktur (ER-diagram eller lignende) samt en kort beskrivelse af jeres datamodellering og relevante overvejelser (og eventuelle fortrydelser)</h2>

![Billede af vores db skema](supabase-schema-mrqgfzhnaznterfqaevn.svg)
Vi har sigtet efter 3NF i vores datamodellering (i må selv vurdere om vi har opnået det...). En gennemgående del af vores overvejelser har været, at lave databasen som om dette projekt reelt skulle bruges i fremtiden. Vi har splittet data ud i mindre tabeller med mål at gøre det mere skalerbart og nemmere at vedligeholde, hvor vi har oprettet hjælpetabeller som gavn for målet, og med formål at forhindre overbelastning af det overordnede system.

- En fortrydelse fra Monica af: håndtering af SoMe links i user_profiles føles forkert. Tror en bedre struktur ville have været nogen form for hjælpetabel (hashtabel / associativ matrix), som tager data fra flere tabeller og sætter dem sammen i en ny. Lidt ligesom Nicolais "likes" tabel.

- En frustration men ikke fortrydelse fra Monica: at splitte users og user_profile har gjort projektet en del mere komplekst at håndtere. Logikken og overvejelserne bag valget står jeg stadig ved, men fuck hvor irriterende at arbejde med.

<h2>11. Post-mortem: En kort opsummering og refleksion over hvad har fungeret godt i projektet, og hvad I ville gøre anderledes hvis I skulle lave projektet igen — både i forhold til tekniske valg, samarbejde og projektstyring.</h2>
<h3>"Godt"</h3>
    Fordeling af features mener vi er gået meget godt, med logisk og sammenhængende dele. Generelt samarbejde mellem gruppen har fungeret helt fint, ingen personlighedsgnidninger og så. Vandfaldsmodellen brugt til projektstruktur har sørget for at vores database og backend er (synes vi) blevet solid, vel- overvejet og udviklet. Vi har arbejdet fleksibelt og givet plads til hinanden, med hjemmearbejde hvor nødvendigt, og støtte til hinandens features og generelle problemer.

<h6>(Vi har mobbet Bjørn fordi han er døv og det er fucking irriterende (det er ok, han kan ikke høre det alligevel), og han kan ikke se farver - hvilken nørd. Rune kom hele vejen til skolen, fra en anden gruppe, bare for at spørge Bjørn om farven af hans traktor - Bjørn kan ikke se farver. Good times. 5/5 stjerner, would bully again.)</h6>

<h3>"Dårligt"</h3>
    Svært at finde lokaler - især med skærm - hvilket har gjort det udfordrende i de dele vi gerne ville kode sammen - altså dele udenfor vores features. Vi har manglet en konkret leder, som tog teten og hjalp med ordstyring og beslutningstagning. Som gruppe har vi været for passive, så diskussioner og beslutninger har taget for meget tid. Vandfaldsmodellen har vist sig at være uhensigtsmæssigt til et projekt på den her størrelse og kompleksitet, i forhold til vores udvikling af frontenden - det faldt lidt fra hinanden på det punkt. Vi endte med at bruge "for lang tid" på de forrige skridt.
    Det hjælper ikke at folk bliver syge - can't recommend, 0/5 stjerner.

<h2>FIN</h2>
