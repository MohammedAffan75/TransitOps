export default function LoadingSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 animate-pulse">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-8 bg-white/[0.06] rounded-md flex-1"
              style={{ animationDelay: `${(i + j) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
