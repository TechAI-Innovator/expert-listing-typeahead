import { SearchDemo } from "@/components/SearchDemo";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 py-4">
          <p className="text-sm font-semibold tracking-tight text-teal-900">
            Location search
          </p>
          <p className="text-xs text-stone-500">Typeahead</p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:py-16">
        <p className="text-sm font-medium text-teal-800">Location search</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Find a place in a few keystrokes
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-stone-600">
          Type a city or area, wait a beat, then pick a result. The list handles
          loading, empty matches, errors, keyboard navigation, and slower
          responses that arrive out of order.
        </p>

        <section className="mt-8">
          <SearchDemo />
        </section>
      </main>
    </div>
  );
}
