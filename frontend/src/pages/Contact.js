import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/contact.css"; 

const Contact = () => {
  useEffect(() => {
    if (document.getElementById("map")?._leaflet_id != null) return;

    const map = L.map("map").setView([49.8397, 24.0297], 12); 

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const customIcon = L.divIcon({
      className: "custom-icon",
      html: "<i class='fas fa-map-marker-alt'></i>", 
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const marker = L.marker([50.932370729592414, 34.79884488344407], { icon: customIcon }).addTo(map);
    marker.bindPopup("м. Суми").openPopup();
  }, []);

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Контакти</h1>
        <div className="contact-details">
          <div className="contact-info">
            <h2>Онлайн-магазин</h2>
            <p>Адреса: м. Суми, Сумська область, Україна</p>
            <p>Телефон: +380 ** *** ****</p>
            <p>Email: petstore@example.com</p>
          </div>

          <div id="map" className="map-container" style={{ height: "400px", width: "100%" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
