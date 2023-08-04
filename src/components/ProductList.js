import React from 'react'

export default function ProductList({items, values}) {

    const pairs = items.map(function(item, i) {
        return [item, values[i]];
      });

  return (
    <>
        {pairs.map(pair => <h5 key={pair}>{pair[0]} {pair[1]}</h5>)}
    </>
  )
}
