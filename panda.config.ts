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
