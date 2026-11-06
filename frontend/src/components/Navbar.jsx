import React from 'react'

function Navbar() {
  return (
    <header className="h-[66px] border-b border-[#efede9] bg-[#fbfaf8] md:h-[78px]">
      <nav className="mx-auto flex h-full w-[calc(100%-38px)] max-w-[1160px] items-center justify-between md:w-[calc(100%-64px)]" aria-label="Main navigation">
        <a className="flex items-center gap-2 font-[Manrope,sans-serif] text-[19px] font-extrabold tracking-[-1.2px] text-[#25232b] md:text-[21px]" href="#top" aria-label="Orbit home">
          <span className="flex h-[27px] w-[27px] -rotate-[8deg] items-center justify-center gap-[2px] rounded-[9px] bg-[#292633]"><i className="h-[11px] w-[3px] skew-x-[-18deg] rounded bg-[#d8c6ff]" /><i className="h-4 w-[3px] skew-x-[-18deg] rounded bg-[#a98be5]" /><i className="h-2 w-[3px] skew-x-[-18deg] rounded bg-[#d8c6ff]" /></span>
          <span>orbit<span className="text-[#9879c6]">.</span></span>
        </a>
        <div className="hidden items-center gap-9 text-[13px] text-[#77737b] md:flex"><a className="transition hover:text-[#8060b6]" href="#how">How it works</a><a className="transition hover:text-[#8060b6]" href="#features">For developers</a><a className="transition hover:text-[#8060b6]" href="#security">Security</a></div>
        <a className="rounded-lg border border-[#e8e4df] px-3 py-[9px] text-[11px] font-semibold transition hover:border-[#ac92df] hover:bg-white md:px-[15px] md:py-[10px] md:text-xs" href="#features">Get started <span className="ml-1">↗</span></a>
      </nav>
    </header>
  )
}

export default Navbar
