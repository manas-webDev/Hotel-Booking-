import React, { useState } from "react";
import { assets, roomsDummyData, facilityIcons } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import StarReating from "./StarReating";

// Reusable checkbox
const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"  
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
        className="w-4 h-4 accent-gray-700 cursor-pointer"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

// Reusable radio button (single choice)
const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
        className="w-4 h-4 accent-gray-700 cursor-pointer"
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

// Filter options
const roomTypes = ["Single Bed", "Family Suite", "Double Bed", "Luxury Room"];

const priceRanges = [
  { label: "$0 to $250", min: 0, max: 250 },
  { label: "$250 to $350", min: 250, max: 350 },
  { label: "$350 to $500", min: 350, max: 500 },
];

const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

const Rooms = () => {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState(false);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  // Add or remove a value from a checkbox group
  const handleToggle = (checked, value, setter) => {
    setter((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const clearFilters = () => {
    setSelectedRoomTypes([]);
    setSelectedPrices([]);
    setSelectedSort("");
  };

  // Does the room match the selected room types?
  const matchesRoomType = (room) =>
    selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomType);

  // Does the room match any selected price range?
  const matchesPrice = (room) =>
    selectedPrices.length === 0 ||
    priceRanges.some(
      (range) =>
        selectedPrices.includes(range.label) &&
        room.pricePerNight >= range.min &&
        room.pricePerNight <= range.max
    );

  // Sort a copy (never mutate the original array)
  const sortRooms = (a, b) => {
    if (selectedSort === "Price Low to High")
      return a.pricePerNight - b.pricePerNight;
    if (selectedSort === "Price High to Low")
      return b.pricePerNight - a.pricePerNight;
    if (selectedSort === "Newest First")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  };

  const filteredRooms = roomsDummyData
    .filter((room) => matchesRoomType(room) && matchesPrice(room))
    .sort(sortRooms);

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Rooms list */}
      <div>
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Hotel Rooms</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.length === 0 && (
          <p className="text-gray-500 mt-10">
            No rooms match your filters. Try clearing them.
          </p>
        )}

        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className="flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0"
          >
            <img
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                window.scrollTo(0, 0);
              }}
              src={room.images[0]}
              alt="hotel-img"
              title="View Room Details"
              className="max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer"
            />
            <div className="md:w-1/2 flex flex-col gap-2">
              <p className="text-gray-500">{room.hotel.city}</p>
              <p
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                className="text-gray-800 text-3xl font-playfair cursor-pointer"
              >
                {room.hotel.name}
              </p>
              <div className="flex items-center">
                <StarReating />
                <p className="ml-2">200+ reviews</p>
              </div>
              <div className="flex items-center gap-1 text-gray-500 mt-2 text-sm">
                <img src={assets.locationIcon} alt="location-icon" />
                <span>{room.hotel.address}</span>
              </div>

              {/* Room Amenities */}
              <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
                {room.amenities.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5F5]/70"
                  >
                    <img
                      src={facilityIcons[item]}
                      alt={item}
                      className="w-5 h-5"
                    />
                    <p className="text-xs">{item}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xl font-medium text-gray-700">
                  ${room.pricePerNight}/night
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16">
        {/* Header */}
        <div
          className={`flex items-center justify-between px-5 py-2.5 lg:border-b border-gray-300 ${
            openFilters && "border-b"
          }`}
        >
          <p className="text-base font-medium text-gray-800">FILTERS</p>
          <div className="text-xs cursor-pointer">
            <span
              onClick={() => setOpenFilters(!openFilters)}
              className="lg:hidden"
            >
              {openFilters ? "HIDE" : "SHOW"}
            </span>
            <span onClick={clearFilters} className="hidden lg:block">
              CLEAR
            </span>
          </div>
        </div>

        {/* Body: collapsible on mobile, always visible on desktop */}
        <div
          className={`${
            openFilters ? "h-auto" : "h-0 lg:h-auto"
          } overflow-hidden transition-all duration-700`}
        >
          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedRoomTypes.includes(room)}
                onChange={(checked) =>
                  handleToggle(checked, room, setSelectedRoomTypes)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5">
            <p className="font-medium text-gray-800 pb-2">Price</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={range.label}
                selected={selectedPrices.includes(range.label)}
                onChange={(checked) =>
                  handleToggle(checked, range.label, setSelectedPrices)
                }
              />
            ))}
          </div>

          <div className="px-5 pt-5 pb-7">
            <p className="font-medium text-gray-800 pb-2">Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={setSelectedSort}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
