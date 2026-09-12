import React from 'react';

export const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-5',
  rounded = 'rounded-xl',
}) => {
  return (
    <div
      className={`skeleton-cozy ${width} ${height} ${rounded} ${className}`}
      aria-hidden="true"
    />
  );
};

export const QuestCardSkeleton = () => {
  return (
    <div className="bg-[#F0E4D3] border border-[#E4D3BE] rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton width="w-20" height="h-4" rounded="rounded-full" />
        <Skeleton width="w-12" height="h-4" rounded="rounded-full" />
      </div>
      <Skeleton width="w-3/4" height="h-6" />
      <Skeleton width="w-full" height="h-4" />
      <div className="flex items-center justify-between pt-2 border-t border-[#E4D3BE]/60">
        <Skeleton width="w-16" height="h-4" />
        <Skeleton width="w-24" height="h-8" rounded="rounded-xl" />
      </div>
    </div>
  );
};
