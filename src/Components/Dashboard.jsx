import React, {useState} from "react";
// Assuming these components are in the same directory as Dashboard.jsx, the paths are correct.
import Navbar from "./Navbar.jsx";
import Connections from "./Connections.jsx";
import Card from "./Card.jsx";

// Declaring 'items' as an array of objects with some sample data
const intialItems = [
  { id: 1, name: "Shoes", imageUrl: "/clothing/shoe.jpg" },
  { id: 2, name: "Pants", imageUrl: "/clothing/pants.jpg" },
  { id: 3, name: "Shirt", imageUrl: "/clothing/shirts.jpg" },
  { id: 4, name: "White Shirt", imageUrl: "/clothing/single_shirt.jpg" },
];

// The Dashboard component now accepts a prop called 'onSignOut'
function Dashboard({ user, onSignOut }) {
  const [items, setItems] = useState(intialItems);

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  return (
    <section className="m-5">
      <Navbar user={user} onSignOut={onSignOut} />
      <Connections />

      <section className="clothing-rack mx-40">
        <h1 className="text-4xl font-bold m-2 mb-10 mt-15">Clothing Rack</h1>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {items.map((item) => (
            <Card key={item.id} item={item} onRemove={handleRemoveItem}/>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
