export interface KeywordEntry {
  lemma: string;
  forms: string[];
  severity: number;
  category: string;
}

export const PL_KEYWORDS: KeywordEntry[] = [
  {
    lemma: 'wojna',
    forms: [
      'wojna', 'wojny', 'wojnie', 'wojnę', 'wojną', 'wojen', 'wojnom',
      'wojnami', 'wojnach', 'wojenny', 'wojenna', 'wojenne', 'wojennego',
      'wojennej', 'wojennym', 'wojennych', 'wojennymi',
    ],
    severity: 0.9,
    category: 'violence',
  },
  {
    lemma: 'śmierć',
    forms: [
      'śmierć', 'śmierci', 'śmiercią', 'śmiertelny', 'śmiertelna', 'śmiertelne',
      'śmiertelnego', 'śmiertelnej', 'śmiertelnym', 'śmiertelnych',
      'zgon', 'zgonu', 'zgony', 'zgonów',
      'zginął', 'zginęła', 'zginęli', 'zginęło', 'zginąć',
      'zmarł', 'zmarła', 'zmarli', 'zmarło',
      'umarł', 'umarła', 'umarli', 'umarło',
    ],
    severity: 1.0,
    category: 'death',
  },
  {
    lemma: 'nie żyje',
    forms: [
      'nie żyje', 'nie żyją', 'nie żył', 'nie żyła', 'nie żyli',
    ],
    severity: 1.0,
    category: 'death',
  },
  {
    lemma: 'wypadek',
    forms: [
      'wypadek', 'wypadku', 'wypadkowi', 'wypadkiem', 'wypadki',
      'wypadków', 'wypadkom', 'wypadkami', 'wypadkach',
    ],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'tragedia',
    forms: [
      'tragedia', 'tragedii', 'tragedię', 'tragedią', 'tragedie',
      'tragedii', 'tragediom', 'tragediami', 'tragediach',
      'tragiczny', 'tragiczna', 'tragiczne', 'tragicznego', 'tragicznej',
      'tragicznym', 'tragicznych', 'tragicznie',
    ],
    severity: 0.8,
    category: 'disaster',
  },
  {
    lemma: 'atak',
    forms: [
      'atak', 'ataku', 'atakowi', 'atakiem', 'ataki',
      'ataków', 'atakom', 'atakami', 'atakach',
      'zaatakował', 'zaatakowała', 'zaatakowali', 'zaatakować',
    ],
    severity: 0.8,
    category: 'violence',
  },
  {
    lemma: 'zabójstwo',
    forms: [
      'zabójstwo', 'zabójstwa', 'zabójstwu', 'zabójstwem', 'zabójstwie',
      'zabójstw', 'zabójstwom', 'zabójstwami', 'zabójstwach',
      'zabił', 'zabiła', 'zabili', 'zabić', 'zabity', 'zabita', 'zabici',
      'zamordował', 'zamordowała', 'zamordowali', 'zamordować',
      'zamordowany', 'zamordowana', 'zamordowani',
      'morderstwo', 'morderstwa', 'morderstw',
    ],
    severity: 1.0,
    category: 'crime',
  },
  {
    lemma: 'katastrofa',
    forms: [
      'katastrofa', 'katastrofy', 'katastrofie', 'katastrofę', 'katastrofą',
      'katastrof', 'katastrofom', 'katastrofami', 'katastrofach',
      'katastrofalny', 'katastrofalna', 'katastrofalne',
    ],
    severity: 0.9,
    category: 'disaster',
  },
  {
    lemma: 'pożar',
    forms: [
      'pożar', 'pożaru', 'pożarowi', 'pożarem', 'pożarze',
      'pożary', 'pożarów', 'pożarom', 'pożarami', 'pożarach',
    ],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'ranni',
    forms: [
      'ranni', 'rannych', 'rannym', 'rannymi', 'ranny', 'ranna', 'ranne',
      'ranił', 'raniła', 'ranili', 'ranić', 'zranił', 'zraniła', 'zranili',
    ],
    severity: 0.7,
    category: 'violence',
  },
  {
    lemma: 'ofiary',
    forms: [
      'ofiara', 'ofiary', 'ofierze', 'ofiarę', 'ofiarą',
      'ofiar', 'ofiarom', 'ofiarami', 'ofiarach',
    ],
    severity: 0.8,
    category: 'death',
  },
  {
    lemma: 'terroryzm',
    forms: [
      'terroryzm', 'terroryzmu', 'terroryzmowi', 'terroryzmem', 'terroryzmie',
      'terrorystyczny', 'terrorystyczna', 'terrorystyczne',
      'terrorysta', 'terrorysty', 'terroryście', 'terrorystę', 'terrorystą',
      'terroryści', 'terrorystów', 'terrorystom', 'terrorystami',
      'zamach', 'zamachu', 'zamachowi', 'zamachem', 'zamachy',
      'zamachów', 'zamachom', 'zamachami', 'zamachach',
    ],
    severity: 1.0,
    category: 'violence',
  },
  {
    lemma: 'powódź',
    forms: [
      'powódź', 'powodzi', 'powodzią', 'powodzie', 'powodzi',
      'powodziom', 'powodziami', 'powodziach',
    ],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'bombardowanie',
    forms: [
      'bombardowanie', 'bombardowania', 'bombardowaniu', 'bombardowaniem',
      'bombardowań', 'bombardował', 'bombardowali', 'zbombardował', 'zbombardowali',
    ],
    severity: 0.9,
    category: 'violence',
  },
  {
    lemma: 'strzelanina',
    forms: [
      'strzelanina', 'strzelaniny', 'strzelaninie', 'strzelaninę', 'strelanin',
      'strzelać', 'strzelał', 'strzelali', 'zastrzelił', 'zastrzeliła',
      'zastrzelili', 'zastrzelony', 'zastrzelona',
    ],
    severity: 0.9,
    category: 'violence',
  },
  {
    lemma: 'eksplozja',
    forms: [
      'eksplozja', 'eksplozji', 'eksplozję', 'eksplozją', 'eksplozje',
      'wybuch', 'wybuchu', 'wybuchowi', 'wybuchem', 'wybuchy',
      'wybuchów', 'wybuchom', 'wybuchami', 'wybuchach',
      'wybuchł', 'wybuchła', 'wybuchło', 'eksplodował', 'eksplodowała',
    ],
    severity: 0.8,
    category: 'disaster',
  },
  {
    lemma: 'gwałt',
    forms: [
      'gwałt', 'gwałtu', 'gwałtowi', 'gwałtem', 'gwałcie',
      'gwałty', 'gwałtów', 'gwałtom', 'gwałtami',
      'zgwałcił', 'zgwałciła', 'zgwałcili', 'zgwałcona', 'zgwałcony',
    ],
    severity: 1.0,
    category: 'crime',
  },
];

