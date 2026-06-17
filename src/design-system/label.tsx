import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { label } from 'styled-system/recipes'

export const Label = styled('label', label)

export type LabelProps = ComponentProps<typeof Label>
