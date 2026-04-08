import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Copy, Share2, Mail, ArrowLeft, BookOpen, Users, Video, X, Check, MessageSquare, ExternalLink } from "lucide-react";
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

function formatStudy(text: string) {
  return text
    .replace(/\[(?:CCF WEEKLY GUIDE|SERMON\/NOTES FILE|ATTACHED FILE)[^\]]*\]\s*/g, '')
    .trim();
}

// =====================================================================
// JOIN SCREEN
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
        <p className="text-gray-500 text-sm mb-2">D-Group Meeting • Room {room.code}</p>
        {room.studyContent && (
          <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1.5 mb-5 inline-block">
            📋 Study guide attached by {room.leaderName || 'your leader'}
          </p>
        )}

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
          Enter Room
        </button>

        <Link href="/bible">
          <button className="mt-4 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mx-auto">
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
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteEmails, setInviteEmails] = useState('');

  useEffect(() => {
    if (!code) { setError('Invalid room code.'); setLoading(false); return; }
    fetch(`/api/dgroups/${code}`)
      .then(r => { if (!r.ok) throw new Error('Room not found'); return r.json(); })
      .then(data => { setRoom(data); setLoading(false); })
      .catch(() => { setError('This meeting room was not found or has expired. Rooms last as long as the server is running.'); setLoading(false); });
  }, [code]);

  const roomLink = `${window.location.origin}/dgroup/${code}`;
  const videoLink = room ? `https://meet.ffmuc.net/${room.jitsiRoom}` : '';

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
    const subject = encodeURIComponent(`You're invited: ${room?.groupName} D-Group Meeting`);
    const body = encodeURIComponent(
      `Hi,\n\nYou're invited to join our D-Group Bible study meeting!\n\nGroup: ${room?.groupName}\nRoom Code: ${code}\n\nClick to join the meeting:\n${roomLink}\n\nSee you there!\n${room?.leaderName}`
    );
    const to = inviteEmails.split(',').map(e => e.trim()).filter(Boolean).join(',');
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  };

  // ── Loading / Error states ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
          <p className="text-lg font-semibold">Loading meeting room…</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <p className="text-gray-700 text-lg font-semibold mb-2">Room not found</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/bible">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold mx-auto hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4"/> Go to Bible Study Generator
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (!joined) {
    return <JoinScreen room={room} onJoin={name => { setDisplayName(name); setJoined(true); }}/>;
  }

  // ── Main room ──────────────────────────────────────────────────────
  const studyText = room.studyContent ? formatStudy(room.studyContent) : '';
  const hasStudy = Boolean(studyText && studyText.length > 30);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-gray-900 text-sm truncate">{room.groupName}</h1>
          <p className="text-gray-400 text-xs">Room {code} • {displayName}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowShare(s => !s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showShare ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Users className="w-3.5 h-3.5"/> Invite
          </button>
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Video className="w-3.5 h-3.5"/> Join Video Call
          </a>
          <Link href="/bible">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg text-xs font-semibold transition-colors">
              <X className="w-3.5 h-3.5"/> Leave
            </button>
          </Link>
        </div>
      </div>

      {/* Invite panel */}
      {showShare && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="max-w-2xl mx-auto">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4"/> Invite Members to {room.groupName}
            </h3>
            <p className="text-xs text-blue-600 mb-3 font-semibold uppercase tracking-wide">Guest Link — Share This</p>
            <div className="flex gap-2 mb-3">
              <input readOnly value={roomLink}
                className="flex-1 border border-blue-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 min-w-0"/>
              <button onClick={copyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <button onClick={shareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">
                <MessageSquare className="w-4 h-4"/> WhatsApp
              </button>
              <div className="flex gap-2 flex-1">
                <input type="text" value={inviteEmails} onChange={e => setInviteEmails(e.target.value)}
                  placeholder="email@example.com, another@..." 
                  className="flex-1 border border-blue-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white min-w-0"/>
                <button onClick={shareEmail}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-semibold flex-shrink-0">
                  <Mail className="w-4 h-4"/> Email
                </button>
              </div>
            </div>
            <p className="text-xs text-blue-500">Anyone with this link can join — no account or download needed.</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">

        {/* Video call card — always on top */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-5 py-4 flex items-center gap-3">
            <Video className="w-5 h-5 text-white flex-shrink-0"/>
            <div>
              <h2 className="text-white font-bold">Video Call</h2>
              <p className="text-green-100 text-xs">No login needed — opens in a new tab</p>
            </div>
            <span className="ml-auto text-green-200 text-xs font-semibold bg-green-800 bg-opacity-40 px-2 py-1 rounded-lg">
              Room {code}
            </span>
          </div>
          <div className="p-5 flex flex-col items-center gap-4">
            <a
              href={videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all w-full justify-center"
            >
              <ExternalLink className="w-5 h-5"/> Join Video Call
            </a>
            <p className="text-xs text-gray-500 text-center">
              Whoever joins first leads the call — no moderator login or account required.
            </p>
          </div>
        </div>

        {/* Study guide card */}
        {hasStudy ? (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-white flex-shrink-0"/>
              <div>
                <h2 className="text-white font-bold">Study Guide</h2>
                <p className="text-amber-100 text-xs">{room.groupName} — shared by {room.leaderName || 'your leader'}</p>
              </div>
            </div>
            <div className="p-5">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                {studyText}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
            <BookOpen className="w-8 h-8 text-amber-400 mx-auto mb-2"/>
            <p className="text-amber-800 font-semibold text-sm">No study guide attached</p>
            <p className="text-amber-600 text-xs mt-1">Your leader can add one from the Bible Study Generator page.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 italic pb-4">
          "Where two or three gather in my name, there am I with them." — Matthew 18:20
        </p>
      </div>
    </div>
  );
}
