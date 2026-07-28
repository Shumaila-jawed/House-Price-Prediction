"use client";

import { useState } from "react";

type FormState = {
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  lot_size_sqft: number;
  year_built: number;
  garage_spaces: number;
  distance_to_city_center_km: number;
  crime_rate_index: number;
  nearby_school_rating: number;
  parking_spaces: number;
  days_on_market: number;
  city: string;
  property_type: string;
  furnished: string;
  property_condition: string;
  swimming_pool: string;
};

const CITIES = [
  "Chicago",
  "Dallas",
  "Houston",
  "Los Angeles",
  "New York",
  "Philadelphia",
  "Phoenix",
  "San Antonio",
  "San Diego",
];

const PROPERTY_TYPES = ["Luxury", "Multi-Family", "Ranch", "Single Family", "Townhouse"];
const CONDITIONS = ["Fair", "Good", "Poor"];

const initialState: FormState = {
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  lot_size_sqft: 5000,
  year_built: 2005,
  garage_spaces: 1,
  distance_to_city_center_km: 10,
  crime_rate_index: 30,
  nearby_school_rating: 7,
  parking_spaces: 2,
  days_on_market: 30,
  city: "Los Angeles",
  property_type: "Single Family",
  furnished: "No",
  property_condition: "Good",
  swimming_pool: "No",
};

function Field({
  label,
  unit,
  children,
}: {
  label: string;
  unit?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-blueprint-bg/60 flex items-baseline justify-between">
        {label}
        {unit && <span className="text-blueprint-bg/40">{unit}</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full bg-transparent border-b border-blueprint-bg/25 focus:border-blueprint-amber outline-none py-1.5 font-mono text-sm text-blueprint-bg transition-colors";

export default function Home() {
  const [form, setForm] = useState<FormState>(initialState);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Prediction failed. Please try again.");

      const data = await res.json();
      setResult(data.predicted_price);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bp-grid">
      {/* Hero */}
      <section className="px-6 pt-20 pb-14 max-w-5xl mx-auto">
        <div className="font-mono text-xs tracking-[0.2em] text-blueprint-amber uppercase mb-4">
          Property Valuation &middot; Rev. 01
        </div>
        <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-blueprint-paper leading-[1.05] max-w-3xl">
          What is this property really worth?
        </h1>
        <p className="mt-5 font-body text-blueprint-slate max-w-xl text-base sm:text-lg">
          Enter the specifications below and a Random Forest model, trained
          on comparable listings, will draft an estimate in seconds.
        </p>
      </section>

      {/* Spec sheet / form */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-blueprint-paper rounded-sm shadow-2xl px-6 py-8 sm:px-10 sm:py-10"
        >
          <div className="flex items-center justify-between border-b border-blueprint-bg/15 pb-4 mb-8">
            <span className="font-mono text-[11px] uppercase tracking-wider text-blueprint-bg/50">
              Schedule of Specifications
            </span>
            <span className="font-mono text-[11px] text-blueprint-bg/50">
              16 fields
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
            <Field label="Bedrooms">
              <input
                type="number"
                className={inputClass}
                value={form.bedrooms}
                min={0}
                max={10}
                onChange={(e) => update("bedrooms", Number(e.target.value))}
              />
            </Field>

            <Field label="Bathrooms">
              <input
                type="number"
                className={inputClass}
                value={form.bathrooms}
                min={0}
                max={10}
                onChange={(e) => update("bathrooms", Number(e.target.value))}
              />
            </Field>

            <Field label="Square feet" unit="sq ft">
              <input
                type="number"
                className={inputClass}
                value={form.square_feet}
                min={200}
                max={15000}
                onChange={(e) => update("square_feet", Number(e.target.value))}
              />
            </Field>

            <Field label="Lot size" unit="sq ft">
              <input
                type="number"
                className={inputClass}
                value={form.lot_size_sqft}
                min={0}
                max={100000}
                onChange={(e) => update("lot_size_sqft", Number(e.target.value))}
              />
            </Field>

            <Field label="Year built">
              <input
                type="number"
                className={inputClass}
                value={form.year_built}
                min={1900}
                max={2026}
                onChange={(e) => update("year_built", Number(e.target.value))}
              />
            </Field>

            <Field label="Garage spaces">
              <input
                type="number"
                className={inputClass}
                value={form.garage_spaces}
                min={0}
                max={5}
                onChange={(e) => update("garage_spaces", Number(e.target.value))}
              />
            </Field>

            <Field label="Parking spaces">
              <input
                type="number"
                className={inputClass}
                value={form.parking_spaces}
                min={0}
                max={10}
                onChange={(e) => update("parking_spaces", Number(e.target.value))}
              />
            </Field>

            <Field label="Distance to center" unit="km">
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={form.distance_to_city_center_km}
                min={0}
                max={100}
                onChange={(e) =>
                  update("distance_to_city_center_km", Number(e.target.value))
                }
              />
            </Field>

            <Field label="Crime rate index">
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={form.crime_rate_index}
                min={0}
                max={100}
                onChange={(e) => update("crime_rate_index", Number(e.target.value))}
              />
            </Field>

            <Field label="School rating" unit="/ 10">
              <input
                type="number"
                step="0.1"
                className={inputClass}
                value={form.nearby_school_rating}
                min={1}
                max={10}
                onChange={(e) =>
                  update("nearby_school_rating", Number(e.target.value))
                }
              />
            </Field>

            <Field label="Days on market">
              <input
                type="number"
                className={inputClass}
                value={form.days_on_market}
                min={0}
                max={500}
                onChange={(e) => update("days_on_market", Number(e.target.value))}
              />
            </Field>

            <Field label="City">
              <select
                className={inputClass}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Property type">
              <select
                className={inputClass}
                value={form.property_type}
                onChange={(e) => update("property_type", e.target.value)}
              >
                {PROPERTY_TYPES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Condition">
              <select
                className={inputClass}
                value={form.property_condition}
                onChange={(e) => update("property_condition", e.target.value)}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Furnished">
              <select
                className={inputClass}
                value={form.furnished}
                onChange={(e) => update("furnished", e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>

            <Field label="Swimming pool">
              <select
                className={inputClass}
                value={form.swimming_pool}
                onChange={(e) => update("swimming_pool", e.target.value)}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Field>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-blueprint-bg text-blueprint-paper font-mono text-sm uppercase tracking-wider px-7 py-3 rounded-sm hover:bg-blueprint-amber hover:text-blueprint-bg transition-colors disabled:opacity-50"
            >
              {loading ? "Calculating…" : "Estimate Price"}
            </button>

            {error && (
              <span className="font-mono text-sm text-red-700">{error}</span>
            )}

            {result !== null && (
              <div className="bp-crosshair font-mono">
                <span className="text-[11px] uppercase tracking-wider text-blueprint-bg/50 block">
                  Estimated Value
                </span>
                <span className="text-2xl text-blueprint-bg font-medium">
                  $
                  {result.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
            )}
          </div>
        </form>

        <p className="mt-6 font-mono text-xs text-blueprint-slate text-center">
          Model: Random Forest Regressor &middot; Trained on comparable
          property listings
        </p>
      </section>
    </main>
  );
}
