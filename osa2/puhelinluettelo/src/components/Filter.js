const Filter = (props) => {
  return (
    <>
    filter shown with 
    <input value={props.nameFilter} onChange={props.handleFilterChange}/>
    </>
  )
}

export default Filter