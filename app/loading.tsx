export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Yükleniyor">
      <div className="skeleton h-[200px] w-full" />
      <div className="space-y-3 px-5 pt-6">
        <div className="skeleton h-7 w-2/3 rounded-xl" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-5/6 rounded-lg" />
        <div className="skeleton mt-5 h-[110px] w-full rounded-3xl" />
        <div className="skeleton h-[110px] w-full rounded-3xl" />
      </div>
    </main>
  );
}
