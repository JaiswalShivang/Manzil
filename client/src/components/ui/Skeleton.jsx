
export const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-5',
}) => {
  return (
    <div
      className={`bg-[#141414]/10 border-2 border-[#141414]/30 animate-pulse ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export const QuestCardSkeleton = () => {
  return (
    <div className="bg-[#F5F3EF] border-2 border-[#141414] p-5 flex flex-col gap-3 shadow-brutal-sm">
      <div className="flex items-center justify-between">
        <Skeleton width="w-24" height="h-5" />
        <Skeleton width="w-16" height="h-5" />
      </div>
      <Skeleton width="w-3/4" height="h-6" />
      <Skeleton width="w-full" height="h-4" />
      <div className="flex items-center justify-between pt-2 border-t-2 border-[#141414]/20">
        <Skeleton width="w-20" height="h-4" />
        <Skeleton width="w-24" height="h-8" />
      </div>
    </div>
  );
};
