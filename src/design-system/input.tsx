import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { input } from 'styled-system/recipes'

export const Input = styled('input', input)

export type InputProps = ComponentProps<typeof Input>
