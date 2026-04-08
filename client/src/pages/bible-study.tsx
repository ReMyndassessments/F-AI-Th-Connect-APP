import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Home, Upload, X, Copy, Download, Loader2, FileText, BookOpen, Video, Share2, Mail, Check, MessageSquare, Users, Pencil } from "lucide-react";
import { chatApi } from "@/lib/chat-api";
import { useToast } from "@/hooks/use-toast";

// =====================================================================
// STUDY TYPES
// =====================================================================
interface StudyType {
  id: string;
  label: string;
  emoji: string;
  color: string;
  defaultGroup: string;
  prompt: (groupName: string, topic: string, hasFile: boolean) => string;
}

const STUDY_TYPES: StudyType[] = [
  {
    id: 'mens',
    label: "Men's Bible Study",
    emoji: '👨',
    color: 'from-blue-500 to-blue-700',
    defaultGroup: 'Fishers of Men',
    prompt: (group, topic, hasFile) => `Create a comprehensive Men's Bible Study Guide for the group "${group}"${topic ? ` focused on: ${topic}` : ''} for a one-hour session that directly addresses the real everyday challenges men face and shows how Scripture speaks to these specific issues.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this Bible study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study on a relevant topic for men today.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with the group name "${group}" as a prominent heading
- Create an inspiring title with subtitle
- State the central message (1 paragraph)
- Key Verse in full (book, chapter, verse, translation, and complete text)
- Connect Scripture to specific men's issues: financial pressure, workplace stress, temptation, isolation, family balance, spiritual leadership, anger, purpose beyond career

2. ONE-HOUR STUDY PLAN
- Welcome & Prayer: 5 min
- Teaching: 15 min
- Discussion: 25 min
- Application & Challenge: 10 min
- Closing Prayer: 5 min

3. THREE CORE TEACHING SECTIONS
For each section:
- Section Title
- Full Scripture Texts (quoted completely with reference and translation)
- Teaching Point: 1-2 paragraphs linking Scripture directly to men's everyday challenges
- Discussion Questions: 3-4 questions about real situations (work pressures, marriage, parenting, personal struggles)
- Practical Application: Specific actionable steps for the coming week

4. FINAL CHALLENGE & CLOSING
- One summarizing Scripture (quoted fully)
- Commitment Exercise: "This week, in my work/family/personal life, I will ____________"
- Short closing prayer

STYLE: Man-to-man honesty. Address issues men actually face but don't talk about. Make Scripture directly applicable to Monday morning at work, Tuesday evening with kids, Wednesday's temptations. Quote ALL Bible verses in full.`
  },
  {
    id: 'womens',
    label: "Women's Bible Study",
    emoji: '👩',
    color: 'from-rose-400 to-pink-600',
    defaultGroup: 'Daughters of the King',
    prompt: (group, topic, hasFile) => `Create a comprehensive Women's Bible Study Guide for the group "${group}"${topic ? ` focused on: ${topic}` : ''} for a one-hour session that directly addresses the real everyday challenges women face and shows how Scripture speaks to these specific issues.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this Bible study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study on a relevant topic for women today.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with the group name "${group}" as a prominent heading
- Create an inspiring title with subtitle (example: "Daughters of the King: Walking in Grace and Strength")
- State the central message (1 paragraph)
- Key Verse in full (book, chapter, verse, translation, and complete text)
- Connect Scripture to specific women's issues: comparison and feeling not enough, juggling multiple roles (mom/wife/professional), mom guilt, self-worth, caring for everyone else, difficult relationships, marriage challenges, loneliness, perfectionism, people-pleasing, anxiety about children

2. ONE-HOUR STUDY PLAN
- Welcome & Prayer: 5 min
- Teaching: 15 min
- Discussion: 25 min
- Application & Challenge: 10 min
- Closing Prayer: 5 min

3. THREE CORE TEACHING SECTIONS
For each section:
- Section Title
- Full Scripture Texts (quoted completely with reference and translation)
- Teaching Point: 1-2 paragraphs linking Scripture directly to women's everyday challenges
- Discussion Questions: 3-4 questions about real situations (overwhelm, comparison, identity, relationships)
- Practical Application: Specific actionable steps (setting one boundary, releasing one comparison trigger, one act of self-care without guilt)

4. FINAL CHALLENGE & CLOSING
- One summarizing Scripture (quoted fully)
- Commitment Exercise: "This week, I will extend grace to myself by ____________"
- Short closing prayer

STYLE: Woman-to-woman empathy. Address the emotional weight women carry. Make Scripture applicable to carpool, bedtime routines, quiet morning coffee, moments of overwhelm. Quote ALL Bible verses in full.`
  },
  {
    id: 'business',
    label: 'Business & Marketplace',
    emoji: '💼',
    color: 'from-slate-500 to-gray-700',
    defaultGroup: 'Marketplace Ministers',
    prompt: (group, topic, hasFile) => `Create a comprehensive Business & Marketplace Bible Study Guide for the group "${group}"${topic ? ` focused on: ${topic}` : ''} for a one-hour session specifically for Christian business people, entrepreneurs, and professionals.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this Bible study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study on faith and work integration for business professionals.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with the group name "${group}" as a prominent heading
- Create an inspiring title (e.g., "Kingdom Business: Serving God in the Marketplace")
- Key Verse in full with complete text
- Connect Scripture to: ethical dilemmas at work, leading with integrity, competing as a Christian, honoring God in profit decisions, treating employees as image-bearers, business failure and faith, work-life stewardship, using wealth for the Kingdom

2. ONE-HOUR STUDY PLAN
- Welcome & Prayer: 5 min
- Business Case/Teaching: 20 min
- Discussion: 25 min
- Application: 5 min
- Closing Prayer: 5 min

3. THREE CORE TEACHING SECTIONS
For each section:
- Section Title
- Full Scripture Texts (quoted completely)
- Teaching Point linking Scripture to real business and professional challenges
- Discussion Questions: 3-4 practical workplace dilemmas (negotiation ethics, competitive behavior, financial decisions, team management, client relationships)
- Monday Application: Specific action for the coming work week

4. FINAL CHALLENGE & CLOSING
- One summarizing Scripture (quoted fully)
- Commitment: "This week in my business/career, I will ____________"
- Short prayer for Kingdom impact through work

STYLE: Speak as one professional to another. Address real boardroom and business challenges with Biblical wisdom. Practical and applicable. Quote ALL Bible verses in full.`
  },
  {
    id: 'sundayschool',
    label: 'Sunday School',
    emoji: '🧒',
    color: 'from-yellow-400 to-orange-500',
    defaultGroup: 'Sunday School Class',
    prompt: (group, topic, hasFile) => `Create a comprehensive Sunday School Bible Lesson for the class "${group}"${topic ? ` focused on: ${topic}` : ''} that is engaging, age-appropriate, and helps children (ages 6-12) understand and apply God's Word.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this lesson. Build the lesson around the themes, Scripture references, and topics from the attached content.' : 'Create a fun, engaging lesson for primary school aged children.'}

REQUIRED STRUCTURE:

1. CLASS NAME & LESSON TITLE
- Start with the class name "${group}" as a heading
- Create a fun, memorable title children will love
- Key Verse (simple translation like NIrV or NIV - quoted in full)
- Central truth statement (one simple sentence a child can memorize)

2. LESSON PLAN (45-60 minutes)
- Welcome & Icebreaker Game: 10 min
- Bible Story Teaching: 15 min
- Interactive Activity: 10 min
- Discussion Circle: 10 min
- Craft/Memory Work: 10 min
- Prayer: 5 min

3. BIBLE STORY TEACHING
- Tell the Bible story engagingly (narrative style)
- Include actions/motions children can do during the story
- 3 key points explained simply
- Questions children can answer (level-appropriate)

4. INTERACTIVE ELEMENTS
- Opening icebreaker game that connects to the theme
- Discussion questions for children (relatable: school, friends, family)
- Practical application (what can I do this week at school, at home, with friends?)
- Memory verse activity (fun way to learn the verse)
- Simple craft or activity idea

5. PARENT TAKE-HOME
- One sentence summary of today's lesson
- How parents can reinforce at home this week
- A family activity or dinner table question

STYLE: Energetic, simple, story-driven. Use analogies children understand (school, sports, video games, friendships). Make the Bible come alive. Use simple language throughout.`
  },
  {
    id: 'youth',
    label: 'Youth Group',
    emoji: '🎯',
    color: 'from-violet-500 to-purple-700',
    defaultGroup: 'Youth Group',
    prompt: (group, topic, hasFile) => `Create a comprehensive Youth Group Bible Study for "${group}"${topic ? ` focused on: ${topic}` : ''} that is relevant, honest, and engages teenagers (ages 13-18) where they actually are in life.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study addressing the real challenges teens face today.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with "${group}" as a heading
- Create a title that sounds interesting to a teenager
- Key Verse (quoted fully in a modern translation like NIV or NLT)
- The BIG question this study answers

2. SESSION PLAN (60-75 minutes)
- Opener/Game: 10-15 min
- Icebreaker Discussion: 5 min
- Bible Teaching: 15-20 min
- Small Group Discussion: 20 min
- Response/Application: 10 min
- Worship/Prayer: 5-10 min

3. THREE TEACHING POINTS
For each point:
- Relatable opener (social media, school, relationships, peer pressure, identity)
- Scripture (quoted in full with modern translation)
- Honest explanation connecting Scripture to teen life
- Discussion questions about real struggles: identity, dating, social media comparison, anxiety, belonging, faith doubts, parents, future fears
- A challenge they can actually do

4. REAL TALK SECTION
- Address a hard question teenagers actually ask about faith
- Give an honest, Biblical answer (don't dodge it)
- How to handle this with their friends

5. CLOSING
- Summarizing Scripture (quoted fully)
- One challenge for the week
- Prayer that sounds like a real conversation with God

STYLE: Talk to teens, not at them. Be honest about doubt and struggle. Use current cultural references. Don't be cheesy. Respect their intelligence. Quote ALL Bible verses in full.`
  },
  {
    id: 'couples',
    label: 'Couples Group',
    emoji: '💑',
    color: 'from-red-400 to-rose-600',
    defaultGroup: 'Couples Bible Study',
    prompt: (group, topic, hasFile) => `Create a comprehensive Couples Bible Study Guide for "${group}"${topic ? ` focused on: ${topic}` : ''} that strengthens marriages and helps couples build a Christ-centered relationship together.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study on building a strong, Christ-centered marriage.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with "${group}" as a heading
- Create an inspiring title (e.g., "Two Becoming One: God's Design for Marriage")
- Key Verse (quoted fully)
- Central truth about marriage or relationships

2. SESSION PLAN (75 minutes)
- Welcome & Couple Icebreaker: 10 min
- Teaching: 20 min
- Couple Discussion (private): 15 min
- Group Discussion: 20 min
- Practical Application: 5 min
- Couple Prayer Time: 5 min

3. THREE TEACHING SECTIONS
For each section:
- Section Title
- Scripture (quoted fully with reference and translation)
- Teaching Point addressing real marriage challenges (communication breakdown, intimacy, financial disagreements, parenting differences, spiritual leadership, forgiveness cycles, in-law dynamics, work-life balance as a couple)
- Couple Questions (to discuss privately): 2-3 honest questions
- Group Discussion: 2-3 questions to share as couples
- This Week's Couple Challenge: A specific activity or conversation

4. INDIVIDUAL REFLECTION
- A moment for each spouse to reflect privately (1-2 prompts)
- How to express appreciation to your spouse using this study

5. CLOSING
- Summarizing Scripture (quoted fully)
- Couple Commitment: "Together this week we will ____________"
- Closing prayer for the marriages in the room

STYLE: Warm, safe, and honest. Create space for vulnerability. Address real marriage struggles without shame. Celebrate the beauty of covenant love. Quote ALL Bible verses in full.`
  },
  {
    id: 'seniors',
    label: 'Senior Adults',
    emoji: '🌿',
    color: 'from-green-500 to-emerald-700',
    defaultGroup: 'Senior Bible Fellowship',
    prompt: (group, topic, hasFile) => `Create a comprehensive Senior Adults Bible Study Guide for "${group}"${topic ? ` focused on: ${topic}` : ''} that honors the wisdom and life experience of older adults while addressing the unique challenges of the senior season of life.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a study honoring the senior season of life with biblical wisdom.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with "${group}" as a heading
- Create a dignified, meaningful title
- Key Verse (quoted fully - KJV or NIV preferred)
- Central message that honors a life of faith

2. SESSION PLAN (60 minutes)
- Welcome & Sharing Time: 10 min
- Opening Devotion: 5 min
- Bible Teaching: 20 min
- Discussion: 20 min
- Prayer Requests & Closing: 5 min

3. THREE TEACHING SECTIONS
For each section:
- Scripture (quoted fully with reference and translation)
- Teaching Point addressing senior life realities: legacy and meaning, health challenges and suffering, loss and grief, fear of death/dying, feeling forgotten or less useful, grandparenting and family roles, living on fixed income, caring for spouse, end-of-life hope, the gift of hard-won wisdom
- Discussion Questions: 3-4 reflective questions that draw on life experience
- Application: Simple, accessible practical step

4. LEGACY SECTION
- How seniors can pour their wisdom into younger generations
- The unique spiritual gifts of the senior season
- Scripture about finishing strong

5. CLOSING
- Summarizing Scripture (quoted fully)
- A blessing to speak over the group
- Prayer focusing on hope, peace, and eternal perspective

STYLE: Respectful, dignified, reflective. Honor their lifetime of experience. Don't talk down to them. Connect deeply with themes of hope, legacy, and eternity. Quote ALL Bible verses in full.`
  },
  {
    id: 'general',
    label: 'General / Mixed Group',
    emoji: '✝️',
    color: 'from-amber-500 to-amber-700',
    defaultGroup: 'Bible Study Group',
    prompt: (group, topic, hasFile) => `Create a comprehensive Bible Study Guide for the group "${group}"${topic ? ` focused on: ${topic}` : ''} for a one-hour session that works well for a mixed group of adults of different ages and backgrounds.

${hasFile ? 'IMPORTANT: The user has attached a sermon script or sermon notes above. Use that content as the PRIMARY foundation for this Bible study. Build the study around the themes, Scripture references, and topics from the attached content.' : 'Create a well-rounded, inclusive study for a general adult group.'}

REQUIRED STRUCTURE:

1. GROUP NAME & TITLE
- Start with "${group}" as a prominent heading
- Create an engaging title with subtitle
- Key Verse (quoted fully with translation)
- Central message of the study

2. ONE-HOUR STUDY PLAN
- Welcome & Prayer: 5 min
- Teaching: 15 min
- Discussion: 25 min
- Application & Response: 10 min
- Closing Prayer: 5 min

3. THREE CORE TEACHING SECTIONS
For each section:
- Section Title
- Full Scripture Texts (quoted completely with reference and translation)
- Teaching Point: 1-2 paragraphs connecting Scripture to everyday life (relationships, work, family, personal struggles, society)
- Discussion Questions: 3-4 open questions accessible to people at different points in their faith journey
- Practical Application: Specific actionable steps for the coming week

4. DEEPER DIVE (optional for leaders)
- A theological insight or historical context point
- A challenge for more mature believers
- A bridge question for newer believers

5. FINAL CHALLENGE & CLOSING
- One summarizing Scripture (quoted fully)
- Commitment Exercise: "This week I will ____________"
- Short closing prayer

STYLE: Inclusive, accessible, and deep. Works for both new and mature believers. Practical and applicable to everyday life. Quote ALL Bible verses in full.`
  },
];

