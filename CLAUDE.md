# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proiect

**ShowUp2Move** — prototip front-end (disciplina **PIUG**) pentru organizarea rapidă a activităților sportive spontane cu oameni din apropiere. Nu există backend: tot fluxul este simulat în browser cu date mock + `localStorage`.

Limba interfeței și a conținutului: **română** (cu diacritice).

## Stack și rulare

- HTML5 + CSS3 + JavaScript vanilla. Fără framework-uri, fără build, fără npm. Singurele resurse externe permise: Google Fonts, embed YouTube, `gtag.js`.
- Rulare: se deschide `index.html` direct în browser (`file://`), sau cu un server static (ex. extensia Live Server din VS Code / `npx serve .`). Embed-ul YouTube poate da eroare pe `file://` (lipsește referrer-ul), deci video-ul se testează prin server.
- Imaginile sunt linkuri directe Unsplash (`images.unsplash.com/photo-<id>`), fără fișiere locale. Dacă o imagine nu se încarcă, `main.js` o înlocuiește cu un SVG gradient care afișează `data-label` (`S.fixImg`).
- **Nu folosi ES modules (`type="module"`)**: nu rulează pe `file://` din cauza CORS. Scripturile sunt clasice, încărcate cu `defer`, într-o ordine fixă, și expun API-ul printr-un singur namespace global `window.SU2M`.
- Nu există teste sau linter. Verificarea se face manual în browser, la lățimile de 375px, 768px și 1280px, în ambele teme.

## Arhitectură

```
*.html            5 pagini la rădăcină, cu același header, footer și aceleași widget-uri globale
css/
  tokens.css      variabile CSS: culori (dark/light), fonturi, spațiere, raze, umbre
  base.css        reset, tipografie, utilitare
  layout.css      navbar fix, footer, grid-uri, secțiuni
  components.css  butoane, carduri, badge-uri, modale, tabel, formular, chatbot, UP/DOWN
  pages.css       stiluri specifice fiecărei pagini (grupate pe secțiuni comentate)
js/
  core/           încărcate pe toate paginile, în ordinea: utils, storage, analytics, data, theme, nav, scroll, help, chatbot
  pages/          un script per pagină: home, events, gallery, components, contact (se înregistrează în SU2M.pages[...])
  main.js         ultimul script; inițializează modulele core și apoi pe cel al paginii (după data-page)
```

Convenții care leagă fișierele între ele:
- Fiecare `<body>` are `data-page="home|events|gallery|components|contact"`. `nav.js` marchează linkul activ după această valoare, iar `main.js` alege din ea scriptul de pagină de inițializat.
- Tema se aplică prin `data-theme="dark|light"` pe `<html>`, accentul prin `data-accent`, mărimea textului prin `--font-scale`. Un mic script inline în `<head>` citește preferințele salvate înainte de randare, ca pagina să nu clipească în tema greșită.
- Tot accesul la `localStorage` trece prin `SU2M.storage` (chei cu prefixul `su2m:`, JSON, protejat cu try/catch).
- Datele mock (sporturi, intervale de mărime a grupului, zone, locații, utilizatori, evenimente) stau doar în `js/core/data.js`. Paginile nu își definesc propriile date.
- `<head>`-ul, navbar-ul și footer-ul se repetă identic în fiecare HTML. Când le modifici, modifică-le în **toate** cele 5 pagini. Widget-urile flotante (panoul de personalizare, Help, UP/DOWN, chatbot) nu sunt în HTML: le injectează modulul lor din `js/core/`.
- Iconițele sunt SVG-uri definite în `utils.js` (`S.icon(name)`). În HTML se pun ca `<span data-icon="name"></span>`, iar `S.fillIcons()` le completează.
- Paginile comunică prin evenimente DOM: `su2m:showup` (răspuns ShowUpToday) și `su2m:profile` (nivel/sport/zonă). Butoanele `[data-showup]` funcționează pe orice pagină, prin handler-ul global din `main.js`.
- Disponibilitatea utilizatorilor mock e deterministă pe zi (`S.rand(S.hash(azi + id))`): aceeași în toată ziua, diferită de la o zi la alta.

Fluxul de domeniu (pagina de evenimente și cea de start):
1. Utilizatorul răspunde **„ShowUpToday?”** Da/Nu; răspunsul se salvează cu data zilei și expiră a doua zi.
2. Pe baza sporturilor preferate, a zonei și a utilizatorilor mock disponibili, se generează grupuri spontane care respectă intervalele de mărime: fotbal 10–14, baschet 6–10, tenis 2–4, volei 6–12, alergare 2–8.
3. Fiecare grup are un **căpitan** (primul membru disponibil cu cel mai mare scor de încredere), o locație sugerată și un buget estimat pe persoană (costul terenului împărțit la numărul de membri).
4. Utilizatorul poate crea manual un eveniment, care apare în listă și se salvează în `localStorage`.

