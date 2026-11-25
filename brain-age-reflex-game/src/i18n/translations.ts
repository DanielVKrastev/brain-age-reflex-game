export type AppLocale = 'bg' | 'en' | 'de' | 'es' | 'fr' | 'it' | 'tr' | 'ro';

export interface TranslationDictionary {
    memorizeHighlighted: boolean;
    appTitle: string;
    homeButton: string;
    badgeFiveGames: string;
    heroHeading: string;
    heroDescription: string;
    startTest: string;
    bestRecord: string;
    clearHistory: string;
    sessionEvaluation: string;
    brainAge: string;
    yearsShort: string;
    overallIndex: string;
    betterThanPrevious: string;
    worseThanPrevious: string;
    sameAsPrevious: string;
    recentAttempts: string;
    shareResult: string;
    playAgain: string;
    sharedOk: string;
    copiedOk: string;
    copyNotSupported: string;
    shareCancelled: string;
    reactionTitle: string;
    memoryTitle: string;
    numberHuntTitle: string;
    stroopTitle: string;
    mathBlitzTitle: string;
    roundOf: string;
    readyForMath: string;
    mathInstructions: string;
    chooseCorrectAnswer: string;
    correctAnswer: string;
    wrongAnswerWithSolution: string;
    readyForReaction: string;
    reactionInstructions: string;
    startRounds: string;
    waitForGreen: string;
    doNotPressEarly: string;
    pressNow: string;
    maxSpeed: string;
    tooEarly: string;
    tapToRetryRound: string;
    calculatingResult: string;
    nextRound: string;
    recordedAttempts: string;
    titleYoungMind: string;
    titleSharpFocus: string;
    titleBalancedRhythm: string;
    titleCalmPace: string;
    titleNeedsWarmup: string;

    // MemoryGame
    readyForMemory: string;
    memoryIntroHint: string;
    memoryPreviewHint: string;
    memoryRepeatCount: string;
    memoryNextRound: string;
    startRoundN: string;
    foundInRound: string;

    // NumberHuntGame
    readyForNumberHunt: string;
    numberHuntInstructions: string;
    startRound: string;
    pressInOrder: string;
    numberLabel: string;
    doneLabel: string;
    progressLabel: string;
    reshuffleBoard: string;

    // StroopGame
    readyForStroop: string;
    stroopInstructions: string;
    stroopPrompt: string;
    stroopCorrect: string;
    stroopWrong: string;
    colorRed: string;
    colorBlue: string;
    colorGreen: string;
    colorYellow: string;
}

export const SUPPORTED_LOCALES: Array<{ code: AppLocale; label: string }> = [
    { code: 'bg', label: 'BG · Български' },
    { code: 'en', label: 'EN · English' },
    { code: 'de', label: 'DE · Deutsch' },
    { code: 'es', label: 'ES · Español' },
    { code: 'fr', label: 'FR · Français' },
    { code: 'it', label: 'IT · Italiano' },
    { code: 'tr', label: 'TR · Türkçe' },
    { code: 'ro', label: 'RO · Română' },
];

