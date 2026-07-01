import type { CefrLevel, Flashcard } from "./types";

/** Raw seed content — full Flashcard fields are filled in by `seedCards()`. */
interface SeedEntry {
  german: string;
  english: string;
  examples: string[];
}

/**
 * Comprehensive Goethe-Zertifikat A1 (Start Deutsch 1) core vocabulary,
 * organized by the standard A1 topic areas. Each entry has an English
 * translation and one natural example sentence (German + English).
 */
const A1_SEED: SeedEntry[] = [
  // ── Greetings & polite expressions ─────────────────────────────
  {
    german: "Hallo",
    english: "hello",
    examples: ["Hallo, wie geht es dir? (Hello, how are you?)"],
  },
  {
    german: "Tschüss",
    english: "bye",
    examples: ["Tschüss, bis morgen! (Bye, see you tomorrow!)"],
  },
  {
    german: "Guten Morgen",
    english: "good morning",
    examples: [
      "Guten Morgen! Hast du gut geschlafen? (Good morning! Did you sleep well?)",
    ],
  },
  {
    german: "Guten Tag",
    english: "good day / hello",
    examples: ["Guten Tag, ich heiße Anna. (Hello, my name is Anna.)"],
  },
  {
    german: "Guten Abend",
    english: "good evening",
    examples: [
      "Guten Abend, schön Sie zu sehen. (Good evening, nice to see you.)",
    ],
  },
  {
    german: "Auf Wiedersehen",
    english: "goodbye",
    examples: ["Auf Wiedersehen und danke! (Goodbye and thank you!)"],
  },
  {
    german: "Bitte",
    english: "please / you're welcome",
    examples: ["Einen Kaffee, bitte. (A coffee, please.)"],
  },
  {
    german: "Danke",
    english: "thank you",
    examples: ["Danke für deine Hilfe. (Thanks for your help.)"],
  },
  {
    german: "Entschuldigung",
    english: "excuse me / sorry",
    examples: [
      "Entschuldigung, wo ist der Bahnhof? (Excuse me, where is the station?)",
    ],
  },
  {
    german: "Ja",
    english: "yes",
    examples: ["Ja, das ist richtig. (Yes, that is correct.)"],
  },
  {
    german: "Nein",
    english: "no",
    examples: ["Nein, danke. (No, thank you.)"],
  },

  // ── Question words ─────────────────────────────────────────────
  { german: "wer", english: "who", examples: ["Wer ist das? (Who is that?)"] },
  {
    german: "was",
    english: "what",
    examples: ["Was machst du? (What are you doing?)"],
  },
  {
    german: "wo",
    english: "where",
    examples: ["Wo wohnst du? (Where do you live?)"],
  },
  {
    german: "wann",
    english: "when",
    examples: ["Wann kommst du? (When are you coming?)"],
  },
  {
    german: "wie",
    english: "how",
    examples: ["Wie heißt du? (What is your name?)"],
  },
  {
    german: "warum",
    english: "why",
    examples: ["Warum lernst du Deutsch? (Why are you learning German?)"],
  },
  {
    german: "woher",
    english: "where from",
    examples: ["Woher kommst du? (Where are you from?)"],
  },
  {
    german: "wohin",
    english: "where to",
    examples: ["Wohin gehst du? (Where are you going?)"],
  },
  {
    german: "wie viel",
    english: "how much",
    examples: ["Wie viel kostet das? (How much does that cost?)"],
  },

  // ── Numbers ────────────────────────────────────────────────────
  {
    german: "null",
    english: "zero",
    examples: ["Die Nummer beginnt mit null. (The number starts with zero.)"],
  },
  {
    german: "eins",
    english: "one",
    examples: ["Ich möchte nur eins. (I want only one.)"],
  },
  {
    german: "zwei",
    english: "two",
    examples: ["Ich habe zwei Kinder. (I have two children.)"],
  },
  {
    german: "drei",
    english: "three",
    examples: ["Wir sind drei Personen. (We are three people.)"],
  },
  {
    german: "vier",
    english: "four",
    examples: ["Das Zimmer hat vier Fenster. (The room has four windows.)"],
  },
  {
    german: "fünf",
    english: "five",
    examples: ["Es ist fünf Uhr. (It is five o'clock.)"],
  },
  {
    german: "sechs",
    english: "six",
    examples: ["Ich stehe um sechs Uhr auf. (I get up at six o'clock.)"],
  },
  {
    german: "sieben",
    english: "seven",
    examples: ["Die Woche hat sieben Tage. (The week has seven days.)"],
  },
  {
    german: "acht",
    english: "eight",
    examples: ["Der Kurs beginnt um acht. (The course starts at eight.)"],
  },
  {
    german: "neun",
    english: "nine",
    examples: ["Sie ist neun Jahre alt. (She is nine years old.)"],
  },
  {
    german: "zehn",
    english: "ten",
    examples: ["Ich habe zehn Euro. (I have ten euros.)"],
  },
  {
    german: "elf",
    english: "eleven",
    examples: ["Es ist elf Uhr. (It is eleven o'clock.)"],
  },
  {
    german: "zwölf",
    english: "twelve",
    examples: ["Das Jahr hat zwölf Monate. (The year has twelve months.)"],
  },
  {
    german: "zwanzig",
    english: "twenty",
    examples: [
      "Der Bus kommt in zwanzig Minuten. (The bus comes in twenty minutes.)",
    ],
  },
  {
    german: "hundert",
    english: "hundred",
    examples: ["Das Buch hat hundert Seiten. (The book has a hundred pages.)"],
  },
  {
    german: "tausend",
    english: "thousand",
    examples: [
      "Die Stadt hat tausend Einwohner. (The town has a thousand inhabitants.)",
    ],
  },

  // ── People & family ────────────────────────────────────────────
  {
    german: "die Frau",
    english: "woman / wife",
    examples: ["Die Frau liest ein Buch. (The woman is reading a book.)"],
  },
  {
    german: "der Mann",
    english: "man / husband",
    examples: ["Der Mann trinkt Kaffee. (The man is drinking coffee.)"],
  },
  {
    german: "das Kind",
    english: "the child",
    examples: [
      "Das Kind spielt im Garten. (The child is playing in the garden.)",
    ],
  },
  {
    german: "der Junge",
    english: "the boy",
    examples: ["Der Junge geht zur Schule. (The boy goes to school.)"],
  },
  {
    german: "das Mädchen",
    english: "the girl",
    examples: ["Das Mädchen singt gern. (The girl likes to sing.)"],
  },
  {
    german: "die Mutter",
    english: "the mother",
    examples: ["Meine Mutter kocht sehr gut. (My mother cooks very well.)"],
  },
  {
    german: "der Vater",
    english: "the father",
    examples: ["Mein Vater arbeitet viel. (My father works a lot.)"],
  },
  {
    german: "die Eltern",
    english: "the parents",
    examples: ["Meine Eltern wohnen in Berlin. (My parents live in Berlin.)"],
  },
  {
    german: "die Tochter",
    english: "the daughter",
    examples: [
      "Ihre Tochter ist fünf Jahre alt. (Her daughter is five years old.)",
    ],
  },
  {
    german: "der Sohn",
    english: "the son",
    examples: ["Sein Sohn spielt Fußball. (His son plays football.)"],
  },
  {
    german: "die Schwester",
    english: "the sister",
    examples: [
      "Meine Schwester studiert Medizin. (My sister studies medicine.)",
    ],
  },
  {
    german: "der Bruder",
    english: "the brother",
    examples: ["Mein Bruder wohnt in München. (My brother lives in Munich.)"],
  },
  {
    german: "die Oma",
    english: "the grandma",
    examples: ["Meine Oma backt einen Kuchen. (My grandma is baking a cake.)"],
  },
  {
    german: "der Opa",
    english: "the grandpa",
    examples: [
      "Mein Opa liest die Zeitung. (My grandpa is reading the newspaper.)",
    ],
  },
  {
    german: "die Familie",
    english: "the family",
    examples: ["Meine Familie ist groß. (My family is big.)"],
  },
  {
    german: "der Freund",
    english: "the friend (male)",
    examples: ["Er ist mein bester Freund. (He is my best friend.)"],
  },
  {
    german: "die Freundin",
    english: "the friend (female)",
    examples: ["Meine Freundin kommt heute. (My friend is coming today.)"],
  },
  {
    german: "der Name",
    english: "the name",
    examples: ["Wie ist dein Name? (What is your name?)"],
  },
  {
    german: "die Leute",
    english: "the people",
    examples: ["Viele Leute warten hier. (Many people are waiting here.)"],
  },

  // ── Body & health ──────────────────────────────────────────────
  {
    german: "der Kopf",
    english: "the head",
    examples: ["Mein Kopf tut weh. (My head hurts.)"],
  },
  {
    german: "die Hand",
    english: "the hand",
    examples: ["Gib mir deine Hand. (Give me your hand.)"],
  },
  {
    german: "das Auge",
    english: "the eye",
    examples: ["Sie hat blaue Augen. (She has blue eyes.)"],
  },
  {
    german: "das Ohr",
    english: "the ear",
    examples: ["Mein Ohr tut weh. (My ear hurts.)"],
  },
  {
    german: "der Arm",
    english: "the arm",
    examples: ["Er hat einen starken Arm. (He has a strong arm.)"],
  },
  {
    german: "das Bein",
    english: "the leg",
    examples: ["Mein Bein ist müde. (My leg is tired.)"],
  },
  {
    german: "der Fuß",
    english: "the foot",
    examples: ["Ich gehe zu Fuß. (I go on foot.)"],
  },
  {
    german: "der Arzt",
    english: "the doctor",
    examples: ["Ich gehe heute zum Arzt. (I am going to the doctor today.)"],
  },
  {
    german: "die Apotheke",
    english: "the pharmacy",
    examples: ["Die Apotheke ist geschlossen. (The pharmacy is closed.)"],
  },
  {
    german: "krank",
    english: "sick",
    examples: ["Ich bin heute krank. (I am sick today.)"],
  },
  {
    german: "gesund",
    english: "healthy",
    examples: ["Obst ist gesund. (Fruit is healthy.)"],
  },
  {
    german: "das Medikament",
    english: "the medicine",
    examples: [
      "Nimm das Medikament dreimal am Tag. (Take the medicine three times a day.)",
    ],
  },

  // ── Food & drink ───────────────────────────────────────────────
  {
    german: "das Essen",
    english: "the food / meal",
    examples: ["Das Essen schmeckt gut. (The food tastes good.)"],
  },
  {
    german: "das Brot",
    english: "the bread",
    examples: ["Ich esse Brot zum Frühstück. (I eat bread for breakfast.)"],
  },
  {
    german: "das Brötchen",
    english: "the bread roll",
    examples: ["Ich kaufe zwei Brötchen. (I am buying two bread rolls.)"],
  },
  {
    german: "die Butter",
    english: "the butter",
    examples: ["Die Butter ist im Kühlschrank. (The butter is in the fridge.)"],
  },
  {
    german: "der Käse",
    english: "the cheese",
    examples: [
      "Der Käse kommt aus der Schweiz. (The cheese is from Switzerland.)",
    ],
  },
  {
    german: "das Ei",
    english: "the egg",
    examples: ["Ich esse ein Ei zum Frühstück. (I eat an egg for breakfast.)"],
  },
  {
    german: "die Milch",
    english: "the milk",
    examples: ["Die Milch ist sauer. (The milk is sour.)"],
  },
  {
    german: "der Kaffee",
    english: "the coffee",
    examples: ["Ich trinke morgens Kaffee. (I drink coffee in the morning.)"],
  },
  {
    german: "der Tee",
    english: "the tea",
    examples: ["Möchtest du einen Tee? (Would you like a tea?)"],
  },
  {
    german: "das Wasser",
    english: "the water",
    examples: ["Ich trinke gern Wasser. (I like drinking water.)"],
  },
  {
    german: "der Saft",
    english: "the juice",
    examples: ["Der Saft ist frisch. (The juice is fresh.)"],
  },
  {
    german: "das Bier",
    english: "the beer",
    examples: ["Das Bier ist kalt. (The beer is cold.)"],
  },
  {
    german: "der Wein",
    english: "the wine",
    examples: ["Ein Glas Wein, bitte. (A glass of wine, please.)"],
  },
  {
    german: "der Apfel",
    english: "the apple",
    examples: ["Der Apfel ist rot und süß. (The apple is red and sweet.)"],
  },
  {
    german: "die Banane",
    english: "the banana",
    examples: ["Die Banane ist gelb. (The banana is yellow.)"],
  },
  {
    german: "die Kartoffel",
    english: "the potato",
    examples: ["Wir essen heute Kartoffeln. (We are eating potatoes today.)"],
  },
  {
    german: "die Tomate",
    english: "the tomato",
    examples: ["Die Tomate ist rot. (The tomato is red.)"],
  },
  {
    german: "das Gemüse",
    english: "the vegetables",
    examples: ["Iss mehr Gemüse! (Eat more vegetables!)"],
  },
  {
    german: "das Obst",
    english: "the fruit",
    examples: ["Ich kaufe Obst auf dem Markt. (I buy fruit at the market.)"],
  },
  {
    german: "das Fleisch",
    english: "the meat",
    examples: ["Ich esse kein Fleisch. (I don't eat meat.)"],
  },
  {
    german: "der Fisch",
    english: "the fish",
    examples: ["Der Fisch schmeckt frisch. (The fish tastes fresh.)"],
  },
  {
    german: "der Reis",
    english: "the rice",
    examples: ["Zum Fisch gibt es Reis. (There is rice with the fish.)"],
  },
  {
    german: "der Zucker",
    english: "the sugar",
    examples: [
      "Nimmst du Zucker im Kaffee? (Do you take sugar in your coffee?)",
    ],
  },
  {
    german: "das Salz",
    english: "the salt",
    examples: ["Die Suppe braucht mehr Salz. (The soup needs more salt.)"],
  },
  {
    german: "die Suppe",
    english: "the soup",
    examples: ["Die Suppe ist heiß. (The soup is hot.)"],
  },
  {
    german: "der Kuchen",
    english: "the cake",
    examples: ["Der Kuchen ist sehr süß. (The cake is very sweet.)"],
  },
  {
    german: "das Frühstück",
    english: "the breakfast",
    examples: [
      "Das Frühstück ist um acht Uhr. (Breakfast is at eight o'clock.)",
    ],
  },
  {
    german: "das Mittagessen",
    english: "the lunch",
    examples: ["Was gibt es zum Mittagessen? (What is there for lunch?)"],
  },
  {
    german: "das Abendessen",
    english: "the dinner",
    examples: [
      "Wir kochen das Abendessen zusammen. (We cook dinner together.)",
    ],
  },
  {
    german: "das Restaurant",
    english: "the restaurant",
    examples: ["Das Restaurant ist sehr gut. (The restaurant is very good.)"],
  },
  {
    german: "der Hunger",
    english: "the hunger",
    examples: ["Ich habe großen Hunger. (I am very hungry.)"],
  },
  {
    german: "der Durst",
    english: "the thirst",
    examples: ["Ich habe Durst. (I am thirsty.)"],
  },

  // ── House & furniture ──────────────────────────────────────────
  {
    german: "das Haus",
    english: "the house",
    examples: ["Das Haus ist sehr groß. (The house is very big.)"],
  },
  {
    german: "die Wohnung",
    english: "the apartment",
    examples: [
      "Meine Wohnung hat drei Zimmer. (My apartment has three rooms.)",
    ],
  },
  {
    german: "das Zimmer",
    english: "the room",
    examples: ["Mein Zimmer ist klein. (My room is small.)"],
  },
  {
    german: "die Küche",
    english: "the kitchen",
    examples: ["Die Küche ist modern. (The kitchen is modern.)"],
  },
  {
    german: "das Bad",
    english: "the bathroom",
    examples: [
      "Das Bad ist neben der Küche. (The bathroom is next to the kitchen.)",
    ],
  },
  {
    german: "das Schlafzimmer",
    english: "the bedroom",
    examples: ["Das Schlafzimmer ist ruhig. (The bedroom is quiet.)"],
  },
  {
    german: "das Wohnzimmer",
    english: "the living room",
    examples: [
      "Wir sitzen im Wohnzimmer. (We are sitting in the living room.)",
    ],
  },
  {
    german: "die Tür",
    english: "the door",
    examples: ["Bitte mach die Tür zu. (Please close the door.)"],
  },
  {
    german: "das Fenster",
    english: "the window",
    examples: ["Das Fenster ist offen. (The window is open.)"],
  },
  {
    german: "der Tisch",
    english: "the table",
    examples: ["Das Buch liegt auf dem Tisch. (The book is on the table.)"],
  },
  {
    german: "der Stuhl",
    english: "the chair",
    examples: ["Der Stuhl ist bequem. (The chair is comfortable.)"],
  },
  {
    german: "das Bett",
    english: "the bed",
    examples: ["Ich gehe früh ins Bett. (I go to bed early.)"],
  },
  {
    german: "der Schrank",
    english: "the cupboard / wardrobe",
    examples: [
      "Die Kleidung ist im Schrank. (The clothes are in the wardrobe.)",
    ],
  },
  {
    german: "die Lampe",
    english: "the lamp",
    examples: ["Die Lampe ist kaputt. (The lamp is broken.)"],
  },
  {
    german: "der Fernseher",
    english: "the television",
    examples: [
      "Der Fernseher ist im Wohnzimmer. (The television is in the living room.)",
    ],
  },
  {
    german: "der Garten",
    english: "the garden",
    examples: [
      "Im Garten blühen Blumen. (Flowers are blooming in the garden.)",
    ],
  },
  {
    german: "der Schlüssel",
    english: "the key",
    examples: ["Ich finde meinen Schlüssel nicht. (I can't find my key.)"],
  },
  {
    german: "die Miete",
    english: "the rent",
    examples: ["Die Miete ist hoch. (The rent is high.)"],
  },

  // ── Clothing & colors ──────────────────────────────────────────
  {
    german: "die Kleidung",
    english: "the clothing",
    examples: ["Die Kleidung ist neu. (The clothing is new.)"],
  },
  {
    german: "das Hemd",
    english: "the shirt",
    examples: ["Das Hemd ist weiß. (The shirt is white.)"],
  },
  {
    german: "die Hose",
    english: "the trousers",
    examples: ["Die Hose ist zu lang. (The trousers are too long.)"],
  },
  {
    german: "das Kleid",
    english: "the dress",
    examples: ["Das Kleid ist sehr schön. (The dress is very beautiful.)"],
  },
  {
    german: "die Jacke",
    english: "the jacket",
    examples: [
      "Zieh eine Jacke an, es ist kalt. (Put on a jacket, it's cold.)",
    ],
  },
  {
    german: "der Schuh",
    english: "the shoe",
    examples: ["Meine Schuhe sind neu. (My shoes are new.)"],
  },
  {
    german: "der Pullover",
    english: "the sweater",
    examples: ["Der Pullover ist warm. (The sweater is warm.)"],
  },
  {
    german: "die Brille",
    english: "the glasses",
    examples: [
      "Ich brauche meine Brille zum Lesen. (I need my glasses for reading.)",
    ],
  },
  {
    german: "die Farbe",
    english: "the color",
    examples: ["Welche Farbe magst du? (Which color do you like?)"],
  },
  {
    german: "rot",
    english: "red",
    examples: ["Das Auto ist rot. (The car is red.)"],
  },
  {
    german: "blau",
    english: "blue",
    examples: ["Der Himmel ist blau. (The sky is blue.)"],
  },
  {
    german: "grün",
    english: "green",
    examples: ["Das Gras ist grün. (The grass is green.)"],
  },
  {
    german: "gelb",
    english: "yellow",
    examples: ["Die Sonne ist gelb. (The sun is yellow.)"],
  },
  {
    german: "schwarz",
    english: "black",
    examples: ["Meine Katze ist schwarz. (My cat is black.)"],
  },
  {
    german: "weiß",
    english: "white",
    examples: ["Der Schnee ist weiß. (The snow is white.)"],
  },
  {
    german: "braun",
    english: "brown",
    examples: ["Das Brot ist braun. (The bread is brown.)"],
  },
  {
    german: "grau",
    english: "grey",
    examples: ["Der Himmel ist heute grau. (The sky is grey today.)"],
  },

  // ── Time & calendar ────────────────────────────────────────────
  {
    german: "die Zeit",
    english: "the time",
    examples: ["Ich habe keine Zeit. (I have no time.)"],
  },
  {
    german: "die Uhr",
    english: "the clock / o'clock",
    examples: ["Wie viel Uhr ist es? (What time is it?)"],
  },
  {
    german: "die Stunde",
    english: "the hour",
    examples: ["Der Film dauert zwei Stunden. (The film lasts two hours.)"],
  },
  {
    german: "die Minute",
    english: "the minute",
    examples: ["Warte eine Minute! (Wait a minute!)"],
  },
  {
    german: "der Tag",
    english: "the day",
    examples: ["Heute ist ein schöner Tag. (Today is a beautiful day.)"],
  },
  {
    german: "die Woche",
    english: "the week",
    examples: ["Die Woche hat sieben Tage. (The week has seven days.)"],
  },
  {
    german: "der Monat",
    english: "the month",
    examples: ["Der Monat hat dreißig Tage. (The month has thirty days.)"],
  },
  {
    german: "das Jahr",
    english: "the year",
    examples: ["Das Jahr hat zwölf Monate. (The year has twelve months.)"],
  },
  {
    german: "heute",
    english: "today",
    examples: ["Heute arbeite ich nicht. (Today I am not working.)"],
  },
  {
    german: "morgen",
    english: "tomorrow",
    examples: ["Morgen fahre ich nach Hause. (Tomorrow I am going home.)"],
  },
  {
    german: "gestern",
    english: "yesterday",
    examples: ["Gestern war ich im Kino. (Yesterday I was at the cinema.)"],
  },
  {
    german: "jetzt",
    english: "now",
    examples: ["Ich muss jetzt gehen. (I have to go now.)"],
  },
  {
    german: "der Morgen",
    english: "the morning",
    examples: ["Am Morgen trinke ich Kaffee. (In the morning I drink coffee.)"],
  },
  {
    german: "der Abend",
    english: "the evening",
    examples: ["Am Abend lese ich ein Buch. (In the evening I read a book.)"],
  },
  {
    german: "die Nacht",
    english: "the night",
    examples: ["In der Nacht ist es ruhig. (At night it is quiet.)"],
  },
  {
    german: "Montag",
    english: "Monday",
    examples: ["Am Montag beginnt die Arbeit. (Work starts on Monday.)"],
  },
  {
    german: "Dienstag",
    english: "Tuesday",
    examples: [
      "Am Dienstag habe ich einen Termin. (On Tuesday I have an appointment.)",
    ],
  },
  {
    german: "Mittwoch",
    english: "Wednesday",
    examples: [
      "Mittwoch ist die Mitte der Woche. (Wednesday is the middle of the week.)",
    ],
  },
  {
    german: "Donnerstag",
    english: "Thursday",
    examples: [
      "Am Donnerstag gehe ich zum Sport. (On Thursday I go to sports.)",
    ],
  },
  {
    german: "Freitag",
    english: "Friday",
    examples: ["Am Freitag ist die Party. (The party is on Friday.)"],
  },
  {
    german: "Samstag",
    english: "Saturday",
    examples: ["Am Samstag schlafe ich lange. (On Saturday I sleep in.)"],
  },
  {
    german: "Sonntag",
    english: "Sunday",
    examples: [
      "Am Sonntag besuche ich meine Eltern. (On Sunday I visit my parents.)",
    ],
  },
  {
    german: "der Frühling",
    english: "the spring",
    examples: ["Im Frühling wird es warm. (In spring it gets warm.)"],
  },
  {
    german: "der Sommer",
    english: "the summer",
    examples: ["Im Sommer fahren wir ans Meer. (In summer we go to the sea.)"],
  },
  {
    german: "der Herbst",
    english: "the autumn",
    examples: ["Im Herbst fallen die Blätter. (In autumn the leaves fall.)"],
  },
  {
    german: "der Winter",
    english: "the winter",
    examples: ["Im Winter schneit es oft. (In winter it often snows.)"],
  },

  // ── City, places & shopping ────────────────────────────────────
  {
    german: "die Stadt",
    english: "the city",
    examples: ["Berlin ist eine große Stadt. (Berlin is a big city.)"],
  },
  {
    german: "die Straße",
    english: "the street",
    examples: ["Die Straße ist sehr breit. (The street is very wide.)"],
  },
  {
    german: "der Bahnhof",
    english: "the train station",
    examples: ["Der Bahnhof ist in der Nähe. (The station is nearby.)"],
  },
  {
    german: "der Flughafen",
    english: "the airport",
    examples: ["Der Flughafen ist weit weg. (The airport is far away.)"],
  },
  {
    german: "die Post",
    english: "the post office",
    examples: ["Ich gehe zur Post. (I am going to the post office.)"],
  },
  {
    german: "die Bank",
    english: "the bank",
    examples: ["Die Bank öffnet um neun. (The bank opens at nine.)"],
  },
  {
    german: "der Supermarkt",
    english: "the supermarket",
    examples: ["Ich kaufe im Supermarkt ein. (I shop at the supermarket.)"],
  },
  {
    german: "der Markt",
    english: "the market",
    examples: [
      "Auf dem Markt ist das Obst frisch. (At the market the fruit is fresh.)",
    ],
  },
  {
    german: "die Bäckerei",
    english: "the bakery",
    examples: ["Die Bäckerei öffnet früh. (The bakery opens early.)"],
  },
  {
    german: "das Kino",
    english: "the cinema",
    examples: ["Wir gehen heute ins Kino. (We are going to the cinema today.)"],
  },
  {
    german: "das Museum",
    english: "the museum",
    examples: [
      "Das Museum ist am Montag geschlossen. (The museum is closed on Monday.)",
    ],
  },
  {
    german: "das Hotel",
    english: "the hotel",
    examples: ["Das Hotel liegt im Zentrum. (The hotel is in the center.)"],
  },
  {
    german: "das Krankenhaus",
    english: "the hospital",
    examples: ["Das Krankenhaus ist groß. (The hospital is big.)"],
  },
  {
    german: "die Schule",
    english: "the school",
    examples: ["Die Kinder gehen zur Schule. (The children go to school.)"],
  },
  {
    german: "die Kirche",
    english: "the church",
    examples: ["Die Kirche ist sehr alt. (The church is very old.)"],
  },
  {
    german: "der Park",
    english: "the park",
    examples: ["Wir gehen im Park spazieren. (We go for a walk in the park.)"],
  },
  {
    german: "die Toilette",
    english: "the toilet",
    examples: ["Wo ist die Toilette, bitte? (Where is the toilet, please?)"],
  },
  {
    german: "das Büro",
    english: "the office",
    examples: [
      "Mein Büro ist im dritten Stock. (My office is on the third floor.)",
    ],
  },
  {
    german: "das Geschäft",
    english: "the shop",
    examples: ["Das Geschäft schließt um acht. (The shop closes at eight.)"],
  },

  // ── Travel & transport ─────────────────────────────────────────
  {
    german: "das Auto",
    english: "the car",
    examples: ["Ich fahre mit dem Auto zur Arbeit. (I drive to work by car.)"],
  },
  {
    german: "der Bus",
    english: "the bus",
    examples: ["Der Bus kommt gleich. (The bus is coming soon.)"],
  },
  {
    german: "der Zug",
    english: "the train",
    examples: ["Der Zug fährt um zehn Uhr. (The train leaves at ten o'clock.)"],
  },
  {
    german: "das Fahrrad",
    english: "the bicycle",
    examples: ["Ich fahre mit dem Fahrrad. (I ride my bicycle.)"],
  },
  {
    german: "das Flugzeug",
    english: "the airplane",
    examples: ["Das Flugzeug fliegt nach Rom. (The plane is flying to Rome.)"],
  },
  {
    german: "das Taxi",
    english: "the taxi",
    examples: ["Wir nehmen ein Taxi. (We are taking a taxi.)"],
  },
  {
    german: "die Fahrkarte",
    english: "the ticket",
    examples: ["Ich kaufe eine Fahrkarte. (I am buying a ticket.)"],
  },
  {
    german: "der Weg",
    english: "the way / path",
    examples: ["Der Weg ist lang. (The way is long.)"],
  },
  {
    german: "die Reise",
    english: "the trip",
    examples: ["Die Reise war schön. (The trip was lovely.)"],
  },
  {
    german: "der Urlaub",
    english: "the vacation",
    examples: [
      "Im Urlaub fahren wir nach Spanien. (On vacation we go to Spain.)",
    ],
  },
  {
    german: "links",
    english: "left",
    examples: ["Gehen Sie nach links. (Go to the left.)"],
  },
  {
    german: "rechts",
    english: "right",
    examples: ["Das Café ist rechts. (The café is on the right.)"],
  },
  {
    german: "geradeaus",
    english: "straight ahead",
    examples: ["Gehen Sie immer geradeaus. (Keep going straight ahead.)"],
  },

  // ── Work, school & communication ───────────────────────────────
  {
    german: "die Arbeit",
    english: "the work / job",
    examples: ["Die Arbeit macht mir Spaß. (I enjoy the work.)"],
  },
  {
    german: "der Beruf",
    english: "the profession",
    examples: ["Was sind Sie von Beruf? (What is your profession?)"],
  },
  {
    german: "der Chef",
    english: "the boss",
    examples: ["Mein Chef ist sehr nett. (My boss is very nice.)"],
  },
  {
    german: "der Lehrer",
    english: "the teacher (male)",
    examples: [
      "Der Lehrer erklärt die Grammatik. (The teacher explains the grammar.)",
    ],
  },
  {
    german: "der Student",
    english: "the student",
    examples: [
      "Der Student lernt für die Prüfung. (The student studies for the exam.)",
    ],
  },
  {
    german: "die Firma",
    english: "the company",
    examples: ["Die Firma ist in Hamburg. (The company is in Hamburg.)"],
  },
  {
    german: "das Geld",
    english: "the money",
    examples: ["Ich habe kein Geld dabei. (I don't have any money with me.)"],
  },
  {
    german: "der Euro",
    english: "the euro",
    examples: ["Das kostet zehn Euro. (That costs ten euros.)"],
  },
  {
    german: "das Buch",
    english: "the book",
    examples: [
      "Ich lese ein spannendes Buch. (I am reading an exciting book.)",
    ],
  },
  {
    german: "das Papier",
    english: "the paper",
    examples: ["Ich brauche ein Blatt Papier. (I need a sheet of paper.)"],
  },
  {
    german: "der Computer",
    english: "the computer",
    examples: ["Der Computer ist neu. (The computer is new.)"],
  },
  {
    german: "das Handy",
    english: "the mobile phone",
    examples: ["Mein Handy ist kaputt. (My mobile phone is broken.)"],
  },
  {
    german: "das Telefon",
    english: "the telephone",
    examples: ["Das Telefon klingelt. (The telephone is ringing.)"],
  },
  {
    german: "die E-Mail",
    english: "the email",
    examples: ["Ich schreibe eine E-Mail. (I am writing an email.)"],
  },
  {
    german: "das Internet",
    english: "the internet",
    examples: ["Ich suche im Internet. (I am searching on the internet.)"],
  },
  {
    german: "die Frage",
    english: "the question",
    examples: ["Ich habe eine Frage. (I have a question.)"],
  },
  {
    german: "die Antwort",
    english: "the answer",
    examples: ["Die Antwort ist richtig. (The answer is correct.)"],
  },
  {
    german: "das Wort",
    english: "the word",
    examples: [
      "Ich verstehe dieses Wort nicht. (I don't understand this word.)",
    ],
  },
  {
    german: "die Sprache",
    english: "the language",
    examples: [
      "Deutsch ist eine schöne Sprache. (German is a beautiful language.)",
    ],
  },

  // ── Nature, weather & animals ──────────────────────────────────
  {
    german: "das Wetter",
    english: "the weather",
    examples: ["Wie ist das Wetter heute? (What is the weather like today?)"],
  },
  {
    german: "die Sonne",
    english: "the sun",
    examples: ["Die Sonne scheint. (The sun is shining.)"],
  },
  {
    german: "der Regen",
    english: "the rain",
    examples: ["Der Regen hört nicht auf. (The rain doesn't stop.)"],
  },
  {
    german: "der Schnee",
    english: "the snow",
    examples: ["Der Schnee ist weiß und kalt. (The snow is white and cold.)"],
  },
  {
    german: "der Wind",
    english: "the wind",
    examples: ["Der Wind ist heute stark. (The wind is strong today.)"],
  },
  {
    german: "der Himmel",
    english: "the sky",
    examples: ["Der Himmel ist blau. (The sky is blue.)"],
  },
  {
    german: "der Baum",
    english: "the tree",
    examples: ["Der Baum ist sehr groß. (The tree is very big.)"],
  },
  {
    german: "die Blume",
    english: "the flower",
    examples: ["Die Blume riecht gut. (The flower smells good.)"],
  },
  {
    german: "der Berg",
    english: "the mountain",
    examples: ["Der Berg ist hoch. (The mountain is high.)"],
  },
  {
    german: "das Meer",
    english: "the sea",
    examples: ["Im Sommer fahren wir ans Meer. (In summer we go to the sea.)"],
  },
  {
    german: "der Fluss",
    english: "the river",
    examples: [
      "Der Fluss fließt durch die Stadt. (The river flows through the city.)",
    ],
  },
  {
    german: "das Tier",
    english: "the animal",
    examples: ["Welches Tier magst du? (Which animal do you like?)"],
  },
  {
    german: "der Hund",
    english: "the dog",
    examples: [
      "Der Hund spielt im Garten. (The dog is playing in the garden.)",
    ],
  },
  {
    german: "die Katze",
    english: "the cat",
    examples: [
      "Die Katze schläft auf dem Sofa. (The cat is sleeping on the sofa.)",
    ],
  },
  {
    german: "der Vogel",
    english: "the bird",
    examples: ["Der Vogel singt am Morgen. (The bird sings in the morning.)"],
  },

  // ── Common verbs ───────────────────────────────────────────────
  {
    german: "sein",
    english: "to be",
    examples: ["Ich bin müde. (I am tired.)"],
  },
  {
    german: "haben",
    english: "to have",
    examples: ["Ich habe einen Hund. (I have a dog.)"],
  },
  {
    german: "machen",
    english: "to do / make",
    examples: [
      "Was machst du am Wochenende? (What are you doing at the weekend?)",
    ],
  },
  {
    german: "gehen",
    english: "to go / walk",
    examples: ["Ich gehe nach Hause. (I am going home.)"],
  },
  {
    german: "kommen",
    english: "to come",
    examples: ["Kommst du mit? (Are you coming along?)"],
  },
  {
    german: "essen",
    english: "to eat",
    examples: ["Wir essen um sieben Uhr. (We eat at seven o'clock.)"],
  },
  {
    german: "trinken",
    english: "to drink",
    examples: [
      "Möchtest du etwas trinken? (Would you like something to drink?)",
    ],
  },
  {
    german: "sprechen",
    english: "to speak",
    examples: ["Sprichst du Deutsch? (Do you speak German?)"],
  },
  {
    german: "sagen",
    english: "to say",
    examples: ["Was hast du gesagt? (What did you say?)"],
  },
  {
    german: "fragen",
    english: "to ask",
    examples: ["Darf ich etwas fragen? (May I ask something?)"],
  },
  {
    german: "verstehen",
    english: "to understand",
    examples: ["Ich verstehe dich nicht. (I don't understand you.)"],
  },
  {
    german: "wissen",
    english: "to know (a fact)",
    examples: ["Ich weiß es nicht. (I don't know.)"],
  },
  {
    german: "lernen",
    english: "to learn",
    examples: ["Ich lerne jeden Tag Deutsch. (I learn German every day.)"],
  },
  {
    german: "lesen",
    english: "to read",
    examples: ["Ich lese gern Bücher. (I like reading books.)"],
  },
  {
    german: "schreiben",
    english: "to write",
    examples: ["Ich schreibe einen Brief. (I am writing a letter.)"],
  },
  {
    german: "sehen",
    english: "to see",
    examples: ["Ich sehe dich morgen. (I'll see you tomorrow.)"],
  },
  {
    german: "hören",
    english: "to hear / listen",
    examples: ["Ich höre gern Musik. (I like listening to music.)"],
  },
  {
    german: "kaufen",
    english: "to buy",
    examples: ["Ich kaufe ein neues Auto. (I am buying a new car.)"],
  },
  {
    german: "bezahlen",
    english: "to pay",
    examples: ["Ich möchte bitte bezahlen. (I would like to pay, please.)"],
  },
  {
    german: "arbeiten",
    english: "to work",
    examples: ["Ich arbeite in einem Büro. (I work in an office.)"],
  },
  {
    german: "wohnen",
    english: "to live / reside",
    examples: ["Wo wohnst du? (Where do you live?)"],
  },
  {
    german: "schlafen",
    english: "to sleep",
    examples: ["Ich schlafe acht Stunden. (I sleep eight hours.)"],
  },
  {
    german: "fahren",
    english: "to drive / go",
    examples: ["Wir fahren nach Berlin. (We are going to Berlin.)"],
  },
  {
    german: "spielen",
    english: "to play",
    examples: [
      "Die Kinder spielen im Park. (The children are playing in the park.)",
    ],
  },
  {
    german: "lieben",
    english: "to love",
    examples: ["Ich liebe dich. (I love you.)"],
  },
  {
    german: "mögen",
    english: "to like",
    examples: ["Ich mag Schokolade. (I like chocolate.)"],
  },
  {
    german: "brauchen",
    english: "to need",
    examples: ["Ich brauche deine Hilfe. (I need your help.)"],
  },
  {
    german: "geben",
    english: "to give",
    examples: ["Gib mir bitte das Buch. (Please give me the book.)"],
  },
  {
    german: "nehmen",
    english: "to take",
    examples: ["Ich nehme den Bus. (I am taking the bus.)"],
  },
  {
    german: "finden",
    english: "to find",
    examples: ["Ich finde meine Schlüssel nicht. (I can't find my keys.)"],
  },
  {
    german: "suchen",
    english: "to search / look for",
    examples: ["Ich suche eine Wohnung. (I am looking for an apartment.)"],
  },
  {
    german: "helfen",
    english: "to help",
    examples: ["Kannst du mir helfen? (Can you help me?)"],
  },
  {
    german: "warten",
    english: "to wait",
    examples: ["Bitte warte auf mich. (Please wait for me.)"],
  },
  {
    german: "bleiben",
    english: "to stay",
    examples: ["Ich bleibe heute zu Hause. (I am staying home today.)"],
  },
  {
    german: "öffnen",
    english: "to open",
    examples: ["Kannst du das Fenster öffnen? (Can you open the window?)"],
  },
  {
    german: "beginnen",
    english: "to begin",
    examples: ["Der Kurs beginnt um neun. (The course begins at nine.)"],
  },
  {
    german: "heißen",
    english: "to be called",
    examples: ["Wie heißen Sie? (What is your name?)"],
  },
  {
    german: "kosten",
    english: "to cost",
    examples: ["Wie viel kostet das Brot? (How much does the bread cost?)"],
  },
  {
    german: "kochen",
    english: "to cook",
    examples: ["Ich koche heute Abend. (I am cooking this evening.)"],
  },
  {
    german: "treffen",
    english: "to meet",
    examples: ["Wir treffen uns um sechs. (We are meeting at six.)"],
  },
  {
    german: "besuchen",
    english: "to visit",
    examples: ["Ich besuche meine Freunde. (I am visiting my friends.)"],
  },
  {
    german: "denken",
    english: "to think",
    examples: ["Ich denke an dich. (I am thinking of you.)"],
  },
  {
    german: "glauben",
    english: "to believe",
    examples: ["Ich glaube, das ist richtig. (I believe that is correct.)"],
  },

  // ── Common adjectives ──────────────────────────────────────────
  {
    german: "gut",
    english: "good",
    examples: ["Das Essen ist gut. (The food is good.)"],
  },
  {
    german: "schlecht",
    english: "bad",
    examples: ["Das Wetter ist schlecht. (The weather is bad.)"],
  },
  {
    german: "groß",
    english: "big / tall",
    examples: ["Er ist sehr groß. (He is very tall.)"],
  },
  {
    german: "klein",
    english: "small",
    examples: ["Die Wohnung ist klein. (The apartment is small.)"],
  },
  {
    german: "neu",
    english: "new",
    examples: ["Mein Auto ist neu. (My car is new.)"],
  },
  {
    german: "alt",
    english: "old",
    examples: ["Das Haus ist sehr alt. (The house is very old.)"],
  },
  {
    german: "jung",
    english: "young",
    examples: ["Sie ist noch jung. (She is still young.)"],
  },
  {
    german: "schön",
    english: "beautiful",
    examples: ["Das ist ein schönes Bild. (That is a beautiful picture.)"],
  },
  {
    german: "teuer",
    english: "expensive",
    examples: ["Das Hotel ist teuer. (The hotel is expensive.)"],
  },
  {
    german: "billig",
    english: "cheap",
    examples: ["Das Brot ist billig. (The bread is cheap.)"],
  },
  {
    german: "schnell",
    english: "fast",
    examples: ["Der Zug ist sehr schnell. (The train is very fast.)"],
  },
  {
    german: "langsam",
    english: "slow",
    examples: ["Bitte sprich langsam. (Please speak slowly.)"],
  },
  {
    german: "lang",
    english: "long",
    examples: ["Der Film ist zu lang. (The film is too long.)"],
  },
  {
    german: "kurz",
    english: "short",
    examples: ["Die Pause ist kurz. (The break is short.)"],
  },
  {
    german: "viel",
    english: "much / a lot",
    examples: ["Ich habe viel Arbeit. (I have a lot of work.)"],
  },
  {
    german: "wenig",
    english: "little / few",
    examples: ["Ich habe wenig Zeit. (I have little time.)"],
  },
  {
    german: "richtig",
    english: "correct / right",
    examples: ["Deine Antwort ist richtig. (Your answer is correct.)"],
  },
  {
    german: "falsch",
    english: "wrong",
    examples: ["Das ist leider falsch. (That is unfortunately wrong.)"],
  },
  {
    german: "einfach",
    english: "easy / simple",
    examples: ["Die Aufgabe ist einfach. (The task is easy.)"],
  },
  {
    german: "schwer",
    english: "difficult / heavy",
    examples: ["Die Prüfung war schwer. (The exam was difficult.)"],
  },
  {
    german: "glücklich",
    english: "happy",
    examples: ["Ich bin sehr glücklich. (I am very happy.)"],
  },
  {
    german: "müde",
    english: "tired",
    examples: ["Ich bin heute sehr müde. (I am very tired today.)"],
  },
  {
    german: "nett",
    english: "nice / kind",
    examples: ["Meine Nachbarn sind sehr nett. (My neighbors are very nice.)"],
  },
  {
    german: "wichtig",
    english: "important",
    examples: ["Das ist sehr wichtig. (That is very important.)"],
  },
  {
    german: "warm",
    english: "warm",
    examples: ["Heute ist es warm. (Today it is warm.)"],
  },
  {
    german: "kalt",
    english: "cold",
    examples: ["Das Wasser ist kalt. (The water is cold.)"],
  },
  {
    german: "heiß",
    english: "hot",
    examples: ["Der Kaffee ist heiß. (The coffee is hot.)"],
  },
  {
    german: "voll",
    english: "full",
    examples: ["Der Bus ist voll. (The bus is full.)"],
  },
  {
    german: "leer",
    english: "empty",
    examples: ["Die Flasche ist leer. (The bottle is empty.)"],
  },
  {
    german: "laut",
    english: "loud",
    examples: ["Die Musik ist zu laut. (The music is too loud.)"],
  },
  {
    german: "leise",
    english: "quiet",
    examples: ["Bitte sei leise. (Please be quiet.)"],
  },

  // ── Common function words ──────────────────────────────────────
  {
    german: "und",
    english: "and",
    examples: ["Ich trinke Kaffee und Tee. (I drink coffee and tea.)"],
  },
  {
    german: "oder",
    english: "or",
    examples: ["Möchtest du Tee oder Kaffee? (Would you like tea or coffee?)"],
  },
  {
    german: "aber",
    english: "but",
    examples: ["Ich bin müde, aber glücklich. (I am tired but happy.)"],
  },
  {
    german: "weil",
    english: "because",
    examples: [
      "Ich bleibe zu Hause, weil ich krank bin. (I am staying home because I am sick.)",
    ],
  },
  {
    german: "hier",
    english: "here",
    examples: ["Ich wohne hier. (I live here.)"],
  },
  {
    german: "dort",
    english: "there",
    examples: ["Das Buch liegt dort. (The book is over there.)"],
  },
  {
    german: "immer",
    english: "always",
    examples: ["Ich trinke immer Kaffee. (I always drink coffee.)"],
  },
  {
    german: "oft",
    english: "often",
    examples: ["Ich gehe oft ins Kino. (I often go to the cinema.)"],
  },
  {
    german: "manchmal",
    english: "sometimes",
    examples: ["Manchmal koche ich zu Hause. (Sometimes I cook at home.)"],
  },
  {
    german: "nie",
    english: "never",
    examples: ["Ich trinke nie Alkohol. (I never drink alcohol.)"],
  },
  {
    german: "sehr",
    english: "very",
    examples: ["Das ist sehr gut. (That is very good.)"],
  },
  {
    german: "auch",
    english: "also / too",
    examples: ["Ich komme auch mit. (I am coming along too.)"],
  },
  {
    german: "nur",
    english: "only",
    examples: ["Ich habe nur fünf Euro. (I only have five euros.)"],
  },
  {
    german: "schon",
    english: "already",
    examples: ["Ich bin schon fertig. (I am already finished.)"],
  },
  {
    german: "noch",
    english: "still / yet",
    examples: ["Ich bin noch nicht fertig. (I am not finished yet.)"],
  },
  {
    german: "vielleicht",
    english: "maybe",
    examples: ["Vielleicht komme ich später. (Maybe I'll come later.)"],
  },
  {
    german: "natürlich",
    english: "of course",
    examples: ["Natürlich helfe ich dir. (Of course I'll help you.)"],
  },
  {
    german: "gern",
    english: "gladly / with pleasure",
    examples: ["Ich trinke gern Tee. (I like drinking tea.)"],
  },
];