## Reguli de cod

- Folosește tokenurile din `tokens.css`, nu culori hardcodate în celelalte fișiere CSS.
- Abordare mobile-first. Breakpoint-uri: `min-width: 640px`, `900px` și `1200px`.
- HTML semantic și accesibil: `alt` pe imagini, `aria-label` pe butoanele care au doar iconiță, focus vizibil, modale care închid cu Esc și păstrează focusul în interior, `prefers-reduced-motion` respectat.
- Fără biblioteci de iconițe: iconițele sunt SVG inline, din `S.icon`.
- Orice text venit de la utilizator se trece prin `S.esc()` înainte de a ajunge în `innerHTML`. Căutările compară textele normalizate cu `S.norm()` (fără diacritice).
- La modificări, editează doar zonele relevante. Nu rescrie fișiere întregi.

## Direcția estetică

Identitate vibrantă **verde + mov**, aspect de produs făcut de o echipă tânără. Interzis: aspectul „AI generic” sau „corporate” (mult alb cu un strop de albastru, carduri identice, layout-uri previzibile).
- Verdele înseamnă acțiune, disponibilitate („ShowUpToday?”) și mișcare. Movul înseamnă partea socială: grupuri, badge-ul de căpitan, profunzime.
- Dark mode este tema implicită: cărbune și mov foarte închis, cu accente verzi și mov. Light mode folosește un fundal alb-lavandă cald, niciodată alb pur steril.
- Fonturi: **Space Grotesk** pentru titluri, **Plus Jakarta Sans** pentru text.
- Folosește asimetrii controlate, tag-uri colorate per sport, gradiente verde→mov folosite cu măsură, hover-uri fluide și secțiuni cu ritmuri vizuale diferite.

## Cerințe PIUG obligatorii (checklist)

1. Navbar fix pe toate paginile, cu pagina activă evidențiată și meniu hamburger pe mobil
2. Căutare și filtrare live (sport, zonă, nivel, activitate), cu mesaj când nu există rezultate
3. Galerie sau carusel cu lightbox, butoane Previous/Next și navigare din tastatură (← → Esc)
4. Tabel de componente (componentă, rol, status și detalii)
5. Formular de contact cu validare reală (nume, email, telefon RO, sport, mesaj), erori pe fiecare câmp și confirmare la trimitere
6. Video YouTube integrat
7. Iconițe de social media (footer și secțiune dedicată)
8. Conținut adaptat utilizatorului (comutator de profil, sport sau nivel care schimbă textele, imaginile și sugestiile)
9. Buton Help ca iconiță, care deschide un ghid rapid într-un modal
10. Butoane UP și DOWN pentru navigare rapidă în pagină
11. Design responsive pe desktop, tabletă și telefon
12. Personalizare: comutator Light/Dark, culoare de accent și mărime text, salvate în `localStorage`
13. Google Analytics: snippet `gtag.js` cu `G-XXXXXXXXXX` și un comentariu care arată unde se pune ID-ul real, în `<head>`-ul fiecărei pagini
14. Bonus: chatbot asistent pe bază de reguli (ShowUpToday, reguli, sporturi, locații, navigare)

## Rezumat pentru prezentare (ce s-a făcut și cum)

**Ce este:** un prototip front-end pentru ShowUp2Move, cu 5 pagini legate între ele: Acasă, Grupuri & Evenimente, Galerie, Componente & Ghid și Contact. Nu are server. Datele sunt simulate (mock), iar ce face utilizatorul se salvează în browser.

**Tehnologii folosite:**
- **HTML5 semantic**: `header`, `nav`, `main`, `section`, `article`, `footer`, `dialog` pentru ferestrele modale, `details`/`summary` pentru întrebările frecvente, `table` cu `caption`/`th scope`.
- **CSS3** fără framework:
  - variabile CSS (custom properties) pentru teme
  - Flexbox și CSS Grid pentru layout
  - `clamp()` pentru tipografie fluidă
  - `color-mix()`, `backdrop-filter`, `scroll-snap`, animații `@keyframes`
  - media queries mobile-first (640 / 900 / 1200px)
