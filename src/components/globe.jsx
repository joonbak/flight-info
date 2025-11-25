import { forwardRef } from "react";
import Globe from "react-globe.gl";
import globeJson from "../assets/countries_110m.json";

const GlobeWrapper = forwardRef(({ arcData }, ref) => {
  return (
    <Globe
      ref={ref}
      globeOffset={[300, 0]}
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      hexPolygonsData={globeJson.features}
      hexPolygonColor={() => "#d1ffbd"}
      arcsData={arcData}
      arcColor="color"
      arcStroke="stroke"
      arcAltitudeAutoScale="scale"
    />
  );
});

export default GlobeWrapper;
