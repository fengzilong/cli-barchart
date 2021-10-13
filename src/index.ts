import termSize from 'term-size'
import isEven from 'is-even'
import stringWidth from 'string-width'
import chalk from 'chalk'

interface IDataItem {
  key: string,
  value: number
}

interface IOptions {
  maxWidth?: number
  colorize?: (item: IDataItem, index: number, data: IDataItem[]) => (arg: string) => string
  renderLabel?: ( item: IDataItem, index: number, data: IDataItem[] ) => string
}

const BLOCK_CHAR = '▋'
const { columns: TERM_COLUMNS } = termSize()

function makeBarChart( data: IDataItem[], options: IOptions = {} ) {
  let { maxWidth } = options

  maxWidth = toEven( maxWidth || ( TERM_COLUMNS / 3 ) )

  const keys: string[] = data.map( v => v.key )
  const values: number[] = data.map( v => v.value )

  const longestLength = Math.max( ...keys.map( key => stringWidth( key ) ) )

  const sum = values.reduce( ( memo, n ) => {
    memo = memo + n
    return memo
  }, 0 )

  let array: string[] = []
  for ( let i = 0, len = data.length; i < len; i++ ) {
    const item = data[ i ]
    const { key, value } = item
    const percentage = value / sum
    const barColumns: number = Math.round( maxWidth * percentage )
    const restColumns = maxWidth - barColumns
    const keyLength = stringWidth( key )
    
    const colorize = options.colorize ? options.colorize( item, i, data ) : chalk.blue
    const label = options.renderLabel ?
      options.renderLabel( item, i, data ) :
      chalk.gray( ( percentage * 100 ).toFixed( 1 ) + '%' )

    array.push(
      ' '.repeat( longestLength ).slice( keyLength ) + key + ' ' +
      renderBar( BLOCK_CHAR, barColumns, restColumns, colorize ) +
      ' ' + label
    )
  }

  return array.join( '\n\n' )
}

function renderBar(
  blockChar: string,
  barLength: number,
  restLength: number,
  colorize: ( params: string ) => string
): string {
  return colorize( blockChar.repeat( barLength ) ) +
    ( chalk.supportsColor ? chalk.gray( blockChar.repeat( restLength ) ) : '' )
}

function toEven( n: number ): number {
  n = Math.round( Math.abs( n ) )

  return isEven( n ) ? n : n - 1
}

export default makeBarChart
