import Header from "../components/Header";
import { useState, useEffect } from "react";
import '../css/App.css'
import Footer from "../components/Footer";
import Table from "../components/Table";
import { API_URL, userEdit, deleteUser } from "../api";

export default function Admin() {
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [categories, setCategory] = useState([])
    const [subcategories, setSubcategory] = useState([])

    const [Subcategory_Name, setSubcategoryName] = useState('')
    const [Subcategory_Category_Id, setSubcategoryCategoryId] = useState('')
    const [CategoryName, setCategoryName] = useState('')

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')

    const [Username, setUsername] = useState('')
    const [Email, setEmail] = useState('')
    const [User_Role, setRole] = useState('')
    const [ProductIMG, setProductIMG] = useState(null)
    const [Product_Name, setProductName] = useState('')
    const [ProductPrice, setProductPrice] = useState('')
    const [ProductDescription, setProductDescription] = useState('')
    const [Stock, setStock] = useState('')



    const [OrderStatus, setOrderStatus] = useState('')
    const [Category_Id, setCategoryId] = useState('')
    const [Subcategory_Id, setSubcategoryId] = useState('')


    useEffect(() => {
        fetch(`${API_URL}/users/getAllUsers`)
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/orders/allOrders`)
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
         fetch(`${API_URL}/products/getAllProducts`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err))
    }, [])
    useEffect(() => {
        fetch(`${API_URL}/categories/getCategoryAll`)
            .then(res => res.json())
            .then(data => setCategory(data))
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`${API_URL}/categories/getSubcategoryAll`)
            .then(res => res.json())
            .then(data => setSubcategory(data))
            .catch(err => console.error(err))
    }, [])

    async function onDelete(item) {
        if (item.Product_Id !== undefined) {
            if (!window.confirm(`Biztosan törölni akarod a "${item.Product_Name}" terméket?`)) return

            const res = await fetch(`${API_URL}/products/deleteProduct/${item.Product_Id}`, {
                method: 'DELETE',
                credentials: "include"
            })
            if (!res.ok) {
                const data = await res.json()
                return alert(data.error)
            }

            setProducts(prev => prev.filter(p => p.Product_Id !== item.Product_Id))
            return alert('Termék sikeresen törölve')
        }


        if (item.Order_Id !== undefined) {
            if (!window.confirm(`Biztosan törölni akarod a ${item.Order_Id} számú rendelést?`)) return

            const res = await fetch(`${API_URL}/orders/deleteOrder/${item.Order_Id}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                })


            if (!res.ok) {
                const data = await res.json()
                return alert(data.error)
            }

            setOrders(prev => prev.filter(o => o.Order_Id !== item.Order_Id))
            return alert('Rendelés sikeresen törölve')
        }

        if (item.User_Id !== undefined) {
            if (!window.confirm(`Biztosan törölni akarod a(z) "${item.Username}" felhasználót?`)) return

            const data = await deleteUser(item.User_Id)
            if (data.error) return alert(data.error)

            setUsers(prev => prev.filter(u => u.User_Id !== item.User_Id))
            return alert('Felhasználó sikeresen törölve')
        }

        if (item.Subcategory_Id !== undefined) {
            if (!window.confirm(`Biztosan törölni akarod a "${item.Subcategory_Name}" alkategóriát?`)) return

            const res = await fetch(`${API_URL}/categories/deleteSubcategory/${item.Subcategory_Id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (!res.ok) {
                const data = await res.json()
                return alert(data.error)
            }

            setSubcategory(prev =>
                prev.filter(s => s.Subcategory_Id !== item.Subcategory_Id)
            )

            return alert('Alkategória sikeresen törölve')
        }

        if (item.Category_Id !== undefined) {
            if (!window.confirm(`Biztosan törölni akarod a "${item.CategoryName}" kategóriát?`)) return

            const res = await fetch(`${API_URL}/categories/deleteCategory/${item.Category_Id}`, { method: 'DELETE', credentials: 'include' })


            if (!res.ok) {
                const data = await res.json()
                return alert(data.error)
            }

            setCategory(prev =>
                prev.filter(s => s.Category_Id !== item.Category_Id)
            )

            return alert('Kategória sikeresen törölve')
        }


    }




    function onModify(user) {
        setSelectedUser(user)
        setModalType('user')
        setUsername(user.Username)
        setEmail(user.Email)
        setRole(user.User_Role)
        setShowModal(true)
    }
    function onModifyCategory(category) {
        setSelectedUser(category)
        setModalType('category')
        setCategoryName(category.CategoryName)
        setShowModal(true)
    }
    function onModifySubCategory(subcategory) {
        setSelectedUser(subcategory)
        setModalType('subcategory')
        setSubcategoryName(subcategory.Subcategory_Name)
        setSubcategoryCategoryId(subcategory.Category_Id)
        setShowModal(true)
    }
    function onModifyOrder(order) {
        setSelectedUser(order)
        setModalType('order')
        setOrderStatus(order.Order_Status ?? '')
        setShowModal(true)
    }

    function onModifyProduct(product) {
        setSelectedUser(product)
        setModalType('product')
        setProductName(product.Product_Name)

        setProductPrice(String(product.ProductPrice).replace(/\s/g, ''))
        setProductDescription(product.ProductDescription)
        setStock(product.Stock)

        setSubcategoryId(product.Subcategory_Id)
        const sub = subcategories.find(s => s.Subcategory_Id === product.Subcategory_Id)
        setCategoryId(sub ? sub.Category_Id : '')
        setShowModal(true)
    }

    function openAddProductModal() {
        setSelectedUser({})
        setModalType('addProduct')
        setProductName('')
        setProductPrice('')
        setProductDescription('')
        setStock('')
        setCategoryId('')
        setSubcategoryId('')
        setProductIMG(null)
        setShowModal(true)
    }

    function openAddCategoryModal() {
        setSelectedUser({})
        setModalType('addCategory')
        setCategoryName('')
        setShowModal(true)
    }

    function openAddSubcategoryModal() {
        setSelectedUser({})
        setModalType('addSubcategory')
        setSubcategoryName('')
        setSubcategoryCategoryId('')
        setShowModal(true)
    }




    async function handleSave() {
        if (modalType === 'user') await editUser(selectedUser.User_Id)
        if (modalType === 'order') await editOrder(selectedUser.Order_Id)
        if (modalType === 'product') await editProduct(selectedUser.Product_Id)

        if (modalType === 'category') await editCategory(selectedUser.Category_Id)
        if (modalType === 'subcategory') await editSubCategory(selectedUser.Subcategory_Id)

        if (modalType === 'addProduct') await addProduct()
        if (modalType === 'addCategory') await addCategory()
        if (modalType === 'addSubcategory') await addSubcategory()
    }


    async function addCategory() {
        if (!CategoryName) {
            return alert('Add meg a kategória nevét!')
        }
        const res = await fetch(`${API_URL}/categories/addCategory`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CategoryName })
        })

        const data = await res.json()
        if (data.error) return alert(data.error)

        setCategory(prev => [...prev, { Category_Id: data.insertId, CategoryName }])

        setShowModal(false)
        alert('Kategória sikeresen hozzáadva')
    }

    async function addSubcategory() {
        if (!Subcategory_Name || !Subcategory_Category_Id) {
            return alert('Tölts ki minden mezőt!')
        }
        const res = await fetch(`${API_URL}/categories/addSubcategory`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                Subcategory_Name, Category_Id: Subcategory_Category_Id
            })
        })

        const data = await res.json()
        if (data.error) return alert(data.error)

        setSubcategory(prev => [
            ...prev, { Subcategory_Id: data.insertId, Subcategory_Name, Category_Id: Subcategory_Category_Id }])
        setShowModal(false)
        alert('Alkategória sikeresen hozzáadva')
    }


    async function editUser(User_Id) {
        const data = await userEdit(User_Id, Username, Email, User_Role)
        if (data.error) {
            return alert(data.error)
        }

        return alert('Sikeres módosítás')
    }

    async function editOrder(Order_Id) {
        const res = await fetch(`${API_URL}/orders/orderStatusModify/${Order_Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                credentials: 'include'
            },
            body: JSON.stringify({ Order_Status: OrderStatus })
        })
        const data = await res.json()
        if (data.error) return alert(data.error)

        setOrders(prev => prev.map(o => o.Order_Id === Order_Id ? { ...o, Order_Status: OrderStatus } : o))
        setShowModal(false)
        alert('Rendelés sikeresen módosítva')
    }

    async function editProduct(Product_Id) {
        const formData = new FormData()

        formData.append("Product_Name", Product_Name)
        formData.append("ProductDescription", ProductDescription)
        formData.append("ProductPrice", ProductPrice)
        formData.append("Stock", Stock)
        formData.append("Subcategory_Id", Subcategory_Id)

        if (ProductIMG) {
            formData.append("ProductIMG", ProductIMG)
        }

        const res = await fetch(`${API_URL}/products/modifyProduct/${Product_Id}`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })

        const data = await res.json()

        if (data.error) return alert(data.error)



        setProducts(prev =>
            prev.map(p =>
                p.Product_Id === Product_Id
                    ? {
                        ...p,
                        Product_Name,
                        ProductDescription,
                        ProductPrice,
                        Stock,
                        Subcategory_Id
                    }
                    : p
            )
        )

        setShowModal(false)
        alert("Termék sikeresen módosítva")
    }

    async function addProduct() {
        if (!Product_Name || !ProductPrice || !ProductDescription || !Stock || !Subcategory_Id) {
            return alert('Minden mezőt ki kell tölteni!')
        }

        if (!ProductIMG) {
            return alert('Kép feltöltése kötelező!')
        }

        const formData = new FormData()

        formData.append('Product_Name', Product_Name)
        formData.append('ProductDescription', ProductDescription)
        formData.append('ProductPrice', ProductPrice)
        formData.append('Stock', Stock)
        formData.append('Subcategory_Id', Subcategory_Id)
        formData.append('ProductIMG', ProductIMG)

        const res = await fetch(`${API_URL}/products/addProduct`, {
            method: 'POST',
            credentials: 'include',
            body: formData
        })

        const data = await res.json()
        if (data.error) return alert(data.error)

        setProducts(prev => [
            ...prev,
            {
                Product_Id: data.insertId,
                Product_Name,
                ProductDescription,
                ProductPrice,
                Stock,
                Subcategory_Id,
                ProductIMG: data.ProductIMG || `/uploads/products/${data.filename || ''}`
            }
        ])

        setShowModal(false)
        alert('Termék sikeresen hozzáadva')
    }
    async function editCategory(Category_Id) {
        const res = await fetch(`${API_URL}/categories/modifyCategoryName/${Category_Id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ CategoryName })
        })

        const data = await res.json()
        if (data.error) return alert(data.error)

        setCategory(prev => prev.map(c => c.Category_Id === Category_Id ? { ...c, CategoryName } : c))
        setShowModal(false)
        alert('Kategórianév sikeresen módosítva')
    }


    async function editSubCategory(Subcategory_Id) {
        const res = await fetch(`${API_URL}/categories/modifySubcategory/${Subcategory_Id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Subcategory_Name,
                Category_Id: Subcategory_Category_Id
            })
        })

        const data = await res.json()

        if (data.error) return alert(data.error)

        setSubcategory(prev =>
            prev.map(s =>
                s.Subcategory_Id === Subcategory_Id
                    ? { ...s, Subcategory_Name, Category_Id: Subcategory_Category_Id }
                    : s
            )
        )

        setShowModal(false)
        alert('Alkategória sikeresen módosítva')
    }



    function renderModalFields() {
        if (modalType === 'user') return (
            <>
                <label className="form-label fw-bold mt-2">Felhasználónév</label>
                <input className="form-control" value={Username} onChange={e => setUsername(e.target.value)} />

                <label className="form-label fw-bold mt-2">Email</label>
                <input className="form-control" type="email" value={Email} onChange={e => setEmail(e.target.value)} />

                <label className="form-label fw-bold mt-2">Szerepkör</label>
                <select className="form-select" value={User_Role} onChange={e => setRole(e.target.value)}>
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                </select>
            </>
        )

        if (modalType === 'order') return (
            <>
                <label className="form-label fw-bold mt-2">Rendelés státusza</label>
                <select className="form-select" value={OrderStatus} onChange={e => setOrderStatus(e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </>
        )

        if (modalType === 'product' || modalType === 'addProduct') {
            const filteredSubcategories = subcategories.filter(
                sub => Number(sub.Category_Id) === Number(Category_Id)
            )

            return (
                <>
                    <label className="form-label fw-bold mt-2">Termék neve</label>
                    <input
                        className="form-control"
                        value={Product_Name}
                        onChange={e => setProductName(e.target.value)}
                    />

                    <label className="form-label fw-bold mt-2">Leírás</label>
                    <textarea
                        className="form-control"
                        value={ProductDescription}
                        onChange={e => setProductDescription(e.target.value)}
                        rows={3}
                    />

                    <label className="form-label fw-bold mt-2">Ár</label>
                    <input
                        className="form-control"
                        type="number"
                        value={ProductPrice}
                        onChange={e => setProductPrice(e.target.value)}
                    />

                    <label className="form-label fw-bold mt-2">Készlet</label>
                    <input
                        className="form-control"
                        type="number"
                        value={Stock}
                        onChange={e => setStock(e.target.value)}
                    />

                    <label className="form-label fw-bold mt-2">Kategória</label>
                    <select
                        className="form-select"
                        value={Category_Id}
                        onChange={e => {
                            setCategoryId(e.target.value)
                            setSubcategoryId('')
                        }}
                    >
                        <option value="">Válassz kategóriát</option>
                        {categories.map(cat => (
                            <option key={cat.Category_Id} value={cat.Category_Id}>
                                {cat.CategoryName}
                            </option>
                        ))}
                    </select>

                    <label className="form-label fw-bold mt-2">Alkategória</label>
                    <select
                        className="form-select"
                        value={Subcategory_Id}
                        onChange={e => setSubcategoryId(e.target.value)}
                    >
                        <option value="">Válassz alkategóriát</option>
                        {filteredSubcategories.map(sub => (
                            <option key={sub.Subcategory_Id} value={sub.Subcategory_Id}>
                                {sub.Subcategory_Name}
                            </option>
                        ))}
                    </select>

                    <label className="form-label fw-bold mt-2">Termék kép</label>
                    <input
                        className="form-control"
                        type="file"
                        accept="image/*"
                        onChange={e => setProductIMG(e.target.files[0])}
                    />
                </>
            )
        }
        if (modalType === 'category' || modalType === 'addCategory') return (
            <>
                <label className="form-label fw-bold mt-2">Kategória neve</label>
                <input
                    className="form-control"
                    value={CategoryName}
                    onChange={e => setCategoryName(e.target.value)}
                />
            </>
        )


        if (modalType === 'subcategory' || modalType === 'addSubcategory') return (
            <>
                <label className="form-label fw-bold mt-2">Alkategória neve</label>
                <input
                    className="form-control"
                    value={Subcategory_Name}
                    onChange={e => setSubcategoryName(e.target.value)}
                />

                <label className="form-label fw-bold mt-2">Kategória</label>
                <select
                    className="form-select"
                    value={Subcategory_Category_Id}
                    onChange={e => setSubcategoryCategoryId(e.target.value)}
                >
                    <option value="">Válassz kategóriát</option>
                    {categories.map(cat => (
                        <option key={cat.Category_Id} value={cat.Category_Id}>
                            {cat.CategoryName}
                        </option>
                    ))}
                </select>
            </>
        )
    }


    return (
        <>
            <Header />

            <div className="d-flex justify-content-end px-3 my-2">
                <button className="btn btn-success" onClick={openAddProductModal}>+ Új termék</button>
            </div>

            <div className="d-flex justify-content-end px-3 my-2">
                <button className="btn btn-success" onClick={openAddCategoryModal}>+ Új kategória</button>
            </div>

            <div className="d-flex justify-content-end px-3 my-2">
                <button className="btn btn-success" onClick={openAddSubcategoryModal}>+ Új alkategória</button>
            </div>



            <Table
                users={users}
                orders={orders}
                products={products}
                categories={categories}
                subcategories={subcategories}
                onDelete={onDelete}
                onModify={onModify}
                onModifyOrder={onModifyOrder}
                onModifyProduct={onModifyProduct}
                onModifyCategory={onModifyCategory}
                onModifySubCategory={onModifySubCategory}
            />

            {showModal && selectedUser && (
                <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">
                            <h5 className="mb-3">
                                {modalType === 'user' && 'Felhasználó szerkesztése'}
                                {modalType === 'order' && 'Rendelés szerkesztése'}
                                {modalType === 'product' && 'Termék szerkesztése'}
                                {modalType === 'category' && 'Kategória szerkesztése'}
                                {modalType === 'subcategory' && 'Alkategória szerkesztése'}
                                {modalType === 'addProduct' && 'Új termék hozzáadása'}
                                {modalType === 'addCategory' && 'Új kategória hozzáadása'}
                                {modalType === 'addSubcategory' && 'Új alkategória hozzáadása'}
                            </h5>

                            {renderModalFields()}

                            <div className="d-flex justify-content-between mt-3">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Bezárás</button>
                                <button className="btn btn-primary" onClick={handleSave}>
                                    {modalType === 'addProduct' ? 'Hozzáadás' : 'Mentés'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            {error && <div className="alert alert-danger text-center my-2">{error}</div>}
            {message && <div className="alert alert-success text-center my-2">{message}</div>}
        </>
    )
}