export const Footer = () => {
  return (
    <footer className="w-full border-t-3 border-[#141414] bg-[#F5F3EF] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b-2 border-[#141414]">
          <div className="space-y-2">
            <div className="inline-block bg-[#141414] text-[#F5F3EF] px-3 py-1 font-heading font-black text-lg">
              LIFE RPG
            </div>
            <p className="text-xs font-sans text-[#141414]/70 max-w-xs">
              Constructivist productivity engine. Turn real-world output into verifiable character progression.
            </p>
          </div>

          <div>
            <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141414] block mb-3">
              PIPELINE
            </span>
            <ul className="text-xs font-heading font-bold uppercase space-y-1.5 text-[#141414]/80">
              <li>01 Quest Logging</li>
              <li>02 Server Calculations</li>
              <li>03 XP Distribution</li>
              <li>04 Stat Calibration</li>
            </ul>
          </div>

          <div>
            <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141414] block mb-3">
              SYSTEM SPECS
            </span>
            <ul className="text-xs font-heading font-bold uppercase space-y-1.5 text-[#141414]/80">
              <li>MERN Architecture</li>
              <li>JWT State Machine</li>
              <li>Mongoose Non-Linear Math</li>
              <li>Zero Client Cheating</li>
            </ul>
          </div>

          <div>
            <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141414] block mb-3">
              STATUS
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F2B705] text-[#141414] border-2 border-[#141414] text-xs font-heading font-extrabold uppercase shadow-brutal-sm">
              <span className="w-2 h-2 bg-[#E8402C]"></span>
              <span>SYSTEM ONLINE v2.0</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-heading font-bold uppercase text-[#141414]/60">
          <div>© 2026 LIFE RPG • CONSTRUCTIVIST HUD • ALL RIGHTS RESERVED</div>
          <div>SWISS DESIGN MATRIX • SHARP EXECUTION</div>
        </div>
      </div>
    </footer>
  );
};
