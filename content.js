/* =====================================================================
   CONTENT — this is the only file you edit to change what the site says.
   Add a piece of wisdom or a story: copy one block in WISDOM, change the words.
   Items marked SAMPLE are placeholders written for the prototype.
   ===================================================================== */

/* Paste your ElevenLabs agent id here when you have it (looks like agent_xxxx).
   Leave blank and a placeholder chat button shows instead. */
const CHAT_AGENT_ID = "agent_3201m5zb7rxgfp5aanqkqvxmj2jc";

/* ---- A thought for today: changes daily. Lines are taken from your own pieces; "from" links to the piece. ---- */
const THOUGHTS = [
  { text:"Life, even with all its twists and turns, is designed to be a journey of joy and fulfilment.", from:"choose-some-positive-thoughts" },
  { text:"Peace isn’t the absence of thoughts. It’s learning to let them come and go, like the rain outside that comes and goes without troubling the earth too much.", from:"eleanors-peace-of-mind" },
  { text:"You had the wisdom within you all along. You just needed a little reminder.", from:"a-lesson-in-joy" },
  { text:"The world is full of magic. You just have to look for it.", from:"the-magic-in-everything" },
  { text:"Enjoying how it feels today brings it closer to reality tomorrow.", from:"enjoy-your-dreams-now" },
  { text:"You are always just a few thoughts away from feeling better, by intentionally focusing on joy, appreciation, and love.", from:"who-am-i" },
  { text:"Hope is like the sun, which is always shining above us, even on the cloudiest day.", from:"a-lantern-of-hope" },
  { text:"It’s the simple things that hold the deepest value.", from:"most-important-things" }
];

/* ---- New on the shelf: ONE item, change it whenever there's something new ---- */
const NEW_ON_SHELF = {
  icon: "🎧",
  title: "The Wisdom of Aloharin audiobook",
  text: "Listen to a few quiet minutes, narrated by Miss Sophia.",
  url: "storytime.html#the-wisdom-of-aloharin"
};

/* ---- A little gift from Miss Sophia: ONE item at a time ---- */
const GIFT = {
  title: "A little gift from Miss Sophia",
  text: "Something to try on a quiet evening — a small app made in the same spirit as the books.",
  linkText: "Have a look",
  url: "https://appmi.paulisherwood.com"
};

/* ---- Stories & Wisdom library ----
   kind: "Stories" | "Wisdom"
   image: the picture for the piece (file in the pieces folder); look: a bookshop picture to borrow if there is none
   related: other pieces to suggest at the bottom ("You might also like"); body: the paragraphs ("## " at the start makes a question heading)
   FREE OR PAID: any piece or Story time item with audio is FREE unless you add  access:"paid", price:499 (pence), priceText:"£4.99", productId:"some-id".
   A paid item is then sold on its own page (/audiobook/<slug>) and its recording is kept private (see PAID AUDIO at the bottom of this file). ---- */