/**
 * Goethe-Zertifikat A2 vocabulary. Builds on A1 with more abstract nouns,
 * feelings, work & education, travel, environment, media, opinions, and a
 * wider set of verbs, adjectives, and connectors. Same format as A1.
 */
const A2_SEED: SeedEntry[] = [
  // ── Feelings & personality ─────────────────────────────────────
  {
    german: "die Angst",
    english: "the fear",
    examples: ["Ich habe Angst vor Spinnen. (I'm afraid of spiders.)"],
  },
  {
    german: "die Freude",
    english: "the joy",
    examples: [
      "Zu meiner Freude kam sie doch. (To my joy, she came after all.)",
    ],
  },
  {
    german: "die Liebe",
    english: "the love",
    examples: [
      "Die Liebe ist manchmal kompliziert. (Love is sometimes complicated.)",
    ],
  },
  {
    german: "die Wut",
    english: "the anger",
    examples: [
      "Vor Wut konnte er nicht sprechen. (He couldn't speak out of anger.)",
    ],
  },
  {
    german: "stolz",
    english: "proud",
    examples: ["Ich bin stolz auf dich. (I'm proud of you.)"],
  },
  {
    german: "nervös",
    english: "nervous",
    examples: [
      "Vor der Prüfung bin ich nervös. (I'm nervous before the exam.)",
    ],
  },
  {
    german: "ruhig",
    english: "calm / quiet",
    examples: ["Bleib bitte ruhig. (Please stay calm.)"],
  },
  {
    german: "ehrlich",
    english: "honest",
    examples: ["Sei ehrlich zu mir. (Be honest with me.)"],
  },
  {
    german: "höflich",
    english: "polite",
    examples: ["Er ist immer sehr höflich. (He is always very polite.)"],
  },
  {
    german: "geduldig",
    english: "patient",
    examples: [
      "Meine Lehrerin ist sehr geduldig. (My teacher is very patient.)",
    ],
  },
  {
    german: "neugierig",
    english: "curious",
    examples: ["Kinder sind oft neugierig. (Children are often curious.)"],
  },
  {
    german: "fleißig",
    english: "hard-working / diligent",
    examples: ["Sie ist eine fleißige Schülerin. (She is a diligent student.)"],
  },
  {
    german: "faul",
    english: "lazy",
    examples: ["Am Sonntag bin ich gern faul. (On Sundays I like being lazy.)"],
  },

  // ── Health ─────────────────────────────────────────────────────
  {
    german: "die Gesundheit",
    english: "the health",
    examples: [
      "Gesundheit ist das Wichtigste. (Health is the most important thing.)",
    ],
  },
  {
    german: "die Krankheit",
    english: "the illness",
    examples: [
      "Er ist wegen einer Krankheit zu Hause. (He is at home because of an illness.)",
    ],
  },
  {
    german: "der Termin",
    english: "the appointment",
    examples: [
      "Ich habe morgen einen Termin beim Arzt. (I have a doctor's appointment tomorrow.)",
    ],
  },
  {
    german: "das Fieber",
    english: "the fever",
    examples: ["Das Kind hat hohes Fieber. (The child has a high fever.)"],
  },
  {
    german: "die Erkältung",
    english: "the cold (illness)",
    examples: ["Ich habe eine Erkältung. (I have a cold.)"],
  },
  {
    german: "sich fühlen",
    english: "to feel",
    examples: ["Ich fühle mich heute besser. (I feel better today.)"],
  },
  {
    german: "wehtun",
    english: "to hurt",
    examples: ["Mein Rücken tut weh. (My back hurts.)"],
  },
  {
    german: "verletzt",
    english: "injured",
    examples: ["Er ist beim Sport verletzt. (He got injured doing sports.)"],
  },

  // ── Work & education ───────────────────────────────────────────
  {
    german: "die Ausbildung",
    english: "the vocational training",
    examples: [
      "Sie macht eine Ausbildung als Krankenschwester. (She is training to be a nurse.)",
    ],
  },
  {
    german: "die Stelle",
    english: "the job / position",
    examples: ["Ich suche eine neue Stelle. (I'm looking for a new job.)"],
  },
  {
    german: "die Bewerbung",
    english: "the job application",
    examples: ["Ich schreibe eine Bewerbung. (I'm writing a job application.)"],
  },
  {
    german: "der Kollege",
    english: "the colleague",
    examples: ["Mein Kollege hilft mir oft. (My colleague often helps me.)"],
  },
  {
    german: "die Besprechung",
    english: "the meeting",
    examples: [
      "Die Besprechung dauert eine Stunde. (The meeting lasts an hour.)",
    ],
  },
  {
    german: "das Gehalt",
    english: "the salary",
    examples: ["Mein Gehalt ist nicht sehr hoch. (My salary isn't very high.)"],
  },
  {
    german: "die Erfahrung",
    english: "the experience",
    examples: ["Sie hat viel Erfahrung. (She has a lot of experience.)"],
  },
  {
    german: "das Praktikum",
    english: "the internship",
    examples: [
      "Ich mache ein Praktikum bei einer Firma. (I'm doing an internship at a company.)",
    ],
  },
  {
    german: "verdienen",
    english: "to earn",
    examples: ["Sie verdient gut. (She earns well.)"],
  },
  {
    german: "kündigen",
    english: "to quit / give notice",
    examples: ["Er hat seinen Job gekündigt. (He quit his job.)"],
  },

  // ── Travel & holidays ──────────────────────────────────────────
  {
    german: "der Ausflug",
    english: "the excursion / day trip",
    examples: [
      "Wir machen einen Ausflug in die Berge. (We're taking a trip to the mountains.)",
    ],
  },
  {
    german: "die Unterkunft",
    english: "the accommodation",
    examples: [
      "Wir suchen eine günstige Unterkunft. (We're looking for cheap accommodation.)",
    ],
  },
  {
    german: "das Gepäck",
    english: "the luggage",
    examples: ["Mein Gepäck ist sehr schwer. (My luggage is very heavy.)"],
  },
  {
    german: "der Koffer",
    english: "the suitcase",
    examples: ["Ich packe meinen Koffer. (I'm packing my suitcase.)"],
  },
  {
    german: "die Grenze",
    english: "the border",
    examples: [
      "An der Grenze müssen wir warten. (We have to wait at the border.)",
    ],
  },
  {
    german: "das Ausland",
    english: "abroad / foreign countries",
    examples: [
      "Im Ausland spricht man andere Sprachen. (Abroad, people speak other languages.)",
    ],
  },
  {
    german: "die Sehenswürdigkeit",
    english: "the sight / attraction",
    examples: [
      "Wir besichtigen die Sehenswürdigkeiten. (We're visiting the sights.)",
    ],
  },
  {
    german: "buchen",
    english: "to book",
    examples: ["Ich habe ein Hotel gebucht. (I've booked a hotel.)"],
  },
  {
    german: "übernachten",
    english: "to stay overnight",
    examples: [
      "Wir übernachten in einem Hotel. (We're staying overnight in a hotel.)",
    ],
  },

  // ── Environment & nature ───────────────────────────────────────
  {
    german: "die Umwelt",
    english: "the environment",
    examples: [
      "Wir müssen die Umwelt schützen. (We must protect the environment.)",
    ],
  },
  {
    german: "der Müll",
    english: "the trash / rubbish",
    examples: ["Bitte trenne den Müll. (Please separate the trash.)"],
  },
  {
    german: "das Klima",
    english: "the climate",
    examples: ["Das Klima ändert sich. (The climate is changing.)"],
  },
  {
    german: "die Landschaft",
    english: "the landscape",
    examples: ["Die Landschaft ist wunderschön. (The landscape is beautiful.)"],
  },
  {
    german: "die Energie",
    english: "the energy",
    examples: ["Wir sparen Energie. (We save energy.)"],
  },
  {
    german: "schützen",
    english: "to protect",
    examples: ["Der Wald schützt das Klima. (Forests protect the climate.)"],
  },
  {
    german: "retten",
    english: "to save / rescue",
    examples: ["Wir müssen die Tiere retten. (We must save the animals.)"],
  },

  // ── Media & technology ─────────────────────────────────────────
  {
    german: "die Nachricht",
    english: "the message / news",
    examples: [
      "Ich habe dir eine Nachricht geschickt. (I sent you a message.)",
    ],
  },
  {
    german: "die Zeitung",
    english: "the newspaper",
    examples: [
      "Ich lese jeden Morgen die Zeitung. (I read the newspaper every morning.)",
    ],
  },
  {
    german: "die Werbung",
    english: "the advertising",
    examples: [
      "Im Fernsehen gibt es viel Werbung. (There's a lot of advertising on TV.)",
    ],
  },
  {
    german: "die Sendung",
    english: "the (TV) program",
    examples: [
      "Diese Sendung ist sehr beliebt. (This program is very popular.)",
    ],
  },
  {
    german: "die Datei",
    english: "the file",
    examples: ["Die Datei ist zu groß. (The file is too big.)"],
  },
  {
    german: "der Bildschirm",
    english: "the screen",
    examples: ["Der Bildschirm ist kaputt. (The screen is broken.)"],
  },
  {
    german: "herunterladen",
    english: "to download",
    examples: ["Ich lade die App herunter. (I'm downloading the app.)"],
  },
  {
    german: "speichern",
    english: "to save (a file)",
    examples: [
      "Vergiss nicht, die Datei zu speichern. (Don't forget to save the file.)",
    ],
  },
  {
    german: "anrufen",
    english: "to call (on the phone)",
    examples: ["Ich rufe dich später an. (I'll call you later.)"],
  },

  // ── Relationships & social ─────────────────────────────────────
  {
    german: "die Beziehung",
    english: "the relationship",
    examples: [
      "Sie haben eine gute Beziehung. (They have a good relationship.)",
    ],
  },
  {
    german: "der Nachbar",
    english: "the neighbor",
    examples: ["Mein Nachbar ist sehr nett. (My neighbor is very nice.)"],
  },
  {
    german: "der Gast",
    english: "the guest",
    examples: ["Wir haben heute Abend Gäste. (We have guests tonight.)"],
  },
  {
    german: "die Hochzeit",
    english: "the wedding",
    examples: ["Die Hochzeit ist im Sommer. (The wedding is in summer.)"],
  },
  {
    german: "das Geschenk",
    english: "the gift",
    examples: ["Ich kaufe ein Geschenk für sie. (I'm buying a gift for her.)"],
  },
  {
    german: "die Einladung",
    english: "the invitation",
    examples: ["Danke für die Einladung. (Thanks for the invitation.)"],
  },
  {
    german: "einladen",
    english: "to invite",
    examples: ["Ich lade dich zum Essen ein. (I'm inviting you to dinner.)"],
  },
  {
    german: "heiraten",
    english: "to marry",
    examples: [
      "Sie heiraten nächstes Jahr. (They're getting married next year.)",
    ],
  },
  {
    german: "sich verlieben",
    english: "to fall in love",
    examples: ["Er hat sich in sie verliebt. (He fell in love with her.)"],
  },
  {
    german: "streiten",
    english: "to argue / quarrel",
    examples: ["Die Kinder streiten oft. (The children often argue.)"],
  },

  // ── Shopping & money ───────────────────────────────────────────
  {
    german: "das Angebot",
    english: "the offer / deal",
    examples: ["Das ist ein gutes Angebot. (That's a good deal.)"],
  },
  {
    german: "der Preis",
    english: "the price",
    examples: ["Der Preis ist zu hoch. (The price is too high.)"],
  },
  {
    german: "die Kasse",
    english: "the checkout / cashier",
    examples: ["Bitte zahlen Sie an der Kasse. (Please pay at the checkout.)"],
  },
  {
    german: "die Rechnung",
    english: "the bill / invoice",
    examples: ["Die Rechnung, bitte! (The bill, please!)"],
  },
  {
    german: "die Kreditkarte",
    english: "the credit card",
    examples: [
      "Kann ich mit Kreditkarte bezahlen? (Can I pay by credit card?)",
    ],
  },
  {
    german: "kostenlos",
    english: "free of charge",
    examples: ["Der Eintritt ist kostenlos. (Admission is free.)"],
  },
  {
    german: "sparen",
    english: "to save (money)",
    examples: ["Ich spare für ein neues Auto. (I'm saving for a new car.)"],
  },
  {
    german: "umtauschen",
    english: "to exchange",
    examples: [
      "Ich möchte diese Hose umtauschen. (I'd like to exchange these trousers.)",
    ],
  },

  // ── Opinions & communication ───────────────────────────────────
  {
    german: "die Meinung",
    english: "the opinion",
    examples: [
      "Meiner Meinung nach ist das falsch. (In my opinion, that's wrong.)",
    ],
  },
  {
    german: "der Grund",
    english: "the reason",
    examples: ["Was ist der Grund dafür? (What's the reason for that?)"],
  },
  {
    german: "der Vorschlag",
    english: "the suggestion",
    examples: ["Ich habe einen Vorschlag. (I have a suggestion.)"],
  },
  {
    german: "das Problem",
    english: "the problem",
    examples: ["Wir haben ein Problem. (We have a problem.)"],
  },
  {
    german: "die Lösung",
    english: "the solution",
    examples: ["Es gibt eine einfache Lösung. (There's a simple solution.)"],
  },
  {
    german: "der Unterschied",
    english: "the difference",
    examples: ["Was ist der Unterschied? (What's the difference?)"],
  },
  {
    german: "die Möglichkeit",
    english: "the possibility / option",
    examples: ["Es gibt viele Möglichkeiten. (There are many possibilities.)"],
  },
  {
    german: "erklären",
    english: "to explain",
    examples: ["Kannst du mir das erklären? (Can you explain that to me?)"],
  },
  {
    german: "entscheiden",
    english: "to decide",
    examples: ["Du musst dich entscheiden. (You have to decide.)"],
  },
  {
    german: "meinen",
    english: "to mean / think",
    examples: ["Was meinst du damit? (What do you mean by that?)"],
  },
  {
    german: "vorschlagen",
    english: "to suggest",
    examples: ["Ich schlage vor, wir gehen essen. (I suggest we go eat.)"],
  },
  {
    german: "diskutieren",
    english: "to discuss",
    examples: ["Wir diskutieren über Politik. (We're discussing politics.)"],
  },

  // ── Time & sequence ────────────────────────────────────────────
  {
    german: "die Zukunft",
    english: "the future",
    examples: [
      "In der Zukunft wird alles digital. (In the future, everything will be digital.)",
    ],
  },
  {
    german: "die Vergangenheit",
    english: "the past",
    examples: [
      "Denk nicht zu viel an die Vergangenheit. (Don't think too much about the past.)",
    ],
  },
  {
    german: "der Moment",
    english: "the moment",
    examples: ["Einen Moment, bitte. (One moment, please.)"],
  },
  {
    german: "plötzlich",
    english: "suddenly",
    examples: ["Plötzlich begann es zu regnen. (Suddenly it started to rain.)"],
  },
  {
    german: "endlich",
    english: "finally / at last",
    examples: ["Endlich bist du da! (Finally you're here!)"],
  },
  {
    german: "sofort",
    english: "immediately",
    examples: ["Komm bitte sofort her. (Please come here immediately.)"],
  },
  {
    german: "normalerweise",
    english: "usually",
    examples: ["Normalerweise stehe ich früh auf. (Usually I get up early.)"],
  },
  {
    german: "zuerst",
    english: "first / at first",
    examples: [
      "Zuerst machen wir die Hausaufgaben. (First we do the homework.)",
    ],
  },
  {
    german: "danach",
    english: "afterwards",
    examples: ["Danach gehen wir ins Kino. (Afterwards we go to the cinema.)"],
  },
  {
    german: "damals",
    english: "back then",
    examples: [
      "Damals war alles anders. (Back then, everything was different.)",
    ],
  },

  // ── Connectors ─────────────────────────────────────────────────
  {
    german: "deshalb",
    english: "therefore / that's why",
    examples: [
      "Es regnet, deshalb bleibe ich zu Hause. (It's raining, so I'm staying home.)",
    ],
  },
  {
    german: "trotzdem",
    english: "nevertheless",
    examples: [
      "Es war teuer, trotzdem habe ich es gekauft. (It was expensive; I bought it anyway.)",
    ],
  },
  {
    german: "obwohl",
    english: "although",
    examples: [
      "Obwohl es regnet, gehe ich spazieren. (Although it's raining, I go for a walk.)",
    ],
  },
  {
    german: "dass",
    english: "that (conjunction)",
    examples: ["Ich glaube, dass er recht hat. (I think that he's right.)"],
  },
  {
    german: "damit",
    english: "so that",
    examples: [
      "Ich lerne, damit ich die Prüfung bestehe. (I study so that I pass the exam.)",
    ],
  },
  {
    german: "während",
    english: "during / while",
    examples: ["Während des Essens sprechen wir. (During the meal we talk.)"],
  },
  {
    german: "außerdem",
    english: "besides / moreover",
    examples: [
      "Es ist spät; außerdem bin ich müde. (It's late; besides, I'm tired.)",
    ],
  },
  {
    german: "sondern",
    english: "but (rather)",
    examples: ["Nicht heute, sondern morgen. (Not today, but tomorrow.)"],
  },
  {
    german: "falls",
    english: "in case / if",
    examples: [
      "Falls es regnet, nimm einen Schirm. (In case it rains, take an umbrella.)",
    ],
  },

  // ── More verbs ─────────────────────────────────────────────────
  {
    german: "aufstehen",
    english: "to get up",
    examples: ["Ich stehe um sechs Uhr auf. (I get up at six.)"],
  },
  {
    german: "anfangen",
    english: "to begin / start",
    examples: ["Der Film fängt gleich an. (The film starts soon.)"],
  },
  {
    german: "aufhören",
    english: "to stop",
    examples: ["Hör auf zu reden! (Stop talking!)"],
  },
  {
    german: "sich erinnern",
    english: "to remember",
    examples: ["Ich erinnere mich an dich. (I remember you.)"],
  },
  {
    german: "sich freuen",
    english: "to be glad / look forward",
    examples: [
      "Ich freue mich auf das Wochenende. (I'm looking forward to the weekend.)",
    ],
  },
  {
    german: "sich interessieren",
    english: "to be interested",
    examples: ["Ich interessiere mich für Musik. (I'm interested in music.)"],
  },
  {
    german: "sich beeilen",
    english: "to hurry",
    examples: ["Beeil dich, wir sind spät! (Hurry up, we're late!)"],
  },
  {
    german: "vergessen",
    english: "to forget",
    examples: ["Ich habe deinen Namen vergessen. (I forgot your name.)"],
  },
  {
    german: "versuchen",
    english: "to try",
    examples: ["Ich versuche, mehr zu lernen. (I try to learn more.)"],
  },
  {
    german: "benutzen",
    english: "to use",
    examples: ["Darf ich dein Handy benutzen? (May I use your phone?)"],
  },
  {
    german: "gehören",
    english: "to belong",
    examples: ["Das Buch gehört mir. (The book belongs to me.)"],
  },
  {
    german: "passieren",
    english: "to happen",
    examples: ["Was ist passiert? (What happened?)"],
  },
  {
    german: "funktionieren",
    english: "to work / function",
    examples: ["Das Handy funktioniert nicht. (The phone isn't working.)"],
  },
  {
    german: "wiederholen",
    english: "to repeat",
    examples: [
      "Können Sie das bitte wiederholen? (Can you repeat that, please?)",
    ],
  },
  {
    german: "empfehlen",
    english: "to recommend",
    examples: [
      "Ich empfehle dieses Restaurant. (I recommend this restaurant.)",
    ],
  },
  {
    german: "bestellen",
    english: "to order",
    examples: ["Ich bestelle eine Pizza. (I'm ordering a pizza.)"],
  },
  {
    german: "mieten",
    english: "to rent",
    examples: ["Wir mieten eine Wohnung. (We're renting an apartment.)"],
  },
  {
    german: "reparieren",
    english: "to repair",
    examples: ["Er repariert das Fahrrad. (He's repairing the bike.)"],
  },
  {
    german: "sich ausruhen",
    english: "to rest",
    examples: ["Ich muss mich ausruhen. (I need to rest.)"],
  },
  {
    german: "teilnehmen",
    english: "to participate",
    examples: ["Ich nehme am Kurs teil. (I'm taking part in the course.)"],
  },
  {
    german: "verbringen",
    english: "to spend (time)",
    examples: [
      "Wir verbringen den Urlaub am Meer. (We spend the holiday at the sea.)",
    ],
  },
  {
    german: "sich vorstellen",
    english: "to introduce oneself / imagine",
    examples: ["Darf ich mich vorstellen? (May I introduce myself?)"],
  },

  // ── More adjectives ────────────────────────────────────────────
  {
    german: "möglich",
    english: "possible",
    examples: ["Ist das möglich? (Is that possible?)"],
  },
  {
    german: "nötig",
    english: "necessary",
    examples: ["Das ist wirklich nicht nötig. (That's really not necessary.)"],
  },
  {
    german: "ähnlich",
    english: "similar",
    examples: [
      "Die beiden sind sich sehr ähnlich. (The two are very similar.)",
    ],
  },
  {
    german: "verschieden",
    english: "different / various",
    examples: ["Es gibt verschiedene Meinungen. (There are various opinions.)"],
  },
  {
    german: "bekannt",
    english: "well-known",
    examples: ["Sie ist eine bekannte Autorin. (She is a well-known author.)"],
  },
  {
    german: "berühmt",
    english: "famous",
    examples: [
      "Berlin ist berühmt für seine Kultur. (Berlin is famous for its culture.)",
    ],
  },
  {
    german: "gefährlich",
    english: "dangerous",
    examples: ["Rauchen ist gefährlich. (Smoking is dangerous.)"],
  },
  {
    german: "pünktlich",
    english: "punctual / on time",
    examples: ["Der Zug ist pünktlich. (The train is on time.)"],
  },
  {
    german: "modern",
    english: "modern",
    examples: ["Die Wohnung ist sehr modern. (The apartment is very modern.)"],
  },
  {
    german: "praktisch",
    english: "practical",
    examples: [
      "Diese Tasche ist sehr praktisch. (This bag is very practical.)",
    ],
  },
  {
    german: "bequem",
    english: "comfortable",
    examples: ["Das Sofa ist sehr bequem. (The sofa is very comfortable.)"],
  },
  {
    german: "sicher",
    english: "safe / sure",
    examples: ["Bist du sicher? (Are you sure?)"],
  },
  {
    german: "arm",
    english: "poor",
    examples: ["Die Familie ist arm. (The family is poor.)"],
  },
  {
    german: "reich",
    english: "rich",
    examples: ["Er ist sehr reich. (He is very rich.)"],
  },
  {
    german: "lustig",
    english: "funny",
    examples: ["Der Film ist sehr lustig. (The film is very funny.)"],
  },

  // ── Abstract nouns & concepts ──────────────────────────────────
  {
    german: "die Idee",
    english: "the idea",
    examples: ["Das ist eine gute Idee. (That's a good idea.)"],
  },
  {
    german: "das Ziel",
    english: "the goal",
    examples: [
      "Mein Ziel ist es, Deutsch zu lernen. (My goal is to learn German.)",
    ],
  },
  {
    german: "der Plan",
    english: "the plan",
    examples: ["Hast du einen Plan für heute? (Do you have a plan for today?)"],
  },
  {
    german: "die Regel",
    english: "the rule",
    examples: ["Das ist gegen die Regeln. (That's against the rules.)"],
  },
  {
    german: "der Fehler",
    english: "the mistake",
    examples: ["Jeder macht Fehler. (Everyone makes mistakes.)"],
  },
  {
    german: "der Erfolg",
    english: "the success",
    examples: ["Ich wünsche dir viel Erfolg. (I wish you much success.)"],
  },
  {
    german: "die Hilfe",
    english: "the help",
    examples: ["Brauchst du Hilfe? (Do you need help?)"],
  },
  {
    german: "die Politik",
    english: "the politics",
    examples: [
      "Er interessiert sich für Politik. (He's interested in politics.)",
    ],
  },
  {
    german: "die Geschichte",
    english: "the history / story",
    examples: ["Erzähl mir eine Geschichte. (Tell me a story.)"],
  },
  {
    german: "die Kultur",
    english: "the culture",
    examples: ["Ich liebe die deutsche Kultur. (I love German culture.)"],
  },
  {
    german: "die Wahrheit",
    english: "the truth",
    examples: ["Sag mir die Wahrheit. (Tell me the truth.)"],
  },
];

/** Turn a raw entry into a full Flashcard tagged with its CEFR level. */
function toCard(entry: SeedEntry, cefr: CefrLevel, index: number): Flashcard {
  return {
    id: `seed-${index}`,
    german: entry.german,
    english: entry.english,
    examples: entry.examples,
    cefr,
    level: 1,
    timesSeen: 0,
    timesKnown: 0,
    createdAt: 0,
    lastReviewedAt: null,
    lastKnownAt: null,
  };
}

/**
 * Build the full seeded deck: all A1 cards (unchanged) followed by the A2 set.
 * IDs stay stable and sequential across both levels so they never collide with
 * user-created cards.
 */
export function seedCards(): Flashcard[] {
  return [
    ...A1_SEED.map((entry, i) => toCard(entry, "A1", i)),
    ...A2_SEED.map((entry, i) => toCard(entry, "A2", A1_SEED.length + i)),
  ];
}
