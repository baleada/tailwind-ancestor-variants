import createPlugin from 'tailwindcss/plugin'

export type Variants = string[] | VariantSelectorTuple[]
export type VariantSelectorTuple = [variant: string, selector: string]

export function defineAncestorVariants (variants: Variants) {
  return variants
}

export const plugin = createPlugin(({ addVariant, theme }) => {
    const narrowed = narrow(theme('ancestorVariants', []))

    for (const [variant, selector] of narrowed) {
      addVariant(variant, `:is(${selector} &)`)
    }
})

function narrow (variants: Variants) {
  return Array.isArray(variants[0])
    ? variants as VariantSelectorTuple[]
    : variants.map(variant => [variant, `.${variant}`] as VariantSelectorTuple)
}
