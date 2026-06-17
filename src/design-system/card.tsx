import { createStyleContext } from 'styled-system/jsx'
import { card } from 'styled-system/recipes'

// Compound Card built from the `card` slot recipe. createStyleContext wires the
// `size` variant from <Card> down to the header/title/description slots via
// context (replacing the old hand-rolled CardSizeContext), and every part is a
// styled factory component, so consumers can override with `css`/style props.
const { withProvider, withContext } = createStyleContext(card)

export const Card = withProvider('div', 'root')
export const CardHeader = withContext('div', 'header')
export const CardBody = withContext('div', 'body')
export const CardFooter = withContext('div', 'footer')
export const CardTitle = withContext('h3', 'title')
export const CardDescription = withContext('p', 'description')
