import "./App.scss";
import HeroImg from "./images/hero_img.png";

import { useEffect, useState } from "react";
import CardComponent from "./components/CardComponent";

export default function App() {
  const [isLoading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [latlong, setLatlong] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dealers, setDealers] = useState([]);

  function setPosition() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);

      console.log("Longitude is :", position.coords.longitude);
      setLatlong(`${position.coords.latitude},${position.coords.longitude}`);
    });
  }

  async function getProvinces() {
    let data = [];
    try {
      const res = await fetch(
        "https://mitsubishi-50.sudahdistaging.in/api/frontend/get-provinces"
      );
      data = await res.json();
    } catch (error) {}
    setProvinces(data);
  }

  async function getNearestDealer() {
    let data = [];
    try {
      const res = await fetch(
        `https://mitsubishi-50.sudahdistaging.in/api/frontend/search-dealers?latlong=${latlong}&page=${currentPage}&limit=9`
      );
      data = await res.json();
      console.log(data);
    } catch (error) {}
    setDealers(data.data);
    setLoading(false);
  }

  function handleLoadMore(e) {
    e.preventDefault();
    setCurrentPage((currentPage) => currentPage + 1);

    loadMoreDealers();
  }

  async function loadMoreDealers() {
    let data = [];
    try {
      const res = await fetch(
        `https://mitsubishi-50.sudahdistaging.in/api/frontend/search-dealers?latlong=${latlong}&page=${
          currentPage + 1
        }&limit=9`
      );
      data = await res.json();
      // console.log(data);
      console.log(data.data);
      setDealers(dealers.concat(data.data));
    } catch (error) {}
  }

  useEffect(() => {
    return () => {
      setPosition();
      getProvinces();
      getNearestDealer();
    };
  }, []);

  return (
    <>
      <img className="hero-image" src={HeroImg} alt="hero" />
      <div className="container">
        <div className="hero-card">
          <div>
            <h1>FIND DEALER</h1>
            <p>Discover the nearest dealership in your area</p>
            <select>
              {provinces &&
                provinces.length &&
                provinces.map((x) => (
                  <option key={x.id} value={x.name}>
                    {x.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <p>
              Cari dan kunjungi dealer resmi Mitsubishi terdekat di kota Anda
              untuk mendapatkan pelayanan terbaik terkait dengan kendaraan dari
              Mitsubishi Motors Indonesia.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div class="loader"></div>
        ) : (
          <>
            <div className="card-grid">
              {dealers &&
                dealers.length &&
                dealers.map((dealer, index) => (
                  <CardComponent key={index} dealer={dealer} />
                ))}
            </div>

            <button className="load-more" onClick={handleLoadMore}>
              Load More
            </button>
          </>
        )}
      </div>
    </>
  );
}
