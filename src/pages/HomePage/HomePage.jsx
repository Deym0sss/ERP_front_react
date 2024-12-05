import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [locationsData, setLocationsData] = useState();
  const [locations, setLocations] = useState([]);
  const createLocation = () => {
    navigate("/location/create");
  };
  const goToLocationInfo = (locationId) => {
    navigate(`/location/${locationId}`);
  };
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/auth/${localStorage.getItem("userId")}`
      );
      setLocations(response.data.locationIds);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getLocationsInfo = async () => {
    if (locations.length > 0) {
      const locationIdsString = locations.join(",");
      try {
        const response = await axios.get(
          `http://localhost:5000/location/ids/${locationIdsString}`
        );
        setLocationsData((prevData) => {
          if (
            !prevData ||
            JSON.stringify(prevData) !== JSON.stringify(response.data.locations)
          ) {
            return response.data.locations;
          }
          return prevData;
        });
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (locations.length > 0) {
      getLocationsInfo();
    }
  }, [locations]); //

  return (
    <div className={styles.home}>
      <Header />
      <div className={styles.content}>
        <div className={styles.locations}>
          {locationsData ? (
            <>
              {locationsData.map((location) => (
                <div
                  key={location._id}
                  className={styles.card}
                  onClick={() => goToLocationInfo(location._id)}
                >
                  <p className={styles.cardTitle}>{location.title}</p>
                </div>
              ))}
              <div
                className={`${styles.card} ${styles.createLocationCard}`}
                onClick={createLocation}
              >
                <p className={styles.cardTitle}>Create location</p>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
