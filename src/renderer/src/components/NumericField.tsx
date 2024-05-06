import { forwardRef, type ElementType } from 'react'

import { TextField } from '@mui/material'
import { NumericFormat } from 'react-number-format'

import type { InputBaseComponentProps, TextFieldProps } from '@mui/material'
import type { NumericFormatProps } from 'react-number-format'

type NumberFieldProps = TextFieldProps

export function NumericField(props: NumberFieldProps): JSX.Element {
  const { InputProps, ...other } = props
  return (
    <TextField
      InputProps={{
        ...InputProps,
        inputComponent: NumericInput as unknown as ElementType<InputBaseComponentProps>
      }}
      {...other}
    />
  )
}

type NumericInputProps = {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const NumericInput = forwardRef<NumericFormatProps, NumericInputProps>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        })
      }}
      valueIsNumericString
    />
  )
})
