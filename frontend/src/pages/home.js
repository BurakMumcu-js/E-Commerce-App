import {useEffect, useState} from "react";
import axios from "axios";
function HomeComponent(){
    const [products,setProducts] = useState([])

    const getAll = async () => {
        var response = await axios.get('http://localhost:5000/products')
        setProducts(response.data)
        console.log(response.data);
    }

    useEffect(()=>{
        getAll()
    },[])

    const addBasket = async (productId) =>{
        let user = JSON.parse(localStorage.getItem('user'))
        let model = {productId:productId,userId:user._id}
        var response = await axios.post('http://localhost:5000/baskets/add',model)
        alert(response.data.message)
        getAll();
    }


    return(
        <>
            <h1>Ana Sayfa</h1>
         <div className='container'>
             <div className='row'>
                 {
                     products.map((product,index)=>{
                         return(
                             <div key={index} className='col-md-3 mt-2'>
                                 <div className='card'>
                                     <div className='card-header'>
                                         <h4>
                                             {product.name}
                                         </h4>
                                     </div>
                                     <div className='card-body'>
                                         <img style={{width:'180px',height:'150px'}} src={'http://localhost:5000/' + product.imageUrl}/>
                                         <h4 className='text-center mt-2' style={{border:'1px solid #ccc',padding:'10px'}}>Adet : {product.stock}</h4>
                                         <h4 className='text-center text-danger mt-2' style={{border:'1px solid #ccc',padding:'10px'}}>Fiyat : {product.price}</h4>
                                         { product.stock ? <button onClick={()=> addBasket(product._id)} className='btn btn-outline-success w-100'>
                                             Sepete Ekle
                                         </button> : <button className='btn btn-danger w-100'>
                                             Ürün Stokta Yok
                                         </button>}
                                     </div>
                                 </div>
                             </div>
                             )
                     })
                 }
             </div>
         </div>
        </>
    )
}

export default HomeComponent