const WISDOM = [
  { slug:"a-lesson-in-joy",
    kind:"Stories",
    look:"bookshop",
    cover:"covers/a-lesson-in-joy.jpg",
    title:"A Lesson in Joy",
    summary:"A tired maths teacher stops by Miss Sophia’s bookshop and leaves with a different way of seeing his lessons — and his life.",
    related:["a-gateway-to-well-being"],
    body:[
    "It was late afternoon when a young teacher from the nearby high school, Mr Harris, shuffled into Miss Sophia’s Bookshop. He had passed by the shop many times but had never ventured inside. Today, though, something drew him in. Perhaps it was the warmth radiating from the windows or the golden light that filtered through the shop’s old glass panes. He needed a reprieve, and the bookshop felt like a quiet sanctuary.",
    "Miss Sophia, who was tidying a small display of books near the door, looked up and smiled warmly. “Ah, welcome,” she said, in her usual soothing tone. “Please, come in.”",
    "Mr Harris gave her a weak smile in return. His shoulders were hunched, his tie slightly loosened, and the weariness in his eyes betrayed the long day he’d had. He nodded but didn’t say much as he walked slowly, taking in the cosy atmosphere of the shop. Wooden shelves lined with books, an old cash register on a counter, and the scent of tea and coffee lingering in the air—it felt like stepping into another world.",
    "Miss Sophia, with her gentle wisdom, sensed his troubled mood at once. She gestured to a comfortable chair by the window and said, “Why don’t you sit down? I’ll bring you a nice cup of tea.”",
    "Grateful, Mr Harris took the seat. He let out a deep sigh, feeling some of the tension melt away as he sank into the soft cushions. He hadn’t realised how much he needed this quiet space. Before long, Miss Sophia returned with a cup of tea, setting it before him with a kind smile.",
    "“How’s your day been, dear?” she asked.",
    "Mr Harris hesitated, but there was something about the atmosphere—maybe it was the kindness in Miss Sophia’s eyes or the warmth of the tea in his hands—that made him open up. “It’s been hard,” he admitted, his voice low. “I teach mathematics at the high school down the road. But the students… they just don’t want to be there. It feels like I’m pushing against a wall every day, trying to teach them something they don’t care about.”",
    "Miss Sophia nodded, her expression one of deep understanding. “Oh, my dear, that does sound difficult. But tell me, have you ever considered what it might be like for the students?”",
    "Mr Harris looked puzzled. “For the students?”",
    "Miss Sophia smiled softly. “Yes, for the students. Young people, full of energy, being asked to sit still in lesson after lesson, day after day. Just like you, they must feel it’s all a bit much sometimes.”",
    "He paused, reflecting. He had never really thought of it like that. He’d been so focused on his own frustrations and how he could best teach mathematics, he hadn’t considered how the students might be feeling.",
    "Miss Sophia continued, her voice calm and wise. “What if you made your goal not just to teach them mathematics, but to enjoy the time you spend with them? And in doing so, what if you made it your goal to help them enjoy the lesson too?”",
    "Mr Harris blinked. “To enjoy it?” He hadn’t considered that. His mind had been so occupied with delivering the curriculum, hitting the targets, and maintaining discipline that the idea of enjoyment had hardly crossed his mind.",
    "Miss Sophia nodded. “Yes. You see, teaching doesn’t have to be a battle, dear. When you enjoy what you’re doing, your students will feel that. Joy is contagious, you know. And we all want to feel good—your students, yourself, everyone. We all share that, and we all have the power to create it.”",
    "He sat back, sipping his tea thoughtfully. The warmth of the drink spread through him, and he began to see things in a new light. “You’re saying if I focus on enjoying the lessons, the students might feel that too?”",
    "“Exactly, my dear,” Miss Sophia said with a twinkle in her eye. “You’re not just teaching them mathematics; you’re sharing an experience with them. And when you make your happiness a priority, it flows naturally into their experience as well. You have the power to make the classroom a more joyful place, for you and for them.”",
    "Mr Harris felt a weight lifting from his shoulders. He had been trying so hard to control everything, to push through resistance, but now he saw a different path. “I never thought of it that way,” he said quietly. “I’ve been so focused on making them learn that I forgot we all want the same thing—to feel good, to enjoy life.”",
    "Miss Sophia smiled warmly. “Yes, dear. Life is meant to be enjoyed, not just endured. When you bring joy into what you do, it changes everything—your teaching, your students, and even your own life.”",
    "He nodded, feeling a new sense of clarity wash over him. “I can do that,” he said, more to himself than to her. “I can make my lessons more enjoyable… for me and for them.”",
    "Miss Sophia took a seat next to him, her eyes filled with warmth. “And don’t forget to take that lesson into your own life too, dear. Joy isn’t just for your students. It’s for you as well. Make joy your goal, not just in the classroom, but in everything you do.”",
    "Mr Harris finished his tea, feeling lighter than he had in weeks. As he stood up to leave, he smiled at Miss Sophia. “Thank you,” he said, his voice filled with gratitude. “I think you’ve just changed my perspective on everything.”",
    "Miss Sophia waved him off with a soft smile. “You had the wisdom within you all along, dear. You just needed a little reminder.”",
    "As Mr Harris stepped out of the bookshop, the air felt fresher, the sky a little brighter. He set off on his walk home, a new determination in his heart. He was ready to bring joy back into his teaching, and into his life.",
    "Miss Sophia watched him go, her heart full of warmth.",
    "Oh, how lovely it is when someone like that dear teacher discovers that life doesn’t have to be so difficult, and that joy is there, ready to be embraced by us all. What a change it will bring to his students, and to himself!"
] },
  { slug:"the-magic-in-everything",
    kind:"Stories",
    image:"pieces/the-magic-in-everything.webp",
    focus:"center 38%",
    thumb:"pieces/the-magic-in-everything-thumb.webp",
    audio:"audio/the-magic-in-everything.mp3",
    duration:306,
    marks:[0.0, 16.2, 25.1, 40.9, 55.6, 65.8, 83.7, 99.9, 107.7, 116.6, 130.0, 135.5, 149.8, 171.4, 181.3, 198.3, 213.0, 225.9, 246.5, 264.9, 273.8, 282.7, 293.6],
    theme:{accent:"lavender"},
    title:"The Magic in Everything",
    summary:"Three friends in Miss Sophia’s bookshop wonder whether magic is real, until a snowy evening shows them.",
    related:["a-walk-in-nature"],
    body:[
    "“I just don’t get it,” Alice said, staring at the worn leather cover of the book in front of her. Her voice was tinged with frustration, the kind that came when a question seemed just out of reach. “If magic isn’t real, why does it feel like it should be? Why do stories about it make me feel… something?”",
    "Jamie adjusted his glasses and frowned, his expression caught somewhere between curiosity and doubt. “Maybe it’s because we want it to be real,” he said. “People like the idea of magic because it explains things we can’t.”",
    "Max, sitting back with his chair tilted precariously on two legs, smirked. “Or maybe it’s just because people like pretending. Tricks, illusions, make-believe—it’s fun, but it’s not real.”",
    "The three of them were gathered at their usual spot in Miss Sophia’s bookshop, a snug table near the fire. Outside, the evening was settling in.",
    "Alice crossed her arms and shook her head. “But it feels real, sometimes. Like, when you see something so beautiful it stops you in your tracks. Or when something happens that feels… too perfect to be just luck. Doesn’t that feel like magic?”",
    "Jamie looked thoughtful but didn’t answer. Max just shrugged.",
    "The door to the shop creaked open, and Miss Sophia appeared, her apron dusted with what might have been flour or glitter—it was hard to tell in the flickering firelight. She carried a tray of steaming hot chocolates, each topped with a generous swirl of cream and a sprinkle of cinnamon.",
    "“Magic, is it?” she said with a knowing smile, setting the tray down on the table. “Now that’s a conversation worth having.”",
    "Alice’s face lit up. “Miss Sophia, do you think magic is real?”",
    "Miss Sophia paused, her wise eyes sparkling as if she held a secret the world had forgotten. She sat down with a mug of her own, cupping it in her hands as if it were a treasure.",
    "“Real?” she repeated softly. “Well, that depends on how you see it. Most people look too quickly to notice, but magic is all around us. You just have to learn how to see it.”",
    "Jamie tilted his head, intrigued despite himself. “How do you see something that isn’t there?”",
    "Miss Sophia’s lips curved into a mysterious smile. “Oh, it’s there, my dear. In the way snowflakes dance in the lamplight. In the way a story feels like it was written just for you. In the moments that take your breath away. And when these things come to you at just the right time… just for you. That’s magic.”",
    "Alice leaned forward, her frustration melting into wonder. “Do you really think so?”",
    "Miss Sophia gave her a little wink and stood, taking her mug with her. “You wait and see,” she said, disappearing into the rows of bookshelves.",
    "The children sat in thoughtful silence, the fire crackling beside them. None of them spoke as they finished their cocoa, but something had shifted—a spark of curiosity, a glimmer of belief.",
    "When they finally stepped outside, it was as if they had entered a different world. Snowflakes drifted gently from the heavens, dusting the cobbled streets in a soft, shimmering white. The old streetlamp outside Miss Sophia’s shop cast a warm golden glow, its halo catching the snow in a mesmerising dance. Above, the first twinkling stars began to emerge, scattered across a breathtaking canvas of indigo and violet, completing the magical transformation.",
    "“Wow,” Alice whispered, her breath puffing in the cold air. “It’s so… beautiful.”",
    "Jamie nodded, his glasses fogging slightly as he looked up at the sky. “I didn’t even notice before, but… it kind of does feel like magic.”",
    "Max, for once, didn’t have a clever remark. He simply stared at the glowing scene around them, his expression softening.",
    "In that moment, they saw it—truly saw it. The magic Miss Sophia had spoken of wasn’t a trick or an illusion. It was in the way the snow seemed to sparkle just for them, in the warmth of their friendship on a cold night, in the quiet wonder of the world transformed.",
    "And as they walked home, the thought stayed with them, a tiny ember of wonder they would carry forever:",
    "The world is full of magic. You just have to look for it."
] },
  { slug:"eleanors-peace-of-mind",
    kind:"Stories",
    image:"pieces/eleanors-peace-of-mind.jpg",
    title:"Eleanor’s Peace of Mind",
    summary:"Eleanor can’t switch off her racing thoughts, until a rainy lunch break leads her into Miss Sophia’s bookshop.",
    related:["meditation"],
    body:[
    "Eleanor couldn’t shut it off. Her mind churned with a relentless stream of thoughts—missed deadlines, unsent emails, calls she had to return. Each worry looped in her head like a wheel she couldn’t stop. I’m behind on that report... did I confirm the meeting for Thursday? Her chest tightened at the thought of tomorrow’s tasks piling on top of today’s unfinished ones. Even now, during her lunch break, she felt like she was suffocating under the weight of it all.",
    "She hurried through the rain-soaked streets, barely noticing the drizzle that seeped into her coat. Her feet moved as though drawn by an invisible force, pulling her away from the office, though she had no idea where she was going. The pressure in her head built until it felt like a ticking clock counting down to some inevitable crash.",
    "When she finally looked up, her eyes fell upon an old bookshop tucked between the grey stone buildings. Miss Sophia’s Bookshop, the teal sign read. Through the window, she saw the soft glow of a fire, the promise of warmth and quiet. Without thinking, she pushed open the door, desperate for something she couldn’t quite name.",
    "The soft chime of a bell greeted her, and as she stepped inside, the world seemed to shift. The hum of her thoughts softened in the warm air scented with books and freshly brewed tea. The shop was as cosy as it was quiet, with dark wooden shelves stretching toward the ceiling, lined with books of every kind. In the corner, a fire crackled gently in the hearth, its amber glow dancing across the wooden floor.",
    "Eleanor took a deep breath for the first time in what felt like days, the tension in her chest loosening slightly. Yet the buzzing in her mind remained, insistent and unyielding.",
    "“Welcome, my dear,” came a gentle voice.",
    "Eleanor turned to see an elderly woman behind the counter, her silver hair swept into a loose bun, and her eyes twinkling with warmth. She smiled as though she already understood what had drawn Eleanor in. “You look like someone who could use a little peace.”",
    "Eleanor let out a soft, nervous laugh. “You could say that. It’s been... a stressful time.”",
    "Miss Sophia nodded knowingly, as though she had heard this story many times before.",
    "“Why don’t you take a seat by the window? I’ll bring you something warm to drink.”",
    "Eleanor found herself sinking into a plush armchair by the window, her hands resting limply in her lap. Outside, the rain pattered against the glass, a steady, rhythmic sound that felt soothing against the whirl of her thoughts. She stared at the raindrops streaking down the panes, but in her mind, all she could see were the endless to-do lists and unfinished tasks.",
    "Moments later, Miss Sophia returned, setting a delicate china cup of tea on the table beside her. “Chamomile with a touch of honey,” she said. “Perfect for calming the spirit.”",
    "Eleanor wrapped her fingers around the warm cup, feeling the steam rise gently against her face. She took a sip, the warmth spreading through her, but her mind remained troubled. She glanced at Miss Sophia, then blurted out, “How can I find peace of mind when my thoughts are always racing? I can’t seem to stop worrying, even when I’m not working.”",
    "Miss Sophia settled into the chair across from her, folding her hands in her lap. “Ah, my dear,” she said softly, “the mind can be a busy place, can’t it? Like a crowded room, full of voices all talking at once, demanding your attention.”",
    "Eleanor nodded, the knot in her chest tightening again. That was exactly how it felt—endless noise she couldn’t escape.",
    "“But peace of mind,” Miss Sophia continued gently, “doesn’t come from stopping all those voices. It comes from learning to step back and let them be, without letting them take over.” She reached into her pocket and pulled out a small, leather-bound journal, the kind that looked as though it had held many secrets over the years. “This is for you,” she said, placing it in Eleanor’s hands.",
    "Eleanor opened it, feeling the smoothness of the pages beneath her fingers. On the first page, written in elegant, flowing script, were the words “Breathe, my dear.”",
    "Miss Sophia smiled kindly. “Each evening, when the day feels too heavy, sit quietly and write. Write every worry, every thought, every little thing that keeps your mind running. Let the paper hold it for you, so you can rest. You don’t have to carry it all yourself, not all the time.”",
    "Eleanor blinked, a warmth spreading through her chest. It was such a simple idea, yet it felt like something she had been waiting to hear for a long time. “But won’t my mind just fill up with more thoughts afterward?” she asked, her voice barely above a whisper.",
    "Miss Sophia chuckled softly. “Oh, most likely,” she said. “But that’s alright. Peace isn’t the absence of thoughts, my dear—it’s learning to let them come and go, like the rain outside that comes and goes without troubling the earth too much.”",
    "Eleanor glanced out at the rain again, feeling a strange sense of calm wash over her. “I never thought of it that way,” she murmured.",
    "Miss Sophia placed a warm hand on Eleanor’s. “Start small,” she said kindly. “Five minutes a day. Just sit, breathe, and let the world be. You’ll find that, little by little, your mind will follow your heart, and peace will find its way to you.”",
    "Eleanor clutched the journal to her chest, feeling as though a weight had been lifted, if only slightly. She sipped her tea, the warmth spreading through her, and for the first time in weeks, she felt a flicker of something she had thought was lost—hope.",
    "As she stood to leave, the rain having lightened into a gentle mist, she turned to Miss Sophia. “Thank you,” she said sincerely. “I think this is exactly what I needed.”",
    "Miss Sophia smiled, her eyes twinkling once more. “I believe we often find just what we need, right when we need it most. Take care, dear, and remember—peace is closer than you think.”",
    "With the journal tucked under her arm, Eleanor stepped out into the soft drizzle, feeling lighter than she had when she entered. The rain no longer seemed so dreary, and for the first time in a long while, she took a deep breath, letting it out slowly. The world outside was still busy, still full of demands—but inside, she carried a small, precious seed of peace, ready to grow.",
    "And that, she thought, was enough for now."
] },
  { slug:"the-unseen-goal",
    kind:"Stories",
    image:"pieces/the-unseen-goal.webp",
    focus:"center 45%",
    thumb:"pieces/the-unseen-goal-thumb.webp",
    audio:"audio/the-unseen-goal.mp3",
    duration:489,
    marks:[0.2, 12.6, 27.5, 42.3, 51.0, 65.0, 74.1, 90.0, 105.2, 120.3, 133.7, 146.9, 163.1, 175.0, 192.5, 209.8, 220.7, 239.3, 252.1, 261.8, 269.9, 285.9, 295.2, 308.4, 326.2, 339.2, 353.8, 368.7, 381.6, 395.2, 407.1, 426.5, 445.4, 460.8, 470.1],
    theme:{accent:"peach"},
    title:"The Unseen Goal",
    summary:"A young footballer returns to Miss Sophia’s bookshop, tired and under pressure, and leaves with a gift and a reminder of joy.",
    related:["meditation"],
    body:[
    "Once upon a time, in a quaint little town, with cobblestone streets and friendly faces, stood a charming old bookshop owned by Miss Sophia. This bookshop, nestled among other beautiful stone buildings, was a sanctuary of wisdom and peace, with its cosy interior lit by a soft natural light that found its way in through beautiful ornate windows.",
    "One afternoon, as the old street lamp outside began to cast a golden glow over the cobbled path, a young man entered Miss Sophia’s Bookshop. The bell above the door chimed gently, announcing his arrival. Miss Sophia looked up from a book she was examining and her eyes came alive with the recognition of a face she had not seen for a long time.",
    "“Oh, my! Is that you Marcus? It has been a long time!” she exclaimed, her voice warm and alive with surprise. “It is lovely to see you. And now you are all grown up.”",
    "“Yes, it’s been quite a few years, hasn’t it?” Marcus replied. “I always used to enjoy coming here and the little chats we had.”",
    "“Oh, yes, I remember your visits well. You always told me about your football. And you had such dreams.”",
    "The young man, now towering and athletic, smiled wistfully. “Yes, I did, didn’t I?”",
    "“Well, it’s worked out well so far, I’m still playing football and I’m even playing for a professional team!”",
    "“Oh, that is wonderful to hear Marcus. I am very happy for you! It was always your dream.”",
    "Miss Sophia invited him to sit down, preparing a cup of tea with the same warmth and care she had always shown. As he settled into one of the comfy chairs, Marcus shared his journey, speaking of trials and triumphs. Yet, beneath his achievements lay a layer of stress and uncertainty.",
    "“It’s not easy, trying to make a career, in such a competitive sport,” he confided, his brow furrowed with concern.",
    "Miss Sophia listened intently, her expression one of empathy and understanding. After a moment of silence, she spoke, her voice carrying her usual air of wisdom and understanding.",
    "“I remember the joy in your eyes when you spoke of football as a boy. That love for the game was pure and full of wonder. No matter how challenging the path becomes, always hold onto that joy. It’s the flame that lights your way!”",
    "Marcus nodded, feeling a sense of peace he hadn’t realised he’d been missing. It was then that Miss Sophia, with kindness in her eyes, reminded him of a memory from his youth.",
    "“Do you remember, my dear, when you once walked into this very shop and found me sitting with my eyes closed? The bell had given its gentle chime, and as I opened my eyes and saw you, I explained that I was just meditating. And you said, ‘What’s meditation?’” She smiled as she recalled the moment with fondness.",
    "The memory also brought a smile to his face. A moment from his childhood that felt both distant and warmly familiar. Miss Sophia leaned forward slightly, her gaze kind and understanding.",
    "“Perhaps meditation could help you now? Just as it has always helped me, find my centre and peace amidst the whirlwind of life,” she suggested.",
    "With the gentleness that was her nature, Miss Sophia continued, “You know Marcus, meditation is used by many athletes. As it improves focus, reduces stress, and brings about a sense of calm. All of which are invaluable. Both on, and off the field.”",
    "Seeing the spark of interest in his eyes, Miss Sophia stood up and walked behind a bookshelf. She returned a moment later, holding a book, its cover worn with the love of many readings.",
    "“The Power of Peace of Mind,” she announced, placing this treasure gently into his hands. “I’d like you to have this,” she said warmly.",
    "“Consider it a gift from someone who believes in you. This book may guide you in finding the peace and focus you seek.",
    "“This book,” she continued, “if you will allow it, will take you on a personal journey through understanding how to live in harmony with your thoughts, to embrace the present moment fully, and to find calm amidst the chaos of competitive sports. It teaches about the beauty of simplifying your mind’s landscape, finding clarity in your goals, and the gentle power of mindfulness to enhance performance.”",
    "“The techniques and insights within these pages,” Miss Sophia explained, “could help you manage stress, improve your focus on the field, and even aid in your physical recovery.”",
    "“Oh, the thought of you reading this book is quite the inspiration Marcus. This book has given me so much over the years. As you step into its wisdom, you will discover ways to harness your thoughts, turning them from distractions into pillars of strength and motivation. You will have a new and powerful understanding that will help you every time you step onto the field.”",
    "As he gently flipped through the pages of the book, a profound realisation dawned on him. Miss Sophia’s words and the book felt exactly what he needed. The notion that the overwhelming stress clouding his love for football could begin to dissipate, filled him with a sense of hope that he hadn’t felt in a while. It was as if destiny had led him back to her bookshop. Just when he needed it most.",
    "As their conversation drew to a close, they both rose from their seats, feeling a wonderful blend of nostalgia and newfound hope. In this moment, Marcus felt great appreciation for the love and wisdom Miss Sophia had shown to him. He leaned over, enveloping her in a hug that was both gentle and encompassing.",
    "In that embrace, a silent exchange of gratitude and support passed between them. His hug conveyed a world of thanks, a gesture embodying the profound impact Miss Sophia had on him.",
    "“Thank you,” he whispered, his voice soft but laden with emotion, acknowledging not just the wisdom she had imparted but the light she had rekindled in his heart.",
    "Miss Sophia, for her part, returned the embrace with equal tenderness, a motherly figure offering solace and encouragement. Her hands, small yet firm, patted his back in a comforting rhythm, a simple act that seemed to imbue him with courage and determination for the road ahead.",
    "As they stepped back, their eyes met, sharing a moment of unspoken understanding. In that brief exchange, both felt a deep sense of connection, a reminder that kindness, wisdom, and a heartfelt hug can indeed make all the difference in the world.",
    "As Marcus stepped out of the bookshop, back into the golden light of the evening, he felt so different. Different in a way that was difficult to describe, but different in a way that felt better than he had felt for as long as he could remember.",
    "Miss Sophia, watching from the window, smiled softly, knowing that another soul had found the guidance needed to navigate life’s journey.",
    "Marcus would continue his journey, as a professional football player but now armed, not only with his talent and determination, but with the wisdom and insight that had been gifted to him in Miss Sophia’s bookshop.",
    "A place where dreams are nurtured and souls are healed."
] },
  { slug:"the-day-you-find-out-why",
    kind:"Stories",
    image:"pieces/the-day-you-find-out-why.webp",
    focus:"center 30%",
    thumb:"pieces/the-day-you-find-out-why-thumb.webp",
    audio:"audio/the-day-you-find-out-why.mp3",
    duration:419,
    marks:[0.0, 11.9, 24.1, 34.1, 49.6, 57.4, 69.9, 77.3, 93.1, 103.7, 116.6, 124.8, 137.2, 154.3, 163.9, 177.4, 190.6, 203.8, 213.8, 225.9, 238.4, 254.3, 269.7, 287.4, 301.8, 314.4, 325.3, 339.6, 348.4, 356.6, 366.6, 376.2, 387.7, 397.8, 406.6],
    theme:{accent:"yellow"},
    title:"The Day You Find Out Why",
    summary:"A young musician wonders whether he has found his calling, and Miss Sophia tells him the day you find out why can be today.",
    related:["living-your-dream","most-important-things"],
    body:[
    "It was a quiet Thursday afternoon in November, and a soft fog had been drifting through the village all day when the bell above the door chimed.",
    "A young man hovered on the doormat, a guitar case slung over one shoulder and a folded piece of paper in his hand. He looked around the shop as though he wasn’t quite sure he was allowed in.",
    "“Come in, dear,” said Miss Sophia, looking up from the counter with a smile. “What a foggy, chilly afternoon to be out in. Do come and get warm.”",
    "He smiled, a little sheepishly, and stepped inside.",
    "“Why don’t you take the armchair by the fire?” she said. “And would you like a cup of tea? Or there’s hot apple juice, if you’d rather. I make it with a little cinnamon.”",
    "“Tea would be lovely, thank you,” he said, and some of the tightness in his shoulders eased as he sank into the chair.",
    "His name was Daniel, and he told her so when she returned with the cup. He was twenty-six, he played music, and he had been trying for years to work out whether he was meant to do it for a living.",
    "“My friend sent me this quote this morning,” he said, holding out the paper. “I can’t stop thinking about it.”",
    "Miss Sophia sat down beside her own cup, put on her glasses and read it aloud, slowly.",
    "“The two most important days in your life are the day you are born and the day you find out why.”",
    "“Mark Twain’s name is often put to that,” she said, with a little twinkle. “I don’t know that he actually said it, but it’s certainly wise enough to be his.”",
    "“It does sound wise,” Daniel said. “It’s got me thinking how important it is to find my calling. Almost everyone I know seems to have one. A friend of mine knew at nine that she’d be an actor. And I’m still sitting here wondering if I’m supposed to be a musician, or a teacher, or something else entirely, and whether I’ve missed it.”",
    "Miss Sophia settled back and wrapped her hands around her cup.",
    "“Do you know, my dear, I think there are two answers to that quote. And the second one makes the first one a great deal easier.”",
    "“What do you mean?” he asked.",
    "“Well, the first answer is the one you’ve been looking for. Perhaps a certain work, a certain art. Some people do feel a pull towards something in particular, and that’s a lovely thing to follow. But I don’t think it’s the why. Not the deepest one.”",
    "She nodded towards the window, where the fog pressed softly against the glass and turned the lane into a watercolour.",
    "“Before you were born, Daniel, before there was a body, or a name, or a guitar, you were something much more than the person who walked in here today. And from that place, you chose this life. You chose it for the adventure of it, to experience the joy of it. To taste it all: the food, the music, the people you’d love, the mornings, even the misty autumn days.”",
    "Daniel was quiet for a moment. “I wasn’t expecting that,” he said. “That’s very deep.”",
    "“It is rather, isn’t it?” Miss Sophia said, laughing softly. “But you did ask about your purpose, dear, so I’m afraid it was always going to be a little deep. The lovely part is how simple it turns out to be. You chose this life, knowing it would be a place where you could have a joyful adventure and discover all the things you love. And so nothing is more important than finding joy in your days. You didn’t come to be tested, or to prove yourself, or to get everything right. You came to enjoy it. And your work, whatever it turns out to be, is just one of the ways you do that.”",
    "He looked down at the guitar case at his feet.",
    "“The trouble,” she went on, “is that we get so busy getting somewhere that we forget we’re already on the adventure. We chase the thing, thinking the joy is waiting behind it. And all the while the joy is in the steam coming off that tea.”",
    "Daniel glanced at his cup. He hadn’t really looked at it. The steam rose in a slow, curling thread, catching the firelight as it went.",
    "“Look at it properly,” said Miss Sophia gently. “Every little thing has a miracle tucked inside it, if you give it a moment. That tea was a leaf on a hillside once, somewhere far away. Someone picked it. Someone carried it. And now it’s warming your hands in a cosy shop, on a foggy afternoon, in front of a fire.”",
    "He took a sip. It tasted, he realised, rather better than it had a moment ago.",
    "“That’s all it is,” she said. “The more you notice what’s good, the easier it gets to notice more. It stops being a thing you have to remember to do. You don’t make yourself feel grateful. It simply starts happening, the way you notice a colour once you’ve started looking for it. And the better it feels, the more you want to do it, so it keeps growing on its own.”",
    "“And the music?” Daniel asked quietly.",
    "“Play it,” Miss Sophia said. “Play it because it makes you feel alive. Not to prove you’ve found your calling. If it turns into your living, wonderful. If it doesn’t, you’ll still have been doing what lights you up, and that was always the point.”",
    "She tapped the paper in his hand.",
    "“The day you find out why isn’t a day you have to find, you know. It can be today. It can be this very minute.”",
    "Daniel read the quote again. It looked different now. It no longer read like a test he was failing, but like a door that was already open.",
    "He stayed for another cup of tea, and when it was time to go, he lifted the guitar case onto his shoulder as though it weighed a little less than when he’d arrived.",
    "At the door he paused. The streetlamp outside had flickered on, and its golden glow hung softly in the fog, lighting a scatter of autumn leaves across the cobbles.",
    "“Thank you, Miss Sophia.”",
    "“Enjoy it, dear,” she said. “That’s all anyone’s asking of you.”",
    "He stepped out into the evening. A blackbird was singing somewhere in the mist above the rooftops, and for the first time in a very long while, he stopped to listen.",
    "Miss Sophia watched him go, smiling to herself. Then she turned back to her fire, her tea and the fog-softened window, and enjoyed them, quite on purpose."
] },
  { slug:"a-lantern-of-hope",
    kind:"Stories",
    image:"pieces/a-lantern-of-hope.jpg",
    title:"A Lantern of Hope",
    summary:"On a rainy afternoon, a young woman who feels lost asks Miss Sophia how to find hope when everything feels hopeless.",
    related:["choose-some-positive-thoughts"],
    body:[
    "In a quaint town, nestled between rows of ageing stone buildings, there was an old bookshop, that seemed to hold the wisdom of the ages, within its old walls. Miss Sophia, the lovely owner of the shop, was known far and wide, not just for her rare collections of books but for her gentle spirit and understanding heart.",
    "One gloomy afternoon, as the rain pattered softly against the shop’s fogged windows, a young lady stepped inside. Her eyes, clouded with the weight of unseen troubles, scanned the room before resting on Miss Sophia, who was arranging books behind the counter.",
    "“Good afternoon, dear,” Miss Sophia greeted, her voice as warm as a comforting embrace. “Is there something specific you’re looking for today?”",
    "The young lady hesitated, then sighed, “I don’t know. I guess I’m looking for… answers. I feel so lost, and nothing seems to make sense anymore.”",
    "Miss Sophia offered a gentle smile, setting aside her work. “Life can indeed feel overwhelming at times, my dear. But remember, it’s in these moments of uncertainty that we find our true strength and purpose. Sometimes, all it takes is a little hope to see the light.”",
    "The young lady looked at Miss Sophia, a flicker of curiosity in her eyes. “But how do I find hope when everything feels so hopeless?”",
    "“Oh, my dear,” Miss Sophia replied, her eyes twinkling with kindness. “Hope is like the sun, which is always shining above us, even on the cloudiest day. You must remember to look beyond the clouds. And sometimes, a good book can be a lantern, illuminating the path through your darkest thoughts.”",
    "The young lady nodded, a sense of comfort beginning to ease her troubled mind. “Could you recommend a book that might help?”",
    "Miss Sophia thought for a moment, then selected a slim volume from the shelf behind her. “This one has guided many through tough times. It’s not just a book; it’s a companion for the soul, reminding us that every day holds the possibility of a miracle.”",
    "The young lady took the book, her fingers tracing the worn cover. “Thank you, Miss Sophia. I… I feel a bit lighter already, just talking to you.”",
    "“That’s the beauty of sharing our worries, dear. It makes the load a bit easier to bear,” Miss Sophia said, her voice soft, yet full of conviction. “Remember, my door is always open, and so are the pages of countless worlds waiting to offer you comfort and guidance.”",
    "The young lady smiled, a genuine smile that reached her eyes for the first time. “I’ll remember that. Thank you.”",
    "A little later, as the young lady stepped out of Miss Sophia’s bookshop, the rain had stopped, and the clouds were parting to reveal the setting sun. She looked back at Miss Sophia, who was waving from the door, and felt a renewed sense of hope. The world hadn’t changed, but her outlook had, and sometimes, that’s all it takes to make life seem a little brighter."
] },
  { slug:"beyond-the-dreaming-spires",
    kind:"Stories",
    look:"path",
    cover:"covers/beyond-the-dreaming-spires.jpg",
    title:"Beyond the Dreaming Spires",
    summary:"A free story to read and keep.",
    download:"stories/beyond-the-dreaming-spires.pdf",
    downloadText:"Read the story (PDF)",
    related:["a-lesson-in-joy"],
    body:[
    "(A short introduction to the story goes here.)"
] },
  { slug:"a-gateway-to-well-being",
    kind:"Wisdom",
    image:"pieces/a-gateway-to-well-being.jpg",
    title:"A Gateway to Well-being",
    summary:"Happiness doesn’t need grand changes. A gentle morning message from Miss Sophia.",
    related:["choose-some-positive-thoughts"],
    body:[
    "Dear friends across the globe, good morning.",
    "I trust this message embraces you in warmth and well-being. Today, like many days, has begun with a tranquil period of writing for me—a cherished activity that fills my soul with joy and contentment. It’s a time when I express my gratitude for life and all its inspirations, focusing on the multitude of blessings that surround us.",
    "I’m fortunate to spend my days in a quaint village, tending to a bookshop that couldn’t be closer to my heart. It’s a place where I’m greeted by the diversity of life, serving teas and coffees, exchanging kind words, and perhaps, offering a nugget of wisdom to those who wander in. My shop is more than a business; it’s a sanctuary where I share love, kindness, and the occasional piece of guidance.",
    "With that spirit, I’d like to share something that, I hope, will enrich your days.",
    "Happiness, my friends, doesn’t require grandiose changes. It’s the small, daily efforts to brighten our lives that truly matter. Success, as we often seek it, is really about the pursuit of a deeper happiness.",
    "Throughout my life, before the bookshop and the settled serenity of old age, I travelled the world, teaching and learning in equal measure. Those adventures, rich in wisdom and experience, taught me the profound impact of joy, peace, and contentment in our lives.",
    "Today, I encourage you to be mindful of your thoughts and where you direct your attention. Our minds are powerful, colouring our experiences and emotions. Take time for solitude, perhaps in nature or over a quiet cup of tea, and gently steer your thoughts towards what is positive and joy-bringing. This practice of mindfulness, and savouring pleasurable thoughts, is a gateway to well-being.",
    "In nurturing a grateful, positive mindset, we not only enhance our own lives but also enrich our interactions with others. Happiness becomes a shared treasure, magnifying the joy in our relationships and encounters.",
    "May you find moments today to reflect on the beauty and goodness that life offers. Allow yourself the gift of quietude, focusing on the aspects of life that bring you happiness and appreciation.",
    "Wishing you a day as lovely as a heartfelt conversation or a cherished book found unexpectedly.",
    "Until we speak again, cherish the beauty around you and within.",
    "With all my love and best wishes for a beautiful day."
] },
  { slug:"meditation",
    kind:"Wisdom",
    image:"pieces/meditation.jpg",
    title:"Meditation: A Simple Practice for a Peaceful Mind",
    summary:"A simple daily practice for a calmer, clearer mind.",
    related:["a-walk-in-nature"],
    body:[
    "In the hustle and bustle of today’s world, finding peace and quiet can seem like searching for a needle in a haystack. Yet, there’s a simple, ancient practice that offers us a sanctuary within ourselves, no matter where we are or what’s happening around us. That practice is meditation.",
    "Meditation doesn’t require special equipment, a specific place, or an abundance of time. It can be as simple as sitting quietly, closing your eyes, and focusing on something constant, like the rhythm of your breath, a peaceful sound in your headphones or the hum of the world around you. This simple act, though it may seem small, is incredibly powerful.",
    "As you sit in silence, you’ll notice your mind wandering to the day’s worries, your to-do list, or memories. This is natural. The mind is accustomed to constant activity. The practice of meditation lies not in keeping your mind empty, but in gently bringing your attention back to your chosen point of focus whenever you notice it drifting. Each time you do this, you’re training your mind to recognise and reduce the pattern of troublesome thinking, calming your thoughts and, by extension, yourself.",
    "Making meditation a daily habit transforms it from a simple activity into a profound personal practice. Over time, you’ll become more aware of your thoughts and how they influence your feelings. This awareness is empowering. It allows you to recognise which thoughts uplift and support you and which do not. Gradually, you’ll find yourself choosing thoughts that feel good more often, naturally gravitating towards positivity and well-being.",
    "The benefits of this practice are manifold. With regular meditation, you may find that you become less reactive to the ups and downs of daily life. Situations that once might have sparked a quick, perhaps negative reaction might now meet a more thoughtful response. Meditation helps us see the good in our surroundings, even on days when that good seems hard to find.",
    "Starting your day with a calm mind sets a precedent for the rest of the day. It’s like planting a seed of peace that continues to grow with every passing moment. This peaceful beginning makes it easier to navigate whatever comes your way, anchored in a sense of calm and clarity. Moreover, meditation brings you closer to your natural state of well-being. In this state, you’re more in tune with your intuition, your creativity, and your capacity for love and joy. It’s a way of being that feels more like your true self: connected, calm, and clear.",
    "In essence, the practice of meditation is a gift we give ourselves. It’s a way to clear the clutter of daily life and connect with something deeper and more profound. It’s a pathway to peace, one that is always available to us, always ready to welcome us back to our natural state of well-being. Why not take a few moments today to discover it for yourself?"
] },
  { slug:"a-walk-in-nature",
    kind:"Wisdom",
    image:"pieces/a-walk-in-nature.jpg",
    title:"A Walk in Nature",
    summary:"The kindest thing we can do for ourselves is often the simplest.",
    related:["meditation"],
    body:[
    "Good morning, my dear. Some days the kindest thing we can do for ourselves is also the simplest: put on a coat, step outside, and walk.",
    "Taking time for yourself to feel a little better is always a good thing, and often the simplest things are what make us feel best.",
    "There is no need to go far, or to have a plan. A lane, a park, a path beside a field will do. Leave the hurry at the door. Let your pace soften, and let your attention wander to what is already there: the light falling through the leaves, the birdsong, the smell of the earth after rain, the sky quietly doing something wonderful.",
    "Out in nature, I find the mind does just what it has been longing to do. It slows. The thoughts that were circling begin to settle, like leaves on still water. You don’t have to make it happen. You simply give it room.",
    "And as you notice these small, lovely things, you feel a little better, not through effort but through appreciation. That small lift is a doorway to more peace of mind.",
    "Cultivate more peace of mind in your life and you will be able to enjoy more of life’s simple pleasures: a warm cup of tea when you get home, a favourite chair, a conversation with someone you love.",
    "So if today feels heavy, or even if it doesn’t, why not take a gentle walk? Nature is always ready to welcome you.",
    "With love,",
    "Miss Sophia"
] },
  { slug:"who-am-i",
    kind:"Wisdom",
    image:"pieces/who-am-i.jpg",
    title:"Who am I? Am I more than just a physical being?",
    summary:"Miss Sophia explores one of life’s biggest questions, and why we sometimes feel bad.",
    related:["most-important-things"],
    body:[
    "Ah, you’ve touched upon one of the most profound questions one can ask. Yes, you are indeed more than just your physical body and personality. You are a magnificent being: an extension of the source energy that created the universe.",
    "You are experiencing life uniquely through your physical self and your unique preferences and perspective. Your true essence is that of pure positive energy and eternal consciousness.",
    "You chose to come here to experience joy, growth, and the vast spectrum of human experience, all while connected to the love and wisdom of the Universe.",
    "So you are both the painter and the masterpiece: continuously evolving and discovering the depths of who you truly are.",
    "## If I am so positive and powerful, why do I feel bad so much of the time?",
    "Well, feeling bad at times is part of our human experience, a contrast that helps us recognise what we don’t like and appreciate what we do like and want more of. It’s like the shadows in a beautiful painting—they bring depth and perspective.",
    "Our emotions are indicators, guiding us back to alignment with our true selves. When we feel off track, it’s a signal to adjust our thoughts, focus on what brings us joy, and remember our connection to the broader, wiser, and more loving part of ourselves.",
    "## So do I have to just accept that life feels bad?",
    "It’s not so much about accepting that life feels bad, but rather understanding that feelings, both good and bad, are part of our journey. They’re like signposts, guiding us towards what we truly desire and away from what doesn’t serve us. Instead of accepting discomfort as a permanent state, think of it as a reminder to realign with your joy.",
    "You have the power to influence how you feel by choosing where to focus your thoughts and energy. As you practise this, you will feel good more of the time, and reduce the time you feel not so good.",
    "And remember, you are always just a few thoughts away from feeling better, by intentionally focusing on joy, appreciation, and love."
] },
  { slug:"enjoy-your-dreams-now",
    kind:"Wisdom",
    image:"pieces/enjoy-your-dreams-now.jpg",
    title:"Enjoy your Dreams Now",
    summary:"Taste your dream today by letting yourself feel it now.",
    related:["living-your-dream"],
    body:[
    "Life is truly about feeling good, isn’t it?",
    "Each of us carries a bundle of dreams, visions of moments filled with joy and fulfilment. We often think, “Oh, how good life would be if my dreams came true!” But what if I told you there’s no need to wait to embrace that joy?",
    "Imagine even a small part of your dream, and let the feeling wash over you.",
    "You see, there’s no need to postpone that delight, that sense of achievement. Life is about how we feel in the now, not just in some distant, dreamy future.",
    "So, why not close your eyes for a minute and allow yourself to live your dream in your heart and mind? Focus on that good feeling, nurture it.",
    "By giving yourself a taste of your dream today, you’re aligning your heart with joy and your life with the essence of your dreams.",
    "Enjoying how it feels today brings it closer to reality tomorrow.",
    "So, indulge in your dream for a moment, and relish the feeling—it’s yours to enjoy, right here, right now."
] },
  { slug:"living-your-dream",
    kind:"Wisdom",
    image:"pieces/living-your-dream.jpg",
    title:"Living Your Dream",
    summary:"The feelings behind our dreams are available right here, right now.",
    related:["enjoy-your-dreams-now"],
    body:[
    "I find there’s something quite magical about the people who stroll into my Bookshop.",
    "Each visitor brings with them their own story and their own dreams, and it is one of my greatest joys to meet and converse with them amidst the comforting embrace of books.",
    "As I welcome each guest, I find myself quietly wondering about the dreams that dance in their hearts. What brings them here today? Are they seeking adventure, solace, or perhaps a forgotten memory tucked away in the pages of a novel? The shop becomes a gentle haven where these quiet conversations can unfold naturally. We might talk about the books they are drawn to, which often gives a glimpse into their hopes and aspirations. It’s in these moments, sharing stories and insights, that a beautiful exchange happens. And I might even offer a few carefully chosen words, hoping to inspire or comfort.",
    "It strikes me that while we all have grand visions of beautiful things we dream of, such as wonderful holidays, a new home, cherished friendships, and perhaps a new car or a healthier bank balance, there is a deeper yearning within each dream. It’s not merely the acquisition of things that we crave, but the feelings we believe will accompany them.",
    "Imagine, for a moment, that achieving your dream is not just about reaching a destination but about embracing a state of mind. This subtle yet profound realisation holds the key to living your dream here and now, rather than in some distant future. The beauty of this perspective is that it doesn’t require the external world to shift before you find contentment. Instead, it invites you to cultivate an inner sanctuary of peace and happiness, regardless of circumstances.",
    "Consider this: if you imagine living your dream life, don’t you also still want to enjoy all the simple pleasures like the food you love, health, rest, the beauty of nature, the joy of friendship, and the warmth and comfort of your bed, to name but a few. And if you imagine living your best life, don’t you want to be living that with peace of mind and free from too much stress and worry? Well, isn’t it wonderful that there are so many of these things available to us in every moment? They are not exclusive to a future filled with more or better possessions; they are woven into the fabric of everyday life, waiting to be appreciated and expanded upon.",
    "It’s also crucial to acknowledge that while dreams propel us forward, they shouldn’t be a condition for our happiness. Too often, we postpone our contentment until we achieve certain goals. Yet, this approach can lead to a perpetual state of longing and dissatisfaction, as there will always be another desire on the horizon. By shifting our focus to feeling good in the present—by practising appreciation and choosing more thoughts of kindness and happiness—we build a life that reflects our deepest aspirations.",
    "To truly live your dream, engage deeply with the beauty and goodness that already surround you. Embrace the peace of mind that comes not from having everything but from appreciating everything you have.",
    "As you walk through your days, I hope you carry with you the understanding that living your dream is possible right now, in this very moment. By fostering a mindset of joy and contentment, you are not just dreaming of a better life; you are living it."
] },
  { slug:"choose-some-positive-thoughts",
    kind:"Wisdom",
    image:"pieces/choose-some-positive-thoughts.jpg",
    title:"Choose Some Positive Thoughts",
    summary:"A gentle reminder for today.",
    related:["a-gateway-to-well-being"],
    body:[
    "My dear, here’s a gentle reminder for today:",
    "Life, even with all its twists and turns, is designed to be a journey of joy and fulfilment. Each moment holds the potential for happiness, guided by the powerful law of attraction. Your thoughts and feelings are like magnets, drawing experiences that align with their essence.",
    "If you find yourself caught in the process of negativity or criticism, remember to pause and shift your focus towards what brings you joy and gratitude. It’s in these moments of appreciation that life’s beauty unfolds before you.",
    "Slow down from the rush of daily life to notice the wonders around you. Whether it’s the simple pleasure of a warm cup of tea, the soothing melody of a favourite song, or the comforting presence of a loved one, these are the threads that weave the fabric of a joyful life.",
    "Trust that you are deserving of happiness and that by focusing on what feels good, you invite more of it into your life. Let today be marked by a conscious choice to nurture thoughts that uplift and inspire you, for in doing so, you align with life’s highest potential.",
    "Remember, there is immense beauty in the world and within you. Let that beauty guide your thoughts and actions, leading you to a day filled with joy, peace, and fulfilment. Life is supposed to be good for you, and by focusing on the positive, you make it so.",
    "Sending you love.",
    "Miss Sophia"
] },
  { slug:"most-important-things",
    kind:"Wisdom",
    image:"pieces/most-important-things.jpg",
    title:"What are the most important things in life?",
    summary:"Love, relationships and inner peace, and the simple things that hold the deepest value.",
    related:["who-am-i"],
    body:[
    "The most important things in life, my dear, revolve around love, relationships, and inner peace.",
    "Love is the foundation of everything beautiful in this world; it nurtures our relationships with family, friends, and even strangers, creating bonds that bring us joy and support.",
    "Inner peace, on the other hand, allows us to be content with who we are and the life we lead, regardless of external circumstances.",
    "It’s also crucial to pursue knowledge and wisdom, for they light our path and help us grow.",
    "Lastly, kindness and compassion towards others not only make the world a better place but also enrich our own lives. Remember, it’s the simple things that hold the deepest value."
] },
  { slug:"loss-of-loved-ones",
    kind:"Wisdom",
    image:"pieces/loss-of-loved-ones.jpg",
    title:"What advice can Miss Sophia give about the loss of loved ones?",
    summary:"Comfort when you have lost someone: the bond that love creates is not severed.",
    related:["love-from-the-afterlife"],
    body:[
    "My dear, the loss of a loved one is among the deepest sorrows the heart can know. But remember, the love and connection you shared with them is a bond that not even loss can sever.",
    "In your memories, their light continues to shine, guiding and comforting you in moments of darkness. It’s okay to grieve, to feel the depth of your loss—it’s a testament to the love you shared.",
    "Find solace in the beauty of life around you, the way the sun still rises, bringing warmth and light. Just as seasons change, your journey through grief will evolve, bringing moments of peace and acceptance amidst the sorrow.",
    "Share stories of your loved one, let their laughter echo in your memories, and in doing so, you keep their spirit alive within you and around you.",
    "Most importantly, allow yourself to lean on the love and support of those who are still here, those who can hold you up when you feel you cannot stand. And remember, my dear, it’s through love that we are eternally connected, beyond the confines of time and space.",
    "Your loved ones are never truly lost; they are a part of you, guiding you with unseen hands and loving you from beyond. In every heartbeat, in every breath, their love remains a gift that endures."
] },
  { slug:"love-from-the-afterlife",
    kind:"Wisdom",
    image:"pieces/love-from-the-afterlife.jpg",
    title:"Love from the Afterlife",
    summary:"Our loved ones are never truly gone. A comforting thought and a small, true story.",
    related:["loss-of-loved-ones"],
    body:[
    "Good evening, and welcome.",
    "Please, imagine yourself here with me in my cosy little cottage, nestled by this crackling log fire, as I share something very special with you—a notion so comforting, it feels like a warm blanket on a chilly evening.",
    "It’s about the idea that our loved ones are always with us, never truly gone, just existing in a different form, in a realm filled with love and peace.",
    "You know, many have felt whispers from that world beyond—little signs and messages that seem too poignant to be mere coincidences. A song that plays at just the right moment, a sudden fragrance of flowers they loved, or dreams where they visit, vivid and reassuring. These moments, they’re like soft taps on the shoulder from our loved ones, saying, “I’m here, and all is well.”",
    "And so, it is with that in mind, that I would like to share with you a little story, that has stayed close to my heart over the years.",
    "Some time ago, not long after my dear husband passed, I found myself wandering through the quiet of my bookshop late one evening, feeling rather low. As I dusted the shelves, my hand brushed against a small, old book—a collection of poems that he and I cherished in our early days together. It had been misplaced for years, or so I thought.",
    "Just as I opened the book, a breeze fluttered through the room, though the windows were closed and the night was still. With it came the faintest scent of violets—my favourite. There was no logical explanation for it, but in that moment, I felt a warmth, a sureness that he was right there with me, comforting me, reminding me of our everlasting bond.",
    "This experience, small yet profound, reassured me that love truly transcends the boundaries of life and death. It’s a gentle nudge from the universe that our loved ones are never really gone; they continue to guide us, to inspire us, and to watch over us with love from the afterlife. Such moments are gifts, I feel. Sweet reminders that we are all connected, always and forever.",
    "In the hope of offering you even more encouragement that your loved ones are in a wonderful place, I would like to point out that there are countless stories of near-death experiences, where people speak of overwhelming love and beauty, of being greeted by those who have passed before us. They talk about a place where there is no pain or sorrow, just pure, positive energy. Imagine that—a place where everyone we miss is not only happy and safe but also cheering us on, hoping we seize every joy this life has to offer.",
    "These experiences and stories give us hope, don’t they? They paint a picture of an afterlife that is not to be feared but looked forward to as another chapter in our existence.",
    "Our loved ones in that serene realm aren’t just waiting; they’re thriving, and they want the same for us until we’re all united once more.",
    "So, let’s hold these stories close, and remember to live fully, laugh loudly, and love deeply. Our loved ones wouldn’t have it any other way. What a comfort it is to know that they are just around the corner - loving us still, as we continue our journey here."
] }
];