export const TRANSLATIONS: Record<AppLocale, Partial<TranslationDictionary>> & {
    en: TranslationDictionary;
} = {
    bg: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Начало',
        badgeFiveGames: '5 МИНИ-ИГРИ · КОГНИТИВЕН ТЕСТ',
        heroHeading: 'На колко години е мозъкът ти?',
        heroDescription:
            'Премини през реакция, визуална памет, търсене на числа, ефект на Струп и бърза математика, за да изчислим относителната ти мозъчна възраст.',
        startTest: 'Започни теста',
        bestRecord: 'Рекорд (най-млад мозък)',
        clearHistory: 'Изчисти',
        sessionEvaluation: 'ОЦЕНКА НА СЕСИЯТА',
        brainAge: 'Мозъчна възраст',
        yearsShort: 'г.',
        overallIndex: 'Общ индекс',
        betterThanPrevious: 'по-млад от предишния опит',
        worseThanPrevious: 'спрямо предишния опит',
        sameAsPrevious: 'Същият резултат като предишния опит',
        recentAttempts: 'ПОСЛЕДНИ ОПИТИ',
        shareResult: 'Сподели резултата',
        playAgain: 'Нов тест',
        sharedOk: 'Споделено!',
        copiedOk: 'Резултатът е копиран!',
        copyNotSupported: 'Копирането не се поддържа в този браузър.',
        shareCancelled: 'Споделянето е отменено.',
        reactionTitle: 'Скорост на реакция',
        memoryTitle: 'Визуална памет',
        numberHuntTitle: 'Търсене на числа',
        stroopTitle: 'Ефект на Струп',
        mathBlitzTitle: 'Бърза математика',
        roundOf: 'Рунд {round} от {total}',
        readyForMath: 'Готов за бърза математика?',
        mathInstructions:
            'Реши {total} кратки сметки с +, - и × възможно най-точно и бързо.',
        chooseCorrectAnswer: 'Избери верния резултат:',
        correctAnswer: 'Верен отговор!',
        wrongAnswerWithSolution: 'Грешно — верният отговор е {answer}',
        readyForReaction: 'Тест за скорост на реакция',
        reactionInstructions:
            'Изчакай зеления сигнал и натисни възможно най-бързо в {total} рунда.',
        startRounds: 'Започни рундовете',
        waitForGreen: 'Изчакай зеления сигнал...',
        doNotPressEarly: 'Не натискай, докато екранът не светне в зелено.',
        pressNow: 'НАТИСНИ СЕГА!',
        maxSpeed: 'Максимална скорост!',
        tooEarly: 'Твърде рано!',
        tapToRetryRound: 'Натисни отново, за да повториш рунда.',
        calculatingResult: 'Изчисляване на резултата...',
        nextRound: 'Следващ рунд...',
        recordedAttempts: 'Записани опити:',
        titleYoungMind: 'Светкавичен ум',
        titleSharpFocus: 'Остър фокус',
        titleBalancedRhythm: 'Уравновесен ритъм',
        titleCalmPace: 'Спокоен темп',
        titleNeedsWarmup: 'Нуждае се от разгрявка',

        readyForMemory: 'Готов за визуалната памет?',
        memoryIntroHint: 'Запомни светещите квадрати и ги повтори в същия рунд.',
        memorizeHighlighted: true,
        memoryPreviewHint:
            'Квадратите ще светнат за 1.5 секунди, след което ще можеш да ги отбележиш.',
        memoryRepeatCount: 'Възпроизведи {count} отбелязани квадрата.',
        memoryNextRound: 'Преминаване към следващия рунд...',
        startRoundN: 'Започни рунд {round}',
        foundInRound: 'Открити в рунда',

        readyForNumberHunt: 'Готов за търсене на числа?',
        numberHuntInstructions:
            'Натисни числата от 1 до {count} във възходящ ред възможно най-бързо.',
        startRound: 'Започни рунда',
        pressInOrder: 'Натисни последователно:',
        numberLabel: 'Число {number}',
        doneLabel: 'Готово!',
        progressLabel: 'Прогрес',
        reshuffleBoard: 'Нова подредба',

        readyForStroop: 'Готов за ефекта на Струп?',
        stroopInstructions:
            'Натисни бутона с ЦВЕТА НА МАСТИЛОТО на думата, а не самата дума.',
        stroopPrompt: 'Избери цвета на мастилото:',
        stroopCorrect: 'Отличен фокус!',
        stroopWrong: 'Цветът беше {color}',
        colorRed: 'ЧЕРВЕН',
        colorBlue: 'СИН',
        colorGreen: 'ЗЕЛЕН',
        colorYellow: 'ЖЪЛТ',
    },
    en: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Home',
        badgeFiveGames: '5 MINI-GAMES · COGNITIVE TEST',
        heroHeading: 'How old is your brain?',
        heroDescription:
            'Complete reaction, visual memory, number hunt, Stroop effect, and math blitz to estimate your relative brain age.',
        startTest: 'Start Test',
        bestRecord: 'Best record (youngest brain)',
        clearHistory: 'Clear',
        sessionEvaluation: 'SESSION EVALUATION',
        brainAge: 'Brain Age',
        yearsShort: 'yrs',
        overallIndex: 'Overall Index',
        betterThanPrevious: 'younger than previous run',
        worseThanPrevious: 'vs previous run',
        sameAsPrevious: 'Same result as previous run',
        recentAttempts: 'RECENT RUNS',
        shareResult: 'Share Result',
        playAgain: 'New Test',
        sharedOk: 'Shared!',
        copiedOk: 'Result copied!',
        copyNotSupported: 'Clipboard is not supported here.',
        shareCancelled: 'Sharing cancelled.',
        reactionTitle: 'Reaction Speed',
        memoryTitle: 'Visual Memory',
        numberHuntTitle: 'Number Hunt',
        stroopTitle: 'Stroop Effect',
        mathBlitzTitle: 'Math Blitz',
        roundOf: 'Round {round} of {total}',
        readyForMath: 'Ready for Math Blitz?',
        mathInstructions:
            'Solve {total} quick +, - and × problems as accurately and fast as possible.',
        chooseCorrectAnswer: 'Choose the correct answer:',
        correctAnswer: 'Correct!',
        wrongAnswerWithSolution: 'Wrong — correct answer is {answer}',
        readyForReaction: 'Reaction Speed Test',
        reactionInstructions:
            'Wait for green and tap as fast as you can across {total} rounds.',
        startRounds: 'Start Rounds',
        waitForGreen: 'Wait for the green signal...',
        doNotPressEarly: 'Do not tap until the screen turns green.',
        pressNow: 'TAP NOW!',
        maxSpeed: 'Maximum speed!',
        tooEarly: 'Too early!',
        tapToRetryRound: 'Tap again to retry the round.',
        calculatingResult: 'Calculating result...',
        nextRound: 'Next round...',
        recordedAttempts: 'Recorded taps:',
        titleYoungMind: 'Lightning Mind',
        titleSharpFocus: 'Sharp Focus',
        titleBalancedRhythm: 'Balanced Rhythm',
        titleCalmPace: 'Steady Pace',
        titleNeedsWarmup: 'Needs Warm-up',

        readyForMemory: 'Ready for Visual Memory?',
        memoryIntroHint: 'Memorize the glowing tiles and repeat them in the same round.',
        memorizeHighlighted: true,
        memoryPreviewHint:
            'Tiles will light up for 1.5 seconds, then you can select them.',
        memoryRepeatCount: 'Select {count} highlighted tiles.',
        memoryNextRound: 'Moving to the next round...',
        startRoundN: 'Start Round {round}',
        foundInRound: 'Found in round',

        readyForNumberHunt: 'Ready for Number Hunt?',
        numberHuntInstructions:
            'Tap the numbers from 1 to {count} in ascending order as fast as possible.',
        startRound: 'Start Round',
        pressInOrder: 'Tap in order:',
        numberLabel: 'Number {number}',
        doneLabel: 'Done!',
        progressLabel: 'Progress',
        reshuffleBoard: 'Reshuffle',

        readyForStroop: 'Ready for Stroop Effect?',
        stroopInstructions:
            'Tap the button matching the INK COLOR of the word — not the word itself.',
        stroopPrompt: 'Tap the INK color of:',
        stroopCorrect: 'Nice focus!',
        stroopWrong: 'Ink was {color}',
        colorRed: 'RED',
        colorBlue: 'BLUE',
        colorGreen: 'GREEN',
        colorYellow: 'YELLOW',
    },
    de: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Start',
        badgeFiveGames: '5 MINI-SPIELE · KOGNITIVER TEST',
        heroHeading: 'Wie alt ist dein Gehirn?',
        heroDescription:
            'Absolviere Reaktion, visuelles Gedächtnis, Zahlensuche, Stroop-Effekt und Kopfrechnen für dein geschätztes Gehirnalter.',
        startTest: 'Test starten',
        bestRecord: 'Rekord (jüngstes Gehirn)',
        clearHistory: 'Löschen',
        sessionEvaluation: 'SITZUUNGSBEWERTUNG',
        brainAge: 'Gehirnalter',
        yearsShort: 'J.',
        overallIndex: 'Gesamtindex',
        betterThanPrevious: 'jünger als beim letzten Versuch',
        worseThanPrevious: 'gegenüber dem letzten Versuch',
        sameAsPrevious: 'Gleiches Ergebnis wie beim letzten Versuch',
        recentAttempts: 'LETZTE VERSUCHE',
        shareResult: 'Ergebnis teilen',
        playAgain: 'Neuer Test',
        sharedOk: 'Geteilt!',
        copiedOk: 'Ergebnis kopiert!',
        copyNotSupported: 'Zwischenablage wird hier nicht unterstützt.',
        shareCancelled: 'Teilen abgebrochen.',
        reactionTitle: 'Reaktionszeit',
        memoryTitle: 'Visuelles Gedächtnis',
        numberHuntTitle: 'Zahlensuche',
        stroopTitle: 'Stroop-Effekt',
        mathBlitzTitle: 'Kopfrechnen-Blitz',
        roundOf: 'Runde {round} von {total}',
        readyForMath: 'Bereit für Kopfrechnen-Blitz?',
        mathInstructions:
            'Löse {total} schnelle +, - und × Aufgaben so genau und schnell wie möglich.',
        chooseCorrectAnswer: 'Wähle das richtige Ergebnis:',
        correctAnswer: 'Richtig!',
        wrongAnswerWithSolution: 'Falsch — richtig ist {answer}',
        readyForReaction: 'Reaktionstest',
        reactionInstructions:
            'Warte auf Grün und tippe in {total} Runden so schnell wie möglich.',
        startRounds: 'Runden starten',
        waitForGreen: 'Warte auf das grüne Signal...',
        doNotPressEarly: 'Nicht tippen, bevor der Bildschirm grün wird.',
        pressNow: 'JETZT TIPPEN!',
        maxSpeed: 'Volles Tempo!',
        tooEarly: 'Zu früh!',
        tapToRetryRound: 'Erneut tippen, um die Runde zu wiederholen.',
        calculatingResult: 'Ergebnis wird berechnet...',
        nextRound: 'Nächste Runde...',
        recordedAttempts: 'Versuche:',
        titleYoungMind: 'Blitzschneller Geist',
        titleSharpFocus: 'Scharfer Fokus',
        titleBalancedRhythm: 'Ausgewogener Rhythmus',
        titleCalmPace: 'Ruhiges Tempo',
        titleNeedsWarmup: 'Braucht Aufwärmen',
        readyForMemory: 'Bereit für das visuelle Gedächtnis?',
        memoryIntroHint: 'Merke dir die leuchtenden Felder und wiederhole sie in derselben Runde.',
        memoryPreviewHint:
            'Die Felder leuchten 1,5 Sekunden lang auf, danach kannst du sie antippen.',
        memoryRepeatCount: 'Wähle {count} markierte Felder.',
        memoryNextRound: 'Weiter zur nächsten Runde...',
        startRoundN: 'Runde {round} starten',
        foundInRound: 'In der Runde gefunden',

        readyForNumberHunt: 'Bereit für die Zahlensuche?',
        numberHuntInstructions:
            'Tippe die Zahlen von 1 bis {count} so schnell wie möglich in aufsteigender Reihenfolge.',
        startRound: 'Runde starten',
        pressInOrder: 'Der Reihe nach tippen:',
        numberLabel: 'Zahl {number}',
        doneLabel: 'Fertig!',
        progressLabel: 'Fortschritt',
        reshuffleBoard: 'Neu mischen',

        readyForStroop: 'Bereit für den Stroop-Effekt?',
        stroopInstructions:
            'Tippe auf die Schaltfläche mit der SCHRIFTFARBE des Wortes – nicht auf das geschriebene Wort.',
        stroopPrompt: 'Tippe die SCHRIFTFARBE von:',
        stroopCorrect: 'Stark fokussiert!',
        stroopWrong: 'Die Farbe war {color}',
        colorRed: 'ROT',
        colorBlue: 'BLAU',
        colorGreen: 'GRÜN',
        colorYellow: 'GELB',
    },
    es: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Inicio',
        badgeFiveGames: '5 MINIJUEGOS · TEST COGNITIVO',
        heroHeading: '¿Qué edad tiene tu cerebro?',
        heroDescription:
            'Completa reacción, memoria visual, búsqueda de números, efecto Stroop y cálculo rápido para estimar tu edad cerebral.',
        startTest: 'Iniciar test',
        bestRecord: 'Récord (cerebro más joven)',
        clearHistory: 'Borrar',
        sessionEvaluation: 'EVALUACIÓN DE SESIÓN',
        brainAge: 'Edad cerebral',
        yearsShort: 'años',
        overallIndex: 'Índice general',
        betterThanPrevious: 'más joven que el intento anterior',
        worseThanPrevious: 'respecto al intento anterior',
        sameAsPrevious: 'Mismo resultado que el intento anterior',
        recentAttempts: 'INTENTOS RECIENTES',
        shareResult: 'Compartir resultado',
        playAgain: 'Nuevo test',
        sharedOk: '¡Compartido!',
        copiedOk: '¡Resultado copiado!',
        copyNotSupported: 'El portapapeles no es compatible aquí.',
        shareCancelled: 'Compartir cancelado.',
        reactionTitle: 'Velocidad de reacción',
        memoryTitle: 'Memoria visual',
        numberHuntTitle: 'Búsqueda de números',
        stroopTitle: 'Efecto Stroop',
        mathBlitzTitle: 'Cálculo rápido',
        roundOf: 'Ronda {round} de {total}',
        readyForMath: '¿Listo para cálculo rápido?',
        mathInstructions:
            'Resuelve {total} cuentas rápidas de +, - y × con la mayor precisión y rapidez.',
        chooseCorrectAnswer: 'Elige la respuesta correcta:',
        correctAnswer: '¡Correcto!',
        wrongAnswerWithSolution: 'Incorrecto — la respuesta es {answer}',
        readyForReaction: 'Test de velocidad de reacción',
        reactionInstructions:
            'Espera el verde y toca lo más rápido posible en {total} rondas.',
        startRounds: 'Empezar rondas',
        waitForGreen: 'Espera la señal verde...',
        doNotPressEarly: 'No toques hasta que la pantalla se ponga verde.',
        pressNow: '¡TOCA AHORA!',
        maxSpeed: '¡Velocidad máxima!',
        tooEarly: '¡Demasiado pronto!',
        tapToRetryRound: 'Toca de nuevo para repetir la ronda.',
        calculatingResult: 'Calculando resultado...',
        nextRound: 'Siguiente ronda...',
        recordedAttempts: 'Intentos:',
        titleYoungMind: 'Mente veloz',
        titleSharpFocus: 'Enfoque agudo',
        titleBalancedRhythm: 'Ritmo equilibrado',
        titleCalmPace: 'Ritmo tranquilo',
        titleNeedsWarmup: 'Necesita calentar',
        readyForMemory: '¿Listo para memoria visual?',
        memoryIntroHint: 'Memoriza los cuadros iluminados y repítelos en la misma ronda.',
        memoryPreviewHint:
            'Los cuadros se iluminarán durante 1,5 segundos y luego podrás marcarlos.',
        memoryRepeatCount: 'Selecciona {count} cuadros resaltados.',
        memoryNextRound: 'Pasando a la siguiente ronda...',
        startRoundN: 'Iniciar ronda {round}',
        foundInRound: 'Encontrados en la ronda',

        readyForNumberHunt: '¿Listo para búsqueda de números?',
        numberHuntInstructions:
            'Toca los números del 1 al {count} en orden ascendente lo más rápido posible.',
        startRound: 'Iniciar ronda',
        pressInOrder: 'Toca en orden:',
        numberLabel: 'Número {number}',
        doneLabel: '¡Listo!',
        progressLabel: 'Progreso',
        reshuffleBoard: 'Reordenar',

        readyForStroop: '¿Listo para el efecto Stroop?',
        stroopInstructions:
            'Toca el botón del COLOR DE TINTA de la palabra, no lo que dice la palabra.',
        stroopPrompt: 'Toca el COLOR DE TINTA de:',
        stroopCorrect: '¡Buen enfoque!',
        stroopWrong: 'El color era {color}',
        colorRed: 'ROJO',
        colorBlue: 'AZUL',
        colorGreen: 'VERDE',
        colorYellow: 'AMARILLO',
    },
    fr: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Accueil',
        badgeFiveGames: '5 MINI-JEUX · TEST COGNITIF',
        heroHeading: 'Quel âge a ton cerveau ?',
        heroDescription:
            'Enchaîne réflexes, mémoire visuelle, chasse aux nombres, effet Stroop et calcul rapide pour estimer ton âge cérébral.',
        startTest: 'Lancer le test',
        bestRecord: 'Record (cerveau le plus jeune)',
        clearHistory: 'Effacer',
        sessionEvaluation: 'ÉVALUATION DE LA SESSION',
        brainAge: 'Âge cérébral',
        yearsShort: 'ans',
        overallIndex: 'Indice global',
        betterThanPrevious: 'plus jeune que la tentative précédente',
        worseThanPrevious: 'par rapport à la tentative précédente',
        sameAsPrevious: 'Même résultat que la tentative précédente',
        recentAttempts: 'ESSAIS RÉCENTS',
        shareResult: 'Partager le résultat',
        playAgain: 'Nouveau test',
        sharedOk: 'Partagé !',
        copiedOk: 'Résultat copié !',
        copyNotSupported: 'Presse-papiers non pris en charge ici.',
        shareCancelled: 'Partage annulé.',
        reactionTitle: 'Temps de réaction',
        memoryTitle: 'Mémoire visuelle',
        numberHuntTitle: 'Chasse aux nombres',
        stroopTitle: 'Effet Stroop',
        mathBlitzTitle: 'Calcul express',
        roundOf: 'Manche {round} sur {total}',
        readyForMath: 'Prêt pour le calcul express ?',
        mathInstructions:
            'Résous {total} calculs rapides avec +, - et × le plus vite et juste possible.',
        chooseCorrectAnswer: 'Choisis la bonne réponse :',
        correctAnswer: 'Bien joué !',
        wrongAnswerWithSolution: 'Raté — la bonne réponse est {answer}',
        readyForReaction: 'Test de temps de réaction',
        reactionInstructions:
            'Attends le vert et appuie le plus vite possible sur {total} manches.',
        startRounds: 'Commencer les manches',
        waitForGreen: 'Attends le signal vert...',
        doNotPressEarly: 'N’appuie pas avant que l’écran devienne vert.',
        pressNow: 'APPUIS MAINTENANT !',
        maxSpeed: 'Vitesse maximale !',
        tooEarly: 'Trop tôt !',
        tapToRetryRound: 'Appuie encore pour rejouer la manche.',
        calculatingResult: 'Calcul du résultat...',
        nextRound: 'Manche suivante...',
        recordedAttempts: 'Essais enregistrés :',
        titleYoungMind: 'Esprit éclair',
        titleSharpFocus: 'Focus affûté',
        titleBalancedRhythm: 'Rythme équilibré',
        titleCalmPace: 'Rythme posé',
        titleNeedsWarmup: 'Besoin d’échauffement',
        readyForMemory: 'Prêt pour la mémoire visuelle ?',
        memoryIntroHint: 'Mémorise les cases allumées et répète-les dans la même manche.',
        memoryPreviewHint:
            'Les cases s’allument pendant 1,5 seconde, puis tu pourras les sélectionner.',
        memoryRepeatCount: 'Sélectionne {count} cases mises en évidence.',
        memoryNextRound: 'Passage à la manche suivante...',
        startRoundN: 'Lancer la manche {round}',
        foundInRound: 'Trouvés dans la manche',

        readyForNumberHunt: 'Prêt pour la chasse aux nombres ?',
        numberHuntInstructions:
            'Appuie sur les nombres de 1 à {count} dans l’ordre croissant le plus vite possible.',
        startRound: 'Lancer la manche',
        pressInOrder: 'Appuie dans l’ordre :',
        numberLabel: 'Nombre {number}',
        doneLabel: 'Terminé !',
        progressLabel: 'Progression',
        reshuffleBoard: 'Mélanger',

        readyForStroop: 'Prêt pour l’effet Stroop ?',
        stroopInstructions:
            'Appuie sur le bouton de la COULEUR D’ENCRE du mot, pas sur le mot lui-même.',
        stroopPrompt: 'Appuie sur la COULEUR D’ENCRE de :',
        stroopCorrect: 'Belle concentration !',
        stroopWrong: 'La couleur était {color}',
        colorRed: 'ROUGE',
        colorBlue: 'BLEU',
        colorGreen: 'VERT',
        colorYellow: 'JAUNE',
    },
    it: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Home',
        badgeFiveGames: '5 MINI-GIOCHI · TEST COGNITIVO',
        heroHeading: 'Quanti anni ha il tuo cervello?',
        heroDescription:
            'Affronta riflessi, memoria visiva, ricerca numeri, effetto Stroop e calcolo veloce per stimare la tua età cerebrale.',
        startTest: 'Inizia il test',
        bestRecord: 'Record (cervello più giovane)',
        clearHistory: 'Pulisci',
        sessionEvaluation: 'VALUTAZIONE SESSIONE',
        brainAge: 'Età cerebrale',
        yearsShort: 'anni',
        overallIndex: 'Indice complessivo',
        betterThanPrevious: 'più giovane del tentativo precedente',
        worseThanPrevious: 'rispetto al tentativo precedente',
        sameAsPrevious: 'Stesso risultato del tentativo precedente',
        recentAttempts: 'ULTIMI TENTATIVI',
        shareResult: 'Condividi risultato',
        playAgain: 'Nuovo test',
        sharedOk: 'Condiviso!',
        copiedOk: 'Risultato copiato!',
        copyNotSupported: 'Appunti non supportati qui.',
        shareCancelled: 'Condivisione annullata.',
        reactionTitle: 'Velocità di reazione',
        memoryTitle: 'Memoria visiva',
        numberHuntTitle: 'Ricerca numeri',
        stroopTitle: 'Effetto Stroop',
        mathBlitzTitle: 'Calcolo lampo',
        roundOf: 'Turno {round} di {total}',
        readyForMath: 'Pronto per il calcolo lampo?',
        mathInstructions:
            'Risolvi {total} calcoli rapidi con +, - e × nel modo più preciso e veloce possibile.',
        chooseCorrectAnswer: 'Scegli la risposta corretta:',
        correctAnswer: 'Corretto!',
        wrongAnswerWithSolution: 'Sbagliato — la risposta è {answer}',
        readyForReaction: 'Test velocità di reazione',
        reactionInstructions:
            'Attendi il verde e tocca più velocemente possibile in {total} turni.',
        startRounds: 'Inizia i turni',
        waitForGreen: 'Attendi il segnale verde...',
        doNotPressEarly: 'Non toccare finché lo schermo non diventa verde.',
        pressNow: 'TOCCA ORA!',
        maxSpeed: 'Massima velocità!',
        tooEarly: 'Troppo presto!',
        tapToRetryRound: 'Tocca di nuovo per ripetere il turno.',
        calculatingResult: 'Calcolo risultato...',
        nextRound: 'Prossimo turno...',
        recordedAttempts: 'Tentativi:',
        titleYoungMind: 'Mente fulminea',
        titleSharpFocus: 'Focus nitido',
        titleBalancedRhythm: 'Ritmo equilibrato',
        titleCalmPace: 'Ritmo calmo',
        titleNeedsWarmup: 'Serve riscaldamento',
        readyForMemory: 'Pronto per la memoria visiva?',
        memoryIntroHint: 'Memorizza le caselle illuminate e ripetile nello stesso turno.',
        memoryPreviewHint:
            'Le caselle si illumineranno per 1,5 secondi, poi potrai selezionarle.',
        memoryRepeatCount: 'Seleziona {count} caselle evidenziate.',
        memoryNextRound: 'Passaggio al turno successivo...',
        startRoundN: 'Inizia turno {round}',
        foundInRound: 'Trovati nel turno',

        readyForNumberHunt: 'Pronto per la ricerca numeri?',
        numberHuntInstructions:
            'Tocca i numeri da 1 a {count} in ordine crescente il più velocemente possibile.',
        startRound: 'Inizia turno',
        pressInOrder: 'Tocca in ordine:',
        numberLabel: 'Numero {number}',
        doneLabel: 'Fatto!',
        progressLabel: 'Avanzamento',
        reshuffleBoard: 'Rimescola',

        readyForStroop: 'Pronto per l’effetto Stroop?',
        stroopInstructions:
            'Tocca il pulsante del COLORE D’INCHIOSTRO della parola, non la parola stessa.',
        stroopPrompt: 'Tocca il COLORE D’INCHIOSTRO di:',
        stroopCorrect: 'Ottima concentrazione!',
        stroopWrong: 'Il colore era {color}',
        colorRed: 'ROSSO',
        colorBlue: 'BLU',
        colorGreen: 'VERDE',
        colorYellow: 'GIALLO',
    },
    tr: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Ana Sayfa',
        badgeFiveGames: '5 MİNİ OYUN · BİLİŞSEL TEST',
        heroHeading: 'Beynin kaç yaşında?',
        heroDescription:
            'Tahmini beyin yaşını ölçmek için refleks, görsel hafıza, sayı bulma, Stroop etkisi ve hızlı matematiği tamamla.',
        startTest: 'Teste Başla',
        bestRecord: 'Rekor (en genç beyin)',
        clearHistory: 'Temizle',
        sessionEvaluation: 'OTURUM DEĞERLENDİRMESİ',
        brainAge: 'Beyin Yaşı',
        yearsShort: 'yaş',
        overallIndex: 'Genel Endeks',
        betterThanPrevious: 'önceki denemeye göre daha genç',
        worseThanPrevious: 'önceki denemeye göre',
        sameAsPrevious: 'Önceki denemeyle aynı sonuç',
        recentAttempts: 'SON DENEMELER',
        shareResult: 'Sonucu Paylaş',
        playAgain: 'Yeni Test',
        sharedOk: 'Paylaşıldı!',
        copiedOk: 'Sonuç kopyalandı!',
        copyNotSupported: 'Pano burada desteklenmiyor.',
        shareCancelled: 'Paylaşım iptal edildi.',
        reactionTitle: 'Tepki Hızı',
        memoryTitle: 'Görsel Hafıza',
        numberHuntTitle: 'Sayı Avı',
        stroopTitle: 'Stroop Etkisi',
        mathBlitzTitle: 'Hızlı Matematik',
        roundOf: 'Tur {round} / {total}',
        readyForMath: 'Hızlı Matematiğe hazır mısın?',
        mathInstructions:
            '{total} kısa +, - ve × işlemini olabildiğince doğru ve hızlı çöz.',
        chooseCorrectAnswer: 'Doğru sonucu seç:',
        correctAnswer: 'Doğru!',
        wrongAnswerWithSolution: 'Yanlış — doğru cevap {answer}',
        readyForReaction: 'Tepki Hızı Testi',
        reactionInstructions:
            'Yeşil ışığı bekle ve {total} turda olabildiğince hızlı dokun.',
        startRounds: 'Turları Başlat',
        waitForGreen: 'Yeşil sinyali bekle...',
        doNotPressEarly: 'Ekran yeşile dönmeden dokunma.',
        pressNow: 'ŞİMDİ DOKUN!',
        maxSpeed: 'Maksimum hız!',
        tooEarly: 'Çok erken!',
        tapToRetryRound: 'Turu tekrarlamak için yeniden dokun.',
        calculatingResult: 'Sonuç hesaplanıyor...',
        nextRound: 'Sonraki tur...',
        recordedAttempts: 'Kayıtlı denemeler:',
        titleYoungMind: 'Şimşek Zihin',
        titleSharpFocus: 'Keskin Odak',
        titleBalancedRhythm: 'Dengeli Ritim',
        titleCalmPace: 'Sakin Tempo',
        titleNeedsWarmup: 'Isınmaya İhtiyacı Var',
        readyForMemory: 'Görsel Hafızaya hazır mısın?',
        memoryIntroHint: 'Parlayan kareleri aklında tut ve aynı turda tekrar et.',
        memoryPreviewHint:
            'Kareler 1,5 saniye yanar, ardından onları seçebilirsin.',
        memoryRepeatCount: 'Vurgulanan {count} kareyi seç.',
        memoryNextRound: 'Sonraki tura geçiliyor...',
        startRoundN: '{round}. Turu Başlat',
        foundInRound: 'Turda bulunan',

        readyForNumberHunt: 'Sayı Avına hazır mısın?',
        numberHuntInstructions:
            '1’den {count}’a kadar olan sayılara artan sırayla olabildiğince hızlı dokun.',
        startRound: 'Turu Başlat',
        pressInOrder: 'Sırayla dokun:',
        numberLabel: 'Sayı {number}',
        doneLabel: 'Tamam!',
        progressLabel: 'İlerleme',
        reshuffleBoard: 'Yeniden Karıştır',

        readyForStroop: 'Stroop Etkisine hazır mısın?',
        stroopInstructions:
            'Kelimenin anlamına değil, kelimenin YAZI RENGİNE karşılık gelen düğmeye dokun.',
        stroopPrompt: 'YAZI RENGİNE dokun:',
        stroopCorrect: 'Harika odak!',
        stroopWrong: 'Renk {color} idi',
        colorRed: 'KIRMIZI',
        colorBlue: 'MAVİ',
        colorGreen: 'YEŞİL',
        colorYellow: 'SARI',
    },
    ro: {
        appTitle: 'Brain Age & Reflex',
        homeButton: 'Acasă',
        badgeFiveGames: '5 MINI-JOCURI · TEST COGNITIV',
        heroHeading: 'Ce vârstă are creierul tău?',
        heroDescription:
            'Parcurge reacție, memorie vizuală, căutare numere, efectul Stroop și calcul rapid pentru a estima vârsta creierului.',
        startTest: 'Începe testul',
        bestRecord: 'Record (cel mai tânăr creier)',
        clearHistory: 'Șterge',
        sessionEvaluation: 'EVALUARE SESIUNE',
        brainAge: 'Vârsta creierului',
        yearsShort: 'ani',
        overallIndex: 'Index general',
        betterThanPrevious: 'mai tânăr față de încercarea anterioară',
        worseThanPrevious: 'față de încercarea anterioară',
        sameAsPrevious: 'Același rezultat ca la încercarea anterioară',
        recentAttempts: 'ÎNCERCĂRI RECENTE',
        shareResult: 'Distribuie rezultatul',
        playAgain: 'Test nou',
        sharedOk: 'Distribuit!',
        copiedOk: 'Rezultat copiat!',
        copyNotSupported: 'Clipboard-ul nu este acceptat aici.',
        shareCancelled: 'Distribuirea a fost anulată.',
        reactionTitle: 'Viteză de reacție',
        memoryTitle: 'Memorie vizuală',
        numberHuntTitle: 'Căutare numere',
        stroopTitle: 'Efectul Stroop',
        mathBlitzTitle: 'Calcul rapid',
        roundOf: 'Runda {round} din {total}',
        readyForMath: 'Pregătit pentru calcul rapid?',
        mathInstructions:
            'Rezolvă {total} calcule scurte cu +, - și × cât mai exact și rapid.',
        chooseCorrectAnswer: 'Alege răspunsul corect:',
        correctAnswer: 'Corect!',
        wrongAnswerWithSolution: 'Greșit — răspunsul corect este {answer}',
        readyForReaction: 'Test de viteză de reacție',
        reactionInstructions:
            'Așteaptă verdele și atinge cât mai repede în {total} runde.',
        startRounds: 'Începe rundele',
        waitForGreen: 'Așteaptă semnalul verde...',
        doNotPressEarly: 'Nu atinge până când ecranul devine verde.',
        pressNow: 'ATUNGE ACUM!',
        maxSpeed: 'Viteză maximă!',
        tooEarly: 'Prea devreme!',
        tapToRetryRound: 'Atinge din nou pentru a relua runda.',
        calculatingResult: 'Se calculează rezultatul...',
        nextRound: 'Runda următoare...',
        recordedAttempts: 'Încercări înregistrate:',
        titleYoungMind: 'Minte fulger',
        titleSharpFocus: 'Focus ascuțit',
        titleBalancedRhythm: 'Ritm echilibrat',
        titleCalmPace: 'Ritm calm',
        titleNeedsWarmup: 'Are nevoie de încălzire',
        readyForMemory: 'Pregătit pentru memorie vizuală?',
        memoryIntroHint: 'Memorează pătratele aprinse și repetă-le în aceeași rundă.',
        memoryPreviewHint:
            'Pătratele se vor aprinde timp de 1,5 secunde, apoi le poți selecta.',
        memoryRepeatCount: 'Selectează {count} pătrate evidențiate.',
        memoryNextRound: 'Trecem la runda următoare...',
        startRoundN: 'Începe runda {round}',
        foundInRound: 'Găsite în rundă',

        readyForNumberHunt: 'Pregătit pentru căutare numere?',
        numberHuntInstructions:
            'Atinge numerele de la 1 la {count} în ordine crescătoare cât mai repede.',
        startRound: 'Începe runda',
        pressInOrder: 'Atinge în ordine:',
        numberLabel: 'Numărul {number}',
        doneLabel: 'Gata!',
        progressLabel: 'Progres',
        reshuffleBoard: 'Amestecă din nou',

        readyForStroop: 'Pregătit pentru efectul Stroop?',
        stroopInstructions:
            'Atinge butonul cu CULOAREA CERNELEI cuvântului, nu cuvântul în sine.',
        stroopPrompt: 'Atinge CULOAREA CERNELEI pentru:',
        stroopCorrect: 'Concentrare bună!',
        stroopWrong: 'Culoarea era {color}',
        colorRed: 'ROȘU',
        colorBlue: 'ALBASTRU',
        colorGreen: 'VERDE',
        colorYellow: 'GALBEN',
    },
};

export function formatText(
    template: string,
    params: Record<string, string | number>
): string {
    return Object.entries(params).reduce(
        (acc, [key, val]) => acc.replaceAll(`{${key}}`, String(val)),
        template
    );
}

export function getTranslations(locale: AppLocale): TranslationDictionary {
    return {
        ...TRANSLATIONS.en,
        ...TRANSLATIONS[locale],
    } as TranslationDictionary;
}