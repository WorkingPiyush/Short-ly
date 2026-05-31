import React from 'react'
import { useUser } from '../../Hooks/useUrl.jsx'

function Links() {
  const { data: urlRecords, isLoading } = useUser()
  console.log(urlRecords)

  return (
    <div>
      Links will display here !!
    </div>
  )
}

export default Links
