import createPlugin from 'tailwindcss/plugin'

export type AncestorVariantsOptions = {
  ancestorIdentifier?: string
}

export type Variants = (string | VariantSelectorTuple)[]
export type VariantSelectorTuple = [variant: string, selector: string]

export function defineConfig (config: Variants) {
  return config
}

export function toTheme (config: Variants) {
  return { [key]: config }
}

export const key = 'ancestorVariants' as const

const defaultOptions: AncestorVariantsOptions = {
  ancestorIdentifier: '.ancestor',
}

/**
 * https://baleada.dev/docs/ancestor-variants
 */
export const plugin = createPlugin.withOptions((options: AncestorVariantsOptions = {}) => {
  const { ancestorIdentifier } = { ...defaultOptions, ...options }

  return ({ addVariant, theme }) => {
      const narrowed = narrow(theme(key, []))

      for (const [variant, selector] of narrowed) {
        addVariant(variant, `:is(${ancestorIdentifier}${selector} &)`)
        addVariant(`not-${variant}`, `:is(${ancestorIdentifier}:not(${selector}) &)`)
      }
  }
})

function narrow (variants: Variants) {
  return variants.map(
    variantOrTuple => Array.isArray(variantOrTuple)
      ? variantOrTuple
      : [variantOrTuple, `.${variantOrTuple}`] as VariantSelectorTuple
  )
}
