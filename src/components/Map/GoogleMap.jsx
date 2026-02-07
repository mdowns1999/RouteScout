import { Card, CardMedia } from "@mui/material";

export default function GoogleMap() {
  return (
    <div className="map">
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img" // Renders as an <img> element
          height="194" // Defines fixed height
          image="/static/images/cards/paella.jpg" // Image source
          alt="Paella dish" // Essential for accessibility
        />
      </Card>
    </div>
  );
}
