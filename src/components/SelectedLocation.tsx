import type { Location } from "@/lib/locations";

const numberFormatter = new Intl.NumberFormat("en-NG");
const coordFormatter = new Intl.NumberFormat("en-NG", {
  maximumFractionDigits: 4,
});

type SelectedLocationProps = {
  location: Location;
};

export function SelectedLocation({ location }: SelectedLocationProps) {
  return (
    <article className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-teal-800">
        Selected location
      </p>
      <h2 className="mt-1 text-xl font-semibold text-stone-900">{location.name}</h2>
      <p className="text-sm text-stone-500">
        {[location.region, location.country].filter(Boolean).join(", ")}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-stone-500">Coordinates</dt>
          <dd className="font-medium text-stone-900">
            {coordFormatter.format(location.latitude)},{" "}
            {coordFormatter.format(location.longitude)}
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Country</dt>
          <dd className="font-medium text-stone-900">
            {location.country}
            {location.countryCode ? ` (${location.countryCode})` : ""}
          </dd>
        </div>
        <div>
          <dt className="text-stone-500">Population</dt>
          <dd className="font-medium text-stone-900">
            {location.population
              ? numberFormatter.format(location.population)
              : "—"}
          </dd>
        </div>
      </dl>
    </article>
  );
}
