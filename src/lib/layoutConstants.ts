// Insets left ~10px inside the Navbar inner edge so grids align with nav content;
// right keeps the full navbar gutter. Encodes border (1px) + nav padding + safe-area.
export const NAV_ALIGN_PAD =
  "pl-[calc(max(20px,env(safe-area-inset-left,0px))+1px+1rem-10px)] pr-[calc(max(20px,env(safe-area-inset-right,0px))+1px+1rem)] sm:pl-[calc(max(20px,env(safe-area-inset-left,0px))+1px+1.5rem-10px)] sm:pr-[calc(max(20px,env(safe-area-inset-right,0px))+1px+1.5rem)]";
