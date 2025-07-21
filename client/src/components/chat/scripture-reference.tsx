import { Book } from "lucide-react";

interface ScriptureReferenceProps {
  reference: {
    verse: string;
    book: string;
    chapter: number;
    verses: string;
    text: string;
  };
}

export default function ScriptureReference({ reference }: ScriptureReferenceProps) {
  if (!reference.text) {
    return (
      <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
        <div className="flex items-center space-x-2">
          <Book className="w-4 h-4 text-blue-600" />
          <p className="text-sm font-medium text-blue-800">{reference.verse}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
      <div className="flex items-start space-x-2">
        <Book className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm italic text-blue-800 mb-1">
            "{reference.text}"
          </p>
          <p className="text-xs font-medium text-blue-600">
            - {reference.verse}
          </p>
        </div>
      </div>
    </div>
  );
}
