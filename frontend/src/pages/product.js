import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
function ProductComponent(){
    const [products,setProducts] = useState([]);
    const [name,setName] = useState('');
    const [stock,setStock] = useState(0);
    const [categoryName,setCategoryName] = useState('');
    const [price,setPrice] = useState(0);
    const navigate = useNavigate()


    const getAll = async () => {
        const response = await axios.get('http://localhost:5000/products')
        setProducts(response.data)
    }

    useEffect( ()=>{
        getAll()
        checkIsAdmin();
    },[]);

    const remove = async (_id) => {

        let confirm = window.confirm('Ürünü Silmek İstediğinize Emin Misiniz')
        if (confirm){
        let model = {
            _id:_id
        }
     let response = await axios.post('http://localhost:5000/products/remove',model)
        alert(response.data.message)
        await  getAll();
    }
    }

    const add = async (e) => {
        e.preventDefault();
        var input = document.querySelector("input[type='file']")

        const formData = new FormData();
        formData.append('name',name)
        formData.append('categoryName',categoryName);
        formData.append('price',price);
        formData.append('stock',stock);
        formData.append('image',input.files[0],input.files[0].name)

        var response = await axios.post('http://localhost:5000/products/add',formData)

        alert(response.data.message);
        getAll();
        let element = document.querySelector('#addModalCloseBtn');
        element.click();

        setName('');
        setCategoryName(0);
        setPrice(0);
        setStock(0);
        input.value = '';
    }

    const checkIsAdmin = () => {
        let user = JSON.parse(localStorage.getItem('user'))
       if (!user.isAdmin){
           navigate('/')
       }
    }

    return(
        <>
           <div className='container mt-4'>
               <div className='card'>
                   <div className='card-header'>
                       <h1>Ürün Listesi</h1>
                   </div>
                   <div className='card-body'>
                    <div className='form-group'>
                        <button data-bs-toggle='modal' data-bs-target='#addModal' className='btn btn-outline-primary'>
                            Ekle
                        </button>
                        <table className='table table-bordered table-hover mt-2'>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Resim</th>
                                <th>Ürün Adı</th>
                                <th>Kategori Adı</th>
                                <th>Adet</th>
                                <th>Fiyat</th>
                                <th>İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            {products.map((product,index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <img style={{width:'50px'}} src={'http://localhost:5000/' + product.imageUrl}/>
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.stock}</td>
                                    <td>{product.price}</td>
                                  <td>
                                      <button onClick={() => remove(product._id)} className='btn btn-outline-danger btn-sm'>Sil</button>
                                  </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                   </div>
               </div>
           </div>


            <div className="modal fade" id="addModal" tabIndex="-1" role="dialog"
                 aria-labelledby="addModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addModalLabel">Ürün Ekle</h5>
                            <button type="button" className="close"  id='addModalCloseBtn'
                                    data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <form onSubmit={add}>
                        <div className="modal-body">
                          <div className='form-group'>
                              <label htmlFor='name'>Ürün Adı</label>
                                <input className='form-control' value={name} onChange={(e)=>setName(e.target.value)} id='name' name='name' />
                          </div>
                            <div className='form-group'>
                                <label htmlFor='categoryName'>Kategori Adı</label>
                              <select className='form-control' value={categoryName} onChange={(e)=>setCategoryName(e.target.value)}>
                                  <option value='0'>Seçim Yapınız ...</option>
                                  <option>Sebze</option>
                                  <option>Meyve</option>
                                  <option>Teknoloji</option>
                                  <option>Diğer</option>
                              </select>
                            </div>
                            <div className='form-group mt-2'>
                                <label htmlFor='stock'>Stok Adedi</label>
                                <input className='form-control' value={stock} onChange={(e)=>setStock(e.target.value)} id='stock' name='stock' />
                            </div>
                            <div className='form-group mt-2'>
                                <label htmlFor='price'>Birim Fiyat</label>
                                <input className='form-control' value={price} onChange={(e)=>setPrice(e.target.value)} id='price' name='price' />
                            </div>
                            <div className='form-group mt-2'>
                                <label htmlFor='image'>Resim</label>
                                <input type='file' className='form-control'  id='image' name='image' />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Kapat</button>
                            <button type="submit" className="btn btn-primary">Kaydet</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ProductComponent