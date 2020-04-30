import React, {useState, useEffect} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import {getAllCategories, createProduct}  from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';

const AddProduct = () => {
    const {user, token} = isAuthenticated();

    const [values, setvalues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: ""

    })

const {name, description, price, stock, categories,
    category, loading, error, createdProduct, getaRedirect, formData} = values;

const preLoad = () => {
        getAllCategories().then(data => {
            
            if(data.error){
                setvalues({...values, error: data.error});
            }
            else{
                setvalues({...setvalues, categories: data, formData: new FormData()});
                console.log("CATE", categories);
                
            }
        })
    };

    useEffect(() => {
        preLoad();
    }, []);

    const successMessage = () => (
        <div className="alert alert-success mt-3"
        style={{display: createdProduct? "": "None"}}>
            <h4>{createdProduct} created Successfully!</h4>
        </div>
    );

    const warningMessage = () => (
            <div className="alert alert-danger mt-3" style={{ display: error ? "" : "none" }}>
                <h4>Error in creating {createdProduct} Product!</h4>
            </div>        
    );

    const onSubmit = (event) => {
        event.preventDefault();
        setvalues({...values, error: "", loading: true});
        createProduct(user._id, token, formData)
        .then(data => {
            if(data.error){
                setvalues({...values, error: data.error})
            }else{
                setvalues({...values, 
                    name: "",
                    description:"",
                    price:"",
                    photo: "",
                    stock:"",
                    loading: false,
                createdProduct: data.name})
            }
        })
        .catch(err => {console.log(err)})
    }

    const handleChange = name => event => {
        const value = name === "photo"? event.target.files[0] : event.target.value
        formData.set(name, value);
        setvalues({...values, [name]: value})
    }

    const createProductForm = () => (
        <form >
          <span>Post photo</span>
          <div className="form-group">
            <label className="btn btn-block btn-success">
              <input
                onChange={handleChange("photo")}
                type="file"
                name="photo"
                accept="image"
                placeholder="choose a file"
              />
            </label>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("name")}
              name="name"
              className="form-control"
              placeholder="Name"
              value={name}
            />
          </div>
          <div className="form-group">
            <textarea
              onChange={handleChange("description")}
              name="description"
              className="form-control"
              placeholder="Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("price")}
              type="number"
              className="form-control"
              placeholder="Price"
              value={price}
            />
          </div>
          <div className="form-group">
            <select
              onChange={handleChange("category")}
              className="form-control"
              placeholder="Category"
            >
              <option>Select</option>
              {categories && 
              categories.map((cate, index) => (
                <option key={index} value={cate._id}>{cate.name}</option>
              ))
              }
            </select>
          </div>
          <div className="form-group">
            <input
              onChange={handleChange("stock")}
              type="number"
              className="form-control"
              placeholder="Stock"
              value={stock}
            />
          </div>
          
          <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
            Create Product
          </button>
        </form>
      );

    return (
        <Base title="Add a Product here!"
            description="Welcome to product creation section"
            className="container bg-info p-4">
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3"> Admin Home</Link>            
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {createProductForm()}
                </div>
            </div>
        </Base>
        )
}

export default AddProduct;