"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Edit from "./Edit";
import { RefreshCw } from "lucide-react";

export default function Menu() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false); // Track if adding a new product

  const BASE_IMAGE_URL = "http://127.0.0.1:8000/assets/images/";

  const fetchProducts = async () => {
    setIsLoading(true); // Set loading to true before fetching
    try {
      let allProducts: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products?page=${currentPage}`
        );
        allProducts = [...allProducts, ...response.data.data];
        totalPages = response.data.last_page; // Assuming the API provides `last_page` in `meta`
        currentPage++;
      } while (currentPage <= totalPages);

      // Sort products by ID in descending order
      allProducts.sort((a, b) => b.id - a.id);

      setProducts(allProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching
    }
  };

  const deleteProduct = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://127.0.0.1:8000/api/products/${id}`
          );

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: response.data.message,
            confirmButtonColor: "#5569B2",
          });

          fetchProducts(); // Refresh product list after deletion
        } catch (error: any) {
          if (error.response && error.response.status === 422) {
            const backendMessage = error.response.data.message;

            Swal.fire({
              icon: "error",
              title: "Validation Error",
              text: backendMessage,
              confirmButtonColor: "#5569B2",
            });
          } else if (error.response && error.response.status === 404) {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: error.response.data.message,
              confirmButtonColor: "#5569B2",
            });
          } else {
            console.error("Failed to delete product:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "An unexpected error occurred while deleting the product.",
              confirmButtonColor: "#5569B2",
            });
          }
        }
      }
    });
  };

  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    setIsAddingProduct(false); // Not adding a new product
    setIsModalOpen(true);
  };

  const handleAddProduct = () => {
    setSelectedProduct(null); // Clear selected product
    setIsAddingProduct(true); // Adding a new product
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen max-w-screen flex flex-col items-center px-6 py-[70px]">
      <div className="w-full max-w-7xl flex flex-col justify-center items-center py-4 px-4">
        <h1 className="text-[#5569B2] text-3xl font-bold mb-10">
          Product List
        </h1>
        <div className="flex justify-start items-center w-full gap-3 mb-5">
          {/* Refresh Button */}
          <button
            onClick={fetchProducts}
            className="bg-[#5569B2] text-white px-2.5 py-2.5 rounded-lg hover:bg-[#333d5e] transition duration-300 flex items-center justify-center"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          {/* Add Product Button */}
          <button
            onClick={handleAddProduct}
            className="bg-[#5569B2] text-white px-4 py-2 rounded-lg hover:bg-[#333d5e] transition duration-300"
          >
            Add Product
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[300px]">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 w-full">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="relative border-1 border-gray-200 bg-gradient-to-tr from-[#eef2ff] to-[#dbe4ff] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col items-center"
              style={{
                animation: `slideIn 1s ease-out ${index * 0.3}s forwards`,
                opacity: 0,
                transform: "translateY(-5%)",
              }}
            >
              {/* <span className="absolute top-3 left-3 bg-[#5569B2] text-white text-xs px-2 py-1 rounded-full shadow-sm">
              ID: {product.id}
            </span> */}

              <img
                src={`${BASE_IMAGE_URL}${product.image}`}
                alt={product.name}
                className="w-full h-[200px] rounded-xl object-cover  -mx-6"
              />

              <h3 className="text-lg font-bold text-[#5569B2] text-center mt-5 mb-1">
                {product.name}
              </h3>

              <p className="text-gray-700 text-center text-sm mb-1 line-clamp-2 truncate-m min-h-[42px] max-h-[42px] px-6">
                {product.description}
              </p>

              <p className="text-gray-800 font-semibold text-center mt-2">
                Rp.{product.price}
              </p>

              <div className="flex justify-between mt-5 w-full">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-[#5569B2] text-white w-1/2 py-1 rounded-bl-lg hover:bg-[#3d4a74] hover:shadow-md border-r-1 border-gray-100 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-500 text-white w-1/2 py-1 rounded-br-lg hover:bg-red-700 hover:shadow-md border-l-1 b border-gray-100 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Edit
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchProducts} // Pass fetchProducts to refresh the list
        product={isAddingProduct ? null : selectedProduct} // Pass null if adding a new product
      />

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #5569b2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
