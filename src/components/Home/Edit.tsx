import { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import Swal from "sweetalert2";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#5569B2",
    color: "white",
    borderRadius: "15px",
    padding: "30px",
    width: "500px",
    maxWidth: "90%",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
};

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void; // Function to refresh product list
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  } | null; // Allow null for adding a new product
}

export default function Edit({
  isOpen,
  onClose,
  onRefresh,
  product,
}: EditProps) {
  const [name, setname] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const BASE_IMAGE_URL = "http://127.0.0.1:8000/assets/images/";

  useEffect(() => {
    Modal.setAppElement("#__next");
  }, []);

  useEffect(() => {
    if (product) {
      // Editing an existing product
      setname(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price ? product.price.toString() : "");
      setImage(null); // Reset image to null when opening a new product
      setImagePreview(
        product.image ? `${BASE_IMAGE_URL}${product.image}` : null
      );
    } else {
      // Adding a new product
      setname("");
      setDescription("");
      setPrice("");
      setImage(null);
      setImagePreview(null);
    }
  }, [product]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (image) {
        formData.append("image", image);
      }

      let response;
      if (product) {
        // Update existing product
        formData.append("_method", "PUT");
        response = await axios.post(
          `http://127.0.0.1:8000/api/products/${product.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );
      } else {
        // Create new product
        response = await axios.post(
          `http://127.0.0.1:8000/api/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message, // Display the backend success message
          confirmButtonColor: "#5569B2",
        });
        onClose(); // Close modal immediately
        onRefresh(); // Refresh product list asynchronously
      }
    } catch (err: any) {
      if (err.response && err.response.status === 422) {
        // Extract the main validation message from the backend response
        const backendMessage = err.response.data.message;

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: backendMessage, // Display the main validation message
          confirmButtonColor: "#5569B2",
        });
      } else {
        console.error("Axios Error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while saving the product.",
          confirmButtonColor: "#5569B2",
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      shouldCloseOnOverlayClick={true}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      preventScroll={true}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        {product ? "Edit Product" : "Add Product"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter product name"
            className="w-full px-4 py-2 border rounded-lg text-[#5569B2] bg-white placeholder-[#5569B2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            className="w-full px-4 py-2 border rounded-lg text-[#5569B2] bg-white placeholder-[#5569B2]"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Price
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            className="w-full px-4 py-2 border rounded-lg text-[#5569B2] bg-white placeholder-[#5569B2]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-white">
            Image
          </label>
          <div className="relative flex items-center">
            <label
              htmlFor="file-upload"
              className="w-auto px-4 py-2 border rounded-lg text-[#5569B2] bg-white"
            >
              {image ? "Change Image" : "Choose Image"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <p className="ml-4 text-sm text-white">
              {image ? image.name : "No file chosen"}
            </p>
          </div>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-4 w-full h-[200px] object-cover rounded-lg"
            />
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg duration-500 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-white text-[#5569B2] hover:bg-gray-200 px-4 py-2 rounded-lg font-bold duration-500 transition-all"
          >
            {product ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
