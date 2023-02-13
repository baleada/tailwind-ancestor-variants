import createPlugin from 'tailwindcss/plugin'

export type AncestorVariantsOptions = {
  ancestorIdentifier?: string
}

export type AncestorVariants = (string | AncestorVariantTuple | AncestorVariantDescriptor)[]
export type AncestorVariantTuple = [variant: string, selector: string]
export type AncestorVariantDescriptor = {
  variant: string,
  selector: string,
  disableSelector?: string,
  specificity?: 0 | 1,
}

export function defineConfig (config: AncestorVariants) {
  return config
}

export function toTheme (config: AncestorVariants) {
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

    for (const { variant, selector, disableSelector, specificity } of narrowed) {
      const fn = specificity === 0 ? 'where' : 'is'

      if (disableSelector) {
        addVariant(variant, `:${fn}(:where(${ancestorIdentifier})${selector} &:where(:not(${disableSelector}):not(${disableSelector} *)))`)
        addVariant(`not-${variant}`, `:${fn}(:where(${ancestorIdentifier}):not(${selector}) &:where(:not(${disableSelector}):not(${disableSelector} *)))`)
        continue
      }

      addVariant(variant, `:${fn}(:where(${ancestorIdentifier})${selector} &)`)
      addVariant(`not-${variant}`, `:${fn}(:where(${ancestorIdentifier}):not(${selector}) &)`)
    }
  }
})

function narrow (variants: AncestorVariants): AncestorVariantDescriptor[] {
  return variants.map(
    variantOrTupleOrDescriptor => {
      if (typeof variantOrTupleOrDescriptor === 'string') {
        return { variant: variantOrTupleOrDescriptor, selector: `.${variantOrTupleOrDescriptor}` }
      }

      if (Array.isArray(variantOrTupleOrDescriptor)) {
        return { variant: variantOrTupleOrDescriptor[0], selector: variantOrTupleOrDescriptor[1] }
      }
      
      return variantOrTupleOrDescriptor
    }
  )
}
