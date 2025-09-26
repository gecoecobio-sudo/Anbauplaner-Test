import { researchCrops } from "@/data/crops";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Kultur-Datenbank</h1>
        <p className="text-[var(--text-secondary)]">
          Recherchebasierte Default-Werte für die Top-20 Market-Garden-Kulturen inklusive Abstände, Erträge und Saatgutbedarf.
        </p>
      </header>
      <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]/70">
        <table className="min-w-full text-left text-sm">
          <thead className="uppercase tracking-[0.3em] text-[var(--text-secondary)]">
            <tr>
              <th className="px-4 py-3">Kultur</th>
              <th className="px-4 py-3">Kategorie</th>
              <th className="px-4 py-3">Anzucht</th>
              <th className="px-4 py-3">Wachstum</th>
              <th className="px-4 py-3">Ernte</th>
              <th className="px-4 py-3">Abstand</th>
              <th className="px-4 py-3">Reihen</th>
              <th className="px-4 py-3">Ertrag</th>
              <th className="px-4 py-3">Saatgut</th>
            </tr>
          </thead>
          <tbody>
            {researchCrops.map((crop) => (
              <tr key={crop.id} className="border-t border-[var(--border)]/40">
                <td className="px-4 py-3 font-medium">{crop.name}</td>
                <td className="px-4 py-3">{crop.category}</td>
                <td className="px-4 py-3">{crop.seed_to_transplant_days ?? "Direkt"} Tage</td>
                <td className="px-4 py-3">{crop.growth_days} Tage</td>
                <td className="px-4 py-3">{crop.harvest_window_days} Tage</td>
                <td className="px-4 py-3">{crop.optimal_spacing_cm} cm</td>
                <td className="px-4 py-3">{crop.rows_per_bed_standard}</td>
                <td className="px-4 py-3">{crop.yield_per_square_meter ?? crop.yield_per_plant ?? "-"} {crop.yield_unit}</td>
                <td className="px-4 py-3">{crop.seed_quantity_per_unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
