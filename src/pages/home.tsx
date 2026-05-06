import { Counter } from "@/components/counter";
import { StatusCard } from "@/components/status-card";
import { APP } from "@/constants/app";

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-950 px-6 text-center text-neutral-50">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-5xl font-semibold tracking-tight">{APP.name}</h1>
        <p className="max-w-md text-sm text-neutral-400">{APP.tagline}</p>
      </div>
      <StatusCard />
      <Counter />
    </main>
  );
}

export default Home;
