import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_URL } from "../api";
export default function Kosar() {
    const [kosarItems, setKosarItems] = useState([]);
    const [loading, setLoading] = useState(true);

    function formatPrice(price) {
        return Number(String(price).replace(/\s/g, ""));
    }

    useEffect(() => {
        fetchKosar();
    }, []);



    async function fetchKosar() {
        try {
            const res = await fetch(`${API_URL}/cart/CartItems`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                setKosarItems([]);
                return;
            }

            const data = await res.json();

            if (data.error) {
                setKosarItems([]);
                return;
            }

            setKosarItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setKosarItems([]);
        } finally {
            setLoading(false);
        }
    }


    async function removeItem(Cart_Item_Id) {
        const res = await fetch(`${API_URL}/cart/deleteCartItem/${Cart_Item_Id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (res.ok) {
            setKosarItems(prev =>
                prev.filter(item => item.Cart_Item_Id !== Cart_Item_Id)
            );
        }
    }

    async function modifyQuantity(Cart_Item_Id, newQuantity) {
        if (newQuantity <= 0) {
            await removeItem(Cart_Item_Id);
            return;
        }

        const res = await fetch(`${API_URL}/cart/modifyCartItem/${Cart_Item_Id}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Quantity: newQuantity })
        });

        if (res.ok) {
            setKosarItems(prev =>
                prev.map(item =>
                    item.Cart_Item_Id === Cart_Item_Id
                        ? { ...item, Quantity: newQuantity }
                        : item
                )
            );
        }
    }

    const osszesAr = kosarItems.reduce((sum, item) => {
        const price = formatPrice(item.ProductPrice);
        return sum + price * Number(item.Quantity);
    }, 0);

    return (
        <>
            <Header></Header>
            <div className="kosar_egesz">
                <div className="jobb-kosar">
                    <h2>Kosár</h2>
                    {loading ? (
                        <p>Betöltés...</p>
                    ) : kosarItems.length === 0 ? (
                        <p>A kosár üres.</p>
                    ) : (kosarItems.map(item => {
                        const price = formatPrice(item.ProductPrice);
                        const itemTotal = price * Number(item.Quantity);
                        const imgSrc = item.ProductIMG?.startsWith("http")
                            ? item.ProductIMG
                            : `${API_URL}${item.ProductIMG}`;
                            
                        return (
                            <div key={item.Cart_Item_Id} className="kosar-item">
                                <img
                                    src={imgSrc}
                                    alt={item.Product_Name}
                                    className="kosar-item-kep"
                                />

                                <div className="kosar-item-info">
                                    <p>{item.Product_Name}</p>
                                    <p>Darabár: {price.toLocaleString()} Ft</p>
                                    <p>Összesen: {itemTotal.toLocaleString()} Ft</p>

                                    <div className="kosar-quantity">
                                        <button onClick={() => modifyQuantity(item.Cart_Item_Id, Number(item.Quantity) - 1)}>
                                            −
                                        </button>

                                        <span>{item.Quantity}</span>

                                        <button onClick={() => modifyQuantity(item.Cart_Item_Id, Number(item.Quantity) + 1)}>
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeItem(item.Cart_Item_Id)}
                                    className="kosar-remove-gomb"
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })
                    )}
                </div>

                <div className="bal-kosar">
                    <h3>Összesen:</h3>
                    <p>{osszesAr.toLocaleString()} Ft</p>

                    <a href="/rendelesek">
                        <button className="fizetes-gomb">
                            Rendelés folytatása
                        </button>
                    </a>
                </div>
            </div>

            <Footer />
        </>
    );
}