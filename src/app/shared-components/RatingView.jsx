import { Rating, Tooltip } from "@mui/material";
import clsx from "clsx";

function RatingView({
  ratings,
  onClick = undefined,
  size = "small",
  className = "",
  precision = 0.5,
  tooltipPlacement = "bottom",
  inline = false,
}) {
  function calcRating() {
    var r = 0.0;
    if (ratings && Array.isArray(ratings)) {
      for (var i = 0; i < ratings.length; i++) {
        if (ratings[i].reviewNumber) {
          r += ratings[i].reviewNumber;
        }
      }
      return r / (ratings.length === 0 ? 1 : ratings.length);
    } else if (ratings && typeof ratings === "number") {
      return ratings;
    }
    return 0;
  }
  const rating = calcRating();
  return (
    <Tooltip
      arrow
      title={rating.toFixed(1)}
      placement={tooltipPlacement}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
      }}
    >
      <div className={clsx(inline ? "inline" : "flex items-center w-auto")}>
        <Rating
          className={className}
          onClick={onClick}
          size={size}
          precision={precision}
          value={rating}
          readOnly
        />
      </div>
    </Tooltip>
  );
}

export default RatingView;
