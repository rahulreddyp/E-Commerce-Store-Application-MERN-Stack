import React, {useState, useEffect} from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { updateCategory, getCategory}  from './helper/adminapicall';
import { isAuthenticated } from '../auth/helper';

const UpdateCategory = ({match}) => {
    const {user, token} = isAuthenticated();

    const [values, setvalues] = useState({
        name: "",
        loading: false,
        error: "",
        createdCategory: "",
        getaRedirect: false,
        formData: ""
    })

const {name, loading, error, createdCategory, getaRedirect, formData} = values;

const preLoad = (categoryId) => {
            getCategory(categoryId).then(data => {
            
            if(data.error){
                setvalues({...values, error: data.error});
            }
            else{
                setvalues({
                    ...values,
                    name: data.name,
                    formData: new FormData()                    
                });
            }
        })
    };


    useEffect(() => {
        preLoad(match.params.categoryId);
    }, []);

    const successMessage = () => (
        <div className="alert alert-success mt-3"
        style={{display: createdCategory? "": "None"}}>
            <h4>{createdCategory} updated Successfully!</h4>
        </div>
    );

    const warningMessage = () => (
            <div className="alert alert-danger mt-3" style={{ display: error ? "" : "none" }}>
                <h4>Error in updating {createdCategory} Category!</h4>
            </div>        
    );

    const onSubmit = (event) => {
        event.preventDefault();
        setvalues({...values, error: "", loading: true});
        updateCategory(match.params.categoryId, user._id, token, formData)
        .then(data => {
            if(data.error){
                setvalues({...values, error: data.error})
            }else{
                setvalues({...values, 
                    name: "",
                    loading: false,
                createdCategory: data.name})
            }
        })
        .catch(err => {console.log(err)})
        
    }

    const handleChange = name => event => {
        const value = name === "photo"? event.target.files[0] : event.target.value
        formData.set(name, value);
        setvalues({...values, [name]: value})
    }

    const createCategoryForm = () => (
        <form>
        <div className="form-group mt-3">
        <input
            onChange={handleChange("name")}
            name="name"
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
        />
        </div>
        <button type="submit" onClick={onSubmit} className="btn btn-outline-success mb-3">
        Update Category
        </button>
        </form>
    );

    return (
        <Base title="Add a Category here!"
            description="Welcome to Category creation section"
            className="container bg-info p-4">
            <Link to="/admin/dashboard" className="btn btn-md btn-dark mb-3"> Admin Home</Link>            
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {warningMessage()}
                    {createCategoryForm()}
                </div>
            </div>
        </Base>
        )
}

export default UpdateCategory;