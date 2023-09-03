import {useEffect, useState} from "react";
import axios from "axios";
function BasketComponent(){
    const [baskets,setBaskets] = useState([])
    const [total,setTotal] = useState(null)

    const getAll = async () => {
        let user = JSON.parse(localStorage.getItem('user'))
    let model = {
            userId: user._id
    }
        let response = await axios.post('http://localhost:5000/baskets/getAll',model)
                setBaskets(response.data)
           let price = 0;
           baskets.map(item => {
               price += item.products[0].price
           })
           setTotal(price)
    }

    const remove = async (_id) => {
        let confirm = window.confirm('Ürünü Silmek İstediğinize Emin Misiniz')
        if(confirm){
            let model = {
                _id:_id
            }
            let response = await axios.post('http://localhost:5000/baskets/remove',model)
            getAll();
        }
    }

    const addOrder = async () => {
        let user = JSON.parse(localStorage.getItem('user'))
        let model = {userId: user._id}
        await axios.post('http://localhost:5000/orders/add',model);
        getAll()
    }

    useEffect(()=>{
        getAll();
        })

    return(
        <>
       <div className='container mt-4'>
           <div className='card'>
               <div className='card-header'>
                <h1 className='text-center'>Sepetteki Ürünler</h1>
               </div>
               <div className='card-body'>
                   <div className='row'>
                       <div className='col-md-8'>
                           <table className='table table-bordered table-hover'>
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ürün Adı</th>
                                    <th>Ürün Resmi</th>
                                    <th>Ürün Adedi</th>
                                    <th>Birim Fiyatı</th>
                                    <th>İşlemler</th>
                                </tr>
                                </thead>
                               <tbody>
                               {
                                  baskets.map((basket,index)=>{
                                       return(
                                           <tr key={index}>
                                               <td>{index + 1}</td>
                                               <td>{basket.products[0].name}</td>
                                               <td>
                                                   <img width='75' src={'http://localhost:5000/' + basket.products[0].imageUrl }/>
                                               </td>
                                               <td>1</td>
                                               <td>{basket.products[0].price}</td>
                                               <td> <button onClick={()=>remove(basket._id)} className='btn btn-outline-danger btn-sm'>Ürünü Sil</button></td>
                                           </tr>
                                       )
                                   })
                               }
                               </tbody>
                           </table>
                       </div>
                       <div className='col-md-4'>
                           <div className='card'>
                               <div className='card-header'>
                                   <h4 className='text-center'>Sepet Toplamı</h4>
                                                <hr/>
                                       <h6 className='alert alert-danger text-center mt-2'>Toplam Ürün Sayısı : {baskets.length}</h6>
                                       <h6 className='alert alert-danger text-center'>Toplam Tutar : {total}</h6>
                                            <hr/>
                                   <button onClick={addOrder} className='btn btn-outline-danger w-100'>Ödeme Yap</button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
        </>
    )
}

export default BasketComponent