// src/Components/Dashboard.jsx
import React, { useState } from "react";
import Navbar from "./Navbar.jsx";
import Connections from "./Connections.jsx";
import Card from "./Card.jsx";

// Declaring 'items' as an array of objects with some sample data
const intialItems = [
  {
    id: 1,
    name: "Shoes",
    imageUrl: "/clothing/shoe.jpg",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 2,
    name: "Pants",
    imageUrl: "/clothing/pants.jpg",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 3,
    name: "Shirt",
    imageUrl: "/clothing/shirts.jpg",
    tags: ["casual", "outdoor", "hiking"],
  },
  {
    id: 4,
    name: "White Shirt",
    imageUrl: "/clothing/single_shirt.jpg",
    tags: ["casual", "outdoor", "hiking"],
  },
];

function Dashboard({ user, onSignOut, googleAccessToken }) {
  const [items, setItems] = useState(intialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleAddItem = (newItem) => {
    // Add a unique ID and the new item to the list
    const newId =
      items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id: newId }]);
    setIsModalOpen(false); // Close the modal after adding
  };

  return (
    <section className="m-5">
      <Navbar user={user} onSignOut={onSignOut} />
      <Connections googleAccessToken={googleAccessToken} />
      <div className="mx-40 flex">
        <h1 className="text-4xl font-bold m-5">Clothing Rack</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary mt-6"
        >
          Add clothing
        </button>
      </div>
      <section className="clothing-rack mx-50 mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {items.map((item) => (
          <Card key={item.id} item={item} onRemove={handleRemoveItem} />
        ))}
      </section>

      {/* The Modal Dialog for adding an item */}
      <dialog
        id="add_item_modal"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Add New Clothing Item</h3>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const newItem = {
                name: form.name.value,
                imageUrl: form.imageUrl.value,
                // Correctly split the tags string and save as an array
                tags: form.tags.value.split(",").map((tag) => tag.trim()),
              };
              handleAddItem(newItem);
              form.reset();
            }}
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Clothing Title</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Image URL</span>
              </label>
              <input
                type="url"
                name="imageUrl"
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">
                  Tags (e.g., formal, winter, work)
                </span>
              </label>
              {/* Note: changed the name to 'tags' to be more descriptive */}
              <input
                type="text"
                name="tags"
                className="input input-bordered w-full"
                placeholder="Separate tags with commas"
                required
              />
            </div>
            <div className="modal-action mt-6">
              <button type="submit" className="btn btn-primary">
                Add Item
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
}
export default Dashboard;
