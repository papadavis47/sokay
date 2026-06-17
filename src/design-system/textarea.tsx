import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { textarea } from 'styled-system/recipes'

export const Textarea = styled('textarea', textarea)

export type TextareaProps = ComponentProps<typeof Textarea>
