export interface Pokemon {
  id: number
  name: string
  types: string[]
  sprites: {
    front_default: string
    other?: {
      'official-artwork'?: {
        front_default?: string
      }
    }
  }
  height: number
  weight: number
  species?: {
    url: string
  }
}

export interface PokemonSpecies {
  color: {
    name: string
  }
  flavor_text_entries: {
    flavor_text: string
    language: {
      name: string
    }
  }[]
}