/* ---- Listen ---- */
/* Left empty on purpose until Paul decides where to point people (YouTube, Spotify, etc.).
   Each item: { icon:"🎧", title:"...", note:"...", url:"https://..." }   Platforms: ["Spotify","https://..."] */
const LISTEN_ITEMS = [];
const PLATFORMS = [];

/* ---- Books (words and links from paulisherwood.com). image = cover file in the covers folder.
   intro = always shown; more = shown when "Read more" is opened; inside = bullet list at the end. ---- */
const BOOKS = [
  { slug:"wisdom-of-aloharin", title:"The Wisdom of Aloharin", image:"covers/wisdom-of-aloharin.jpg",
    tagline:"A fable for anyone who has ever felt that life is meant to be more than this.",
    url:"https://www.amazon.co.uk/Wisdom-Aloharin-Paul-Isherwood/dp/B0FG13MTVB",
    audiobook:"https://open.spotify.com/show/6HLyNCsaJ6gU9Y81oLwSvU",
    intro:["Sophia is twenty-three years old and drifting. She doesn’t know what she wants, and everyone else seems to have it figured out.",
           "One afternoon, in her favourite bookshop, she pulls a mysterious book from the shelf, and a door opens."],
    more:["What follows is a journey through a world called Aloharin, where a series of remarkable elders offer her the truths she has been searching for, truths about worth, about joy, about the magic hidden in ordinary life.",
          "Written in lyrical, verse-like prose, The Wisdom of Aloharin carries the same wisdom as the first book, told as a story. For readers who want to feel the truth as much as understand it."],
    inside:[] },
  { slug:"most-important-hour", title:"The Most Important Hour", image:"covers/most-important-hour.jpg",
    tagline:"On joy, wisdom and living well.",
    url:"https://amzn.eu/d/00wz4f3e",
    audiobook:"https://open.spotify.com/show/7EPW5a4VKSDNZszbaCa6LB",
    intro:["What if the most important thing you could do today wasn’t more productive, more ambitious, or more disciplined, but simply more joyful?"],
    more:["In seventeen short chapters, this book shares the practical understanding that could transform the way you experience being alive. Not theory or affirmations, but genuine shifts in how life actually works, and how once you begin to see them, your days may start to feel a little different.",
          "Each chapter stands on its own. You can read it in an hour, carry a chapter in your pocket, return to it whenever you need. It was written for anyone who has ever sensed that life is meant to feel better than this."],
    inside:["How to stop waiting for happiness and find it in the life you already have",
            "Why your feelings are a compass, not a problem",
            "What you’re really after, beneath every goal and dream",
            "The morning hour that changes everything"] },
  { slug:"a-christmas-dream", title:"A Christmas Dream", image:"covers/a-christmas-dream-2.jpg",
    tagline:"A gentle story about grief, joy, and the enduring presence of those we have loved.",
    url:"https://www.amazon.co.uk/Christmas-Dream-Paul-Isherwood/dp/B0DT47VY1T",
    audiobook:"https://open.spotify.com/show/3LMa6ysyj6FVd5y8Olf465",
    intro:["Oliver is twelve years old, and this Christmas feels impossible. His grandmother died in the summer, and the warmth she brought to every December has gone with her."],
    more:["On Christmas Eve, he falls into a dream so vivid it feels entirely real, a reunion, a message, and a quiet understanding that changes everything. What he discovers is that love doesn’t end when someone leaves. It simply changes shape.",
          "A Christmas Dream is a gentle story about grief, joy, and the people who stay with us long after we can no longer see them. Short enough to read on Christmas Eve. Warm enough to stay with you long after."],
    inside:[] }
];

