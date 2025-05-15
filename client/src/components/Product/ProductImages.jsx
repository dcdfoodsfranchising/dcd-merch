import React from "react";

export default function ProductImages({ images, selectedImage, setSelectedImage, productName }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex-1">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full aspect-[548/712] object-cover rounded shadow"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setSelectedImage(img)}
            className={`w-24 h-24 object-cover cursor-pointer border-2 rounded ${
              selectedImage === img ? 'border-black' : 'border-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
}