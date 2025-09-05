import React, { useState, useCallback } from "react";
import Navbar from "./Navbar.jsx";
import Connections from "./Connections.jsx";
import Card from "./Card.jsx";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useAuth } from '../AuthContext.jsx';

// Function to find the best matching item based on tags
const findBestMatch = (items, eventTags) => {
  let bestMatch = null;
  let highestCount = 0;

  items.forEach(item => {
    if (!item.tags || item.tags.length === 0) return;

    const matchCount = item.tags.filter(tag => eventTags.includes(tag)).length;

    if (matchCount > highestCount) {
      highestCount = matchCount;
      bestMatch = item;
    }
  });

  return bestMatch;
};

// Declaring 'items' as an array of objects with some sample data
const initialItems = [
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

function Dashboard() {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, googleAccessToken, handleSignOut } = useAuth();
  const [syncMessage, setSyncMessage] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [suggestedOutfit, setSuggestedOutfit] = useState(null);

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleAddItem = (newItem) => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, { ...newItem, id: newId }]);
    setIsModalOpen(false);
  };
  
  // This function now sends a simplified payload to the Cloud Function
  const handleSyncLillyGo = async () => {
    if (!user || !suggestedOutfit) {
      setSyncMessage("No suggested outfit available to sync.");
      return;
    }

    setSyncMessage(`Syncing outfit "${suggestedOutfit.name}" to LillyGo...`);

    try {
      const functions = getFunctions();
      const syncLillyGoFunction = httpsCallable(functions, 'syncLillyGo');
      const response = await syncLillyGoFunction({ 
        outfitName: suggestedOutfit.name
      });

      setSyncMessage(response.data.message);
      console.log('Response from Cloud Function:', response.data);
    } catch (error) {
      console.error('Error calling Cloud Function:', error);
      setSyncMessage(`Error: ${error.message}`);
    }
  };

  const updateCalendarEvents = useCallback((events) => {
    setCalendarEvents(events);
    console.log(events);
    console.log(suggestedOutfit);
    if (events.length > 0) {
      const firstEventDescription = events[0].description || "";
      const eventTags = firstEventDescription.split(',').map(tag => tag.trim().toLowerCase());
      const bestMatch = findBestMatch(items, eventTags);
      setSuggestedOutfit(bestMatch);
    } else {
      setSuggestedOutfit(null);
      setSyncMessage("No upcoming events found.");
    }
  }, [items]);

  return (
    <section className="m-5">
      <Navbar user={user} onSignOut={handleSignOut} />
      <Connections googleAccessToken={googleAccessToken} onUpdateEvents={updateCalendarEvents} />
      <section className="clothing-rack mx-40">
        <h1 className="text-4xl font-bold m-2 mb-10 mt-15">Clothing Rack</h1>
        {suggestedOutfit && (
          <div className="alert alert-success my-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Suggested Outfit: {suggestedOutfit.name}</span>
          </div>
        )}
        <div className="flex mb-4">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Add clothing
          </button>
          <button
            className="btn mx-2 btn-secondary"
            onClick={handleSyncLillyGo}
            disabled={!suggestedOutfit}
          >
            Sync to LillyGo
          </button>
          {syncMessage && <p className="text-center text-sm my-2">{syncMessage}</p>}
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {items.map((item) => (
            <Card key={item.id} item={item} onRemove={handleRemoveItem} />
          ))}
        </div>
      </section>

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
                tags: form.tags.value.split(',').map(tag => tag.trim()),
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
