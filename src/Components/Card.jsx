import { useState } from "react";

const badgeColors = [
  "badge-primary",
  "badge-secondary",
  "badge-accent",
  "badge-info",
  "badge-success",
  "badge-warning",
  "badge-error"
]

  const getRandomBadgeColor = () => {
    const randomIndex = Math.floor(Math.random() * badgeColors.length);
    return badgeColors[randomIndex];
  };

function Card({ item, onRemove }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = () => {
    onRemove(item.id);
    setIsModalOpen(false);
  };

  return (
    <div className="card card-compact w-full bg-base-100 shadow-xl rounded-box">
      <figure className="aspect-square overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{item.name}</h2>
        <p>
          A card component has a figure, a body part, and inside body there are
          title and actions parts
        </p>
        <div className="flex">
        {item.tags.map((item) => (
          <div className={`badge badge-soft ${getRandomBadgeColor()} m-1`}>{item}</div>
        ))}
        </div>

        <div className="card-actions justify-center mt-2">
          {/* Button to open the modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Remove
          </button>
        </div>
      </div>

      {/* The Modal Dialog */}
      <dialog
        id="my_modal_1"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">
            Are you sure you want to remove "{item.name}" from your collection?
          </p>
          <div className="modal-action">
            <button className="btn btn-error" onClick={handleDeleteClick}>
              Confirm
            </button>
            <button className="btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Card;