/* ---- An earlier book (2014, paperback only). Shown quietly at the bottom of the Books page.
   Amazon link given by Paul on 30 Oct 2026 (the older address https://www.amazon.co.uk/dp/1502708272 is the same book). ---- */
const EARLIER_BOOKS = [
  { slug:"most-important-hour-of-your-life", title:"The Most Important Hour of Your Life", image:"covers/most-important-hour-of-your-life.jpg",
    tagline:"Published in 2014. Paperback only.",
    url:"https://amzn.eu/d/06lrhMWb",
    intro:["Do you question life? Does something inside you tell you that life should be better? Would you like to have the power to get more of what you want? Would you like to see how your life could get better and better?"],
    more:["If this sounds like you then you have found the perfect place to start; for contained in this book is everything you need to begin to feel good, clarify what is most important to you and make your life the way you want it to be. You will discover that you have the power to attract whatever you desire into your life. You will be shown how you can apply this understanding to your life through many ideas and activities. As you apply this understanding each day, you will begin to feel better, you will get more of what you want and you will realise that the time you spend making your life better in this way is in fact The Most Important Hour of Your Life."],
    note:"This is the original, fuller book on these ideas. For a gentler, shorter read, start with The Most Important Hour (2026)." }
];

/* ---- Free stories (not on Amazon). Shown in the Stories & Wisdom library and on the Books page. ---- */

