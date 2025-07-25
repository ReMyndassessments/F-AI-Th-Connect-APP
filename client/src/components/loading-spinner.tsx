import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ 
  size = "md", 
  className = "",
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin",
          sizeClasses[size]
        )}
        aria-label="Loading"
      />
      {text && (
        <p className="mt-2 text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
}

// Specialized loading spinner for the faith theme
export function FaithLoadingSpinner({ 
  size = "md", 
  className = "",
  text = "Seeking divine guidance..."
}: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div 
          className={cn(
            "border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin",
            size === "sm" ? "w-4 h-4" : size === "lg" ? "w-12 h-12" : "w-8 h-8"
          )}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-blue-500 font-bold text-xs">✝</span>
        </div>
      </div>
      {text && (
        <p className="mt-2 text-sm text-gray-600 text-center">{text}</p>
      )}
    </div>
  );
}

// Loading skeleton for chat messages
export function MessageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="bg-gray-200 rounded-2xl rounded-bl-md p-4 max-w-md flex-1">
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}