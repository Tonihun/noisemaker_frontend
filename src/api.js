export const API_URL = "https://nodejs304.dszcbaross.edu.hu"

const BACKEND_URL_USER = "https://nodejs304.dszcbaross.edu.hu/users"
const BACKEND_URL_PRODUCTS = 'https://nodejs304.dszcbaross.edu.hu/products'
const BACKEND_URL_CATEGORIES = 'https://nodejs304.dszcbaross.edu.hu/categories'
const BACKEND_URL_ORDERS = 'https://nodejs304.dszcbaross.edu.hu/orders'

export async function regisztracio(username, email, psw){
    const res = await fetch(`${BACKEND_URL_USER}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, psw })
        
    })
console.log("REGISTER INPUT:", username, email)
    //console.log(res)

    const data = await res.json()

    if (!data.error) {
        return data
    }
    return data
}

export async function bejelentkezes(email, psw){
    const res = await fetch(`${BACKEND_URL_USER}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ psw, email })
    })

    //console.log(res)

    const data = await res.json()

    if (!data.error) {
        return data
    }
    return data
}

export async function whoAmI() {
    const res = await fetch(`${BACKEND_URL_USER}/whoami`, {
        method: 'GET',
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error }
    }
    //console.log(await res.json());
    return await res.json()
}

export async function logout() {
    const res = await fetch(`${BACKEND_URL_USER}/logout`, {
        method: 'GET',
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error }
    }

    return await res.json()
}

export async function getProducts() {
    const res = await fetch(`${BACKEND_URL_PRODUCTS}/getAllProducts`)

    const data = await res.json()

    if (!data.error) {
        return data
    }
    return data
}

export async function getCategoryAll() {
    const res = await fetch(`${BACKEND_URL_CATEGORIES}/getCategoryAll`)

    const data = await res.json()

    if (!data.error) {
        return data
    }
    return data
}

export async function getSubcategoryAll() {
    const res = await fetch(`${BACKEND_URL_CATEGORIES}/getSubcategoryAll`)

    const data = await res.json()

    if (!data.error) {
        return data
    }
    return data
}

// összes felhasználó lekérése
export async function getAllUsers() {
    const res = await fetch(`${BACKEND_URL_USER}/getAllUsers`, {
        method: 'GET',
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error}
    }

    return await res.json()
}

// egy felhasználó adatainak módosítása
export async function userEdit(User_Id, username, email, User_Role) {
    const res = await fetch(`${BACKEND_URL_USER}/userModifyInAdmin/${User_Id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, User_Role }),
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error }
    }

    return await res.json()
}

export async function deleteUser(User_Id) {
    const res = await fetch(`${BACKEND_URL_USER}/deleteUser/${User_Id}`,{
        method: 'DELETE',
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error }
    }

    return await res.json()
}

export async function rendelesek(User_Id) {
    const res = await fetch(`${BACKEND_URL_ORDERS}/myOrders/${User_Id}`,{
        method: 'GET',
        credentials: 'include'
    })

    if (!res.ok) {
        const data = await res.json()
        return { error: data?.error }
    }

    return await res.json()
}