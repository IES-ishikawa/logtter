import moment from 'moment'

import type { Duration } from 'moment'
import type { editor } from 'monaco-editor'

export function diffTimeCalc(model: editor.ITextModel, startLineNum: number, endLineNum: number): string {
  if (startLineNum !== endLineNum) {
    const startText = model.getLineContent(startLineNum)
    let endText = model.getLineContent(endLineNum)
    if (endText === '') {
      endText = model.getLineContent(endLineNum - 1)
    }
    const timePeriod = getTimePeriod(startText, endText)
    return timePeriod ? convertToDisplayString(timePeriod) : null
  } else {
    return null
  }
}

function convertToDisplayString(selectedDuration: Duration): string {
  let text = ''

  if (selectedDuration.asDays() >= 1) {
    text += Math.floor(selectedDuration.asDays()) + 'd'
  }
  if (text !== '') {
    text += ', ' + selectedDuration.hours() + 'h'
  } else if (selectedDuration.hours() !== 0) {
    text += selectedDuration.hours() + 'h'
  }
  if (text !== '') {
    text += ', ' + selectedDuration.minutes() + 'm'
  } else if (selectedDuration.minutes() !== 0) {
    text += selectedDuration.minutes() + 'm'
  }
  if (text !== '') {
    text += ', ' + selectedDuration.seconds() + 's'
  } else if (selectedDuration.seconds() !== 0) {
    text += selectedDuration.seconds() + 's'
  }
  if (text !== '') {
    text += ', ' + selectedDuration.milliseconds() + 'ms'
  } else {
    text += selectedDuration.milliseconds() + 'ms'
  }

  return text
}

function getTimePeriod(firstLine: string, lastLine: string): Duration {
  const clockPattern = '\\d{2}:\\d{2}(?::\\d{2}(?:[.,]\\d{3,})?)?(?:Z| ?[+-]\\d{2}:\\d{2})?\\b'
  const isoDatePattern = '\\d{4}-\\d{2}-\\d{2}(?:T|\\b)'
  const cultureDatesPattern = '\\d{2}[^\\w\\s]\\d{2}[^\\w\\s]\\d{4}\\b'
  const dateTimePattern =
    '((?:' + isoDatePattern + '|' + cultureDatesPattern + '){1} ?' + '(?:' + clockPattern + '){1})'
  const datesPattern = '(' + isoDatePattern + '|' + cultureDatesPattern + '){1}'

  const rankedPattern = [dateTimePattern, clockPattern, datesPattern]
  let firstLineMatch: string
  let lastLineMatch: string

  for (const item of rankedPattern) {
    const timeRegEx = new RegExp(item)

    const firstMatch = timeRegEx.exec(firstLine)
    const lastMatch = timeRegEx.exec(lastLine)

    if (firstMatch && lastMatch) {
      firstLineMatch = convertToIso(firstMatch[0])
      lastLineMatch = convertToIso(lastMatch[0])
      break
    }
  }

  let timePeriod: Duration = null

  if (firstLineMatch && lastLineMatch) {
    const firstMoment = moment(firstLineMatch)
    const lastMoment = moment(lastLineMatch)

    if (firstMoment.isValid() && lastMoment.isValid()) {
      timePeriod = moment.duration(lastMoment.diff(firstMoment))
    } else {
      const firstDuration = moment.duration(firstLineMatch)
      const lastDuration = moment.duration(lastLineMatch)

      if (moment.isDuration(firstDuration) && moment.isDuration(lastDuration)) {
        timePeriod = moment.duration(lastDuration.asMilliseconds() - firstDuration.asMilliseconds())
      }
    }
  }

  return timePeriod
}

function convertToIso(dateString: string): string {
  let result = dateString.replace(
    /\b((?:0[1-9])|(?:1[0-2]))[./-]((?:0[1-9])|(?:[1-2][0-9])|(?:3[0-1]))[./-](\d{4})/g,
    '$3-$1-$2'
  )

  result = dateString.replace(
    /\b((?:0[1-9])|(?:[1-2][0-9])|(?:3[0-1]))[./-]((?:0[1-9])|(?:1[0-2]))[./-](\d{4})/g,
    '$3-$2-$1'
  )

  result = result.replace(',', '.')

  return result
}
