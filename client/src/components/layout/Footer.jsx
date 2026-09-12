export const Footer = () => {
  return (
    <footer className="w-full border-t-3 border-[#141414] bg-[#F5F3EF] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 text-center sm:text-left">
            <div className="inline-block bg-[#141414] text-[#F5F3EF] px-3 py-1 font-heading font-black text-sm tracking-tighter border-2 border-[#141414] shadow-brutal-sm">
              MANZIL
            </div>
          </div>

          {/* Right Badges & Telemetry */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F2B705] text-[#141414] border-2 border-[#141414] text-[11px] font-mono font-black uppercase shadow-brutal-sm">
              <span className="w-2 h-2 bg-[#E8402C] inline-block animate-pulse"></span>
              <span>SYSTEM ONLINE v2.0</span>
            </div>

            {/* Bauhaus Color Swatch Accent */}
            <div className="flex border-2 border-[#141414] shadow-brutal-sm overflow-hidden h-7">
              <div className="w-2.5 bg-[#E8402C]" title="Cadmium Red" />
              <div className="w-2.5 bg-[#2B4AE8]" title="International Blue" />
              <div className="w-2.5 bg-[#F2B705]" title="Bauhaus Yellow" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
