import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import styles from "./LocationInfo.module.css";
import { Button, Space, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LocationInfo = () => {
  const navigate = useNavigate();
  const [locationInfo, setLocationInfo] = useState(null);
  const [staffInfo, setStaffInfo] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [dataSource, setDataSource] = useState(null);

  const { locationId } = useParams();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Amount",
      dataIndex: "value",
      key: "value",
      width: "15%",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              onOpenAsset(record);
            }}
          >
            <p>Open </p>
          </Button>
          <Button
            onClick={() => {
              onDeleteAsset(record);
            }}
          >
            <p>Delete</p>
          </Button>
        </Space>
      ),
    },
  ];

  const getLocationInfo = async () => {
    await axios
      .get(`http://localhost:5000/location/ids/${locationId}`)
      .then((response) => {
        const locationData = response.data.locations[0];
        setLocationInfo(locationData);
        getLogo(locationData);
      });
  };

  const getStaffInfo = async () => {
    await axios
      .get(`http://localhost:5000/auth/all/${locationId}`)
      .then((response) => {
        setStaffInfo(JSON.parse(JSON.stringify(response.data.users)));
        getLogo();
      });
  };

  const getAssetsInfo = async () => {
    await axios
      .get(`http://localhost:5000/asset/all/${locationId}`)
      .then((response) => {
        setDataSource(JSON.parse(JSON.stringify(response.data.assets)));
      });
  };

  const getLogo = async (locationData) => {
    if (locationData && locationData.logo) {
      try {
        const response = await axios.get(
          `http://localhost:5000/logos/${locationData.logo}`,
          {
            responseType: "blob",
          }
        );
        const logoUrl = URL.createObjectURL(response.data);
        setLogoUrl(logoUrl);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    }
  };

  const goToStaffInfo = () => {
    navigate(`/staff/${locationId}`);
  };
  const goToCreateAsset = () => {
    navigate(`/asset/create/${locationId}`);
  };
  const goToInventory = () => {
    navigate(`/location/create/inventory/${locationId}`);
  };
  const goToOrdersInfo = () => {
    navigate(`/orders/${locationId}`);
  };

  const onDeleteAsset = async (asset) => {
    await axios
      .delete(`http://localhost:5000/asset/${asset._id}`)
      .then(() => {
        getAssetsInfo();
        axios.put(`http://localhost:5000/location/removeAsset`, {
          assetId: asset._id,
          locationId: locationId,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const onOpenAsset = (asset) => {
    navigate(`/asset/${asset._id}`);
  };

  useEffect(() => {
    getLocationInfo();
    getStaffInfo();
    getAssetsInfo();
  }, []);
  return (
    <div className={styles.wrapper}>
      <Header></Header>
      <div className={styles.content}>
        {locationInfo && (
          <div className={styles.content__locationInfo}>
            <div className={styles.content__locationInfo__element}>
              <label>Title</label>
              <p>{locationInfo.title}</p>
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Description</label>
              <p>{locationInfo.description}</p>
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Address</label>
              <p>{locationInfo.address}</p>
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>City</label>
              <p>{locationInfo.city}</p>
            </div>
            <div className={styles.content__locationInfo__element}>
              <label>Country</label>
              <p>{locationInfo.country}</p>
            </div>{" "}
          </div>
        )}

        <div className={styles.content__staff}>
          <label>Workers</label>
          <hr />
          <div className={styles.content__staff__info}>
            {staffInfo &&
              staffInfo.map((user) => (
                <div
                  key={user._id}
                  className={styles.content__staff__info__element}
                >
                  {locationInfo && (
                    <p>
                      {user.name} {user.surname} - {user.role};
                    </p>
                  )}
                </div>
              ))}
          </div>
          <button onClick={goToStaffInfo} className={styles.staffBtn}>
            <p>Manage</p>
          </button>
        </div>

        <div>
          <img className={styles.content__logo} src={logoUrl} alt="Logo" />
        </div>
      </div>
      <div className={styles.table}>
        <Table dataSource={dataSource} columns={columns}></Table>
      </div>

      <div className={styles.location__btns}>
        <div>
          <Button
            className={styles.location__btns__element}
            onClick={goToCreateAsset}
          >
            <p>Add asset</p>
          </Button>
        </div>
        <div>
          <Button
            className={styles.location__btns__element}
            onClick={goToInventory}
          >
            <p>Inventorize</p>
          </Button>
        </div>
        <div>
          <Button
            className={styles.location__btns__element}
            onClick={goToOrdersInfo}
          >
            <p>Orders</p>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
