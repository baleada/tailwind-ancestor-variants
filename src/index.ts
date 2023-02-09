import createPlugin from 'tailwindcss/plugin'

export type Variants = string[] | VariantSelectorTuple[]
export type VariantSelectorTuple = [variant: string, selector: string]

export function defineConfig (config: Variants) {
  return config
}

export function toTheme (config: Variants) {
  return { [key]: config }
}

export const key = 'ancestorVariants'

export const plugin = createPlugin(({ addVariant, theme }) => {
    const narrowed = narrow(theme(key, []))

    for (const [variant, selector] of narrowed) {
      addVariant(variant, `:is(${selector} &)`)
    }
})

function narrow (variants: Variants) {
  return Array.isArray(variants[0])
    ? variants as VariantSelectorTuple[]
    : variants.map(variant => [variant, `.${variant}`] as VariantSelectorTuple)
}
