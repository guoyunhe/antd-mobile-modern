import React, { FC, useCallback, useMemo } from 'react'
import PickerView from '../picker-view'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'
import { usePropsValue } from '../../utils/use-props-value'
import {
  Precision,
  generateDatePickerColumns,
  convertDateToStringArray,
  convertStringArrayToDate,
} from '../date-picker/date-picker-utils'

export type DatePickerViewProps = {
  value?: Date
  defaultValue?: Date
  onChange?: (value: Date) => void
  min?: Date
  max?: Date
  precision?: Precision
} & NativeProps<'--height'>

const thisYear = new Date().getFullYear()

const defaultProps = {
  min: new Date(new Date().setFullYear(thisYear - 10)),
  max: new Date(new Date().setFullYear(thisYear + 10)),
  precision: 'day',
}

export const DatePickerView: FC<DatePickerViewProps> = p => {
  const props = mergeProps(defaultProps, p)

  const [value, setValue] = usePropsValue<Date | null>({
    value: props.value,
    defaultValue: props.defaultValue ?? null,
  })

  const pickerValue = useMemo(() => convertDateToStringArray(value), [value])

  const onChange = useCallback(
    (val: string[]) => {
      const date = convertStringArrayToDate(val)
      if (date) {
        setValue(date)
        props.onChange?.(date)
      }
    },
    [props.onChange]
  )

  return withNativeProps(
    props,
    <PickerView
      columns={selected =>
        generateDatePickerColumns(
          selected as string[],
          props.min,
          props.max,
          props.precision
        )
      }
      value={pickerValue}
      onChange={onChange}
    />
  )
}