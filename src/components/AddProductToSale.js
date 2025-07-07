import React, { useState, useEffect } from "react";
import axios from "axios";

function AddProductToSale({ sale, setShowAddProductModal }) {
    const [products, setProducts] = useState([]); // Lista de productos disponibles
    const [selectedProductId, setSelectedProductId] = useState(""); // ID del producto seleccionado
    const [quantity, setQuantity] = useState(1); // Cantidad seleccionada

    // Obtener la lista de productos disponibles al montar el componente
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/products") // Endpoint para obtener productos
            .then((response) => {
                setProducts(response.data); // Guardar productos en el estado
                console.log("Productos cargados:", response.data); // Log para depuración
            })
            .catch((error) => {
                console.error("Error al cargar los productos:", error);
                alert("Error al cargar los productos. Intente nuevamente.");
            });
    }, []);

    // Manejar cambios en la selección de producto
    const handleProductChange = (e) => {
        setSelectedProductId(e.target.value); // Guardar ID del producto seleccionado
    };

    // Manejar cambios en la cantidad
    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1); // Asegurar mínimo de 1
        setQuantity(value);
    };

    // Agregar producto a la venta
    const addProductToSale = () => {
        if (!selectedProductId) {
            alert("Por favor, selecciona un producto.");
            return;
        }

        // Encontrar el producto seleccionado
        const selectedProduct = products.find((p) => p.id === parseInt(selectedProductId));

        // Validar si el producto fue encontrado
        if (!selectedProduct) {
            alert("Producto seleccionado no encontrado.");
            return;
        }

        const detailSale = {
            sale: { id: sale.id }, // Enviar objeto Sale con su ID
            product: { id: selectedProduct.id }, // Enviar objeto Product con su ID
            quantity: quantity, // Cantidad seleccionada
            price: selectedProduct.price * quantity, // Precio total (precio por cantidad)
        };

        console.log("Datos a enviar al backend:", detailSale);

        // Enviar los datos al backend
        axios
            .post("http://localhost:8080/api/detailSales", detailSale)
            .then(() => {
                alert("Producto agregado exitosamente.");
                setShowAddProductModal(false); // Cerrar modal
            })
            .catch((error) => {
                console.error("Error al agregar producto a la venta:", error);
                alert("Error al agregar el producto. Verifica los datos e inténtalo de nuevo.");
            });
    };

    return (
        <>
            {/* Fondo oscuro del modal */}
            <div
                className="modal-backdrop fade show"
                style={{zIndex: 1040, backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            />
            <div
                className="modal fade show"
                style={{ display: "block", zIndex: 1050 }}
                role="dialog"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        {/* Encabezado del modal */}
                        <div className="modal-header">
                            <h5 className="modal-title">Agregar Producto a la Venta</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                }} // Posicionar la X arriba a la derecha
                                onClick={() => setShowAddProductModal(false)} // Cerrar el modal
                            />
                        </div>
                        <div className="modal-body">
                            <h6>Detalles de la Venta</h6>
                            <p>
                                <strong>ID:</strong> {sale.id}
                            </p>
                            <p>
                                <strong>Cliente:</strong> {sale.client}
                            </p>
                            <p>
                                <strong>Fecha de Venta:</strong> {sale.saleDate}
                            </p>
                            <h6 className="mt-3">Selecciona un Producto</h6>
                            <select
                                id="product"
                                value={selectedProductId}
                                onChange={handleProductChange}
                                className="form-select"
                            >
                                <option value="">-- Selecciona un Producto --</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - ${product.price.toFixed(2)}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-3">
                                <label>Cantidad</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowAddProductModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={addProductToSale}
                            >
                                Agregar Producto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddProductToSale;
