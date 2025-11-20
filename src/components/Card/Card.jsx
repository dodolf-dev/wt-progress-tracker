export default function Card({title, cover,id}){
    return ( 
        <Link to={`/housing/${id}`} className="card">
            <p>{title}</p>
            <img src={cover} alt="cover"/>
        </Link> 
    )
}