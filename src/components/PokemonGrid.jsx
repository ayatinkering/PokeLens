import { useEffect, useState } from "react";
import TypeCard from "./TypeCard";

export default function PokemonGrid({
  pokemonList,
  setSelectedPokemon,
}) {

  const [pokemonData, setPokemonData] = useState({});

  useEffect(() => {

    pokemonList.forEach(async (pokemon) => {

      const res = await fetch(pokemon.url);

      const data = await res.json();

      setPokemonData((prev) => ({
        ...prev,
        [pokemon.name]: data,
      }));
    });

  }, [pokemonList]);

  return (
    <div
      className="
        grid
 grid-cols-1
sm:grid-cols-2
md:grid-cols-3
lg:grid-cols-4
xl:grid-cols-5
2xl:grid-cols-6
        gap-6
      "
    >

      {pokemonList.map((pokemon) => {

        const data =
          pokemonData[pokemon.name];

        if (!data) return null;

        return (
          
            <button
  className="pokemon-card hover:!bg-zinc-800"
  key={pokemon.name}
  onClick={() => setSelectedPokemon(data.id)}
>
  <span className="corner tl"></span>
  <span className="corner tr"></span>
  <span className="corner bl"></span>
  <span className="corner br"></span>

  <p className="text-white text-lg mb-2">
    #{String(data.id).padStart(3, "0")}
  </p>

  <img
    loading="lazy"
    src={data.sprites.other["official-artwork"].front_default}
    alt={data.name}
    className="h-32 mx-auto object-contain"
  />

  <h3 className="capitalize text-lg mt-3">
    {data.name}
  </h3>

  <div className="flex justify-center gap-2 mt-3 flex-wrap ">
    {data.types.map((typeObj) => (
      <TypeCard
        key={typeObj.type.name}
        type={typeObj.type.name}
      />
    ))}
  </div>
</button>

        );
      })}

    </div>
  );
}