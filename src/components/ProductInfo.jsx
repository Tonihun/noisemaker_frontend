import { API_URL } from "../api";

export default function ProductInfo({ product_id, product_name, description, product_price, stock, product_img, onModify, onDelete }) {
    const productObject = {
        Product_Id: product_id,
        Product_Name: product_name,
        ProductDescription: description,
        ProductPrice: product_price,
        Stock: stock
    }

    const imgSrc = product_img?.startsWith("http")
        ? product_img
        : `${API_URL}${product_img}`

    return (
        <tr>
            <td>
                <img src={imgSrc} alt={product_name} style={{ width: "60px", height: "60px", objectFit: "cover" }}></img></td>
            <td>{product_id}</td>

            <td>{product_name}</td>
            <td>{description}</td>
            <td>{product_price} Ft</td>
            <td>{stock}</td>
            <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => onModify(productObject)}>Szerkesztés</button>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(productObject)}>Törlés</button>
            </td>
        </tr>

    )
}