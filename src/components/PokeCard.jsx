import { useEffect, useState } from 'react'
import { getFullPokedexNumber, getPokedexNumber } from '../utils/index'
import TypeCard from './TypeCard'
import Modal from './Modal'

export default function PokeCard(props) {
    const {selectedPokemon,closeModal,} = props;

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const { name, height, abilities, stats, types, moves } = data || {}

    async function fetchMoveData(move, moveUrl) {
        if (loadingSkill || !localStorage || !moveUrl) { return }

        // check cache for move
        let c = {}
        if (localStorage.getItem('pokemon-moves')) {
            c = JSON.parse(localStorage.getItem('pokemon-moves'))
        }

        if (move in c) {
            setSkill(c[move])
            console.log('Found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.filter(val => {
                return val.version_group.name == 'firered-leafgreen'
            })[0]?.flavor_text

            const skillData = {
                name: move,
                description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingSkill(false)
        }
    }

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) { return }
        // check if the selected pokemon information is available in the cache
        // 1. define the cache
        let cache = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex'))
        }

        // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return
        }

        // we passed all the cache stuff to no avail and now need to fetch the data from the api

        async function fetchPokemonData() {
            setLoading(true)
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' +selectedPokemon
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('Fetched pokemon data')
                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

        // if we fetch from the api, make sure to save the information to the cache for next time
    }, [selectedPokemon])

    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        )
    }

    //Calculate BST
    const bst = stats?.reduce(
  (acc, stat) => acc + stat.base_stat,
  0
);

//diff colours for STATS BARS
const statColors = {
  hp: "from-red-400 to-red-500",
  attack: "from-orange-400 to-orange-500",
  defense: "from-yellow-300 to-yellow-400",
  "special-attack":
    "from-blue-400 to-blue-500",
  "special-defense":
    "from-green-400 to-green-500",
  speed:
    "from-pink-400 to-pink-500"
};


    return (
  <Modal handleCloseModal={closeModal}>
    <div
  className="
    bg-[#ff3234]
    border-3
    border-black/70
    rounded-xl
    w-[95vw]
    max-w-[1100px]
    h-[90vh]
    max-h-[900px]
    flex
    overflow-hidden
  "
>

      {/* LEFT */}

      <div className="
  w-full
  lg:w-[48%]
  bg-[#ff3234]
  relative
  overflow-hidden
  border-r-0
  lg:border-r-3
  border-black/70
">
        <img
  src="/pokedex.png"
  alt="pokedex"
  className="
    w-full
    h-full
    object-fill
    
  "
/>

        <img
  src={
    data.sprites.other.home.front_default ||
    data.sprites.other["official-artwork"].front_default
  }
  alt={name}
  className="
    absolute
    left-1/2
    top-[42%]
    -translate-x-1/2
    -translate-y-1/2
    w-[40%]
    max-w-[320px]
    min-w-[180px]
  "
/>

        <p
  className="
    absolute
    left-1/2
    bottom-[7%]
    -translate-x-1/2
    text-center
    text-black
    font-bold
    text-[clamp(18px,2vw,34px)]
    w-[45%]
    uppercase
  "
>
  {name.toUpperCase()}
</p>

      </div>

      {/* RIGHT */}

<div className="
  w-full
  lg:w-[52%]
  bg-[#111114]
  overflow-y-auto
  p-4
  md:p-6
  border-[20px]
  md:border-[32px]
  border-[#ff3234]
">
        <p className="text-zinc-300 text-lg">
          #{getFullPokedexNumber(selectedPokemon)}
        </p>

        <h2 className="text-4xl mb-2">
          {name.toUpperCase()}
        </h2>

        <div className="flex gap-2 mb-3">
          {types.map((typeObj, index) => (
            <TypeCard
              key={index}
              type={typeObj.type.name}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">

  <div className="bg-zinc-900 p-2 rounded-lg">
    <p className="text-zinc-500 text-xs">
      HEIGHT
    </p>
    <h3 className="text-[15px]">
      {(height / 10).toFixed(1)} m
    </h3>
  </div>

  <div className="bg-zinc-900 p-2 rounded-lg">
    <p className="text-zinc-500 text-xs">
      WEIGHT
    </p>
    <h3 className="text-[14px]">
      {(data.weight / 10).toFixed(1)} kg
    </h3>
  </div>

  <div className="bg-zinc-900 p-2 rounded-lg">
    <p className="text-zinc-500 text-xs">
      BASE XP
    </p>
    <h3 className="text-[15px]">
      {data.base_experience}
    </h3>
  </div>

  <div className="bg-zinc-900 p-2 rounded-lg">
    <p className="text-zinc-500 text-xs">
      BST
    </p>
    <h3 className="text-[15px]">
      {bst}
    </h3>
  </div>

</div>

        <h3 className="text-lg mb-1">
  STATS
</h3>

<div className="space-y-1 mb-6">

  {stats.map((statObj) => {

    const value = statObj.base_stat;

    return (
      <div
        key={statObj.stat.name}
        className="grid grid-cols-[120px_35px_1fr]
md:grid-cols-[150px_35px_1fr] items-center gap-2 text-sm"
      >
        <p>
          {statObj.stat.name[0].toUpperCase()+statObj.stat.name.substring(1)}
        </p>

        <p>
          {value}
        </p>

        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">

          <div
            className={`
  h-full
  rounded-full
  bg-gradient-to-r
  ${statColors[statObj.stat.name]}
`}
            style={{
              width: `${Math.min(
                value,
                150
              ) / 150 * 100}%`
            }}
          />

        </div>

      </div>
    );

  })}

</div>

        <h3 className="text-lg mb-1 ">
          MOVES
        </h3>

        <div
          className="flex flex-wrap gap-2"
        >
          {moves.slice(0, 24).map((moveObj) => (
            <button
              key={moveObj.move.name}
              onMouseEnter={() =>
                fetchMoveData(
                  moveObj.move.name,
                  moveObj.move.url
                )
              }
              className="
  px-2
  py-0.5
  m-0
  rounded-full
  border
  border-zinc-700
  bg-zinc-900
  hover:bg-zinc-800
  cursor-grab
  capitalize
  text-xs
"
            >
              {moveObj.move.name}
            </button>
          ))}
        </div>

        {skill && (
  <div
    className="
      sticky
      bottom-0
      mt-4
      py-2 px-3
      rounded-xl
      border
      border-zinc-700
      bg-zinc-900
    "
  >
    <h4 className="mb-1 capitalize text-sm">
      {skill.name}
    </h4>

    <p className="text-zinc-200 text-xs">
      {skill.description}
    </p>
  </div>
)}

      </div>

    </div>
  </Modal>
);
}