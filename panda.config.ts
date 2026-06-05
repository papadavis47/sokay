import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import teal from '@park-ui/panda-preset/colors/teal'
import neutral from '@park-ui/panda-preset/colors/neutral'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: teal,
      grayColor: neutral,
      radius: 'md',
    }),
  ],
  jsxFramework: 'react',
  outdir: 'styled-system',
  theme: {
    extend: {
      semanticTokens: {
        colors: {
          // Warm brand accent used for the "sokay" wordmark and heading
          // highlights. Light / dark values baked in.
          brand: {
            solid: { value: { base: '#ea580c', _dark: '#fdba74' } },
            solidHover: { value: { base: '#c2410c', _dark: '#fcd34d' } },
            onSolid: { value: { base: 'white', _dark: '#1c1917' } },
            // Soft warm surface + border for tinted cards / callouts.
            subtle: {
              value: {
                base: 'rgba(234, 88, 12, 0.08)',
                _dark: 'rgba(253, 186, 116, 0.10)',
              },
            },
            border: {
              value: {
                base: 'rgba(234, 88, 12, 0.25)',
                _dark: 'rgba(253, 186, 116, 0.28)',
              },
            },
          },
        },
        shadows: {
          brand: {
            value: {
              base: '0 8px 20px -6px rgba(234, 88, 12, 0.5)',
              _dark: '0 8px 20px -6px rgba(253, 186, 116, 0.45)',
            },
          },
          brandHover: {
            value: {
              base: '0 12px 26px -6px rgba(234, 88, 12, 0.6)',
              _dark: '0 12px 26px -6px rgba(253, 186, 116, 0.55)',
            },
          },
        },
      },
    },
  },
  plugins: [
    {
      name: 'Remove Panda Preset Colors',
      hooks: {
        'preset:resolved': ({ utils, preset, name }) =>
          name === '@pandacss/preset-panda'
            ? utils.omit(preset, ['theme.tokens.colors', 'theme.semanticTokens.colors'])
            : preset,
      },
    },
  ],
})