- **JavaScript vanilla (ES6+)**: arrow functions, template literals, `Set`, destructuring. Codul e organizat în module IIFE care folosesc un singur obiect global, `window.SU2M`. Nu am folosit ES modules, ca proiectul să meargă și la dublu-click pe fișier.
- **API-uri de browser**:
  - `localStorage` pentru preferințe, profil, evenimente create și mesaje
  - `<dialog>` cu `showModal()`, pentru focus și Esc gestionate nativ
  - `CustomEvent` pentru comunicarea dintre module
  - `matchMedia` pentru reduced motion și breakpoint-uri
  - `requestAnimationFrame` pentru animația cifrelor
- **Servicii externe**: Google Fonts (Space Grotesk, Plus Jakarta Sans), imagini Unsplash, embed YouTube, Google Analytics 4 (`gtag.js`).

**Cum e implementată fiecare cerință (pe scurt):**
1. *Navbar fix*: `position: fixed`. Linkul activ e ales din `data-page` de pe `<body>`. Pe mobil, meniul hamburger își actualizează `aria-expanded`.
2. *Căutare*: filtrează la fiecare tastă (evenimentul `input`). Textul se normalizează fără diacritice, deci „sala” găsește „Sală”. Se combină cu filtrele și afișează un mesaj când nu există rezultate.
3. *Galerie*: grilă asimetrică (`grid-auto-flow: dense`). La click se deschide un lightbox `<dialog>` cu Previous/Next, săgeți ← →, Esc și swipe pe telefon.
4. *Tabel de componente*: tabel HTML cu căutare și filtru de status. Tabelul de sporturi se generează din date.
5. *Formular*: validare cu expresii regulate (regex):
   - nume: doar litere Unicode, cu prenume și nume
   - email: format `nume@domeniu.tld`
   - telefon RO: `07xx…` sau `+40…`
   - mesaj: minim 20 de caractere

   Erorile apar sub fiecare câmp, la părăsirea câmpului și apoi pe măsură ce scrii. La trimitere apare un mesaj de confirmare.
6. *Video*: `iframe` YouTube responsive (`aspect-ratio: 16/9`).
7. *Social media*: iconițe SVG în footer și carduri mari în pagina Contact.
8. *Conținut adaptat*: nivelul (Începător / Intermediar / Avansat) și sportul ales schimbă titlul, sfaturile, imaginea și evenimentele recomandate. Alegerea e salvată.
9. *Help*: butonul „?” deschide un ghid general, plus sfaturi pentru pagina curentă.
10. *UP / DOWN*: `window.scrollTo` cu derulare lină. Butoanele se ascund când nu sunt utile.
11. *Responsive*: abordare mobile-first. Testat la 375 / 768 / 1280px.
12. *Personalizare*: Dark/Light, accent (verde / mov / lime) și mărimea textului. Totul vine din variabile CSS schimbate prin atribute pe `<html>` și se salvează în `localStorage`. Un script mic din `<head>` aplică tema înainte de afișare, ca pagina să nu clipească.
13. *Google Analytics*: snippetul `gtag.js` cu `G-XXXXXXXXXX`, plus evenimente proprii: răspuns ShowUpToday, căutare, creare eveniment, trimitere formular, deschidere galerie.
14. *Chatbot (bonus)*: chatbot pe reguli, fără AI. Caută cuvinte cheie în întrebare și alege răspunsul care se potrivește cel mai bine.

**Logica aplicației (dacă întreabă „cum se formează grupurile”):**
- Sunt 80 de utilizatori simulați. Disponibilitatea lor e calculată dintr-un generator pseudo-aleator care pornește de la dată și id. Rezultatul e același în toată ziua și diferit în ziua următoare.
- Pentru fiecare sport, oamenii disponibili sunt sortați: întâi cei din zona aleasă, apoi după scorul de încredere. Apoi sunt împărțiți în grupuri care respectă intervalul sportului (de ex. fotbal 10–14). Ce rămâne sub minim devine un grup „în formare”.
- **Căpitanul** este membrul cu cel mai mare scor de încredere.
- **Bugetul** = prețul terenului pe oră × durata ÷ numărul de jucători. De exemplu, 220 lei × 1,5 h ÷ 14 ≈ 24 lei de persoană.

**Accesibilitate:**
- link „Sari la conținut”
- `aria-label` pe butoanele care au doar iconiță
- `aria-live` pentru rezultatele care se schimbă
- focus vizibil
- tastatura funcționează peste tot
- `prefers-reduced-motion` respectat
- `alt` pe toate imaginile, plus imagine de rezervă dacă una nu se încarcă

**Securitate:** textul introdus de utilizator e „escapat” (`S.esc`) înainte să fie afișat în pagină. Asta previne XSS.