// =====================================================================
// MAIN PAGE
// =====================================================================
interface MeetingRoom { code: string; jitsiRoom: string; groupName: string; studyType: string; }

export default function BibleStudy() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ccfFileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const meetingRef = useRef<HTMLDivElement>(null);

  const [groupName, setGroupName] = useState('');
  const [topic, setTopic] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [studySource, setStudySource] = useState<'ccf-4ws' | 'generated' | 'template' | 'uploaded' | null>(null);
  const [pendingUploadText, setPendingUploadText] = useState('');
  const [showTip, setShowTip] = useState(true);

  const [isLoadingCcf, setIsLoadingCcf] = useState(false);
  const [ccfBlocked, setCcfBlocked] = useState(false);

  // Meeting room state
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [meetingRoom, setMeetingRoom] = useState<MeetingRoom | null>(null);
  const [inviteEmails, setInviteEmails] = useState('');
  const [roomLinkCopied, setRoomLinkCopied] = useState(false);
  const [leaderName, setLeaderName] = useState('');

  // Auto-scroll to result when it appears (offset 80px for sticky header)
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        const el = resultRef.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 200);
    }
  }, [result]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please use a file under 5MB.", variant: "destructive" });
      return;
    }

    const allowed = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload a .txt, .pdf, or .docx file.", variant: "destructive" });
      return;
    }

    setFileName(file.name);

    let extractedText = '';
    if (file.type === 'text/plain') {
      extractedText = await file.text();
      setFileContent(`[SERMON/NOTES FILE: ${file.name}]\n\n${extractedText}`);
    } else {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/process-file', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          extractedText = data.content || data.text || '';
          setFileContent(`[SERMON/NOTES FILE: ${file.name}]\n\n${extractedText}`);
        } else {
          setFileContent(`[ATTACHED FILE: ${file.name}] - Use the themes and content from this file as the foundation for the Bible study.`);
        }
      } catch {
        setFileContent(`[ATTACHED FILE: ${file.name}] - Use the themes and content from this file as the foundation for the Bible study.`);
      }
    }

    // Store extracted text as pending — user must click "Use as Study Guide" to confirm
    setPendingUploadText(extractedText);

    toast({ title: "File attached!", description: `${file.name} is ready. Click "Use as Study Guide" below to attach it to your meeting room.` });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = () => { setFileContent(''); setFileName(''); setPendingUploadText(''); };

  // Separate handler for uploading CCF 4W's guide directly as the study guide
  const handleCcfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please use a file under 5MB.", variant: "destructive" });
      return;
    }
    const allowed = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowed.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Please upload a .txt, .pdf, or .docx file.", variant: "destructive" });
      return;
    }

    let extractedText = '';
    setFileName(file.name);
    if (file.type === 'text/plain') {
      extractedText = await file.text();
    } else {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/process-file', { method: 'POST', body: formData });
        if (res.ok) {
          const data = await res.json();
          extractedText = data.content || data.text || '';
        }
      } catch { /* ignore */ }
    }

    const displayText = extractedText || '[Guide loaded but text could not be extracted — it may be a scanned image PDF.]';
    setFileContent(`[CCF WEEKLY GUIDE: ${file.name}]\n\n${extractedText}`);
    setResult(displayText);
    setStudySource('ccf-4ws');
    setActiveType(null);
    setMeetingRoom(null);
    if (ccfFileInputRef.current) ccfFileInputRef.current.value = '';
    toast({ title: 'CCF 4 W\'s Guide loaded!', description: 'Ready to share in a meeting room. You can also generate an AI study from it below.' });
  };

  const use4WsTemplate = () => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const name = groupName.trim() || 'My D-Group';
    const template = `D-GROUP STUDY GUIDE — 4 W's
Group: ${name}
Date: ${dateStr}
Passage: [Enter Scripture reference here]

────────────────────────────────────

WELCOME  (10–15 min)
Icebreaker / opening question:
[Write your question here — e.g. "What is one thing you are grateful for this week?"]

────────────────────────────────────

WORSHIP  (10 min)
Prayer focus for today:
• Praise:
• Thanksgiving:
• Intercession:

[Leader opens in prayer, or open it up to the group]

────────────────────────────────────

WORD  (30–40 min)
Scripture: [Passage]

Read the passage aloud together, then discuss:

1. WHAT DOES IT SAY?  (Observation)
   [What are the key facts, characters, or events in this passage?]

2. WHAT DOES IT MEAN?  (Interpretation)
   [What is the main truth or message God is communicating?]

3. WHAT DOES IT MEAN TO ME?  (Application)
   [How does this truth apply to your life right now?]

4. WHAT WILL I DO?  (Response)
   [What is one specific, measurable step you will take this week?]

────────────────────────────────────

WORKS  (10–15 min)
Accountability:
• Last week's commitment — How did it go?
• This week's commitment — What will you do differently?
• Prayer partner — Who will you check in with this week?

Closing Prayer`;
    setResult(template);
    setStudySource('template');
    setActiveType(null);
    toast({ title: '4 W\'s template ready!', description: 'Edit it to fit your group, then create your meeting room.' });
  };

  const loadCcfWeekly = async () => {
    setIsLoadingCcf(true);
    try {
      const res = await fetch('/api/dgroups/ccf-weekly');
      const contentType = res.headers.get('content-type') || '';

      // If anything other than a real file comes back (HTML error page, blocked, etc.) → manual mode
      if (!res.ok || contentType.includes('text/html')) {
        setCcfBlocked(true);
        toast({
          title: 'Manual download needed',
          description: 'Tap "Open CCF Page" to download this week\'s guide, then upload it with the Upload button.',
        });
        return;
      }

      const blob = await res.blob();
      const ext = contentType.includes('pdf') ? 'pdf' : contentType.includes('word') ? 'docx' : 'txt';
      const ccfFileName = `CCF-Weekly-Guide.${ext}`;
      const file = new File([blob], ccfFileName, { type: blob.type });

      let extractedText = '';
      if (file.type === 'text/plain') {
        extractedText = await file.text();
      } else {
        const formData = new FormData();
        formData.append('file', file);
        const parseRes = await fetch('/api/process-file', { method: 'POST', body: formData });
        if (parseRes.ok) {
          const data = await parseRes.json();
          extractedText = data.content || data.text || '';
        }
      }

      setFileContent(`[CCF WEEKLY GUIDE: ${ccfFileName}]\n\n${extractedText}`);
      setFileName(ccfFileName);
      setResult(extractedText || '[The guide loaded but text could not be extracted — it may be a scanned image PDF. Try generating a study guide from it anyway.]');
      setStudySource('ccf-4ws');
      setActiveType(null);
      setMeetingRoom(null);
      setCcfBlocked(false);
      toast({ title: 'CCF Weekly Guide loaded!', description: 'The 4 W\'s guide is ready — create your meeting room to share it, or generate an AI study below.' });
    } catch {
      // Any failure at all → show manual download UI, never a raw error
      setCcfBlocked(true);
      toast({
        title: 'Manual download needed',
        description: 'Tap "Open CCF Page" to download this week\'s guide, then upload it with the Upload button.',
      });
    } finally {
      setIsLoadingCcf(false);
    }
  };

  const generate = async (studyType: StudyType) => {
    setIsGenerating(true);
    setActiveType(studyType.id);
    setResult('');
    setStudySource(null);
    setMeetingRoom(null);

    const finalGroupName = groupName.trim() || studyType.defaultGroup;
    const prompt = studyType.prompt(finalGroupName, topic.trim(), !!fileContent);
    const fullMessage = fileContent ? `${fileContent}\n\n${prompt}` : prompt;

    try {
      const session = await chatApi.createSession();
      const response = await chatApi.sendMessage(session.sessionId, fullMessage);
      setResult(response.aiMessage.content);
      setStudySource('generated');
      toast({ title: "Study guide ready!", description: "Scroll down to view your guide and start a meeting." });
    } catch (err) {
      toast({ title: "Generation failed", description: "Please try again. Check your connection.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copied!", description: "Study guide copied to clipboard." });
  };

  const downloadResult = () => {
    const studyType = STUDY_TYPES.find(s => s.id === activeType);
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studyType?.label || 'Bible Study'} - ${groupName || 'Group'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const createMeetingRoom = async () => {
    const studyType = STUDY_TYPES.find(s => s.id === activeType);
    const finalGroupName = groupName.trim() || studyType?.defaultGroup || 'D-Group';
    setIsCreatingRoom(true);
    try {
      const res = await fetch('/api/dgroups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName: finalGroupName,
          studyType: activeType,
          studyContent: result,
          leaderName: leaderName.trim() || 'Leader',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      const room = await res.json();
      setMeetingRoom(room);
    } catch {
      toast({ title: 'Could not create meeting room', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const getRoomLink = () => meetingRoom ? `${window.location.origin}/dgroup/${meetingRoom.code}` : '';

  const copyRoomLink = () => {
    navigator.clipboard.writeText(getRoomLink());
    setRoomLinkCopied(true);
    toast({ title: 'Link copied!', description: 'Share this with your group members.' });
    setTimeout(() => setRoomLinkCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    if (!meetingRoom) return;
    const studySection = result
      ? `\n\n--- STUDY GUIDE ---\n${result.slice(0, 1000)}${result.length > 1000 ? '\n\n[Full guide available in the meeting room]' : ''}`
      : '';
    const text = encodeURIComponent(
      `You're invited to ${meetingRoom.groupName} D-Group!\n\nJoin the meeting: ${getRoomLink()}\nRoom code: ${meetingRoom.code}${studySection}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareEmail = () => {
    if (!meetingRoom) return;
    const emails = inviteEmails.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
    const subject = encodeURIComponent(`You're invited: ${meetingRoom.groupName} D-Group Meeting`);
    const studySection = result
      ? `\n\n--- BIBLE STUDY GUIDE ---\n\n${result}\n\n---`
      : '';
    const body = encodeURIComponent(
      `Hi,\n\nYou're invited to join our D-Group Bible study meeting!\n\nGroup: ${meetingRoom.groupName}\nRoom Code: ${meetingRoom.code}\n\nClick to join:\n${getRoomLink()}${studySection}\n\nSee you there!`
    );
    window.open(`mailto:${emails.join(',')}?subject=${subject}&body=${body}`, '_blank');
  };

  // Format the result for display (convert basic markdown to readable text)
  const formatResult = (text: string) => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/#{1,4}\s+/g, '')
      .replace(/---+/g, '────────────────────')
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Home className="w-5 h-5 text-gray-600"/>
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">D-Group Bible Study Generator</h1>
            <p className="text-sm text-gray-500">Create tailored study guides for your D-Group or Bible study</p>
          </div>
          <BookOpen className="w-6 h-6 text-blue-500"/>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Tip Banner */}
        {showTip && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div className="flex-1">
              <p className="text-sm text-blue-800 font-medium">Pro tip for group leaders</p>
              <p className="text-sm text-blue-700 mt-0.5">Upload your pastor's sermon notes or a Scripture passage, enter your group name, then tap your group type. The AI will generate a complete, tailored study guide in seconds.</p>
            </div>
            <button onClick={() => setShowTip(false)} className="text-blue-400 hover:text-blue-600 flex-shrink-0">
              <X className="w-4 h-4"/>
            </button>
          </div>
        )}

        {/* Setup Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">Study Setup</h2>

          {/* Quick Start Options */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-4 space-y-3">
            <p className="text-sm font-bold text-indigo-900">Quick Start — choose how to begin:</p>
            <div className="grid sm:grid-cols-3 gap-2">
              {/* Upload own */}
              <button onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-1.5 p-3 bg-white border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-indigo-700 hover:text-indigo-900 transition-all text-sm font-semibold text-center">
                <Upload className="w-5 h-5"/>
                <span>Upload My Own<br/><span className="text-xs font-normal text-gray-500">Past 4W's, personal study guides or sermon notes</span></span>
              </button>

              {/* 4 W's template */}
              <button onClick={use4WsTemplate}
                className="flex flex-col items-center gap-1.5 p-3 bg-white border-2 border-amber-300 hover:border-amber-500 rounded-xl text-amber-700 hover:text-amber-900 transition-all text-sm font-semibold text-center">
                <span className="text-xl">✏️</span>
                <span>4 W's Template<br/><span className="text-xs font-normal text-gray-500">Blank guide to fill yourself</span></span>
              </button>

              {/* CCF Weekly */}
              {ccfBlocked ? (
                <div className="flex flex-col items-center gap-2 p-3 bg-amber-50 border-2 border-amber-400 rounded-xl text-center">
                  <span className="text-xl">⬇️</span>
                  <span className="text-xs font-bold text-amber-800">Manual download needed</span>
                  <a href="https://www.ccf.org.ph/download/40059/" target="_blank" rel="noopener noreferrer"
                    className="w-full text-xs text-white bg-amber-500 hover:bg-amber-600 px-3 py-2 rounded-lg font-semibold">
                    1. Open CCF Page &amp; Download
                  </a>
                  <button onClick={() => ccfFileInputRef.current?.click()}
                    className="w-full text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg font-semibold flex items-center justify-center gap-1">
                    <Upload className="w-3.5 h-3.5"/> 2. Upload Latest 4W's
                  </button>
                  <input ref={ccfFileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleCcfUpload}/>
                </div>
              ) : (
                <button onClick={loadCcfWeekly} disabled={isLoadingCcf}
                  className="flex flex-col items-center gap-1.5 p-3 bg-white border-2 border-green-300 hover:border-green-500 rounded-xl text-green-700 hover:text-green-900 transition-all text-sm font-semibold text-center disabled:opacity-50">
                  {isLoadingCcf ? <Loader2 className="w-5 h-5 animate-spin"/> : <span className="text-xl">📥</span>}
                  <span>{isLoadingCcf ? 'Loading...' : 'CCF Weekly Guide'}<br/><span className="text-xs font-normal text-gray-500">Auto-load this week's CCF guide</span></span>
                </button>
              )}
            </div>
            <p className="text-xs text-indigo-500 text-center">Or scroll down to let AI generate a guide using the study type buttons below.</p>
          </div>

          {/* File Upload — shown when a file is attached */}
          <div className="space-y-2">
            {fileName && (
              <>
                {/* File attached row */}
                <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0"/>
                  <span className="text-sm font-medium text-blue-800 flex-1 truncate">{fileName}</span>
                  <button onClick={removeFile} className="text-blue-400 hover:text-red-500 ml-2 flex-shrink-0">
                    <X className="w-4 h-4"/>
                  </button>
                </div>

                {/* Confirm + bypass — only show when file is not yet set as study guide */}
                {studySource !== 'uploaded' && (
                  <div className="space-y-2">
                    {/* Warning + paste fallback if PDF text extraction failed */}
                    {!pendingUploadText && (
                      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-2">
                        <p className="text-xs font-semibold text-amber-800">
                          ⚠️ Text could not be read from this PDF (it may be a scanned image).
                        </p>
                        <p className="text-xs text-amber-700">
                          Paste the 4 W's content below so participants can read it in the meeting room:
                        </p>
                        <textarea
                          rows={6}
                          placeholder="Paste your 4 W's or study guide text here…"
                          onChange={e => setPendingUploadText(e.target.value)}
                          className="w-full border border-amber-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 resize-y"
                        />
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => {
                          const text = pendingUploadText.trim() || `[${fileName}]`;
                          setResult(text);
                          setStudySource('uploaded');
                          setActiveType(null);
                          setMeetingRoom(null);
                          setTimeout(() => {
                            if (meetingRef.current) {
                              const top = meetingRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
                              window.scrollTo({ top, behavior: 'smooth' });
                            }
                          }, 150);
                          toast({ title: '✓ Study guide saved!', description: 'Scroll down to create your meeting room.' });
                        }}
                        disabled={!pendingUploadText.trim()}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
                      >
                        <BookOpen className="w-4 h-4"/> Save as Study Guide & Go to Meeting Room ↓
                      </button>
                      <button
                        onClick={() => {
                          if (meetingRef.current) {
                            const top = meetingRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
                            window.scrollTo({ top, behavior: 'smooth' });
                          }
                        }}
                        className="sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Skip to Meeting Room
                      </button>
                    </div>
                  </div>
                )}

                {/* Already saved confirmation */}
                {studySource === 'uploaded' && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0"/>
                    Study guide saved — scroll down to create your meeting room
                    <button
                      onClick={() => {
                        if (meetingRef.current) {
                          const top = meetingRef.current.getBoundingClientRect().top + window.pageYOffset - 90;
                          window.scrollTo({ top, behavior: 'smooth' });
                        }
                      }}
                      className="ml-auto text-xs text-indigo-600 font-bold hover:underline whitespace-nowrap"
                    >
                      Go ↓
                    </button>
                  </div>
                )}
              </>
            )}
            <input ref={fileInputRef} type="file" accept=".txt,.pdf,.doc,.docx" className="hidden" onChange={handleFileChange}/>
          </div>

          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              placeholder="e.g. Fishers of Men, Daughters of the King, Youth Group..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Topic / Focus */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specific Topic or Focus <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Forgiveness, Identity in Christ, Dealing with anxiety, Leadership..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Study Type Buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <h2 className="font-bold text-gray-900 text-lg mb-1">Choose Your Study Type</h2>
          <p className="text-sm text-gray-500 mb-4">Tap a group type to generate a complete, tailored Bible study guide</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STUDY_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => generate(type)}
                disabled={isGenerating}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl text-white font-semibold text-sm text-center shadow-sm hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${type.color} ${activeType===type.id && isGenerating ? 'ring-4 ring-offset-2 ring-blue-300' : ''}`}
              >
                {activeType === type.id && isGenerating ? (
                  <Loader2 className="w-6 h-6 animate-spin"/>
                ) : (
                  <span className="text-2xl">{type.emoji}</span>
                )}
                <span className="leading-tight">{type.label}</span>
              </button>
            ))}
          </div>

          {isGenerating && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3 text-sm text-blue-800">
              <Loader2 className="w-4 h-4 animate-spin flex-shrink-0"/>
              <span>Generating your complete study guide — this takes 30–60 seconds for a thorough result...</span>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div ref={resultRef} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-amber-500 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">
                  {activeType
                    ? `${STUDY_TYPES.find(s => s.id === activeType)?.label} Guide`
                    : fileName.includes('CCF')
                      ? 'CCF Weekly Study Guide — Preview'
                      : '4 W\'s Study Guide'}
                </h2>
                <p className="text-white text-opacity-80 text-sm">
                  {activeType
                    ? (groupName || STUDY_TYPES.find(s => s.id === activeType)?.defaultGroup)
                    : fileName.includes('CCF')
                      ? 'Review the content below — edit or generate a guide from it'
                      : (groupName || 'My D-Group')}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={copyResult}
                  className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors">
                  <Copy className="w-4 h-4"/> Copy
                </button>
                <button onClick={downloadResult}
                  className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4"/> Save
                </button>
                <button onClick={() => { setResult(''); setStudySource(null); setMeetingRoom(null); }}
                  className="flex items-center gap-1.5 bg-white bg-opacity-20 hover:bg-red-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                  title="Dismiss">
                  <X className="w-4 h-4"/> Dismiss
                </button>
              </div>
            </div>

            {/* Editable guide notice */}
            <div className="bg-amber-50 border-b border-amber-100 px-5 py-2 flex items-center gap-2 text-xs text-amber-700">
              <Pencil className="w-3.5 h-3.5 flex-shrink-0"/>
              <span>You can tap anywhere in the text below to edit the guide before copying or sharing it.</span>
            </div>

            {/* Editable textarea */}
            <div className="p-5">
              <textarea
                value={result}
                onChange={e => setResult(e.target.value)}
                className="w-full min-h-[420px] text-sm text-gray-800 font-sans leading-relaxed resize-y border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                spellCheck={false}
              />
            </div>

            {/* Action row */}
            <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 flex gap-3 flex-wrap">
              <button onClick={copyResult} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">
                <Copy className="w-4 h-4"/> Copy Study Guide
              </button>
              <button onClick={downloadResult} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200">
                <Download className="w-4 h-4"/> Download as Text
              </button>
              <button onClick={() => { setResult(''); setStudySource(null); setMeetingRoom(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200">
                <X className="w-4 h-4"/> Clear
              </button>
            </div>
          </div>
        )}

        {/* ── D-Group Meeting Room — always visible ─────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-700 px-5 py-4 flex items-center gap-3">
            <Video className="w-6 h-6 text-white flex-shrink-0"/>
            <div>
              <h2 className="text-white font-bold text-lg">D-Group Video Meeting Room</h2>
              <p className="text-white text-opacity-80 text-sm">
                {studySource === 'ccf-4ws' ? 'CCF 4 W\'s guide will be shared with your group'
                  : studySource === 'generated' ? 'AI study guide will be shared with your group'
                  : studySource === 'template' ? 'Your 4 W\'s template will be shared with your group'
                  : studySource === 'uploaded' ? 'Your uploaded guide will be shared with your group'
                  : 'Create a free video room and optionally attach a study guide'}
              </p>
            </div>
            {studySource && (
              <span className="ml-auto flex-shrink-0 bg-white bg-opacity-20 text-white text-xs font-semibold px-2 py-1 rounded-lg whitespace-nowrap">
                {studySource === 'ccf-4ws' ? '📋 CCF 4W\'s ✓'
                  : studySource === 'generated' ? '✨ AI Guide ✓'
                  : studySource === 'uploaded' ? '📄 Uploaded ✓'
                  : '✏️ Template ✓'}
              </span>
            )}
          </div>

          {!meetingRoom ? (
            <div className="p-5 space-y-4">
              {/* Study Guide Status — always shown, makes the distinction explicit */}
              <div className={`rounded-xl p-3.5 flex items-center gap-3 ${
                studySource ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                  studySource ? 'bg-green-100' : 'bg-amber-100'}`}>
                  {studySource === 'ccf-4ws' && '📋'}
                  {studySource === 'generated' && '✨'}
                  {studySource === 'template' && '✏️'}
                  {studySource === 'uploaded' && '📄'}
                  {!studySource && '📹'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${studySource ? 'text-green-800' : 'text-amber-800'}`}>
                    {studySource === 'ccf-4ws' && 'CCF Weekly 4 W\'s Guide attached'}
                    {studySource === 'generated' && 'AI-generated study guide attached'}
                    {studySource === 'template' && '4 W\'s template attached'}
                    {studySource === 'uploaded' && 'Your uploaded guide attached'}
                    {!studySource && 'No study guide — plain meeting room'}
                  </p>
                  <p className={`text-xs mt-0.5 ${studySource ? 'text-green-600' : 'text-amber-600'}`}>
                    {studySource === 'ccf-4ws' && 'This week\'s CCF 4 W\'s will be accessible to all participants inside the meeting room'}
                    {studySource === 'generated' && 'Your custom study guide will be accessible to all participants inside the meeting room'}
                    {studySource === 'template' && 'Your filled-in 4 W\'s template will be shared with all participants'}
                    {studySource === 'uploaded' && 'Your uploaded file will be accessible to all participants inside the meeting room'}
                    {!studySource && 'Load the CCF guide, use a template, or generate an AI study above to attach one'}
                  </p>
                </div>
                {studySource && (
                  <span className="flex-shrink-0 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">Ready ✓</span>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name <span className="text-gray-400 font-normal">(leader)</span></label>
                  <input
                    type="text"
                    value={leaderName}
                    onChange={e => setLeaderName(e.target.value)}
                    placeholder="e.g. Pastor Mike, Sarah..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name <span className="text-gray-400 font-normal">(for the room)</span></label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. Fishers of Men..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                onClick={createMeetingRoom}
                disabled={isCreatingRoom}
                className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {isCreatingRoom ? <Loader2 className="w-5 h-5 animate-spin"/> : <Video className="w-5 h-5"/>}
                {isCreatingRoom ? 'Creating Room...' : 'Create D-Group Meeting Room'}
              </button>
              <p className="text-xs text-gray-400 text-center">Free video calls via Jitsi Meet — no account or download needed for anyone</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {/* Room created */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0"/>
                <div>
                  <p className="font-bold text-green-800">Meeting room is live!</p>
                  <p className="text-sm text-green-600">
                    Room code: <strong className="text-lg tracking-widest">{meetingRoom.code}</strong>
                  </p>
                  {studySource && (
                    <p className="text-xs text-green-500 mt-0.5">
                      {studySource === 'ccf-4ws' ? '📋 CCF 4 W\'s guide included'
                        : studySource === 'generated' ? '✨ AI study guide included'
                        : studySource === 'uploaded' ? '📄 Your uploaded guide included'
                        : '✏️ 4 W\'s template included'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setLocation(`/dgroup/${meetingRoom.code}`)}
                  className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex-shrink-0"
                >
                  <Video className="w-4 h-4"/> Join Now
                </button>
              </div>

              {/* Share link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Shareable Meeting Link</label>
                <div className="flex gap-2">
                  <input readOnly value={getRoomLink()}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 text-gray-600 min-w-0"/>
                  <button onClick={copyRoomLink}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors ${roomLinkCopied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                    {roomLinkCopied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                    {roomLinkCopied ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setMeetingRoom(null)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold">
                  <X className="w-4 h-4"/> New Room
                </button>
              </div>

              {/* Email invite */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1"/>Invite by Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteEmails}
                    onChange={e => setInviteEmails(e.target.value)}
                    placeholder="member@email.com, another@email.com..."
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-0"
                  />
                  <button onClick={shareEmail}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex-shrink-0">
                    <Mail className="w-4 h-4"/> Send
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Separate emails with commas — opens your email app with a pre-written invite.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer quote */}
        <div className="text-center pb-6">
          <p className="text-gray-400 text-sm italic">"Where two or three gather in my name, there am I with them." — Matthew 18:20</p>
        </div>
      </div>
    </div>
  );
}
