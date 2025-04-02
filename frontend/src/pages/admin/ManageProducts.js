import { useState, useEffect } from "react";
import axios from "../../utils/axiosInstance";
import "../../styles/manage-products.css";

const categories = ["Food", "Accessories", "Aquatic", "Toys"];
const targets = ["dogs", "cats", "birds", "rodents", "fish"];

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");
  const [brand, setBrand] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    axios.get("/admin/products")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  const handleDeleteProduct = (id) => {
    axios.delete(`/admin/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  const handleEditProduct = (product) => {
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStock(product.stock);
    setImageUrl(product.image_url);
    setCategory(product.category);
    setTarget(product.target);
    setBrand(product.brand);
    setIsEditing(true);
    setProductId(product.id);
  };

  const handleSaveProduct = () => {
    const updatedProduct = { name, description, price, stock, image_url, category, target, brand };

    if (isEditing) {
      axios.put(`/admin/products/${productId}`, updatedProduct)
        .then(() => {
          setProducts(
            products.map((product) =>
              product.id === productId ? { ...product, ...updatedProduct } : product
            )
          );
          resetForm();
        })
        .catch((error) => {
          console.error("Error updating product:", error);
        });
    } else {
      axios.post("/admin/products", updatedProduct)
        .then((response) => {
          setProducts([...products, response.data]);
          resetForm();
        })
        .catch((error) => {
          console.error("Error creating product:", error);
        });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setCategory(categories[0]);
    setTarget(targets[0]);
    setBrand("");
    setIsEditing(false);
    setProductId(null);
  };

  return (
    <div className="manage-products">
      <h1>Управління продуктами</h1>

      <div className="product-form">
        <h2>{isEditing ? "Редагувати продукт" : "Додати новий продукт"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveProduct();
          }}
        >
          <input
            type="text"
            placeholder="Назва продукту"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Опис"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Ціна"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Кількість"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="URL зображення"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          
          <div className="styled-select">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="styled-select">
            <select value={target} onChange={(e) => setTarget(e.target.value)}>
              {targets.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Бренд"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
          <button type="submit">{isEditing ? "Оновити" : "Додати"}</button>
        </form>
      </div>

      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Опис</th>
              <th>Ціна</th>
              <th>Кількість</th>
              <th>Зображення</th>
              <th>Категорія</th>
              <th>Призначення</th>
              <th>Бренд</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price} ₴</td>
                <td>{product.stock}</td>
                <td><img src={`/images/${product.image_url}`} alt={product.name} width="50" /></td>
                <td>{product.category}</td>
                <td>{product.target}</td>
                <td>{product.brand}</td>
                <td>
                  <button onClick={() => handleEditProduct(product)}>Редагувати</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Видалити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts;
