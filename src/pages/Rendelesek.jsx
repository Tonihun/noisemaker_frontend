import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Gomb from '../components/Gomb'
import Header from '../components/Header'
import InputMezo from '../components/InputMezo'
import '../css/App.css'
import { API_URL } from "../api";
function Rendelesek() {
    const navigate = useNavigate()

    const [kosarItems, setKosarItems] = useState([])
    const [phoneNumber, setPhoneNumber] = useState('')
    const [postal_code, setPostalCode] = useState('')
    const [city, setCity] = useState('')
    const [streethousenumber, setStreetHouseNumber] = useState('')
    const [uzenet, setUzenet] = useState('')

    // Kosár lekérése a backendről (ugyanúgy mint Kosar.jsx-ben)
    useEffect(() => {
        async function fetchKosar() {
            try {
                const res = await fetch(`${API_URL}/cart/CartItems`, {
                    credentials: 'include'
                })
                if (res.status === 400) return
                const data = await res.json()
                if (data.error) return
                setKosarItems(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('Kosár betöltési hiba:', err)
            }
        }
        fetchKosar()
    }, [])


    //automatikus város lekérés postal code alapján
    useEffect(() => {
    if (!postal_code) return

    async function fetchCity() {
        try {
            const res = await fetch(`${API_URL}/postalCodes/${postal_code}`)
            const data = await res.json()

            if (data.error) {
                setCity('')
                return
            }

            setCity(data.city)
        } catch (err) {
            console.log(err)
            setCity('')
        }
    }

    fetchCity()
}, [postal_code])

    async function onOrder() {
        setUzenet('')

        // Validáció
        if (!phoneNumber || !postal_code || !city || !streethousenumber) {
            return alert('Minden mezőt tölts ki!')
        }

        if (kosarItems.length === 0) {
            return alert('A kosár üres!')
        }

        try {
            // 1. Rendelés leadása a backendnek
            const orderRes = await fetch(`${API_URL}/orders/addOrder`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    PhoneNumber: phoneNumber,
                    Postal_Code: postal_code,
                    City: city,
                    StreetHousenumber: streethousenumber,
                    items: kosarItems
                })
            })

            const orderData = await orderRes.json()

            if (!orderRes.ok) {
                return alert(orderData.error || 'Hiba történt a rendelés leadásakor.')
            }

            // 2. Kosár törlése a backendből
            const Cart_Id = kosarItems[0]?.Cart_Id
            if (Cart_Id) {
                await fetch(`/cart/deleteCart/${Cart_Id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                })
            }

            // 3. Kosár nullázása frontenden
            setKosarItems([])

            // 4. Sikeres üzenet + átirányítás
            setUzenet('Sikeres rendelésleadás!')
            setTimeout(() => navigate('/fooldal'), 2000)

        } catch (err) {
            console.log(err);
            return alert('Nem sikerült kapcsolódni a backendhez.')
        }
    }

    return (
        <>
            <Header />
            <div className="container-reg" style={{ maxWidth: 620, marginTop: 60 }}>

                {uzenet && (
                    <div className="alert alert-success text-center my-2">
                        {uzenet}
                    </div>
                )}

                <InputMezo
                    label="Telefonszám"
                    type="text"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    placeholder="(06 52) 471 798"
                />
                <InputMezo
                    label="Irányítószám"
                    type="text"
                    value={postal_code}
                    setValue={setPostalCode}
                    placeholder="4030"
                />
                <InputMezo
                    label="Város"
                    type="text"
                    value={city}
                    setValue={setCity}
                    placeholder="Debrecen"
                />
                <InputMezo
                    label="Cím"
                    type="text"
                    value={streethousenumber}
                    setValue={setStreetHouseNumber}
                    placeholder="Budai Ézsaiás utca 8/A"
                />

                <h2 className="mt-4">Rendelésed tételei:</h2>
                {kosarItems.length === 0 ? (
                    <p>A kosarad üres.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Termék</th>
                                    <th>Mennyiség</th>
                                    <th>Ár</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kosarItems.map((item) => (
                                    <tr key={item.Product_Id}>
                                        <td>{item.Product_Name}</td>
                                        <td>{item.Quantity}</td>
                                        <td>{item.ProductPrice * item.Quantity} Ft</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="text-center mt-3">
                    <Gomb
                        szin='btn btn-dark px-4'
                        onClick={onOrder}
                        text='Rendelés leadása'
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Rendelesek