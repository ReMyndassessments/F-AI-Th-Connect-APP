import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { Copy, Share2, Mail, ArrowLeft, BookOpen, ChevronDown, ChevronUp, Users, Video, X, Check, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DGroupRoom {
  code: string;
  jitsiRoom: string;
  groupName: string;
  studyType: string;
  studyContent: string;
  leaderName: string;
  createdAt: string;
}

// Declare Jitsi global
declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

// =====================================================================
// JOIN SCREEN — asks for display name before entering
// =====================================================================
function JoinScreen({ room, onJoin }: { room: DGroupRoom; onJoin: (name: string) => void }) {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Video className="w-8 h-8 text-white"/>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{room.groupName}</h1>
        <p className="text-gray-500 text-sm mb-6">D-Group Video Meeting • Room {room.code}</p>

        <div className="mb-6 text-left">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onJoin(name.trim()); }}
            placeholder="Enter your name..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>

        <button
          onClick={() => { if (name.trim()) onJoin(name.trim()); }}
          disabled={!name.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-40 transition-all"
        >
          Join Meeting
        </button>

        <p className="text-xs text-gray-400 mt-4">Powered by Jitsi — free, encrypted video calls. No login required.</p>

        <Link href="/bible">
          <button className="mt-3 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
            <ArrowLeft className="w-3 h-3"/> Back to Study Generator
          </button>
        </Link>
      </div>
    </div>
  );
}

// =====================================================================
// MAIN ROOM
// =====================================================================
export default function DGroupRoom() {
  const params = useParams<{ code: string }>();
  const code = params.code?.toUpperCase() || '';
  const { toast } = useToast();

  const [room, setRoom] = useState<DGroupRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [joined, setJoined] = useState(false);
  const [showStudy, setShowStudy] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');

  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  // Fetch room data
  useEffect(() => {
    if (!code) { setError('Invalid room code.'); setLoading(false); return; }
    fetch(`/api/dgroups/${code}`)
      .then(r => { if (!r.ok) throw new Error('Room not found'); return r.json(); })
      .then(data => { setRoom(data); setLoading(false); })
      .catch(() => { setError('This meeting room was not found or has expired. Rooms last as long as the server is running.'); setLoading(false); });
  }, [code]);

  // Load Jitsi and launch meeting when joined
  useEffect(() => {
    if (!joined || !room || !jitsiContainerRef.current) return;

    const loadJitsi = () => {
      if (jitsiApiRef.current) return; // Already loaded
      const api = new window.JitsiMeetExternalAPI('jitsi.systemli.org', {
        roomName: room.jitsiRoom,
        parentNode: jitsiContainerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          requireDisplayName: false,
          enableWelcomePage: false,
          enableInsecureRoomNameWarning: false,
          disableModeratorIndicator: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: false,
          TOOLBAR_ALWAYS_VISIBLE: false,
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        },
      });
      jitsiApiRef.current = api;
    };

    if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement('script');
      script.src = 'https://jitsi.systemli.org/external_api.js';
      script.async = true;
      script.onload = loadJitsi;
      document.head.appendChild(script);
    }

    return () => {
      if (jitsiApiRef.current) {
        try { jitsiApiRef.current.dispose(); } catch {}
        jitsiApiRef.current = null;
      }
    };
  }, [joined, room, displayName]);

  const roomLink = `${window.location.origin}/dgroup/${code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopied(true);
    toast({ title: 'Link copied!', description: 'Share this link with your group members.' });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`You're invited to join ${room?.groupName} D-Group meeting!\n\nClick the link to join:\n${roomLink}\n\nRoom code: ${code}\n\n_F-AI-TH-Connect_`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareEmail = () => {
    const emails = inviteEmails.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean);
    const subject = encodeURIComponent(`You're invited: ${room?.groupName} D-Group Meeting`);
    const body = encodeURIComponent(
      `Hi,\n\nYou're invited to join our D-Group Bible study meeting!\n\nGroup: ${room?.groupName}\nRoom Code: ${code}\n\nClick to join the meeting:\n${roomLink}\n\nSee you there!\n${room?.leaderName}`
    );
    const to = emails.join(',');
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  };

  const formatStudy = (text: string) =>
    text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/#{1,4}\s+/g, '').replace(/---+/g, '────────────────────').trim();

  // ── Loading / Error States ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4"/>
          <p className="text-lg font-semibold">Finding your meeting room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="text-5xl mb-4">🚪</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Room Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/bible">
            <button className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700">
              Go to Bible Study Generator
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ── Join screen ────────────────────────────────────────────────────
  if (!joined) {
    return <JoinScreen room={room} onJoin={name => { setDisplayName(name); setJoined(true); }}/>;
  }

  // ── Main meeting room ──────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Top bar */}
      <div className="flex-shrink-0 bg-gray-950 border-b border-gray-800 px-4 py-2.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-sm truncate">{room.groupName}</h1>
          <p className="text-gray-400 text-xs">Room {code} • {displayName}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {room.studyContent && (
            <button onClick={() => { setShowStudy(s => !s); setShowShare(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showStudy ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              <BookOpen className="w-3.5 h-3.5"/> Study Guide
            </button>
          )}
          <button onClick={() => { setShowShare(s => !s); setShowStudy(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showShare ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            <Share2 className="w-3.5 h-3.5"/> Invite
          </button>
          <a
            href={`https://jitsi.systemli.org/${room.jitsiRoom}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition-colors"
            title="Open meeting in browser if you see a login prompt"
          >
            <Video className="w-3.5 h-3.5"/> Open in Browser
          </a>
          <Link href="/bible">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-red-700 hover:text-white rounded-lg text-xs font-semibold transition-colors">
              <X className="w-3.5 h-3.5"/> Leave
            </button>
          </Link>
        </div>
      </div>

      {/* Slide-down panels */}
      {showShare && (
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600"/> Invite Members to {room.groupName}
            </h3>
            {/* Room link */}
            <div className="flex gap-2 mb-3">
              <input readOnly value={roomLink}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-600 min-w-0"/>
              <button onClick={copyLink}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {/* Share buttons */}
            <div className="flex gap-2 mb-3">
              <button onClick={shareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">
                <MessageSquare className="w-4 h-4"/> WhatsApp
              </button>
              <span className="text-gray-300 text-sm self-center">or email:</span>
            </div>
            {/* Email */}
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteEmails}
                onChange={e => setInviteEmails(e.target.value)}
                placeholder="email@example.com, another@example.com..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
              />
              <button onClick={shareEmail}
                className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex-shrink-0">
                <Mail className="w-4 h-4"/> Send
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Room code: <strong>{code}</strong> — members need this code to join at faithconnect.app/dgroup/{code}</p>
          </div>
        </div>
      )}

      {showStudy && room.studyContent && (
        <div className="flex-shrink-0 bg-amber-50 border-b border-amber-200 max-h-72 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4"/> Study Guide — {room.groupName}
            </h3>
            {room.studyContent.startsWith('[') && room.studyContent.length < 200 ? (
              <p className="text-sm text-amber-700 italic">
                The study guide is a PDF file. Your group leader will share the content via WhatsApp or email — ask them for a copy if you don't have it yet.
              </p>
            ) : (
              <pre className="whitespace-pre-wrap text-xs text-gray-800 font-sans leading-relaxed">
                {formatStudy(room.studyContent)}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Jitsi frame — fills all remaining space */}
      <div className="flex-1 min-h-0 bg-gray-900" ref={jitsiContainerRef}/>
    </div>
  );
}
