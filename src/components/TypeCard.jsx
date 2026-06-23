import { pokemonTypeColors } from "../utils/index";

export default function TypeCard({ type }) {
  return (
    <div
      className="
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
      "
      style={{
        color: pokemonTypeColors?.[type]?.color,
        background: pokemonTypeColors?.[type]?.background,
      }}
    >
      {type}
    </div>
  );
}