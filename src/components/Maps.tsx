import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { env } from "@/env";

export const Map = ({ lat, lng }: { lat: number; lng: number }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_TOKEN;

    mapRef.current = new mapboxgl.Map({
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: "mapbox://styles/mapbox/light-v11",
      container: "map",
      antialias: true,
      center: [lng, lat],
      zoom: 10,
    });

    mapRef.current.on("load", () => {
      mapRef.current.addSource("admin-1", {
        type: "vector",
        url: "mapbox://mapbox.boundaries-adm1-v4",
        promoteId: "mapbox_id",
      });

      // Define a filter for India worldview boundaries
      let worldviewFilter = [
        "any",
        ["==", "all", ["get", "worldview"]],
        ["in", "IN", ["get", "worldview"]],
      ];

      mapRef.current.addLayer(
        {
          id: "admin-1-fill",
          type: "line",
          source: "admin-1",
          "source-layer": "boundaries_admin_1",
          filter: worldviewFilter,
        },
        // This final argument indicates that we want to add the Boundaries layer
        // before the `waterway-label` layer that is in the map from the Mapbox
        // Light style. This ensures the admin polygons are rendered below any labels
        "waterway-label",
      );
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return <div id="map" ref={mapContainerRef} style={{ height: "50vh" }}></div>;
};
