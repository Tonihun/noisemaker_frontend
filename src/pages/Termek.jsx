import '../css/App.css'
import Header from "../components/Header";
import Footer from '../components/Footer';
import { getProducts } from '../api';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Gomb from '../components/Gomb';
import { API_URL } from "../api";
function Termek() {
    const [productsData, setProductsData] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const data = await getProducts();
            setProductsData(data);
        })();
    }, []);

    const product = productsData.find(p => p.Product_Id == id);

    const addToKosar = async () => {
        if (!product) return;

        const res = await fetch(`${API_URL}/cart/addCart`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Product_Id: product.Product_Id, Quantity: 1 })
        });

        const data = await res.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        navigate('/kosar');
    };

    return (
        <>
            <Header />
            <div className='termek-ablak'>
                <div className='termek-kep'>
                    <img src={product?.ProductIMG} alt={product?.Product_Name} />
                </div>
                <div className='termek-leiras'>
                    <h2>{product?.Product_Name}</h2>
                    <p>{product?.ProductDescription}</p>
                    <p>
                        Ár: {
                            Number(String(product?.ProductPrice).replace(/\s/g, '')).toLocaleString()
                        } Ft
                    </p>
                    <Gomb
                        onClick={addToKosar}
                        className='px-3 py-1 text-decoration-none rounded text-dark fs-4 w-100'
                        text="Kosárba"
                    />
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Termek;