/* ---- Bookshops (themes) — to add one: add a line. image = big picture (1400 px wide), small = phone-size copy (900 px, optional), thumb = tiny picture for the chooser (320 px). Use WebP files.
   overlay: 0 (none) to 0.7 (dark) keeps the words readable on bright pictures.
   hidden:true = not offered in the chooser, kept only because a piece in the library borrows the picture. ---- */
const THEMES = [
  { id:"greendoor", name:"The Green Door", image:"shops/green-door.webp", small:"shops/green-door-sm.webp", thumb:"shops/green-door-thumb.webp", overlay:.40 },
  { id:"streetday", name:"The Cobbled Street", image:"shops/street-day.webp", small:"shops/street-day-sm.webp", thumb:"shops/street-day-thumb.webp", overlay:.35 },
  { id:"inside", name:"Inside the Bookshop", image:"shops/inside-front.webp", small:"shops/inside-front-sm.webp", thumb:"shops/inside-front-thumb.webp", overlay:.40 },
  { id:"fireside", name:"By the Fireside", image:"shops/fireside.webp", small:"shops/fireside-sm.webp", thumb:"shops/fireside-thumb.webp", overlay:.40 },
  { id:"windowstreet", name:"Window onto the Street", image:"shops/window-street.webp", small:"shops/window-street-sm.webp", thumb:"shops/window-street-thumb.webp", overlay:.40 },
  { id:"sunset", name:"Sunset on the Cobbles", image:"shops/street-sunset.webp", small:"shops/street-sunset-sm.webp", thumb:"shops/street-sunset-thumb.webp", overlay:.35 },
  { id:"bookshop", name:"The Bookshop Front", image:"shops/bookshop-front.jpg",    thumb:"shops/bookshop-front-thumb.jpg",    overlay:.30, hidden:true },
  { id:"path",     name:"Golden Coastal Path",image:"shops/coastal-path.jpg",      thumb:"shops/coastal-path-thumb.jpg",      overlay:.30, hidden:true }
];

