export default function PageHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="bg-gradient-to-b from-[#F6DCC3] to-cream px-5 pb-6 pt-8">
      <p className="text-[10.5px] font-bold tracking-[2px] text-terra">{eyebrow}</p>
      <h1 className="mt-1.5 font-display text-[40px] font-semibold leading-none tracking-tight">{title}</h1>
    </header>
  );
}
