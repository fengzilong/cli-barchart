import termSize from 'term-size'
import isEven from 'is-even'
import stringWidth from 'string-width'
import chalk from 'chalk'

interface IDataItem {
  key: string,
  value: number
}

const BLOCK_CHAR = '▋'
const { columns: TERM_COLUMNS } = termSize()
const HALF_COLUMNS = isEven( TERM_COLUMNS ) ?
  TERM_COLUMNS / 2 :
  ( TERM_COLUMNS - 1 ) / 2


function makeBarChart( data: IDataItem[] ) {
  const keys: string[] = data.map( v => v.key )
  const values: number[] = data.map( v => v.value )

  const longestLength = Math.max( ...keys.map( key => stringWidth( key ) ) )

  const sum = values.reduce( ( memo, n ) => {
    memo = memo + n
    return memo
  }, 0 )

  

  let array: string[] = []
  for ( let { key, value } of data ) {
    const percentage = value / sum
    const barColumns = HALF_COLUMNS * percentage
    const keyLength = stringWidth( key )
    array.push(
      ' '.repeat( longestLength ).slice( keyLength ) + key +
      ' ' +
      chalk.blue( BLOCK_CHAR.repeat( Math.round( barColumns ) ) ) +
      ' ' + chalk.gray( ( percentage * 100 ).toFixed( 1 ) + '%' )
    )
  }

  return array.join( '\n\n' )
}

export default makeBarChart