const STORYTIME_PICTURE = { image:"storytime/story-time.webp", small:"storytime/story-time-sm.webp", alt:"A cosy bookshop corner with a crackling fire and two armchairs, seen from behind: silver hair above one high-backed chair, a hand holding an open book" };
const STORYTIME = [ {
  slug:"the-wisdom-of-aloharin",
  title:"The Wisdom of Aloharin",
  summary:"A sample from the audiobook: Saphira’s farewell, and why we come into this world. The full audiobook is on Spotify.",
  chapter:"A sample from the audiobook",
  sample:true,
  fullNote:"The full audiobook is on Spotify.",
  fullLink:"https://open.spotify.com/show/6HLyNCsaJ6gU9Y81oLwSvU",
  cover:"storytime/aloharin-cover.webp",
  theme:{bg:"#0b2a3b",accent:"mint"},
  credit:"The Wisdom of Aloharin by Paul Isherwood",
  audio:"audio/the-wisdom-of-aloharin.mp3",
  duration:253,
  marks:[0.0, 16.0, 32.1, 41.5, 58.3, 67.4, 85.3, 100.4, 117.1, 128.8, 140.3, 150.2, 166.8, 176.2, 192.9, 212.1, 225.4, 237.2],
  body:[
 "At the base of the steps, a murmur rose, a single plea, picked up and carried by the crowd:",
 "“Saphira, before you leave us – share your wisdom once more, so we may carry it in our hearts when you are gone!”",
 "Saphira closed her eyes for a moment, breathing in the golden light, feeling the ache of parting rise and swell inside her. She felt a deep love for them all: for the people of Aloharin and for those dearest to her. For Alfonso, with his quiet wisdom and humour. For Eleonora, whose presence had been like a guiding lamp from the very beginning.",
 "And for Elfira, sweet, brilliant Elfira, who now stood with tear-filled eyes, barely holding herself together. As Saphira looked at her, she felt her own tears rising, the weight of their bond pressing softly against her chest. She longed to go to her, to gather her close one last time. But instead, she drew in a breath and steadied herself.",
 "She was here now as their prophet. This moment was not for sorrow, but for offering.",
 "And yet, beneath the sadness, there was peace. A deep, quiet knowing that all was well, that this, too, was part of the journey.",
 "She opened her eyes and smiled, a soft, radiant smile full of love. She lifted her hands in blessing, her cloak catching the last light of the setting sun, her presence a quiet beacon.",
 "And then she stepped forward, her voice ready to weave its final gift.",
 "From the crowd, a young woman stepped forward, her hands resting gently on the curve of her belly. Her eyes shone with wonder and a trace of uncertainty.",
 "She lifted her voice and asked,",
 "“Saphira, before you leave us… tell me. Why do we come into this world? What is the purpose of this life?”",
 "Saphira met her gaze with warmth and tenderness. For a moment, she was silent, her hand resting gently over her heart. Then she began.",
 "“This is one of the great questions of the soul. Especially in difficult moments, we wonder: why would we choose to come here at all?",
 "“To begin to understand, we must first remember: You are more than this body. You are part of something eternal. You are part of the divine. And before you were born, from beyond this world, you chose to come.",
 "“And there is a power beyond the physical, a wisdom that walks beside you always, helping you to live the life you came here to live.",
 "“And now, as you welcome new life into this world, this wisdom is made visible again. For when your child arrives, they will remind you of everything you’ve forgotten. You’ll see it in the way they reach for joy in every moment. How they play, how they giggle, how they turn the ordinary into delight.",
 "“And in watching them, you will remember what it is to live with lightness. To seek what feels good. To follow curiosity. To laugh for no reason. To trust the goodness of life.",
 "“And when you remember, you will feel more joy in your own life. You will walk together, hand in hand, not just as mother and child, but as companions on a great and beautiful adventure.”",
 "The woman’s eyes shimmered as Saphira’s words settled into her heart. She placed both hands gently over her belly, and for a moment, she simply breathed.",
 "A feeling rose within her, warm, steady and bright. It was as if some ancient part of her had finally remembered life was unfolding as it should, and was destined to be more beautiful than she had ever imagined."
]
} ];