export const EN_KEYWORDS: KeywordEntry[] = [
  {
    lemma: 'war',
    forms: ['war', 'wars', 'warfare', 'warzone'],
    severity: 0.9,
    category: 'violence',
  },
  {
    lemma: 'death',
    forms: ['death', 'deaths', 'dead', 'died', 'killed', 'killing', 'fatal', 'fatality', 'fatalities'],
    severity: 1.0,
    category: 'death',
  },
  {
    lemma: 'accident',
    forms: ['accident', 'accidents', 'crash', 'crashed', 'collision'],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'tragedy',
    forms: ['tragedy', 'tragedies', 'tragic'],
    severity: 0.8,
    category: 'disaster',
  },
  {
    lemma: 'attack',
    forms: ['attack', 'attacks', 'attacked', 'attacker', 'attackers'],
    severity: 0.8,
    category: 'violence',
  },
  {
    lemma: 'murder',
    forms: ['murder', 'murders', 'murdered', 'murderer', 'homicide', 'homicides'],
    severity: 1.0,
    category: 'crime',
  },
  {
    lemma: 'catastrophe',
    forms: ['catastrophe', 'catastrophic', 'disaster', 'disasters', 'disastrous'],
    severity: 0.9,
    category: 'disaster',
  },
  {
    lemma: 'fire',
    forms: ['wildfire', 'wildfires', 'blaze', 'inferno'],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'victims',
    forms: ['victim', 'victims', 'casualty', 'casualties'],
    severity: 0.8,
    category: 'death',
  },
  {
    lemma: 'terrorism',
    forms: ['terrorism', 'terrorist', 'terrorists', 'bombing', 'bombings', 'bomber'],
    severity: 1.0,
    category: 'violence',
  },
  {
    lemma: 'shooting',
    forms: ['shooting', 'shootings', 'gunfire', 'gunman', 'gunmen', 'shot dead'],
    severity: 0.9,
    category: 'violence',
  },
  {
    lemma: 'explosion',
    forms: ['explosion', 'explosions', 'exploded', 'detonation', 'detonated'],
    severity: 0.8,
    category: 'disaster',
  },
  {
    lemma: 'flood',
    forms: ['flood', 'floods', 'flooding', 'flooded'],
    severity: 0.7,
    category: 'disaster',
  },
  {
    lemma: 'earthquake',
    forms: ['earthquake', 'earthquakes', 'quake', 'tremor'],
    severity: 0.7,
    category: 'disaster',
  },
];

export const ALL_KEYWORDS: Record<string, KeywordEntry[]> = {
  pl: PL_KEYWORDS,
  en: EN_KEYWORDS,
};
