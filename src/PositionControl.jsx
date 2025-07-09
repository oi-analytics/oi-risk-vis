function PositionControl(props) {
  return (
    <div className="custom-map-control bottom-right position-control">
      Lon: {props.lng.toFixed(2)} Lat: {props.lat.toFixed(2)} Zoom:{" "}
      {props.zoom.toFixed(0)}
    </div>
  );
}

export default PositionControl;
