// Comprehensive biblical terms dictionary for spell checking and predictive text
export const biblicalTerms = [
  // Books of the Bible
  'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy', 'joshua', 'judges', 'ruth',
  'samuel', 'kings', 'chronicles', 'ezra', 'nehemiah', 'esther', 'job', 'psalms', 'proverbs',
  'ecclesiastes', 'song', 'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel', 'hosea',
  'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum', 'habakkuk', 'zephaniah', 'haggai',
  'zechariah', 'malachi', 'matthew', 'mark', 'luke', 'john', 'acts', 'romans', 'corinthians',
  'galatians', 'ephesians', 'philippians', 'colossians', 'thessalonians', 'timothy', 'titus',
  'philemon', 'hebrews', 'james', 'peter', 'revelation',

  // Major Biblical Characters
  'abraham', 'isaac', 'jacob', 'moses', 'david', 'solomon', 'elijah', 'elisha', 'isaiah',
  'jeremiah', 'ezekiel', 'daniel', 'jesus', 'christ', 'messiah', 'mary', 'joseph', 'john',
  'peter', 'paul', 'apostle', 'disciples', 'matthew', 'mark', 'luke', 'timothy', 'titus',
  'barnabas', 'silas', 'noah', 'adam', 'eve', 'cain', 'abel', 'seth', 'enoch', 'methuselah',
  'sarah', 'rebecca', 'rachel', 'leah', 'aaron', 'miriam', 'joshua', 'caleb', 'gideon',
  'samson', 'samuel', 'saul', 'jonathan', 'bathsheba', 'absalom', 'nehemiah', 'ezra',
  'esther', 'mordecai', 'haman', 'pharaoh', 'pharisees', 'sadducees', 'scribes', 'levites',
  'priests', 'prophets', 'apostles', 'evangelists', 'pastors', 'teachers', 'deacons',

  // Places and Geography
  'jerusalem', 'bethlehem', 'nazareth', 'galilee', 'capernaum', 'jericho', 'jordan',
  'mediterranean', 'canaan', 'israel', 'judah', 'samaria', 'egypt', 'babylon', 'assyria',
  'persia', 'rome', 'athens', 'corinth', 'ephesus', 'philippi', 'thessalonica', 'antioch',
  'damascus', 'cyprus', 'crete', 'malta', 'sinai', 'horeb', 'zion', 'moriah', 'carmel',
  'hermon', 'tabor', 'olivet', 'golgotha', 'calvary', 'gethsemane', 'temple', 'synagogue',
  'tabernacle', 'wilderness', 'desert', 'promised', 'land', 'river', 'sea', 'mountain',
  'valley', 'garden', 'eden', 'sodom', 'gomorrah',

  // Religious Terms and Concepts
  'god', 'lord', 'yahweh', 'jehovah', 'adonai', 'elohim', 'almighty', 'creator', 'father',
  'son', 'holy', 'spirit', 'trinity', 'salvation', 'redemption', 'atonement', 'sacrifice',
  'covenant', 'testament', 'gospel', 'grace', 'mercy', 'love', 'faith', 'hope', 'charity',
  'prayer', 'worship', 'praise', 'thanksgiving', 'blessing', 'baptism', 'communion',
  'eucharist', 'passover', 'sabbath', 'pentecost', 'christmas', 'easter', 'resurrection',
  'crucifixion', 'cross', 'crown', 'throne', 'kingdom', 'heaven', 'hell', 'angels',
  'archangel', 'cherubim', 'seraphim', 'devil', 'satan', 'demon', 'evil', 'sin', 'iniquity',
  'transgression', 'righteousness', 'holiness', 'sanctification', 'justification',
  'glorification', 'prophecy', 'revelation', 'vision', 'dream', 'miracle', 'sign', 'wonder',
  'parable', 'beatitudes', 'commandments', 'law', 'torah', 'scripture', 'bible', 'verse',
  'chapter', 'psalm', 'proverb', 'genealogy', 'census', 'offering', 'tithe', 'firstfruits',

  // Theological Terms
  'omnipotent', 'omniscient', 'omnipresent', 'immutable', 'eternal', 'infinite', 'sovereign',
  'predestination', 'election', 'foreknowledge', 'providence', 'incarnation', 'virgin',
  'birth', 'immanuel', 'emanuel', 'transfiguration', 'ascension', 'pentecost', 'church',
  'body', 'bride', 'flock', 'vineyard', 'branches', 'shepherd', 'lamb', 'lion', 'king',
  'priest', 'prophet', 'intercessor', 'mediator', 'advocate', 'comforter', 'counselor',
  'helper', 'guide', 'teacher', 'light', 'way', 'truth', 'life', 'bread', 'water', 'rock',
  'cornerstone', 'foundation', 'head', 'alpha', 'omega', 'beginning', 'end', 'first', 'last',

  // Objects and Items
  'ark', 'covenant', 'altar', 'incense', 'lampstand', 'showbread', 'veil', 'curtain',
  'cherubim', 'mercy', 'seat', 'bronze', 'serpent', 'staff', 'rod', 'manna', 'quail',
  'water', 'rock', 'tablets', 'stone', 'commandments', 'ephod', 'breastplate', 'urim',
  'thummim', 'crown', 'scepter', 'throne', 'scroll', 'parchment', 'papyrus', 'ink', 'pen',
  'seal', 'signet', 'ring', 'gold', 'silver', 'bronze', 'iron', 'precious', 'stones',
  'pearls', 'frankincense', 'myrrh', 'spices', 'ointment', 'oil', 'wine', 'bread', 'fish',
  'lamb', 'dove', 'eagle', 'lion', 'ox', 'calf', 'sheep', 'goat', 'donkey', 'camel',
  'horse', 'chariot', 'wagon', 'ship', 'boat', 'net', 'anchor',

  // Actions and Verbs
  'believe', 'faith', 'trust', 'hope', 'love', 'pray', 'worship', 'praise', 'sing', 'rejoice',
  'bless', 'curse', 'heal', 'restore', 'deliver', 'save', 'redeem', 'forgive', 'repent',
  'confess', 'baptize', 'anoint', 'consecrate', 'sanctify', 'purify', 'cleanse', 'wash',
  'sacrifice', 'offer', 'give', 'tithe', 'serve', 'minister', 'teach', 'preach', 'proclaim',
  'testify', 'witness', 'evangelize', 'disciple', 'follow', 'obey', 'submit', 'surrender',
  'seek', 'find', 'ask', 'knock', 'enter', 'abide', 'remain', 'dwell', 'walk', 'run',
  'fight', 'war', 'battle', 'victory', 'triumph', 'overcome', 'conquer', 'defeat',

  // Adjectives and Descriptive Terms
  'holy', 'righteous', 'just', 'merciful', 'gracious', 'loving', 'kind', 'good', 'perfect',
  'pure', 'clean', 'spotless', 'blameless', 'innocent', 'faithful', 'true', 'honest',
  'wise', 'understanding', 'knowledgeable', 'discerning', 'humble', 'meek', 'gentle',
  'patient', 'longsuffering', 'peaceful', 'joyful', 'blessed', 'happy', 'content',
  'thankful', 'grateful', 'obedient', 'submissive', 'reverent', 'fearful', 'awesome',
  'glorious', 'majestic', 'powerful', 'mighty', 'strong', 'victorious', 'triumphant',
  'eternal', 'everlasting', 'immortal', 'incorruptible', 'imperishable', 'unchanging',
  'immutable', 'infinite', 'unlimited', 'boundless', 'measureless',

  // Numbers and Time
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven',
  'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen',
  'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety',
  'hundred', 'thousand', 'million', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth',
  'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'day', 'week', 'month',
  'year', 'generation', 'age', 'era', 'time', 'season', 'hour', 'moment', 'morning',
  'evening', 'night', 'midnight', 'noon', 'dawn', 'dusk', 'sunset', 'sunrise',

  // Common Christian phrases and expressions
  'amen', 'hallelujah', 'hosanna', 'glory', 'honor', 'majesty', 'power', 'dominion',
  'forever', 'evermore', 'selah', 'blessed', 'curse', 'woe', 'behold', 'lo', 'verily',
  'truly', 'surely', 'indeed', 'therefore', 'wherefore', 'thus', 'saith', 'said', 'spoke',
  'declared', 'proclaimed', 'commanded', 'ordained', 'established', 'founded', 'created',
  'formed', 'made', 'fashioned', 'wrought', 'worked', 'performed', 'accomplished',
  'fulfilled', 'completed', 'finished'
];