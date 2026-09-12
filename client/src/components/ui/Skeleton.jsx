export const Skeleton = ({
  className = '',
  width = 'w-full',
  height = 'h-5',
}) => {
  return (
    <div
      className={`border-2 border-[#141414] bg-[#FAF3E8] shimmer-bauhaus ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export const QuestCardSkeleton = () => {
  return (
    <div className="bg-white border-2 border-[#141414] p-5 flex flex-col justify-between shadow-brutal min-h-[190px]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Skeleton width="w-24" height="h-6" />
          <Skeleton width="w-20" height="h-5" />
        </div>
        <Skeleton width="w-3/4" height="h-6" className="mb-2" />
        <Skeleton width="w-full" height="h-4" className="mb-1" />
        <Skeleton width="w-2/3" height="h-4" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t-2 border-[#141414] mt-4">
        <div className="flex items-center gap-2">
          <Skeleton width="w-16" height="h-6" />
          <Skeleton width="w-16" height="h-6" />
        </div>
        <Skeleton width="w-24" height="h-8" />
      </div>
    </div>
  );
};

export const ShopItemCardSkeleton = () => {
  return (
    <div className="bg-[#FAF3E8] border-3 border-[#141414] p-5 flex flex-col justify-between shadow-brutal min-h-[320px]">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Skeleton width="w-20" height="h-6" />
          <Skeleton width="w-14" height="h-6" />
        </div>
        <div className="w-full h-32 bg-[#F5F3EF] border-2 border-[#141414] mb-4 flex items-center justify-center p-4">
          <Skeleton width="w-16" height="h-16" />
        </div>
        <Skeleton width="w-4/5" height="h-5" className="mb-2" />
        <Skeleton width="w-1/2" height="h-4" className="mb-4" />
      </div>
      <div className="pt-3 border-t-2 border-[#141414] flex items-center justify-between gap-2 mt-auto">
        <Skeleton width="w-24" height="h-7" />
        <Skeleton width="w-20" height="h-7" />
      </div>
    </div>
  );
};

export const AvatarViewportSkeleton = () => {
  return (
    <div className="bg-white border-3 border-[#141414] shadow-brutal-lg p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#141414] pb-4">
        <div>
          <Skeleton width="w-36" height="h-5" className="mb-2" />
          <Skeleton width="w-64" height="h-8" />
        </div>
        <Skeleton width="w-32" height="h-9" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="border-4 border-[#141414] p-2 bg-[#141414] shadow-brutal">
            <div className="w-64 h-64 sm:w-72 sm:h-72 bg-[#2B4AE8] border-2 border-[#141414] shimmer-bauhaus" />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-3">
          <Skeleton width="w-48" height="h-5" className="mb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border-2 border-[#141414] p-3 flex items-center justify-between bg-white shadow-brutal-sm">
                <div className="flex items-center gap-3">
                  <Skeleton width="w-10" height="h-10" />
                  <div className="space-y-1">
                    <Skeleton width="w-12" height="h-3" />
                    <Skeleton width="w-24" height="h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSkillBarSkeleton = () => {
  return (
    <div className="bg-white border-2 border-[#141414] p-6 shadow-brutal space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton width="w-32" height="h-6" />
        <Skeleton width="w-14" height="h-6" />
      </div>
      <Skeleton width="w-full" height="h-4" />
      <Skeleton width="w-4/5" height="h-4" />
      <Skeleton width="w-full" height="h-5" className="border-2 border-[#141414]" />
    </div>
  );
};

export const ProfileInventorySkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border-2 border-[#141414] p-3 bg-white shadow-brutal-sm flex flex-col items-center gap-2">
          <Skeleton width="w-16" height="h-16" />
          <Skeleton width="w-20" height="h-4" />
          <Skeleton width="w-full" height="h-6" />
        </div>
      ))}
    </div>
  );
};
