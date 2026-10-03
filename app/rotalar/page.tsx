import PageHeader from "@/components/PageHeader";
import RouteBrowser from "@/components/RouteBrowser";

export const metadata = { title: "Rotalar" };

export default function Rotalar() {
  return (
    <main className="wide lg:px-4">
      <PageHeader eyebrow="AFYONKARAHİSAR" title="Rotalar" />
      <RouteBrowser />
    </main>
  );
}
