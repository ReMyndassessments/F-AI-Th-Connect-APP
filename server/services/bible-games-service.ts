import type { BibleGame, GameScore, UserGameStats, InsertBibleGame, InsertGameScore } from '@shared/bible-games-schema';

// Comprehensive Bible Games Database - Significantly Expanded for Variety
export const sampleBibleGames: InsertBibleGame[] = [
  
  // === EASY LEVEL QUESTIONS ===
  
  // Easy Scripture Scrambles
  {
    type: 'scramble',
    title: 'Unscramble this Bible Verse',
    question: 'Unscramble these words to reveal John 3:16: "God so For world loved the gave he his one and only Son"',
    correctAnswer: 'For God so loved the world that he gave his one and only Son',
    hints: JSON.stringify([
      'This is one of the most famous verses in the Bible',
      'It talks about God\'s love for humanity',
      'It mentions God\'s Son'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'John 3:16',
    points: 15
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: SESMO',
    correctAnswer: 'Moses',
    hints: JSON.stringify([
      'This person led the Israelites out of Egypt',
      'He received the Ten Commandments',
      'He parted the Red Sea'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: VADDI',
    correctAnswer: 'David',
    hints: JSON.stringify([
      'I killed Goliath with a sling',
      'I was a shepherd boy who became king',
      'I wrote many psalms'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: RAHAM',
    correctAnswer: 'Abraham',
    hints: JSON.stringify([
      'God called me to leave my homeland',
      'I am the father of many nations',
      'God promised to make my descendants as numerous as the stars'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: HOAN',
    correctAnswer: 'Noah',
    hints: JSON.stringify([
      'I built an ark',
      'I saved animals from the flood',
      'God made a covenant with me using a rainbow'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: SAACI',
    correctAnswer: 'Isaac',
    hints: JSON.stringify([
      'I was Abraham\'s son',
      'I was almost sacrificed by my father',
      'God provided a ram in my place'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: BOCAJ',
    correctAnswer: 'Jacob',
    hints: JSON.stringify([
      'I wrestled with an angel',
      'My name was changed to Israel',
      'I had twelve sons'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  
  // Easy Fill in the Blanks - Characters
  {
    type: 'fill_blank',
    title: 'Bible Character',
    question: 'Who was swallowed by a great fish?',
    correctAnswer: 'Jonah',
    hints: JSON.stringify([
      'He was a prophet',
      'He tried to run from God',
      'He preached to Nineveh'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Character',
    question: 'Who built the ark?',
    correctAnswer: 'Noah',
    hints: JSON.stringify([
      'God told him to save the animals',
      'It rained for 40 days and nights',
      'He sent out a dove'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Character',
    question: 'Who was the strongest man in the Bible?',
    correctAnswer: 'Samson',
    hints: JSON.stringify([
      'His strength was in his hair',
      'He was betrayed by Delilah',
      'He pushed down temple pillars'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  
  // Easy Fill in the Blanks - Verses
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Complete this famous verse: "I can do all things through _____ who strengthens me."',
    correctAnswer: 'Christ',
    hints: JSON.stringify([
      'This verse is from Philippians 4:13',
      'It refers to Jesus',
      'Another name for the Messiah'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'Philippians 4:13',
    points: 12
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "The LORD is my _____, I shall not want."',
    correctAnswer: 'shepherd',
    hints: JSON.stringify([
      'This is from Psalm 23',
      'It\'s someone who takes care of sheep',
      'Jesus called himself the good _____'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'Psalm 23:1',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "In the beginning was the _____, and the _____ was with God."',
    correctAnswer: 'Word',
    hints: JSON.stringify([
      'This is from John 1:1',
      'It refers to Jesus',
      'Another term for Scripture or message'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'John 1:1',
    points: 12
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "Jesus said, I am the way, the truth, and the _____."',
    correctAnswer: 'life',
    hints: JSON.stringify([
      'This is from John 14:6',
      'It\'s what we have when we\'re living',
      'Opposite of death'
    ]),
    difficulty: 'easy',
    category: 'verses',
    scripture: 'John 14:6',
    points: 12
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "Be not afraid, for I am with _____."',
    correctAnswer: 'you',
    hints: JSON.stringify([
      'God is speaking to us',
      'It\'s a personal pronoun',
      'God promises His presence'
    ]),
    difficulty: 'easy',
    category: 'verses',
    points: 10
  },
  
  // Easy Places
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'In which city was Jesus born?',
    correctAnswer: 'Bethlehem',
    hints: JSON.stringify([
      'It\'s in Judea',
      'It\'s also called the City of David',
      'It starts with the letter B'
    ]),
    difficulty: 'easy',
    category: 'places',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'What sea did Moses part for the Israelites to cross?',
    correctAnswer: 'Red Sea',
    hints: JSON.stringify([
      'It\'s between Egypt and the Sinai Peninsula',
      'Its name describes its color',
      'The Israelites walked through on dry ground'
    ]),
    difficulty: 'easy',
    category: 'places',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'What was the name of the garden where Adam and Eve lived?',
    correctAnswer: 'Eden',
    hints: JSON.stringify([
      'It means pleasure or delight',
      'It had the Tree of Life',
      'A river flowed out of it'
    ]),
    difficulty: 'easy',
    category: 'places',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'Where was Jesus baptized?',
    correctAnswer: 'Jordan River',
    hints: JSON.stringify([
      'John the Baptist baptized people here',
      'It flows through the Holy Land',
      'Jesus came up out of the water here'
    ]),
    difficulty: 'easy',
    category: 'places',
    points: 10
  },
  
  // Easy Books
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'What is the first book of the Bible?',
    correctAnswer: 'Genesis',
    hints: JSON.stringify([
      'It means "beginning"',
      'It tells the story of creation',
      'It starts with "In the beginning"'
    ]),
    difficulty: 'easy',
    category: 'books',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'What is the last book of the Bible?',
    correctAnswer: 'Revelation',
    hints: JSON.stringify([
      'It means "unveiling" or "disclosure"',
      'It was written by John',
      'It describes the end times'
    ]),
    difficulty: 'easy',
    category: 'books',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which book contains the Ten Commandments?',
    correctAnswer: 'Exodus',
    hints: JSON.stringify([
      'It tells about leaving Egypt',
      'It means "going out" or "departure"',
      'Moses is the main character'
    ]),
    difficulty: 'easy',
    category: 'books',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which book tells about Jesus\' birth?',
    correctAnswer: 'Matthew',
    hints: JSON.stringify([
      'It\'s one of the four Gospels',
      'It traces Jesus\' genealogy',
      'It\'s the first book of the New Testament'
    ]),
    difficulty: 'easy',
    category: 'books',
    points: 10
  },

  // Easy Character Guessing
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the first woman created by God.',
    correctAnswer: 'Eve',
    hints: JSON.stringify([
      'I lived in the Garden of Eden',
      'I was made from Adam\'s rib',
      'I was tempted by the serpent'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was born in a manger and grew up to save the world.',
    correctAnswer: 'Jesus',
    hints: JSON.stringify([
      'I am the Son of God',
      'I died on the cross for sins',
      'I rose from the dead'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was chosen to be the mother of Jesus.',
    correctAnswer: 'Mary',
    hints: JSON.stringify([
      'An angel appeared to me',
      'I was a virgin when I conceived',
      'I said "Let it be unto me according to your word"'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a shepherd boy who became king of Israel.',
    correctAnswer: 'David',
    hints: JSON.stringify([
      'I killed Goliath with a sling',
      'I wrote many psalms',
      'I was called a man after God\'s own heart'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },

  // === MEDIUM LEVEL QUESTIONS ===
  
  // Medium Scripture Scrambles
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: HEPSOJ',
    correctAnswer: 'Joseph',
    hints: JSON.stringify([
      'I had a coat of many colors',
      'I was sold into slavery by my brothers',
      'I became second in command in Egypt'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: HAIMEJ',
    correctAnswer: 'Jeremiah',
    hints: JSON.stringify([
      'I was known as the weeping prophet',
      'I prophesied about the fall of Jerusalem',
      'I wrote the book of Lamentations'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 20
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: LEIZEKE',
    correctAnswer: 'Ezekiel',
    hints: JSON.stringify([
      'I was a prophet during the Babylonian exile',
      'I had visions of wheels within wheels',
      'I prophesied about dry bones coming to life'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 20
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: HTUT',
    correctAnswer: 'Ruth',
    hints: JSON.stringify([
      'I was from Moab',
      'I said "Your people shall be my people"',
      'I married Boaz'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Place',
    question: 'Unscramble this place: RUSICAMAD',
    correctAnswer: 'Damascus',
    hints: JSON.stringify([
      'Paul was on the road to this city when he met Jesus',
      'It\'s in modern-day Syria',
      'Paul was blinded by a great light here'
    ]),
    difficulty: 'medium',
    category: 'places',
    points: 20
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Place',
    question: 'Unscramble this place: HTNIMSAGEEE',
    correctAnswer: 'Gethsemane',
    hints: JSON.stringify([
      'Jesus prayed here before his crucifixion',
      'It means "oil press"',
      'Jesus was arrested here'
    ]),
    difficulty: 'medium',
    category: 'places',
    points: 20
  },

  // Medium Character Guessing
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was swallowed by a great fish for three days after trying to run away from God\'s command to preach to Nineveh.',
    correctAnswer: 'Jonah',
    hints: JSON.stringify([
      'I was a prophet',
      'I tried to sail to Tarshish instead',
      'My name starts with J'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 15
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the strongest man in the Bible, but my strength came from my hair. I was betrayed by Delilah.',
    correctAnswer: 'Samson',
    hints: JSON.stringify([
      'I was a judge of Israel',
      'I killed a lion with my bare hands',
      'I pushed down the pillars of a temple'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was sold into slavery by my brothers but became second in command in Egypt.',
    correctAnswer: 'Joseph',
    hints: JSON.stringify([
      'I interpreted dreams',
      'I had a coat of many colors',
      'I saved Egypt from famine'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a tax collector who climbed a tree to see Jesus.',
    correctAnswer: 'Zacchaeus',
    hints: JSON.stringify([
      'I was short in stature',
      'I climbed a sycamore tree',
      'Jesus invited himself to my house'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I denied Jesus three times before the rooster crowed.',
    correctAnswer: 'Peter',
    hints: JSON.stringify([
      'I was one of the twelve disciples',
      'I walked on water',
      'Jesus gave me the keys to the kingdom'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a queen who risked my life to save my people from destruction.',
    correctAnswer: 'Esther',
    hints: JSON.stringify([
      'I was married to King Ahasuerus',
      'My cousin Mordecai raised me',
      'I said "If I perish, I perish"'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 20
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a tentmaker who became an apostle after persecuting Christians.',
    correctAnswer: 'Paul',
    hints: JSON.stringify([
      'My original name was Saul',
      'I was from Tarsus',
      'I was blinded on the road to Damascus'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was called by God to lead the Israelites out of Egypt.',
    correctAnswer: 'Moses',
    hints: JSON.stringify([
      'I saw a burning bush',
      'I parted the Red Sea',
      'I received the Ten Commandments'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 15
  },

  // Medium Fill in the Blanks
  {
    type: 'fill_blank',
    title: 'Complete the Memory Verse',
    question: 'Finish this verse: "Trust in the LORD with all your heart and lean not on your own ___..."',
    correctAnswer: 'understanding',
    hints: JSON.stringify([
      'This verse is from Proverbs 3:5',
      'It\'s the opposite of trusting yourself',
      'Synonym for knowledge or wisdom'
    ]),
    difficulty: 'medium',
    category: 'verses',
    scripture: 'Proverbs 3:5',
    points: 16
  },
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "Be strong and _____, do not be afraid or terrified."',
    correctAnswer: 'courageous',
    hints: JSON.stringify([
      'This was said to Joshua',
      'It means brave or bold',
      'Opposite of cowardly'
    ]),
    difficulty: 'medium',
    category: 'verses',
    scripture: 'Joshua 1:9',
    points: 16
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'How many days and nights did it rain during Noah\'s flood?',
    correctAnswer: '40',
    hints: JSON.stringify([
      'It\'s the same number of days Jesus fasted',
      'It\'s the same number of years the Israelites wandered',
      'It\'s between 30 and 50'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 15
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'How many loaves and fishes did Jesus use to feed the 5000?',
    correctAnswer: '5 loaves and 2 fish',
    hints: JSON.stringify([
      'The loaves were barley bread',
      'A boy provided them',
      'There were 12 baskets of leftovers'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 18
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'How many days was Lazarus dead before Jesus raised him?',
    correctAnswer: '4',
    hints: JSON.stringify([
      'He was already buried',
      'Martha said he would smell',
      'Jesus wept before raising him'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 18
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which book tells the story of the early Christian church?',
    correctAnswer: 'Acts',
    hints: JSON.stringify([
      'It was written by Luke',
      'It follows the four Gospels',
      'It describes the coming of the Holy Spirit'
    ]),
    difficulty: 'medium',
    category: 'books',
    points: 15
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which Old Testament book is entirely about wisdom and poetry?',
    correctAnswer: 'Proverbs',
    hints: JSON.stringify([
      'Much of it was written by Solomon',
      'It contains practical life advice',
      'It has 31 chapters'
    ]),
    difficulty: 'medium',
    category: 'books',
    points: 15
  },

  // === HARD LEVEL QUESTIONS ===
  
  // Hard Character Guessing
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a prophetess and judge who led Israel to victory against Sisera.',
    correctAnswer: 'Deborah',
    hints: JSON.stringify([
      'I sat under a palm tree',
      'Barak would not go to battle without me',
      'I was one of the few female judges'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the high priest who served in the temple when young Samuel heard God\'s voice.',
    correctAnswer: 'Eli',
    hints: JSON.stringify([
      'My sons Hophni and Phinehas were wicked',
      'I trained Samuel',
      'I fell backward and broke my neck when I heard the ark was captured'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a Gentile woman who showed kindness to Naomi and said "Your people shall be my people."',
    correctAnswer: 'Ruth',
    hints: JSON.stringify([
      'I was from Moab',
      'I gleaned in Boaz\'s field',
      'I became an ancestor of Jesus'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 25
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was struck dead for lying about the price of land I sold.',
    correctAnswer: 'Ananias',
    hints: JSON.stringify([
      'My wife Sapphira also died',
      'I kept back part of the proceeds',
      'Peter confronted me about lying to the Holy Spirit'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was a young man who fell asleep during Paul\'s sermon and fell from a window.',
    correctAnswer: 'Eutychus',
    hints: JSON.stringify([
      'I was in Troas',
      'I fell from the third story',
      'Paul brought me back to life'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the cupbearer to the king who rebuilt the walls of Jerusalem.',
    correctAnswer: 'Nehemiah',
    hints: JSON.stringify([
      'I served King Artaxerxes',
      'I led the rebuilding in 52 days',
      'I was both a leader and a governor'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },

  // Hard Fill in the Blanks
  {
    type: 'fill_blank',
    title: 'Complete the Verse',
    question: 'Fill in the blank: "The _____ of the LORD is the beginning of wisdom."',
    correctAnswer: 'fear',
    hints: JSON.stringify([
      'This is from Proverbs',
      'It means reverence or awe',
      'Not the same as being afraid'
    ]),
    difficulty: 'hard',
    category: 'verses',
    scripture: 'Proverbs 9:10',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which book comes immediately after 2 Chronicles in the Bible?',
    correctAnswer: 'Ezra',
    hints: JSON.stringify([
      'It\'s about the return from exile',
      'The main character was a scribe',
      'It deals with rebuilding the temple'
    ]),
    difficulty: 'hard',
    category: 'books',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'On which mountain did Moses receive the Ten Commandments?',
    correctAnswer: 'Mount Sinai',
    hints: JSON.stringify([
      'It\'s also called Mount Horeb',
      'It\'s in the Sinai Peninsula',
      'God appeared in fire and smoke here'
    ]),
    difficulty: 'hard',
    category: 'places',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'In which city did Paul preach on Mars Hill?',
    correctAnswer: 'Athens',
    hints: JSON.stringify([
      'It\'s in Greece',
      'It was known for philosophy',
      'Paul spoke about the "unknown god"'
    ]),
    difficulty: 'hard',
    category: 'places',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'How many years did the Israelites wander in the wilderness?',
    correctAnswer: '40',
    hints: JSON.stringify([
      'It was because of their disobedience',
      'An entire generation died in the wilderness',
      'It\'s the same number of days it rained during the flood'
    ]),
    difficulty: 'hard',
    category: 'events',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'What happened to Jesus\' clothes when he was crucified?',
    correctAnswer: 'soldiers cast lots for them',
    hints: JSON.stringify([
      'The soldiers divided them',
      'They gambled for his seamless robe',
      'This fulfilled a prophecy'
    ]),
    difficulty: 'hard',
    category: 'events',
    points: 20
  },

  // Hard Scripture Scrambles
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: MALEELCHIZED',
    correctAnswer: 'Melchizedek',
    hints: JSON.stringify([
      'I was king of Salem',
      'I was a priest of the Most High God',
      'Abraham gave me a tenth of everything'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: CHAINEBEZUZDR',
    correctAnswer: 'Nebuchadnezzar',
    hints: JSON.stringify([
      'I was a Babylonian king',
      'I conquered Jerusalem',
      'I had dreams that Daniel interpreted'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'scramble',
    title: 'Unscramble Bible Character',
    question: 'Unscramble this name: HACIRAZE',
    correctAnswer: 'Zechariah',
    hints: JSON.stringify([
      'I was a prophet',
      'I had visions of horsemen and lampstands',
      'I prophesied about the Messiah'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 25
  },

  // Additional Questions for More Variety
  
  // More Easy Questions
  {
    type: 'fill_blank',
    title: 'Bible Character',
    question: 'Who betrayed Jesus for 30 pieces of silver?',
    correctAnswer: 'Judas',
    hints: JSON.stringify([
      'He was one of the twelve disciples',
      'He kissed Jesus to identify him',
      'He later hanged himself'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'On which day did God rest after creation?',
    correctAnswer: 'seventh',
    hints: JSON.stringify([
      'It became the Sabbath',
      'God had finished all His work',
      'It comes after the sixth day'
    ]),
    difficulty: 'easy',
    category: 'events',
    points: 10
  },
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the first man created by God.',
    correctAnswer: 'Adam',
    hints: JSON.stringify([
      'I lived in the Garden of Eden',
      'I was made from the dust of the earth',
      'I named all the animals'
    ]),
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    type: 'fill_blank',
    title: 'Bible Books',
    question: 'Which book contains the story of David and Goliath?',
    correctAnswer: '1 Samuel',
    hints: JSON.stringify([
      'It\'s in the Old Testament',
      'It tells about the kings of Israel',
      'Samuel anointed David as king'
    ]),
    difficulty: 'medium',
    category: 'books',
    points: 15
  },
  
  // More Medium Questions
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was thrown into a den of lions but God protected me.',
    correctAnswer: 'Daniel',
    hints: JSON.stringify([
      'I interpreted dreams',
      'I was taken to Babylon',
      'I refused to eat the king\'s food'
    ]),
    difficulty: 'medium',
    category: 'characters',
    points: 18
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'How many plagues did God send on Egypt?',
    correctAnswer: '10',
    hints: JSON.stringify([
      'They included frogs, locusts, and darkness',
      'The last one killed the firstborn',
      'It\'s the number of fingers on your hands'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 18
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'Where did Jesus grow up?',
    correctAnswer: 'Nazareth',
    hints: JSON.stringify([
      'It\'s in Galilee',
      'Jesus was called a Nazarene',
      'Mary and Joseph lived here'
    ]),
    difficulty: 'medium',
    category: 'places',
    points: 15
  },
  
  // More Hard Questions
  {
    type: 'character_guess',
    title: 'Guess the Bible Character',
    question: 'Who am I? I was the wife of David who prevented him from killing my foolish husband.',
    correctAnswer: 'Abigail',
    hints: JSON.stringify([
      'My first husband was Nabal',
      'I brought David food and supplies',
      'I became David\'s wife after Nabal died'
    ]),
    difficulty: 'hard',
    category: 'characters',
    points: 30
  },
  {
    type: 'fill_blank',
    title: 'Bible Geography',
    question: 'In which region was Jesus tempted by Satan for 40 days?',
    correctAnswer: 'wilderness',
    hints: JSON.stringify([
      'It was a desert area',
      'Jesus fasted during this time',
      'Wild animals were there'
    ]),
    difficulty: 'hard',
    category: 'places',
    points: 25
  },
  {
    type: 'fill_blank',
    title: 'Bible Events',
    question: 'What sign did God give Noah that He would never flood the earth again?',
    correctAnswer: 'rainbow',
    hints: JSON.stringify([
      'It appears in the sky after rain',
      'It has many colors',
      'It was God\'s covenant sign'
    ]),
    difficulty: 'medium',
    category: 'events',
    points: 15
  }
];

// Storage for user statistics and game scores
export class BibleGamesService {
  private gameScores: Map<string, GameScore[]> = new Map();
  private userStats: Map<string, UserGameStats> = new Map();

  async getAllGames(): Promise<BibleGame[]> {
    return sampleBibleGames.map((game, index) => ({
      id: index + 1,
      ...game
    })) as BibleGame[];
  }

  async getGameById(id: number): Promise<BibleGame | undefined> {
    const game = sampleBibleGames[id - 1];
    if (!game) return undefined;
    
    return {
      id,
      ...game
    } as BibleGame;
  }

  async getFilteredGames(category?: string, difficulty?: string, limit: number = 10): Promise<BibleGame[]> {
    let filteredGames = sampleBibleGames.map((game, index) => ({
      id: index + 1,
      ...game
    })) as BibleGame[];

    if (category && category !== 'all') {
      filteredGames = filteredGames.filter(game => game.category === category);
    }

    if (difficulty && difficulty !== 'all') {
      filteredGames = filteredGames.filter(game => game.difficulty === difficulty);
    }

    // Shuffle and return limited results
    const shuffled = filteredGames.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  }

  async addScore(userId: string, score: InsertGameScore): Promise<GameScore> {
    const userScores = this.gameScores.get(userId) || [];
    const newScore: GameScore = {
      id: userScores.length + 1,
      userId,
      ...score,
      submittedAt: new Date()
    };

    userScores.push(newScore);
    this.gameScores.set(userId, userScores);

    // Update user statistics
    await this.updateUserStats(userId, newScore);

    return newScore;
  }

  async getUserStats(userId: string): Promise<UserGameStats | undefined> {
    return this.userStats.get(userId);
  }

  private async updateUserStats(userId: string, newScore: GameScore): Promise<void> {
    let stats = this.userStats.get(userId) || {
      userId,
      totalGamesPlayed: 0,
      totalScore: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastPlayedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    stats.totalGamesPlayed += 1;
    stats.totalScore += newScore.score;
    stats.averageScore = Math.round(stats.totalScore / stats.totalGamesPlayed);
    stats.bestScore = Math.max(stats.bestScore, newScore.score);
    stats.lastPlayedAt = new Date();

    // Update streaks
    const userScores = this.gameScores.get(userId) || [];
    let currentStreak = 0;
    let bestStreak = 0;
    
    // Calculate streaks based on recent scores
    for (let i = userScores.length - 1; i >= 0; i--) {
      if (userScores[i].score > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Find best streak
    let tempStreak = 0;
    for (const score of userScores) {
      if (score.score > 0) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    stats.currentStreak = currentStreak;
    stats.bestStreak = Math.max(stats.bestStreak || 0, bestStreak);
    stats.updatedAt = new Date();
    
    this.userStats.set(userId, stats);
  }
}

export const bibleGamesService = new BibleGamesService();