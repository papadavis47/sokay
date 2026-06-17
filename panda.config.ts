import { defineConfig } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import teal from '@park-ui/panda-preset/colors/teal'
import neutral from '@park-ui/panda-preset/colors/neutral'
import { button } from './src/theme/recipes/button.recipe'
import { input } from './src/theme/recipes/input.recipe'
import { textarea } from './src/theme/recipes/textarea.recipe'
import { label } from './src/theme/recipes/label.recipe'
import { card } from './src/theme/recipes/card.recipe'
import { dialog } from './src/theme/recipes/dialog.recipe'
import { select } from './src/theme/recipes/select.recipe'
import { slider } from './src/theme/recipes/slider.recipe'
import { avatar } from './src/theme/recipes/avatar.recipe'

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
      recipes: {
        button,
        input,
        textarea,
        label,
      },
      slotRecipes: {
        card,
        dialog,
        select,
        slider,
        avatar,
      },
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
            // Quiet brand-tinted text for low-emphasis actions.
            mutedFg: {
              value: {
                base: 'rgba(234, 88, 12, 0.65)',
                _dark: 'rgba(253, 186, 116, 0.65)',
              },
            },
          },
          // Muted, desaturated slate-blue — the classic "feeling blue"
          // melancholy. Used to color the SAD acronym so it reads as somber
          // rather than on-brand. Light / dark values baked in.
          somber: {
            solid: { value: { base: '#5b6b8c', _dark: '#9aa8c4' } },
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
            ? utils.omit(preset, [
                'theme.tokens.colors',
                'theme.semanticTokens.colors',
              ])
            : preset,
      },
    },
    {
      // The Park UI preset ships full button/card/dialog/… recipe definitions,
      // but nothing imports them — we author our own (see src/theme/recipes/).
      // Strip the preset's recipes so we own the canonical names with no dead
      // generated CSS; keep all of its tokens (colors, radii, colorPalette).
      name: 'Remove Park UI Preset Recipes',
      hooks: {
        'preset:resolved': ({ utils, preset, name }) =>
          name === '@park-ui/panda-preset'
            ? utils.omit(preset, [
                'theme.extend.recipes',
                'theme.extend.slotRecipes',
              ])
            : preset,
      },
    },
  ],
})