/* =====================================================================
   PAID AUDIO  (added 19 Nov 2026)
   Each item here is sold on its own page: misssophiabooks.com/audiobook/<slug>
   - access:"paid"; price in pence; priceText is what the page shows; productId is what Stripe and the purchase record use.
   - bookSlug: the BOOKS entry that supplies the description, the Amazon link (url) and the Spotify link (audiobook).
   - sample: the FREE sample. It is a normal public file in the audio folder.
   - chapters: one entry per chapter, in order.
       n        = the chapter number (null for Titles & Credits and the Preface, which are not numbered chapters)
       title    = the chapter title            first = the first sentence of the chapter (the player adds "..." itself; "" for none)
       file     = the chapter's file name in PRIVATE storage (never in the public audio folder)
       duration = length in seconds
     The book's text is never shown: only the title and that first sentence.
   - Titles, first sentences and lengths below are the real ones (19 Nov 2026). The files are in private storage (stage 4).
   ===================================================================== */
const AUDIOBOOKS = [ {
  slug:"a-christmas-dream",
  access:"paid", price:499, priceText:"£4.99", productId:"a-christmas-dream-audiobook",
    taxCode:"txcd_10301000", // Stripe product tax category "Audiobook". PAUL TO CHECK with Stripe/an adviser that this is the right one for your streamed audiobook.
  bookSlug:"a-christmas-dream",
  title:"A Christmas Dream",
  kind:"Audiobook",
  by:"Paul Isherwood",
  narration:"Read by Miss Sophia", narrationNote:"AI voice",   /* shown as: Read by Miss Sophia (AI voice). narrationNote is the quiet bracket; set it to "" to remove it. */
  cover:"covers/a-christmas-dream-2.jpg",
  theme:{bg:"#3a0d14",accent:"peach"},
  sample:{ audio:"audio/a-christmas-dream-sample.mp3", duration:417 },
  chapters:[
    { n:null, title:"Titles & Credits", first:"", file:"track-01.mp3", duration:7 },
    { n:null, title:"Preface", first:"", file:"track-02.mp3", duration:40 },
    { n:1, title:"A Box of Memories", first:"Oliver had always loved Christmas.", file:"track-03.mp3", duration:695 },
    { n:2, title:"A Familiar Glow", first:"That night, the house was unusually quiet.", file:"track-04.mp3", duration:287 },
    { n:3, title:"Christmas Past", first:"The swirling light around them grew brighter, softening into a golden glow that felt both familiar and comforting.", file:"track-05.mp3", duration:472 },
    { n:4, title:"Christmas Present", first:"The shimmering light faded, leaving Oliver standing in his own living room.", file:"track-06.mp3", duration:738 },
    { n:5, title:"Christmas Yet to Come", first:"The golden light around Oliver softened, turning into a radiant, silvery glow that filled the space with a quiet stillness.", file:"track-07.mp3", duration:496 },
    { n:6, title:"Waking Up to Joy", first:"The house was quiet, cloaked in the lingering darkness of a winter morning.", file:"track-08.mp3", duration:400 },
    { n:7, title:"Miss Sophia’s Bookshop", first:"After lunch, the three of them bundled up in scarves and coats and set off for the village.", file:"track-09.mp3", duration:367 },
    { n:8, title:"’Twas the Night Before Christmas", first:"The walk home from the village was magical.", file:"track-10.mp3", duration:319 },
    { n:9, title:"A Christmas Miracle", first:"The next morning, Oliver awoke feeling wonderful.", file:"track-11.mp3", duration:274 },
    { n:10, title:"A Sign of Love", first:"The sound of the doorbell rang out just as Oliver reached for the peeler.", file:"track-12.mp3", duration:467 },
    { n:11, title:"The Greatest Gift", first:"After the robin’s visit, the garden beyond the frosted glass seemed even more still and quiet, the snow glistening faintly under the soft glow spilling from the living room.", file:"track-13.mp3", duration:540 }
  ]
} ];
/* helpers used by the product page and the player */
const bookSeconds = b => b.chapters.reduce((a,c) => a + c.duration, 0);
const bookMinutes = b => Math.max(1, Math.round(bookSeconds(b) / 60));
const bookChapterCount = b => b.chapters.filter(c => c.n).length;
const hrmin = sec => { const m = Math.max(1, Math.round(sec / 60)); return m >= 60 ? Math.floor(m / 60) + ' hr' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min'; };
const teaser = t => String(t).replace(/[.…\s]+$/, '') + '...';

/* ---- Checkout wording (shown on our own page just before Stripe; saved with each purchase) ----
   PAUL TO CHECK before going live: the "digital" wording is a DRAFT. It has to match what the law requires for digital content
   (immediate access, and losing the 14-day cancellation right once listening starts). Check it against the official GOV.UK / Trading Standards guidance.
   The "marketing" wording is yours exactly as given; its box is always UNTICKED to start with. */
const CHECKOUT_WORDING = {
  digital:"DRAFT, TO CHECK: I agree that my access starts straight away, and that I lose my right to cancel within 14 days once I start listening.",
  marketing:"Occasionally send me news of new stories"
};
