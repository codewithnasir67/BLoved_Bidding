import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsStarHalf } from "react-icons/bs";

const Ratings = ({ rating, isInteractive = false, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const displayRating = isInteractive && hoverRating > 0 ? hoverRating : rating;

  const handleClick = (starValue) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleMouseEnter = (starValue) => {
    if (isInteractive) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (isInteractive) {
      setHoverRating(0);
    }
  };

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= displayRating) {
      stars.push(
        <AiFillStar
          key={i}
          size={20}
          color={isInteractive ? "#06B6D4" : "#FF6B6B"}
          className={`mr-2 ${isInteractive ? "cursor-pointer hover:scale-125 transition-transform duration-200" : "cursor-default"}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        />
      );
    } else if (i === Math.ceil(displayRating) && !Number.isInteger(displayRating) && !isInteractive) {
      stars.push(
        <BsStarHalf
          key={i}
          size={17}
          color="#FF6B6B"
          className="mr-2 cursor-default"
        />
      );
    } else {
      stars.push(
        <AiOutlineStar
          key={i}
          size={20}
          color={isInteractive ? "#06B6D4" : "#FF6B6B"}
          className={`mr-2 ${isInteractive ? "cursor-pointer hover:scale-125 transition-transform duration-200" : "cursor-default"}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
  }

  return <div className="flex items-center">{stars}</div>;
};

export default Ratings;
